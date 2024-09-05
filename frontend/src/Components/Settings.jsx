import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { RemoveToken } from "../utils/getAuth";

export default function Settings({data}){
    const {id}=useParams()
    const name=data?.data[0].name || ""
    const navigate=useNavigate()
    function HandelLogOut(){
    RemoveToken()
    navigate("/");
    }
    return   <div className="info h-10% font-medium ">
    <ul className="flex justify-around  ">
        <li className="flex items-center gap-1 w-1/3 ">
        <NavLink to={id} className="flex items-center gap-1 w-full">
        <FontAwesomeIcon icon={faUser} />
        <p>{name}</p>
        </NavLink>
        </li>
        
        <li className="w-1/3 ">
           <button onClick={HandelLogOut}>
           LogOut
           </button>
        </li>
    </ul>
    </div>
}