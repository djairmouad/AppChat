import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchConversation } from "../utils/http";
import NewConversation from "../Components/NewConversation";
import Inputs from "../Components/Inputs";
import { useDispatch } from "react-redux";
import { conversationAction } from "../../store/conversation";

export default function Chat() {
  const { friend, id } = useParams();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(conversationAction.deleteArray());

    const fetchData = async () => {
      try {
        let response = await fetchConversation({ id, friend });
        let messages = response?.data?.messages || [];
        messages = messages.slice(-6); // Get last 10 messages
        setData(messages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchData();
  }, [id, friend, dispatch]);

  // Scroll whenever the data is updated (i.e., new messages arrive)
  useEffect(() => {
    handelScroll();
  }, [data]);

  function handelScroll() {
    console.log("hello World")
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  }

  return (
    <div className="flex flex-col justify-end h-90%  ">
      <ul className="h-full p-3 overflow-y-auto">
        {data.map((item) => {
          if (item.senderId === friend) {
            return (
              <div key={item.timestamp}>
                {item.content && (
                  <li className="w-fit bg-white py-1 px-2 mb-3 rounded-md">
                    {item.content}
                  </li>
                )}
                {item.nameFile && (
                  <img
                    className="h-28 my-1"
                    src={`http://localhost:5000/upload/${item.nameFile}`}
                    alt="file"
                  />
                )}
              </div>
            );
          } else {
            return (
              <ul
                key={item.timestamp}
                className="bg-transparent mb-3 gap-2"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  alignContent: "end",
                }}
              >
                {item.content && (
                  <li className="w-fit bg-blue-800 py-1 px-2 rounded-md text-white">
                    {item.content}
                  </li>
                )}
                {item.nameFile && (
                  <img
                    className="h-28 my-1"
                    src={`http://localhost:5000/upload/${item.nameFile}`}
                    alt="file"
                  />
                )}
              </ul>
            );
          }
        })}
        <div ref={messagesEndRef} /> {/* Ref placed here to scroll to the bottom */}
        <NewConversation key={data} handelScroll={handelScroll} />
      </ul>
      <Inputs />
    </div>
  );
}
