import { useEffect, useRef } from "react"
import handelVideo from "../utils/handelVideo";

export default function VideoChat(){
    const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null)
    useEffect(()=>{
        if (localVideoRef.current) {
            handelVideo(localVideoRef.current,remoteVideoRef.current);
          }
    },[localVideoRef])
    return <div className=" absolute flex flex-wrap w-full h-full ">
        <video ref={localVideoRef} id="local-video" className=" w-1/2 h-4/5  "  controls   autoPlay></video>
        <video ref={remoteVideoRef} id="remote-video" className=" w-1/2 h-4/5  "  controls autoPlay></video>
        <div id="button" className=" w-full  flex  justify-center items-center">
        <button className=" outline-none bg-red-500 text-white p-0 py-3 px-1 font-medium">Remove</button>
        </div>
    </div>
}