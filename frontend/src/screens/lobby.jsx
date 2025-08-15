import React, { useEffect, useRef, useState } from "react";
import { firestore } from "../firebase";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";

const Lobby = () => {
  const webcamRef = useRef(null);
  const remoteRef = useRef(null);
  const textRef = useRef(null);
  const [callId, setCallId] = useState("");
  const [callDocRef, setCallDocRef] = useState(null);
  const [pc] = useState(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
    })
  );

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const localStreamRef = useRef(null); 

  useEffect(() => {
    if (!callDocRef || !textRef.current) return;

    const unsubscribe = onSnapshot(callDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.sharedText !== textRef.current.value) {
        textRef.current.value = data.sharedText || "";
      }
    });

    const handleInput = async () => {
      try {
        await updateDoc(callDocRef, {
          sharedText: textRef.current.value,
        });
      } catch (err) {
        console.error("Failed to sync text:", err);
      }
    };

    const inputEl = textRef.current;
    inputEl.addEventListener("input", handleInput);

    return () => {
      unsubscribe();
      inputEl.removeEventListener("input", handleInput);
    };
  }, [callDocRef]);

  const startWebcam = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      webcamRef.current.srcObject = localStream;
      localStreamRef.current = localStream;

      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      const remoteStream = new MediaStream();
      remoteRef.current.srcObject = remoteStream;

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          if (!webcamRef.current.srcObject.getTracks().includes(track)) {
            remoteStream.addTrack(track);
          }
        });
      };
    } catch (error) {
      console.error("Error starting webcam:", error);
    }
  };

  const toggleAudio = () => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const createCall = async () => {
    try {
      const callDoc = doc(collection(firestore, "calls"));
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(offerCandidates, event.candidate.toJSON());
        }
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      await setDoc(callDoc, {
        offer: { type: offerDescription.type, sdp: offerDescription.sdp },
      });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pc.currentRemoteDescription) {
          pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });

      setCallId(callDoc.id);
      setCallDocRef(callDoc);
    } catch (error) {
      console.error("Error creating call:", error);
    }
  };

  const answerCall = async () => {
    try {
      const callDoc = doc(firestore, "calls", callId);
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(answerCandidates, event.candidate.toJSON());
        }
      };

      const callData = (await getDoc(callDoc)).data();
      await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      await updateDoc(callDoc, {
        answer: {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        },
      });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });

      setCallDocRef(callDoc);
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const endCall = () => {
    pc.getSenders().forEach((sender) => sender.track?.stop());
    pc.close();
    webcamRef.current.srcObject?.getTracks().forEach((track) => track.stop());
    remoteRef.current.srcObject = null;
    webcamRef.current.srcObject = null;
    setCallId("");
    setCallDocRef(null);
    setAudioEnabled(true);
    setVideoEnabled(true);
  };

  return (
    <div className="min-h-screen bg-white mt-10 dark:bg-black px-4 py-8 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Meeting Room</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-lg">
                <video
                  ref={webcamRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-lg">
                <video
                  ref={remoteRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 shadow-md p-6 rounded-xl border border-gray-300 dark:border-gray-700 space-y-4">
              <input
                value={callId}
                onChange={(e) => setCallId(e.target.value)}
                placeholder="Enter or share Call ID"
                className="w-full p-3 rounded-md bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition"
              />

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={startWebcam}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg shadow transition"
                >
                  Start Webcam
                </button>
                <button
                  onClick={createCall}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg shadow transition"
                >
                  Create Call
                </button>
                <button
                  onClick={answerCall}
                  className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg shadow transition"
                >
                  Answer Call
                </button>
                <button
                  onClick={endCall}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg shadow transition"
                >
                  End Call
                </button>
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition"
                >
                  {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  {audioEnabled }
                </button>

                <button
                  onClick={toggleVideo}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
                >
                  {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                  {videoEnabled }
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 shadow-md p-6 rounded-xl border border-gray-300 dark:border-gray-700 h-full">
            <textarea
              ref={textRef}
              placeholder="Write shared notes here..."
              className="w-full h-full min-h-[500px] p-3 rounded-md bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );



};

export default Lobby;