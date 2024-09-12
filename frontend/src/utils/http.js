import { QueryClient } from "@tanstack/react-query";
import getToken from "./getAuth";
import axios from "axios"
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

export async function saveConversation({ info, id, friend, FileUpload }) {
    const token = getToken(); // Assuming this is a valid token
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  try {
    const formData = new FormData();
    const { senderId, content, status, timestamp } = info;

    // Append fields to FormData
    if(FileUpload){
        formData.append('fileUpload', FileUpload);
    }
    formData.append('content', content);
    formData.append('senderId', senderId);
    formData.append('status', status);
    formData.append('timestamp', timestamp);

    // Make the request with headers if needed (like Authorization)
    const response = await axios.post(
      `http://localhost:5000/api/user/${id}/${friend}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization":"Bearer "+token
        },
      }
    );

    // Return the response data
    return response.data; // Axios handles the JSON conversion
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error; // Rethrow the error after logging it
  }
}


export async function fetchConversation({id,friend}) {
    const token=getToken();
    const response= await fetch("http://localhost:5000/api/user/"+id+"/"+friend,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })
    const data= await response.json();
    console.log(data);
    return data
}

export async function UpdateProfile(data) {
    console.log(data);
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("email", data.email);
    if(data.profileImage!==""){
        formData.append("profile", data.profileImage);
    }
    try {
        const token = getToken();
        if (!token) {
            throw new Error("No token found");
        }

        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        // Note: For FormData, you don't need to specify Content-Type header, axios does it automatically.
        const response = await axios.post("http://localhost:5000/api/user/profile/"+data.id, formData,{
            'Content-Type': 'multipart/form-data',
        });
        return response;
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }
}
