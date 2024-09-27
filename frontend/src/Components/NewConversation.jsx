import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NewConversation({handelScroll}) {
  const { friend, id } = useParams();
  let conversation = useSelector((state) => state.conversation.ArrayConversation) || [];
  
  // State to manage visibility for the last item
  const [loadingLastImage, setLoadingLastImage] = useState(true);
  const [lastItemTimestamp, setLastItemTimestamp] = useState(null);

  useEffect(() => {
    handelScroll()
    // Find the last item in the conversation
    const lastItem = conversation[conversation.length - 1];

    if (lastItem && lastItem.nameFile) {
      setLoadingLastImage(true); // Start loading state
      setLastItemTimestamp(lastItem.timestamp); // Track the timestamp of the last item

      // Delay showing the image for 1 second
      setTimeout(() => {
        setLoadingLastImage(false); // End loading state after 1 second
      }, 1000);
    }
  }, [conversation,handelScroll]);

  return (
    <>
      {conversation.map((item) => {
        const isLastItem = item.timestamp === lastItemTimestamp;

        if (item.senderId === friend) {
          return (
            <div key={item.timestamp}>
              {item.content && (
                <li className="w-fit bg-white py-1 px-2 mb-3 rounded-md">{item.content}</li>
              )}
              {item.nameFile && (
                <>
                  {/* Show the loading design for the last image */}
                  {isLastItem && loadingLastImage ? (
                    <div className="h-28 w-28 flex items-center justify-center bg-gray-200">
                      <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-t-transparent border-blue-500" />
                    </div>
                  ) : (
                    <img
                      className="h-28 my-1"
                      src={`http://localhost:5000/upload/${item.nameFile}`}
                      alt="Uploaded file"
                    />
                  )}
                </>
              )}
            </div>
          );
        } else {
          return (
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                alignContent: "end",
              }}
              key={item.timestamp}
              className="bg-transparent mb-3 gap-2"
            >
              {item.content && (
                <li className="w-fit bg-blue-800 py-1 px-2 rounded-md text-white">
                  {item.content}
                </li>
              )}
              {item.nameFile && (
                <>
                  {/* Show the loading design for the last image */}
                  {isLastItem && loadingLastImage ? (
                    <div className="h-28 w-28 flex items-center justify-center bg-gray-200">
                      <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-t-transparent border-blue-500" />
                    </div>
                  ) : (
                    <img
                      className="h-28 my-1"
                      src={`http://localhost:5000/upload/${item.nameFile}`}
                      alt="Uploaded file"
                    />
                  )}
                </>
              )}
            </ul>
          );
        }
      })}
    </>
  );
}
