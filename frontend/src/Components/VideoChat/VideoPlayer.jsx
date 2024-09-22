import { useEffect, useRef } from "react";

export default function VideoPlayer({ localStream, remoteStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

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

  return (
    <div className="absolute flex flex-wrap w-full h-full">
      <video
        ref={localVideoRef}
        id="local-video"
        className="w-1/2 h-4/5"
        autoPlay
        muted
        playsInline
        controls
      ></video>
      <video
        ref={remoteVideoRef}
        id="remote-video"
        className="w-1/2 h-4/5"
        autoPlay
        playsInline
        controls
      ></video>
      <div id="button" className="w-full flex justify-center items-center">
        <button className="outline-none bg-red-51 text-white p-1 py-3 px-1 font-medium">Remove</button>
      </div>
    </div>
  );
}
