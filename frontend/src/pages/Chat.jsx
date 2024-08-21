import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Chat(){
return <div className=" flex flex-col justify-between h-full">
   <div className="h-10%">
    <input type="text" className=" w-full border h-3/4 outline-none" placeholder=" Search About Friends"/>
   </div>
    <ul className="flex items-center h-10% w-full  pl-3">
        <input type="text" name="message" className="border h-3/4 w-4/5    py-1 pl-1 bg-white outline-none" placeholder="Type your message here"  />
        <div className=" w-10%  h-3/4 relative cursor-pointer   ">
            <input type="file" className="relative z-10 w-full h-full opacity-0 cursor-pointer " />
            <FontAwesomeIcon icon={faPaperclip} className=" cursor-pointer  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  " />
        </div>
       <button className="w-10%  h-10% flex items-center" >
       <FontAwesomeIcon icon={faPaperPlane}/>
       </button>

    </ul>
</div>
}