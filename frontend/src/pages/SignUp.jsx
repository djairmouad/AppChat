import { Form, Link, redirect } from "react-router-dom";
import { CreateUser } from "../utils/http";

export default function SignUp(){
    return <div className=" bg-blue-100 w-full h-full absolute">
    <Form method="post">
    <div className=" w-96 h-40 justify-between   absolute flex flex-col left-1/2 -translate-x-2/4  top-1/2 -translate-y-2/4 items-center ">
    <h1 className=" text-xl font-medium mb-2 ">Sign Up</h1>
    <input name="name" className=" w-3/5 border mb-1 rounded-sm pl-1  py-1 outline-none " placeholder="Name"/>
    <input name="email" className=" w-3/5 border mb-1 rounded-sm pl-1  py-1 outline-none " placeholder="Email"/>
    <input name="password" className=" w-3/5 border mb-1 rounded-sm pl-1  py-1 outline-none " placeholder="Password"/>
    <div className=" w-3/5 flex justify-start items-center gap-2">
    <button className=" border bg-blue-600 text-white p-1 px-8 font-medium outline-none rounded-lg ">Sign Up</button>
    <Link to="/" className=" text-sm">Login</Link>
    </div>
    
</div>
</Form>
</div>
}


export async function action({request}) {
    const data= await request.formData();
    const eventData={
        name:data.get("name"),
        email:data.get("email"),
        password:data.get("password")
    }
    await CreateUser(eventData)
    return redirect("/")
}