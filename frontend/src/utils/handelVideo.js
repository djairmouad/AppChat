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

    // Set remote description if provided
    if (offerObj && offerObj.offer) {
      await pc.setRemoteDescription(offerObj.offer);
      console.log("Remote description set.");
    }

    // Handle signaling state changes
    pc.onsignalingstatechange = () => {
      console.log('Signaling state changed to:', pc.signalingState);
    };

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

export const answerOffer = async (localVideo, remoteVideo, username, offerObj) => {
  try {
    await fetchUserMedia(localVideo);
    peerConnection = await createPeerConnection(remoteVideo, username, offerObj);

    if (peerConnection.signalingState === 'have-remote-offer' || peerConnection.signalingState === 'stable') {
      await peerConnection.setRemoteDescription(offerObj.offer);
      console.log("Remote description set.");

      // Create and set the local answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log("Local description set.");

      // Send the answer to the signaling server
      offerObj.answer = answer;
      const offerIceCandidates = await socket.emitWithAck('newAnswer', offerObj);

      // Add ICE candidates from the offer
      offerIceCandidates.forEach(c => {
        peerConnection.addIceCandidate(c);
        console.log("Added ICE candidate from offer.");
      });
    } else {
      console.warn("Peer connection is not in a state to set remote description.");
    }
  } catch (err) {
    console.error("Error answering offer:", err);
  }
};

export const addAnswer = async (offerObj) => {
  try {
    if (peerConnection.signalingState === 'have-remote-offer') {
      await peerConnection.setRemoteDescription(offerObj.answer);
      console.log("Answer added to peer connection.");
    } else {
      console.warn("Peer connection is not in a state to set remote description.");
    }
  } catch (err) {
    console.error("Error adding answer:", err);
  }
};

export const addNewIceCandidate = async (iceCandidate) => {
  try {
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
