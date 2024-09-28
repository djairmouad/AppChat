import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { RemoveToken } from "../utils/getAuth";
import { fetchUser } from "../utils/http";
import { useQuery } from "@tanstack/react-query";

export default function Settings(){
    const {id}=useParams()
    const { data, isPending, isError } = useQuery({
        queryKey: ["fetchUser", id],
        queryFn: () => fetchUser(id),
    });
    const name=data?.data[0].name || ""
     const profileImage=data?.data[0].profileImage 

    const navigate=useNavigate()
    function HandelLogOut(){
    RemoveToken()
    navigate("/");
    }
    return   <div className="info h-10% font-medium ">
    <ul className="flex justify-around items-center  ">
        <li className="flex items-center gap-1 w-1/3 ">
        <NavLink to={id} className="flex items-center gap-1 w-full">
        {profileImage?
            <li className="relative overflow-hidden rounded-full w-9 h-9    border-1 border-white ">
              <img className="" src={"http://localhost:5000/upload/"+profileImage}></img>
            </li>:
        <FontAwesomeIcon icon={faUser} />}
        <p>{name}</p>
        </NavLink>
        </li>
        
        <li className="w-1/3 ">
           <button onClick={HandelLogOut} className=" flex gap-2 items-center ">
           LogOut
           <FontAwesomeIcon icon={faRightFromBracket} />
           </button>
        </li>
    </ul>
    </div>
} 

