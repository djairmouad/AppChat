import { useEffect, useRef } from "react"
import handelVideo, { addAnswer, addNewIceCandidate, answerOffer } from "../utils/handelVideo";
import { useSearchParams } from "react-router-dom";
import socket from "../utils/socket";

export default function VideoChat(){
    const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null)
  const [searchParams,setSerachParams]=useSearchParams();
  const id=searchParams.get("id") || 1
  const friend=searchParams.get("friend") || 1
  const caller=searchParams.get("caller") || 1
  useEffect(() => {
    if (id !== 1 && friend !== 1) {
      if (localVideoRef.current && remoteVideoRef.current) {
        handelVideo(localVideoRef.current, remoteVideoRef.current, id);
      }
    } else {
      console.log(id)
      socket.on(`receiver-${id}`, (offers) => {
        console.log(offers);
        offers.forEach((o) => {
          answerOffer(localVideoRef, remoteVideoRef, id, o);
        });
      });
      
  
      socket.on(`answerResponse-${id}`, (offerObj) => {
        addAnswer(offerObj);
      });
  
      socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
        addNewIceCandidate(iceCandidate);
      });
      
    }
  }, [localVideoRef, remoteVideoRef, id, friend, caller]);
  
    return <div className=" absolute flex flex-wrap w-full h-full ">
        <video ref={localVideoRef} id="local-video" className=" w-1/2 h-4/5  "  controls   autoPlay></video>
        <video ref={remoteVideoRef} id="remote-video" className=" w-1/2 h-4/5  "  controls autoPlay></video>
        <div id="button" className=" w-full  flex  justify-center items-center">
        <button className=" outline-none bg-red-51 text-white p-1 py-3 px-1 font-medium">Remove</button>
        </div>
    </div>
}