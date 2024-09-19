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
  try {
    const pc = new RTCPeerConnection(peerConfiguration);

    // Initialize remote stream
    const remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;

    // Check if localStream exists before adding tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
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
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      console.log("Received track from remote peer.");
    };

    // If an offer object is provided, set the remote description
    if (offerObj) {
      await pc.setRemoteDescription(offerObj.offer);
    }

    // Handle signaling state changes
    pc.onsignalingstatechange = () => {
      console.log(pc);
      console.log('Signaling state changed to:', pc.signalingState);
    };

    console.log(pc);
    return pc;

  } catch (error) {
    console.error("Error creating peer connection:", error);
  }
};

// Function to initiate the call
const call = async (localVideo, remoteVideo, username) => {
  try {
    await fetchUserMedia(localVideo);
    peerConnection = await createPeerConnection(remoteVideo, username, null);
    if (peerConnection) {
      console.log("Creating offer...");
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      didIOffer = true;

      // Send offer to the signaling server
      socket.emit('newOffer', offer);
    }
  } catch (err) {
    console.error("Error during call initiation:", err);
  }
};

// Function to handle the video
const handleVideo = async (localVideo, remoteVideo, username) => {
  await call(localVideo, remoteVideo, username);
};

// Function to answer an offer
export const answerOffer = async (localVideo, remoteVideo, username, offerObj) => {
  try {
    await fetchUserMedia(localVideo);
    peerConnection = await createPeerConnection(remoteVideo, username, offerObj);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    offerObj.answer = answer;

    const offerIceCandidates = await socket.emitWithAck('newAnswer', offerObj);
    offerIceCandidates.forEach(c => {
      peerConnection.addIceCandidate(c);
      console.log("Added ICE candidate from offer.");
    });

  } catch (err) {
    console.error("Error answering offer:", err);
  }
};

export const addAnswer = async (offerObj) => {
  try {
    // Ensure peer connection is in the correct state to accept an answer
    if (peerConnection.signalingState === 'have-local-offer') {
      await peerConnection.setRemoteDescription(offerObj.answer);
      console.log("Added answer to peer connection.");
    } else {
      console.warn("Cannot add answer, peer connection is not in the correct state. Current signaling state:", peerConnection.signalingState);
    }
  } catch (err) {
    console.error("Error adding answer:", err);
  }
};


export const addNewIceCandidate = async (iceCandidate) => {
  try {
    // Ensure the connection is not closed and the description is set before adding ICE candidates
    if (peerConnection.signalingState !== 'closed') {
      await peerConnection.addIceCandidate(iceCandidate);
      console.log("Added ICE candidate.");
    } else {
      console.warn("Cannot add ICE candidate, peer connection is closed.");
    }
  } catch (err) {
    console.error("Error adding ICE candidate:", err);
  }
};


export default handleVideo;
