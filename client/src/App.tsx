import React, { useEffect, useRef, useState } from "react";
import { socket } from "./socket/socket";

const App: React.FC = () => {
  // Chat States
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  // WebRTC States
  const [isStreaming, setIsStreaming] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (data: string) => {
      console.log("Message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for WebRTC signals (offer, answer, ice candidates)
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("candidate", handleCandidate);

    // Clean up event listeners on component unmount
    return () => {
      socket.off("message");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  // Set up WebRTC connection
  const startVideoCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const peer = new RTCPeerConnection();
    setPeerConnection(peer);

    // Add local stream to the peer connection
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    // Set up ICE candidate gathering
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", event.candidate);
      }
    };

    // Receive remote stream and set it to the remote video element
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Create and send offer
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", offer);
    setIsStreaming(true);
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      // Get user media (local stream)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add local tracks to the peer connection
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = (candidate: RTCIceCandidateInit) => {
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message); // Emit message to the server
      setMessage(""); // Clear input
    }
  };
  console.log(messages)

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-4">React WebRTC Video Streaming with Chat</h1>

      <div className="flex flex-col items-center mb-6">
        <button
          onClick={startVideoCall}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white font-semibold hover:bg-blue-700"
        >
          Start Video Call
        </button>
      </div>

      <div className="flex justify-between mb-6">
        <div className="flex-1">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-64 bg-black rounded-lg mb-4"
            playsInline
          ></video>
        </div>
        <div className="flex-1">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-64 bg-black rounded-lg mb-4"
            playsInline
          ></video>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full py-2 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-700"
        >
          Send Message
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <ul className="list-none space-y-2 mt-4">
          {messages.map((msg, index) => (
            <li key={index} className="bg-gray-700 p-2 rounded-md">{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
