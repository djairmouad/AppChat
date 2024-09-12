import { useMutation, useQuery } from "@tanstack/react-query";
import image from "../assets/profile.jpg";
import { fetchUser, UpdateProfile } from "../utils/http";
import { useRef } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams(); // Move this above the useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchUser", id], // Include id as part of the queryKey
    queryFn: () => fetchUser(id),
  });

  const name = useRef();
  const email = useRef();
  const file = useRef();
  const { mutate, isPending, isError: mutationError } = useMutation({
    mutationFn: UpdateProfile,
  });

  const profile = data?.data[0] || "";

  function handleUpdate() {
    const profileImage = file.current.files[0];
    let data={id:id,name:name.current.value,email:email.current.value}
    console.log(profileImage!==undefined)
    if (profileImage) {
      data={...data,profileImage}
    }
  
    mutate(data, {
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    });
  }
  
console.log(profile.profileImage);
  return (
    <ul className="w-1/2 flex flex-col gap-5 pl-5">
      <li className="relative">
        {profile.profileImage==="" || profile.profileImage===undefined?<img src={image} className="w-32 rounded-full" alt="Profile" />:
            <img src={"http://localhost:5000/upload/"+profile.profileImage} className="w-32 rounded-full border-4 border-white  " alt="Profile" />
        }
        <input ref={file} type="file" 
        className=" absolute w-32 h-32  rounded-full top-0 opacity-0 "
         />
      </li>
      <li>
        <p className="font-semibold">Name</p>
        <input
          ref={name}
          type="text"
          className=" w-3/4  rounded font-normal outline-none pl-1"
          defaultValue={profile.name}
        />
      </li>
      <li>
        <p className="font-semibold">Email</p>
        <input
          ref={email}
          type="text"
          className=" w-3/4  rounded font-normal outline-none pl-1"
          defaultValue={profile.email}
        />
      </li>
      <li className=" w-3/4  flex justify-start ">
      <button onClick={handleUpdate} className=" w-fit px-3 py-1 rounded-lg font-semibold  bg-white">Update</button>
      </li>
    </ul>
  );
}
