import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../api";
import '../styles/chatbot.css';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ clientId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {  

        setMessages([]);
        setInput("");
        
        api.get(`/api/chat-history/${clientId}/`)
            .then(response => response.json())
            .then(data => setMessages(data));
    }, [clientId]);

    
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        const response = await api.post(`/api/chat/${clientId}/`, { message: input });
        const botMessage = { role: "bot", content: response.data.content };
        setMessages([...messages, userMessage, botMessage]);
        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chatbot-area"> 
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.role === "user" ? "user-msg" : "bot-msg"}>
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
                    placeholder='Type your question... Ask our AI anything related to case law or about the client.' 
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { // Send on Enter, allow Shift+Enter for new lines
                            e.preventDefault(); // Prevents newline
                            sendMessage();
                        }
                    }}
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