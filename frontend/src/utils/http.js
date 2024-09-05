import { QueryClient } from "@tanstack/react-query";
import getToken from "./getAuth";

export const queryClient=new QueryClient();
export async function login(eventData) {
    const response=await fetch("http://localhost:5000/api/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(eventData)
    });
    const data=await response.json();
    return data
}

export async function SearchUsers() {
    const token=getToken();
    const response=await fetch("http://localhost:5000/api/user/search",{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })
    const data=await response.json();
    console.log(data);
    return data.data
}

export async function CreateUser(eventData) {
const token=getToken();
 const response=await fetch("http://localhost:5000/api/user/create",{
    method:"POST",
    headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+token
    },
    body:JSON.stringify(eventData)
});
const data=await response.json();
return data
}

export async function fetchUser(id) {
 const token=getToken();
 const response=await fetch("http://localhost:5000/api/user/"+id,{
    method:"GET",
    headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+token
    }
 })
 const data=await response.json();
 return data
}

export async function addFriend({id,id_Friend}) {
    console.log(id_Friend);
    const token=getToken();
    const response=await fetch("http://localhost:5000/api/user/"+id,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        },
        body:JSON.stringify({id_Friend:id_Friend})
    })
    const data=response.json();
    console.log(data);
    return data
}