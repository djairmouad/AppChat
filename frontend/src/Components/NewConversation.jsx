import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";

export default function NewConversation(){
    const { friend, id } = useParams();
    let conversation=useSelector(state=>state.conversation.ArrayConversation) || []
    return <>
        {conversation.map(item=>{
        if(item.senderId===friend){
           return <li key={item.timestamp} className="w-fit bg-white py-1 px-2 mb-3 rounded-md">{item.content}</li>
        }else if(item.senderId===id){
           return <ul key={item.timestamp} className="bg-transparent flex justify-end mb-3">
          <li className="w-fit bg-blue-800 py-1 px-2 rounded-md text-white">{item.content}</li>
        </ul>
        }
       })}  
    </>
}