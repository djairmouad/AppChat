import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import socket from "../utils/socket";
import VideoPlayer from "../Components/VideoChat/VideoPlayer";

export default function VideoChat() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || 1;
  const friend = searchParams.get("friend") || 1;

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
    ]
  };

  const peerConnectionRef = useRef(new RTCPeerConnection(configuration));
  const remoteMediaStream = useRef(new MediaStream());

  useEffect(() => {
    const peerConnection = peerConnectionRef.current;

    // Handle remote track
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteMediaStream.current.addTrack(track);
      });
      setRemoteStream(remoteMediaStream.current);
    };

    // Handle ICE candidate
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          id: friend
        });
        
      }
    };

    // Start video chat
    const startVideoChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("signalFirst", { type: "offer", sdp: offer, id: friend });
        console.log("Emitting offer:", { type: "offer", sdp: offer, id: friend });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access your camera and microphone. Please check your permissions.');
      }
    };

    if (id !== 1 && friend !== 1) {
      startVideoChat();
    }

    // Cleanup
    return () => {
      peerConnection.close();
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [id, friend]);

  useEffect(() => {
    const peerConnection = peerConnectionRef.current;

    // Handle incoming offer
    const handleReceiveOffer = async (offer) => {
      try {
        if (offer && offer.type === 'offer') {
          console.log("hello")
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('signalFirst', { type: 'answer', sdp: answer, id });
          console.log("Emitting answer:", { type: 'answer', sdp: answer, id });

        } else {
          console.error("Received invalid offer:", offer);
        }
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

// Handle incoming answer
const handleReceiveAnswer = async (answer) => {
  try {
    if (answer && answer.type === 'answer') {
      if (peerConnection.signalingState === 'have-local-offer') { // Ensure we are in the correct state
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Remote answer set successfully.");
      } else {
        console.error(`Unexpected state: ${peerConnection.signalingState}. Cannot set remote answer.`);
      }
    } else {
      console.error("Received invalid answer:", answer);
    }
  } catch (error) {
    console.error("Error handling answer:", error);
  }
};



    // Handle incoming ICE candidate
    const handleNewICECandidateMsg = (candidate) => {
      try {
        if (candidate) {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => {
            console.error("Error adding received ice candidate:", e);
          });
        } else {
          console.error("Received invalid ICE candidate:", candidate);
        }
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    // Listen for signaling messages
    socket.on(`signal-${id}`, data => {
      console.log("Signal data received:", data);
      switch (data.type) {
        case 'offer':
          console.log(data)
          handleReceiveOffer(data.offer);
          break;
        case 'answer':
          console.log(data)
          handleReceiveAnswer(data.offer);
          break;
        case 'ice-candidate':
          handleNewICECandidateMsg(data.candidate);
          break;
        default:
          console.warn("Unknown signal type received:", data.type);
          break;
      }
    });

    // Cleanup
    return () => {
      socket.off(`signal-${id}`);
    };
  }, [id]);

  return (
    <VideoPlayer localStream={localStream} remoteStream={remoteStream} />
  );
}
