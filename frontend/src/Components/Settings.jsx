import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export default function Settings(){
    return   <div className="info h-10% font-medium ">
    <ul className="flex justify-around  ">
        <li className="flex items-center gap-1 w-1/3 ">
        <NavLink className="flex items-center gap-1 w-full">
        <FontAwesomeIcon icon={faUser} />
        <p>Mouad</p>
        </NavLink>
        </li>
        
        <li className="w-1/3 ">
            <NavLink>LogOut</NavLink>
        </li>
    </ul>
    </div>
}