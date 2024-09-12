import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";

export default function NewConversation(){
    const { friend, id } = useParams();
    let conversation=useSelector(state=>state.conversation.ArrayConversation) || []
    console.log(conversation);
    return <>
        {conversation.map(item=>{
         if(item.senderId===friend){
           return <div key={item.timestamp}>
           {item.content? <li className="w-fit bg-white py-1 px-2 mb-3 rounded-md">{item.content}</li>:null}
           {item.nameFile? <img  className=" w-4/12 my-1 " src={"http://localhost:5000/upload/" + item.nameFile} />:null} 
           </div>
        }else{
           return <ul style={{display:"flex",flexDirection:"column",alignItems:"end" , alignContent:"end"}} key={item.timestamp} className="bg-transparent mb-3 gap-2">
          {item.content? <li className="w-fit bg-blue-800 py-1 px-2 rounded-md text-white">{item.content}</li>:null}
          {item.nameFile? <img  className=" w-4/12 my-1 " src={"http://localhost:5000/upload/" + item.nameFile} />:null}  
        </ul>
        }
       })}  
    </>
}