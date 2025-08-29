import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        let id = sessionStorage.getItem("chatSessionId");
        if (!id) {
            id = uuidv4();
            sessionStorage.setItem("chatSessionId", id);
        }
        setSessionId(id);

        const saved = JSON.parse(localStorage.getItem(`chatMessages-${id}`)) || [];
        setMessages(saved);
    }, []);

    useEffect(() => {
        if (sessionId) {
            localStorage.setItem(`chatMessages-${sessionId}`, JSON.stringify(messages));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sessionId]);

    const parseAndHighlight = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <span key={index} className="bg-yellow-300 text-black font-semibold px-1 rounded">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        const updatedUserMessages = [...messages, userMessage];
        setMessages(updatedUserMessages);

        setInput("");
        setIsTyping(true);

        try {
            const response = await axios.post("http://localhost:8000/api/chat", { message: input });
            const botMessage = { sender: "bot", text: response.data.reply };
            const updated = [...updatedUserMessages, botMessage];
            setMessages(updated);
        } catch (error) {
            const errMsg = { sender: "bot", text: "Oops! Something went wrong. Please try again." };
            setMessages(prev => [...prev, errMsg]);
        }

        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#0f172a] dark:to-[#1e293b] min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl shadow-2xl p-6 transition-all">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-5">🤖 Chat with MNNIT-Connect</h2>

                <div className="h-96 overflow-y-auto px-2 space-y-3 mb-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.sender === "bot" && (
                                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="Bot" className="w-8 h-8 rounded-full" />
                            )}
                            <div className={`px-4 py-2 rounded-xl text-sm leading-relaxed tracking-wide shadow-md transition-all
                                ${msg.sender === "user"
                                    ? "bg-blue-600 text-white dark:bg-blue-500"
                                    : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                                }`}>
                                {msg.sender === "bot" ? parseAndHighlight(msg.text) : msg.text}
                            </div>
                            {msg.sender === "user" && (
                                <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="You" className="w-8 h-8 rounded-full" />
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-2 justify-start">
                            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="Bot" className="w-8 h-8 rounded-full" />
                            <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-xl text-sm font-medium animate-pulse">
                                Typing...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className="flex-1 px-4 py-2 rounded-l-xl text-sm bg-gray-100 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="px-5 py-2 rounded-r-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
