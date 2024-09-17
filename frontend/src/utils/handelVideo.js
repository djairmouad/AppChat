import socket from "./socket";

let localStream;
let remoteStream;
let peerConnection;
let didIOffer = false;

const peerConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302'
      ]
    }
  ]
};

// Function to handle the video
const handelVideo = async (localVideo, remoteVideo) => {
  await call(localVideo, remoteVideo);
};

// Function to initiate the call
const call = async (localVideo, remoteVideo) => {
  await fetchUserMedia(localVideo);
  peerConnection = await createPeerConnection(remoteVideo);
  
  try {
    console.log("Creating offer...");
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    didIOffer = true;
    
    // Send offer to the signaling server
    socket.emit('newOffer', offer);
  } catch (err) {
    console.error("Error creating offer:", err);
  }
};

// Function to fetch user media (video and audio)
const fetchUserMedia = async (localVideo) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    localVideo.srcObject = stream;
    localStream = stream;
  } catch (err) {
    console.error("Error accessing user media:", err);
  }
};

// Function to create a new peer connection
const createPeerConnection = async (remoteVideo) => {
  // Create a new RTCPeerConnection
  const peerConnection = new RTCPeerConnection(peerConfiguration);

  // Initialize remote stream
  remoteStream = new MediaStream();
  remoteVideo.srcObject = remoteStream;

  // Add local stream tracks to the peer connection
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("ICE candidate found!", event.candidate);
      socket.emit('sendIceCandidateToSignalingServer', {
        iceCandidate: event.candidate,
        iceUserName: "Mouad",
        didIOffer
      });
    }
  };

  // Handle incoming tracks from remote peer
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
    console.log("Received track from remote peer.");
  };

  // Handle signaling state changes
  peerConnection.onsignalingstatechange = () => {
    console.log('Signaling state changed to:', peerConnection.signalingState);
    if (peerConnection.signalingState === 'stable') {
      console.log('The connection is stable.');
    }
  };

  return peerConnection;
};

export default handelVideo;
