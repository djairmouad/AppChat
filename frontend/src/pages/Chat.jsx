

import { useParams } from "react-router-dom";
import { useEffect,  useState } from "react";
import { fetchConversation} from "../utils/http";
import NewConversation from "../Components/NewConversation";
import Inputs from "../Components/Inputs";
import { useDispatch } from "react-redux";
import { conversationAction } from "../../store/conversation";
export default function Chat() {
  const { friend, id } = useParams();
  const [data,setData]=useState([]);
  const dispatch=useDispatch();
  useEffect(() => {
    dispatch(conversationAction.deleteArray())
    const fetchData = async () => {
      try {
        let response = await fetchConversation({ id, friend });
        let messages = response?.data?.messages || [];
        messages=messages.slice(-3)
        setData(messages);
        console.log(messages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchData();
  }, [id, friend]);
  
  return (
    <div className="flex flex-col justify-end h-90%">
      <ul className="h-full p-3 overflow-y-auto">
      {data.map(item=>{
        if(item.senderId===friend){
           return <div key={item.timestamp}>
           <li className="w-fit bg-white py-1 px-2 mb-3 rounded-md">{item.content}</li>
           {item.nameFile? <img  className=" w-4/12 my-1 " src={"http://localhost:5000/upload/" + item.nameFile} />:null} 
           </div>
        }else{
           return <ul style={{display:"flex",flexDirection:"column",alignItems:"end" , alignContent:"end"}} key={item.timestamp} className="bg-transparent mb-3 gap-2">
          <li className="w-fit bg-blue-800 py-1 px-2 rounded-md text-white">{item.content}</li>
          {item.nameFile? <img  className=" w-4/12 my-1" src={"http://localhost:5000/upload/" + item.nameFile} />:null} 
        </ul>
        }
       })}
       <NewConversation key={friend} />
      </ul>
      <Inputs />
    </div>
  );
}

