import React, { useEffect, useState } from "react";
import { socket } from "./socket/socket";

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (data: string) => {
      console.log("Message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message); // Emit message to the server
      setMessage(""); // Clear input
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React TypeScript with Socket.IO</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
