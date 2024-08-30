import { Outlet } from "react-router-dom";
import Side from "../Components/Side";
import Search from "../Components/Search";
import { useRef, useState } from "react";

export default function SideBare(){
    const search=useRef();
    const [searchValue,setSearchValue]=useState("");
    function handelChange(){
        setSearchValue(search.current.value)
    }
    return <div className=" flex absolute bg-red-600 w-full h-full ">
    <main className=" w-1/4 h-full bg-white" >
    <Side/>
    </main>
    <main className=" w-3/4 col-span-1 h-full bg-blue-200 ">
    <div className="h-10%">
    <input
      type="text" ref={search} 
      className=" w-full border h-3/4 outline-none" 
      placeholder=" Search About Friends"
     onChange={handelChange}
    />
    <Search include={searchValue}/>
   </div>
    <Outlet/>
    </main>
    
    </div>
}