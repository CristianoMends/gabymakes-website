import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Message from './message'; 



let messageQueue = [];
let addMessageToQueue = () => { }; 

export function showAppMessage(type, text, duration = 3000) {
    const id = Date.now(); 
    messageQueue.push({ id, type, text, duration });
    addMessageToQueue(); 
}

const MessageContainer = () => {
    const [messages, setMessages] = useState([]);

    
    addMessageToQueue = useCallback(() => {
        setMessages([...messageQueue]);
        messageQueue = []; 
    }, []);

    useEffect(() => {
        
        messages.forEach((msg) => {
            if (msg.duration > 0) { 
                const timer = setTimeout(() => {
                    setMessages((prevMessages) =>
                        prevMessages.filter((m) => m.id !== msg.id)
                    );
                }, msg.duration);
                return () => clearTimeout(timer); 
            }
        });
    }, [messages]); 

    
    
    return ReactDOM.createPortal(
        <div className="fixed bottom-4 right-4 z-[1000] space-y-3">
            {messages.map((msg) => (
                <Message
                    key={msg.id}
                    type={msg.type}
                    message={msg.text}
                    onClose={() =>
                        setMessages((prevMessages) =>
                            prevMessages.filter((m) => m.id !== msg.id)
                        )
                    }
                />
            ))}
        </div>,
        document.body 
    );
};

export default MessageContainer;