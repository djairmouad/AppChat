import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import socket from "../utils/socket";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Chat(){
    const {friend,id}=useParams();
    const message=useRef();
    useEffect(() => {
        socket.on(id, (message) => {
            console.log(message);
        });

        // Cleanup to avoid multiple listeners
        return () => {
            socket.off(id);
        };
    }, [id]);
    function HandelSend(){
        const newMessage=message.current.value
        socket.emit("Message",friend,newMessage);
        message.current.value=""
    }
return <div className=" flex flex-col justify-end h-90% ">
     <ul className=" h-full p-3">
     <li className=" w-fit bg-white py-1 px-2 rounded-md ">Hello Mouad</li>
     <ul className="bg-transparent flex justify-end">
     <li className=" w-fit bg-blue-800  py-1 px-2 rounded-md text-white">Hello fateh</li>
     </ul>
     </ul>
    <ul className="flex items-center h-10% w-full  pl-3">
        <input ref={message} type="text" name="message" className="border h-3/4 w-4/5    py-1 pl-1 bg-white outline-none" placeholder="Type your message here"  />
        <div className=" w-10%  h-3/4 relative cursor-pointer   ">
            <input type="file" className="relative z-10 w-full h-full opacity-0 cursor-pointer " />
            <FontAwesomeIcon icon={faPaperclip} className=" cursor-pointer  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  " />
        </div>
       <button onClick={HandelSend} className="w-10%  h-10% flex items-center" >
       <FontAwesomeIcon icon={faPaperPlane}/>
       </button>

    </ul>
</div>
}