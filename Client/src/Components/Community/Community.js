import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { GetApi } from "../../Services/ApiServices";
import { getUserInfo } from "../../Pages/AuthProvider/AuthProvider";

function Community() {
  const socketConnection = useRef();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const renderUI = useRef(1);
  let roomId = "12345_raj";
  let userInfo = getUserInfo();
  useEffect(() => {
    if (!socketConnection.current) {
      socketConnection.current = io(process.env.REACT_APP_URL);
      // Get old messages
      if (renderUI.current === 1) {
        GetApi(
          `community-chat/all-chat?roomId=${roomId ? roomId : ""}`,
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
                renderUI.current++;
              }
            } else {
              console.log(res);
            }
          }
        );

        // Socket connection
        socketConnection.current.emit("roomId", roomId);
        socketConnection.current.on("connect", () => {
          console.log("connected to server");
        });
        socketConnection.current.on("disconnect", () => {
          console.log("disconnected from server");
        });
        socketConnection.current.on("message", (msg) => {
          setChatMessages((prevMessages) => [...prevMessages, msg]);
        });
        return () => {
          console.log("socketConnection.current.disconnect");
          socketConnection.current.disconnect();
        };
      }
    }
  }, []);

  function sendMessage() {
    let emit_msg = {
      roomId: roomId,
      userInfo: userInfo.loginInf,
      message: message,
    };
    if (message !== "") {
      socketConnection.current.emit("message", emit_msg);
      setMessage("");
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
        {chatMessages.map((msg, index) => (
          <div
            className={`flex mb-2 ${
              userInfo.loginInf.email === msg.email
                ? "justify-end"
                : "justify-start"
            }`}
            key={index}
          >
            <div
              className={`max-w-xs p-2 rounded-md shadow-md ${
                userInfo.loginInf.email === msg.email
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <span className="font-semibold">{`${msg.firstName} ${msg.lastName}`}</span>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white flex items-center">
        <input
          className="flex-grow border rounded-l-md p-2 focus:outline-none"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
        />
        <button
          className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 transition duration-200"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Community;
