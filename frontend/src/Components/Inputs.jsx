import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { conversationAction } from "../../store/conversation";
import socket from "../utils/socket";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { saveConversation } from "../utils/http";
import { useParams } from "react-router-dom";
import { callAction } from "../../store/call";

export default function Inputs(){
    const { friend, id } = useParams();
    const message = useRef();
    const file=useRef();
    const dispatch=useDispatch();
    const {mutate,isError,isPending}=useMutation({
      mutationFn:saveConversation
    })
    useEffect(() => {
        socket.on(id, (message) => {
          console.log(message);
          dispatch(conversationAction.addMessageToArray({...message}))
        });
            // Cleanup to avoid multiple listeners
    return () => {
        socket.off("hey"); // Corrected to remove the "hey" listener
      };
    }, [id]);

    function handleSend() { // Fixed typo: 'HandelSend' -> 'handleSend'
      const newMessage = message.current.value;
        const FileUpload=file.current.files[0]
      if(newMessage!=="" || FileUpload!==undefined ){
        const nameFile=FileUpload?.name || "";
        const info={
            senderId:id,
            content:newMessage,
            timestamp:new Date().toISOString(),
            status:"sent",
            nameFile:nameFile
        }
        socket.emit("Message", friend, info,nameFile,FileUpload);
        dispatch(conversationAction.newMessage({...info}))
        dispatch(conversationAction.deleteMessage())
        mutate({info,id,friend,FileUpload})
        message.current.value = "";
      }
      }

    function handleCall(friend){
      socket.emit(`call`,friend)
      }

    
      if(isError || isPending){
        return <p>error</p>
      }
    return   <ul className="flex items-center h-10% w-full pl-3">
    <input
      ref={message}
      type="text"
      name="message"
      className="border h-3/4 w-4/5 py-1 pl-1 bg-white outline-none"
      placeholder="Type your message here"
    />
    <div className="w-10% h-3/4 relative cursor-pointer">
      <input
      ref={file}
        type="file"
        name="file"
        className="relative z-10 w-full h-full opacity-0 cursor-pointer"
      />
      <FontAwesomeIcon
        icon={faPaperclip}
        className="cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
    <button onClick={handleSend} className="w-10% h-10% flex items-center">
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
    <button onClick={()=>handleCall(friend)} className="w-10% h-10% flex items-center">
      Call
    </button>
  </ul>
}