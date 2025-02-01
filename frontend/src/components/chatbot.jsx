import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../api";
import '../styles/chatbot.css';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ clientId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        
        // fetchChatHistory();
        // const savedMessages = localStorage.getItem("chatMessages");
        // if (savedMessages) {
        //     setMessages(JSON.parse(savedMessages));
        //     console.log(messages[0])
        // }

    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await api.get(`/api/chat-history/${clientId}/`);
            setMessages(response.data);
            localStorage.setItem("chatMessages", JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await api.post(`/api/chat/${clientId}/`, { message: input });
            const botMessage = { role: "bot", content: response.data.bot_response };
            setMessages(prev => [...prev, botMessage]);
            localStorage.setItem("chatMessages", JSON.stringify([...messages, userMessage, botMessage]));
        } catch (error) {
            console.error("Error sending message", error);
        }

        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chatbot-area"> 
                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={msg.role === "user" ? "user-msg" : "bot-msg"}>
                            {/* {msg.userMessage}
                            {msg.bot_response} */}
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            {/* {msg.content} */}
                            {/* {msg.message} */}
                        </div>
                    ))}
                </div>
                <div className ="chat-input">
                    <textarea 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your question..." 
                    rows={3}
                    />
                    <button onClick={sendMessage}>Enter</button>
                </div>
                <div>
                    
                </div>
                
            </div>
        </div>
    );
};

export default Chatbot;