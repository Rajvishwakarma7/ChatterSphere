import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { GetApi } from "../../Services/ApiServices";
import { getUserInfo } from "../../Pages/AuthProvider/AuthProvider";

function Chatroom({ chatRoomUserInfo }) {
  const senderInf = getUserInfo().loginInf;
  const socketConnection = useRef();
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  // create roomId using sender and receiver userId
  function createRoomId() {
    if (senderInf.userId && chatRoomUserInfo._id) {
      return [senderInf.userId, chatRoomUserInfo._id].sort().join("_");
    }
  }
  const getRoomId = createRoomId();

  useEffect(() => {
    if (!socketConnection.current) {
      GetApi(
        `community-chat/all-chat?roomId=${getRoomId ? getRoomId : ""}`,
        (err, res) => {
          if (err) {
            console.log(err);
          } else if (res.status === 200) {
            if (
              res?.data?.allmsg &&
              Array.isArray(res.data.allmsg) &&
              res.data.allmsg.length > 0
            ) {
              setChatMessages(res.data.allmsg);
            }
          } else {
            console.log(res);
          }
        }
      );

      socketConnection.current = io(process.env.REACT_APP_URL);

      socketConnection.current.on("connect", () => {
        console.log("user connected");
      });

      socketConnection.current.emit("roomId", getRoomId);

      socketConnection.current.on("message", (msg) => {
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      });

      socketConnection.current.on("disconnect", () => {
        console.log("user disconnected");
      });

      return () => {
        socketConnection.current.disconnect();
      };
    }
  }, []);

  const sendMessage = () => {
    const emit_msg = {
      roomId: getRoomId,
      userInfo: senderInf,
      message: message.trim(),
      receiverId: chatRoomUserInfo._id,
    };
    if (message.trim() !== "") {
      socketConnection.current.emit("message", emit_msg);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
        {chatMessages?.length > 0 ? (
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                senderInf.email === msg.email ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs shadow-md ${
                  senderInf.email === msg.email
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <div
                  className={`text-xs font-medium mb-1 ${
                    senderInf.email === msg.email
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {`${msg.firstName} ${msg.lastName}`}
                </div>
                <p>{msg.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Start a conversation with{" "}
            <span className="font-medium text-gray-700">
              {chatRoomUserInfo.firstName} {chatRoomUserInfo.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-3 bg-white flex items-center gap-2 border-t">
        <input
          className="flex-grow border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Send a message to ${chatRoomUserInfo.firstName} ${chatRoomUserInfo.lastName}`}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatroom;
