import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import socket from "../utils/socket";
import VideoPlayer from "../Components/VideoChat/VideoPlayer";

export default function VideoChat() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const friend = searchParams.get("friend");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const servers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
    ]
  };

  useEffect(() => {
    const startVideoChat = async () => {
      try {
        // Get local media stream (video/audio)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create a new RTCPeerConnection
        const peerConnection = new RTCPeerConnection(servers);
        peerConnectionRef.current = peerConnection;  // Save the peerConnection to a ref

        // Add tracks from local stream to peer connection
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        // Set up the handler for receiving remote tracks
        peerConnection.ontrack = (event) => {
          const remoteStream = event.streams[0];
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        // Set up the handler for ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('candidate', event.candidate,id,friend);
          }
        };

        // Handle receiving an offer
        socket.on('offer', async (offer) => {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', answer,id,friend);
        });

        // Handle receiving an answer
        socket.on('answer', async (answer) => {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        });

   // Handle receiving ICE candidates
socket.on('candidate', async (candidateDataArray) => {
  for (const candidateData of candidateDataArray) {
      console.log('Received ICE candidate:', candidateData);
      if (candidateData && candidateData.candidate && candidateData.sdpMid !== null && candidateData.sdpMLineIndex !== null) {
          try {
              const iceCandidate = new RTCIceCandidate(candidateData);
              await peerConnection.addIceCandidate(iceCandidate);
          } catch (error) {
              console.error('Error adding ICE candidate:', error);
          }
      } else {
          console.error('Received invalid ICE candidate:', candidateData);
      }
  }
});


       
        // Create an offer, set local description, and send it to the other peer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer,id,friend);

      } catch (error) {
        console.error("Error starting video chat:", error);
      }
    };

    // Condition to continue execution only if the URL parameters match the specific IDs
    if (
      (id === id && friend === friend) ||
      (id === friend && friend === id)
    ) {
      startVideoChat();
    }

    // Cleanup when the component is unmounted
    return () => {
      const peerConnection = peerConnectionRef.current;
      if (peerConnection) {
        peerConnection.close();
      }
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [id, friend]);

  return (
    <VideoPlayer localStream={localStream} remoteStream={remoteStream} />
  );
}
