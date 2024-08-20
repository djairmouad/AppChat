import { faComments, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Side(){
    return <>
         <ul className=" flex flex-col h-90%     pt-8 ">
        <li className=" pl-2 pb-2 flex gap-2 ">
        <FontAwesomeIcon  className="w-7 h-6 text-blue-700" icon={faComments} />
        <p className=" font-medium text-blue-700 ">MernChat</p>
        </li>
        <li className=" bg-blue-300 border border-white py-2 pl-1 text-ms font-medium">
            <Link>Mouad</Link>
        </li>
        <li className=" bg-blue-300 border border-white py-2 pl-1 text-ms font-medium">
            <Link>fateh</Link>
        </li>
        <li className=" bg-blue-300 border border-white py-2 pl-1 text-ms font-medium">
            <Link>abdo</Link>
        </li>
    </ul>
    <div className="info h-10% font-medium ">
    <ul className="flex justify-around  ">
        <li className="flex items-center gap-1 w-1/3 ">
        <Link className="flex items-center gap-1 w-full">
        <FontAwesomeIcon icon={faUser} />
        <p>Mouad</p>
        </Link>
        </li>
        
        <li className="w-1/3 ">
            <Link>LogOut</Link>
        </li>
    </ul>
    </div>
    </>
}