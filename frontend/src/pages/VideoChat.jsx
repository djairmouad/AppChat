import { useEffect, useRef } from "react";
import handelVideo, { addAnswer, addNewIceCandidate, answerOffer } from "../utils/handelVideo";
import { useSearchParams } from "react-router-dom";
import socket from "../utils/socket";

export default function VideoChat() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || 1;
  const friend = searchParams.get("friend") || 1;

  useEffect(() => {
    if (id !== 1 && friend !== 1) {
      if (localVideoRef.current && remoteVideoRef.current) {
        handelVideo(localVideoRef.current, remoteVideoRef.current, id);
      }
    } else {
      const receiverListener =async()=>{
        await socket.on(`receiver-${id}`, (offers) => {
          console.log("hello")
          offers.forEach((o) => {
            answerOffer(localVideoRef.current, remoteVideoRef.current, id, o);
          });
        });
      }
      receiverListener();
      const answerListener = socket.on(`answerResponse-${id}`, (offerObj) => {
        addAnswer(offerObj);
      });

      const iceCandidateListener = socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
        addNewIceCandidate(iceCandidate);
      });

      return () => {
        // // Cleanup event listeners when component unmounts
        // socket.off(`receiver-${id}`, receiverListener);
        socket.off(`answerResponse-${id}`, answerListener);
        socket.off("receivedIceCandidateFromServer", iceCandidateListener);
      };
    }
  }, [id, friend]);

  return (
    <div className="absolute flex flex-wrap w-full h-full">
      <video ref={localVideoRef} id="local-video" className="w-1/2 h-4/5" autoPlay controls></video>
      <video ref={remoteVideoRef} id="remote-video" className="w-1/2 h-4/5" autoPlay></video>
      <div id="button" className="w-full flex justify-center items-center">
        <button className="outline-none bg-red-51 text-white p-1 py-3 px-1 font-medium">Remove</button>
      </div>
    </div>
  );
}
