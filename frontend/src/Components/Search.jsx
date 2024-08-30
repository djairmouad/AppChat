import {  faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { SearchUsers } from "../utils/http";

export default function Search({include}){
    const {data,isPending,isError}=useQuery({
        queryKey:["users"],
        queryFn:SearchUsers
    })
    console.log(include);
    let users
    if(include===""){
        users=[]
    }else{
        users=data?.filter((item)=>{
            return item.name.includes(include.trim())
        })
    }
    console.log(users);
    if(isError && isPending){
        return <p>pending...</p>
    }
    console.log(data);
    return <ul className=" h-fit bg-white">
    {users?.map((item)=>
    (
        <li key={item.id} className="flex items-center h-7 justify-between px-4 ">
        <p>{item.name}</p>
        <button>
        <FontAwesomeIcon icon={faLocationArrow} className=" w-3 text-blue-500" />
        </button>
    </li>
    )
    )}
    </ul>
}