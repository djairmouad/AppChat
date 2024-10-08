import {  faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addFriend, queryClient, SearchUsers } from "../utils/http";
import { useParams } from "react-router-dom";

export default function Search({include}){
    const {data,isPending,isError}=useQuery({
        queryKey:["users"],
        queryFn:SearchUsers
    })
    const {id}=useParams();
    const {mutate,isLoading}=useMutation({
        mutationFn:addFriend,
        
    })
    let users
    if(include===""){
        users=[]
    }else{
        users=data?.filter((item)=>{
            return item.name.toLowerCase().startsWith(include.trim().toLowerCase())
        });
        users=users.filter(item=>{
            return item._id!==id
        })
    }
    if(isError && isPending){
        return <p>pending...</p>
    }
    function HandelAddFriend(id_Friend){
    mutate({id,id_Friend});
    queryClient.invalidateQueries([{
        queryKey:"fetchUser"
    }])
    }
    return <ul className=" h-fit bg-white relative z-30">
    {users?.map((item)=>
    (
        <li key={item._id} className="flex items-center h-7 justify-between px-4 ">
        <p>{item.name}</p>
        <button className=" w-1/12 bg-blue-300 text-sm   rounded-lg " onClick={()=>HandelAddFriend(item._id)}>
        <FontAwesomeIcon icon={faLocationArrow} className=" w-3 text-blue-500" />
        </button>
    </li>
    )
    )}
    </ul>
}