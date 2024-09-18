import socket from "./socket";

let localStream;
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
const handelVideo = async (localVideo, remoteVideo, username) => {
  await call(localVideo, remoteVideo, username);
};

// Function to initiate the call
const call = async (localVideo, remoteVideo, username) => {
  await fetchUserMedia(localVideo);
  peerConnection = await createPeerConnection(remoteVideo, username);
  
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
const createPeerConnection = async (remoteVideo, username, offerObj) => {
  // Create a new RTCPeerConnection
  const peerConnection = new RTCPeerConnection(peerConfiguration);

  // Initialize remote stream
  const remoteStream = new MediaStream();
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
        iceUserName: username,
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

  if (offerObj) {
    // Set the remote description if an offerObj is provided
    await peerConnection.setRemoteDescription(offerObj.offer);
  }

  return peerConnection;
};

export const answerOffer = async (localVideo, remoteVideo, username, offerObj) => {
  await fetchUserMedia(localVideo);
  peerConnection = await createPeerConnection(remoteVideo, username, offerObj)
  console.log(peerConnection)
  const answer = await peerConnection.createAnswer();
  console.log(answer)
  await peerConnection.setLocalDescription(answer);
  console.log("offerObj:", offerObj);
  console.log("answer:", answer);
  console.log("peerConnection.signalingState:", peerConnection.signalingState);
  offerObj.answer = answer;
  const offerIceCandidates = await socket.emitWithAck('newAnswer', offerObj);
  offerIceCandidates.forEach(c => {
    peerConnection.addIceCandidate(c);
    console.log("======Added Ice Candidate======");
  });
  console.log("offerIceCandidates:", offerIceCandidates);
};

export const addAnswer = async (offerObj) => {
  // Add the answer to the peer connection
    await peerConnection.setRemoteDescription(offerObj.answer)
  console.log("Added answer to peer connection.");
};

export const addNewIceCandidate = (iceCandidate) => {
  peerConnection.addIceCandidate(iceCandidate);
  console.log("======Added Ice Candidate======");
};

export default handelVideo;
