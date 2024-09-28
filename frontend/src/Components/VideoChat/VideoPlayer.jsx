import { faMicrophone, faMicrophoneSlash, faPhoneSlash, faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";
import { fetchUser } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";

export default function VideoPlayer({ localStream, remoteStream,friend,id,handelClose,ControleCmira ,ControleMicroPhone }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [microPhone,setMicroPhone]=useState(false)
  const [video,setVideo]=useState(false)
  const [showImage,setShowImage]=useState(true)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchUser", friend],
    queryFn: () => fetchUser(friend),
});
  const { data:DataProfile, isPending:PendingProfile, isError:isErrorProfile } = useQuery({
    queryKey: ["fetchUser", id],
    queryFn: () => fetchUser(id),
});
const infoCaller=data?.data[0];
const infoProfile=DataProfile?.data[0];
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
  useEffect(()=>{
    socket.on(`ControleCamira-${id}`,(config)=>{
      setShowImage(config)
      console.log(config)
    })
  },[id])
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
    <div className=" flex flex-wrap w-full h-full bg-black relative">
      <video
        ref={localVideoRef}
        id="local-video"
        className="w-1/2 h-4/5 "
        autoPlay
        muted
      ></video>
      {video && <div className="flex flex-col w-1/2 h-4/5 justify-center items-center absolute top-0 left-0  ">
                            <img className=" w-28 h-28 rounded-full opacity-70 " src={"http://localhost:5000/upload/"+infoProfile.profileImage}></img>
                            <p className=" font-medium text-black  ">{infoProfile.name}</p>
                        </div>}
      
        <video
        ref={remoteVideoRef}
        id="remote-video"
        className="w-1/2 h-4/5 "
        autoPlay
      ></video>
      {
        !showImage && <div className="flex flex-col w-1/2 h-4/5 justify-center items-center absolute top-0   right-0  ">
                            {isLoading && <p className=" text-white">Loading...</p>}{data &&<img className=" w-28 h-28 rounded-full opacity-70 " src={"http://localhost:5000/upload/"+infoCaller.profileImage}></img>}
                            {isLoading && <p className=" text-white">Loading...</p>}{data &&<p className=" font-medium text-black  ">{infoCaller.name}</p>}
                            
                        </div>
      }
     
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
