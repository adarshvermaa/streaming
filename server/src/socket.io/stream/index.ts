import { Socket } from "socket.io";

// Live stream socket handler
export const liveStreamSocket = async (socket: Socket): Promise<void> => {
    try {
        console.log("Setting up live streaming socket for:", socket.id);
        // Handle offer message (sent when a peer wants to initiate a call)
        socket.on("offer", (offer: string) => {
            console.log(`Received offer from ${socket.id}`);
            socket.broadcast.emit("offer", offer); // Forward the offer to the other peers
        });

        // Handle answer message (sent in response to an offer)
        socket.on("answer", (answer: string) => {
            console.log(`Received answer from ${socket.id}`, answer);
            socket.broadcast.emit("answer", answer); // Forward the answer to the other peers
        });

        // Handle ICE candidates (used for NAT traversal and peer-to-peer connection)
        socket.on("candidate", (candidate: string) => {
            console.log(`Received ICE candidate from ${socket.id}`);
            socket.broadcast.emit("candidate", candidate); // Forward the candidate to the other peers
        });

        // Handle incoming chat message
        socket.on("message", (message: string) => {
            console.log(`Received message from ${socket.id}: ${message}`);
            socket.emit("message", message); // Broadcast the message to other peers
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    } catch (err) {
        console.error("Error in live streaming socket:", err);
    }
};
