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

export default function SideBare() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const search = useRef();
    const navigate=useNavigate()
    const [searchValue, setSearchValue] = useState("");
    const [show, setShow] = useState(false);
    const [caller,setCller]=useState(null)
    useEffect(() => {
        socket.on(`call-${id}`, (newShow,caller) => {
            console.log(newShow);
            setShow(newShow);
            setCller(caller)
        });
        socket.emit("send-id",id)
        return () => {
            socket.off("hey"); // Corrected to remove the "hey" listener
          };
    }, [id]);

    const { data, isPending, isError } = useQuery({
        queryKey: ["fetchUser", id],
        queryFn: () => fetchUser(id),
    });

    function handleChange() {
        setSearchValue(search.current.value);
    }

    function onClose() {
        dispatch(callAction.removeCall());
    }
    function handelCall(caller){
        socket.emit("TellResiver","message")
        navigate(`/video?id=${id}&caller=${caller}`);
    }
    return (
        <div className="flex absolute bg-red-600 w-full h-full">
            <main className="w-1/4 h-full bg-white">
                <Side data={data} />
                {show && (
                    <Modal open={show} onClose={onClose}>
                        <div className="flex gap-3 w-56 bg-transparent">
                            <button className="py-1 px-3 font-medium outline-none rounded-lg border w-1/2 bg-green-500 text-white" onClick={()=>handelCall(caller)}>Call</button>
                            <button className="py-1 px-3 font-medium outline-none rounded-lg border w-1/2 bg-red-600 text-white">Remove</button>
                        </div>
                    </Modal>
                )}
            </main>
            <main className="w-3/4 col-span-1 h-full bg-blue-200">
                <div className="h-10%">
                    <input
                        type="text"
                        ref={search}
                        className="w-full border h-3/4 outline-none"
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
