import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useParams } from "react-router-dom";
import image from "../assets/profile.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/http";
export default function Friends(){
    const {id}=useParams();
    const { data, isPending, isError } = useQuery({
        queryKey: ["fetchUser", id],
        queryFn: () => fetchUser(id),
    });
    const Friends=data?.data[0].FriendUser || []
    
    return    <ul className=" flex flex-col h-90%     pt-2  sm: pt-0 ">
    <li className=" pl-2 pb-2 flex gap-2  ">
    <FontAwesomeIcon  className="w-7 h-6 text-blue-700 sm: w-5" icon={faComments} />
    <p className=" font-medium text-blue-700 ">MernChat</p>
    </li>
    {Friends.map(item=>{
        return  <NavLink key={item._id} to={`${id}/${item._id}`} className={({ isActive }) => (isActive ? "bg-blue-200" : "bg-blue-300 ")}>
        <ul className="flex items-center border border-white border-r-0 py-1">
        <>
        <li className="relative overflow-hidden rounded-full w-12 h-12 border-1 border-white ">
        {item.profileImage==="" || item.profileImage===undefined?<img src={image} className="" alt="item" />:
            <img src={"http://localhost:5000/upload/"+item.profileImage} alt="item" />
        }
        </li>
        </>
        <li className=" border border-white border-none py-2 pl-1 text-ms font-medium">
        {item.name}
    </li>
    </ul>
    </NavLink>
    })}
</ul>
}