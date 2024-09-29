import { Outlet, useNavigate, useParams } from "react-router-dom";
import Side from "../Components/Side";
import Search from "../Components/Search";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/http";
import Modal from "../Components/Ui/Modal";
import { useDispatch } from "react-redux";
import { callAction } from "../../store/call";
import socket from "../utils/socket";
import { faPhoneSlash, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SideBare() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const search = useRef();
    const navigate=useNavigate()
    const [searchValue, setSearchValue] = useState("");
    const [show, setShow] = useState(false);
    const [caller,setCller]=useState(null)
    const [infoCaller,setInfoCaller]=useState(null)
    const { data, isPending, isError } = useQuery({
        queryKey: ["fetchUser", id],
        queryFn: () => fetchUser(id),
    });
    useEffect(() => {
        socket.on(`call-${id}`, (newShow,caller) => {
            const infoCaller=data?.data[0]?.FriendUser.find(item=>item._id===caller);
            setInfoCaller(infoCaller)
            setShow(newShow);
            setCller(caller)
        });
        socket.emit("send-id",id)
        return () => {
            socket.off("hey"); // Corrected to remove the "hey" listener
          };
    }, [id,data]);
     
    function handleChange() {
        setSearchValue(search.current.value);
    }

    function onClose() {
        setShow(false)
        socket.emit("Close",caller)
        // dispatch(callAction.removeCall());
    }
    function handelCall(caller){
        
    socket.emit("send-id", id);  // Send the ID to the server
        navigate(`/video?id=${id}&friend=${caller}`);
    }
    if(isError || isPending){
        return <p>error</p>
    }
    return (
        <div className="flex absolute bg-red-600 w-full h-full">
            <main className="w-1/4 h-full bg-white">
                <Side  />
                {show && (
                    <Modal open={show} onClose={onClose}>
                        <div className=" flex flex-col gap-3 ">
                        <div className="flex flex-col w-full justify-center items-center ">
                            <img className=" w-28 h-28 rounded-full " src={"http://localhost:5000/upload/"+infoCaller.profileImage}></img>
                            <p className=" font-medium text-white   ">{infoCaller.name}</p>
                        </div>
                        <div className="flex gap-3 w-56 bg-transparent">
                            <button className="py-1 px-3 font-medium outline-none rounded-lg border w-1/2 bg-green-500 text-white" onClick={()=>handelCall(caller)}>
                            <FontAwesomeIcon icon={faPhoneVolume} />
                            </button>
                            <button className="py-1 px-3 font-medium outline-none rounded-lg border w-1/2 bg-red-600 text-white" onClick={onClose}>
                            <FontAwesomeIcon icon={faPhoneSlash} />
                            </button>
                        </div>
                        </div>
                    </Modal>
                )}
            </main>
            <main className="w-3/4 col-span-1 h-full bg-blue-200">
                <div className="h-10%">
                    <input
                        type="text"
                        ref={search}
                        className="w-full border h-3/4 outline-none pl-6"
                        placeholder=" Search About Friends"
                        onChange={handleChange}
                    />
                    <Search include={searchValue} />
                </div>
                <Outlet />
            </main>
        </div>
    );
}
