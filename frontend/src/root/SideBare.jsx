import { Outlet } from "react-router-dom";
import Side from "../Components/Side";

export default function SideBare(){
    return <div className=" flex absolute bg-red-600 w-full h-full ">
    <side className=" w-1/4 h-full bg-white" >
    <Side/>
    </side>
    <main className=" w-3/4 col-span-1 h-full bg-blue-200 ">
    <Outlet/>
    </main>
    
    </div>
}