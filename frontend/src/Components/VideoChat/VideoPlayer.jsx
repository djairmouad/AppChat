import { faMicrophone, faMicrophoneSlash, faPhoneSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";

export default function VideoPlayer({ localStream, remoteStream,friend,handelClose,ControleCmira ,ControleMicroPhone }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [microPhone,setMicroPhone]=useState(false)
  const [video,setVideo]=useState(false)
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log("Local stream set:", localStream);
    }

    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Remote stream set:", remoteStream);
    }
  }, [localStream, remoteStream]);
  
  function handelCloseVideo(){
    socket.emit("Close",friend);
    handelClose();
  }
  function changeVideoState(){
    setVideo(prev=>!prev) 
  }
  function changeMicroState(){
    setMicroPhone(prev=>!prev)
  }
  return (
    <div className="absolute flex flex-wrap w-full h-full bg-black">
      <video
        ref={localVideoRef}
        id="local-video"
        className="w-1/2 h-4/5"
        autoPlay
        muted
      ></video>
      <video
        ref={remoteVideoRef}
        id="remote-video"
        className="w-1/2 h-4/5"
        autoPlay
      ></video>
      <div id="button" className="w-full flex justify-center items-center gap-4">
        <button className="  bg-white w-14 h-14  rounded-full "
        onClick={() => { ControleCmira(video); changeVideoState(); }}
        >
        {video?<FontAwesomeIcon  icon={faVideoSlash} />:
        <FontAwesomeIcon  icon={faVideo} />}
        </button>
        <button className="  bg-white w-14 h-14  rounded-full "
        onClick={() => { ControleMicroPhone(microPhone); changeMicroState(); }}
        >
        {microPhone?<FontAwesomeIcon  icon={faMicrophoneSlash} />:
        <FontAwesomeIcon  icon={faMicrophone} />}
        </button>
        <button className="  bg-red-600 text-white  w-14 h-14  rounded-full " 
        onClick={handelCloseVideo}>
        <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
      </div>
    </div>
  );
}
