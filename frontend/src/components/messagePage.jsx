import React, { useState, useEffect } from "react";
import { FaSearch, FaPaperPlane } from "react-icons/fa";
import axiosInstance from "../../config/axios.js";
import { useNavigate } from 'react-router-dom'; 

const MessagesPage = () => {
  const navigate = useNavigate();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await axiosInstance.get("/connections");
        setConnectedUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
    fetchConnectedUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axiosInstance.get(
            `message/${selectedUser._id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" || !selectedUser) return;
    try {
      const response = await axiosInstance.post(
        `message/send/${selectedUser._id}`,
        { text: message }
      );
      setMessages([...messages, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black p-4 overflow-hidden scroll-smooth">
      {/* Sidebar */}
      <aside className="w-1/3 p-5 shadow-xl border bg-white dark:bg-black border-gray-300 dark:border-gray-700 rounded-xl">
        <h2 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white">    Chats  </h2>

        {/* Search Box */}
        <div className="relative mb-4">
          <input  type="text"  placeholder="Search users..."  value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)}  className="w-full p-3 pr-10 rounded-lg border bg-gray-50 dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-black dark:focus:ring-gray-500"  aria-label="Search users"/>
          <FaSearch className="absolute right-4 top-3 text-gray-500 dark:text-gray-400" />
        </div>

        {/* User List */}
        <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hidden">
          {filteredUsers.map((user) => (
            <div    key={user._id}    className="flex items-center gap-3 p-3 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:shadow-md hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-300 transition duration-300"    onClick={() => handleSelectUser(user)}    role="button"    aria-label={`Chat with ${user.name}`}  >
              <img    src={user.profilePicture || "/avatar.png"}    alt={`${user.name}'s profile`}    className="w-12 h-12 rounded-full border object-cover"  />
              <span className="text-lg font-medium text-gray-900 dark:text-white">    {user.name}  </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Section */}
      <section className="w-2/3 flex flex-col p-5 shadow-xl bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl ml-4">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-300 dark:border-gray-600">
              <img    src={selectedUser.profilePicture || "/avatar.png"}    alt={`${selectedUser.name}'s profile`}    className="w-12 h-12 rounded-full border object-cover cursor-pointer"    onClick={() => navigate(`/explore/${selectedUser.username}`)}  />
              <h3    className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"    onClick={() => navigate(`/explore/${selectedUser.username}`)}  >    {selectedUser.name}  </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 h-[70vh] flex flex-col scrollbar-hidden">
              {messages.map((msg, index) => {
                const isSender = msg.senderId !== selectedUser._id;
                return (
                  <div    key={index}    className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}  >
                    <div    className={`p-3 rounded-xl max-w-xs text-sm text-white flex flex-col shadow-md ${      isSender ? "bg-blue-600" : "bg-gray-700"    }`}  >
                      <span className="break-words">{msg.text}</span>
                      <span className="text-xs text-gray-300 self-end">    {new Date(msg.createdAt).toLocaleTimeString([], {      hour: "2-digit",      minute: "2-digit",    })}  </span>
                    </div>
                    <img  src={isSender ? "/avatar.png" : selectedUser.profilePicture || "/avatar.png"}  alt={isSender ? "You" : "Sender"}  className="w-8 h-8 rounded-full ml-2 object-cover"/>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="flex mt-4 items-center border-t pt-4 border-gray-300 dark:border-gray-600">
              <input  type="text"  placeholder="Type a message..."  value={message}  onChange={(e) => setMessage(e.target.value)}  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}  className="flex-grow p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"   />
              <button    onClick={handleSendMessage}    className="ml-3 px-5 py-3 rounded-lg flex items-center transition duration-300 bg-black text-white hover:bg-gray-700 dark:bg-blue-500 dark:hover:bg-blue-400"    aria-label="Send message"  >    <FaPaperPlane className="mr-2" /> Send  </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">    Select a user to start chatting.  </div>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;
