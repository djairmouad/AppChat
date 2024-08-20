import { Link } from "react-router-dom";

export default function Login(){
    return <div className=" bg-blue-100 w-full h-full absolute">
        <div className=" w-96 h-40 justify-between   absolute flex flex-col left-1/2 -translate-x-2/4  top-1/2 -translate-y-2/4 items-center ">
        <h1 className=" text-xl font-medium ">Login</h1>
        <input className=" w-3/5 border rounded-sm pl-1  py-1 outline-none " placeholder="Email"/>
        <input className=" w-3/5 border rounded-sm pl-1  py-1 outline-none " placeholder="Password"/>
        <div className=" w-3/5 flex justify-start items-center gap-2">
        <button className=" border bg-blue-600 text-white p-1 px-8 font-medium outline-none rounded-lg ">Login</button>
        <Link to="register" className=" text-sm">Register</Link>
        </div>
        
    </div>
    </div>
}