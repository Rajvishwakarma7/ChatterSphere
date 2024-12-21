import React, { useEffect, useState } from "react";
import { GetApi } from "../../Services/ApiServices";
import Chatroom from "./Chatroom";
import { FaRegHandPointRight } from "react-icons/fa";
import { getUserInfo } from "../../Pages/AuthProvider/AuthProvider";
import "./privateChat.css";

function PrivateChat() {
  const [allUsersAccount, setAllUsersAccount] = useState([]);
  const userId = getUserInfo().loginInf.userId;
  const [view, setView] = useState(0);
  const [chatRoomUserInfo, setChatRoomUserInfo] = useState(null);

  useEffect(() => {
    GetApi("/user/all-users", (err, res) => {
      if (err) {
        console.log(err);
      } else if (res.status === 200) {
        const filteredUsers = res.data.filter((user) => user._id !== userId);
        setAllUsersAccount(filteredUsers);
      } else {
        console.log(res);
      }
    });
  }, [userId]);

  const handleChatRoom = (user) => {
    setChatRoomUserInfo(user);
    setTimeout(() => {
      setView(1);
    }, 500);
  };

  return (
    <div className="privateChat-container flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="privateChat-header flex justify-between items-center bg-yellow-200 py-3 px-4 shadow-md">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-emerald-600 text-lg">
            Select a user to start chatting with
          </span>
          <FaRegHandPointRight className="text-red-500 w-8 h-8" />
        </div>
      </div>

      {/* Users List */}
      <div className="privateChat-userList flex overflow-x-auto p-4 bg-white shadow-md">
        {allUsersAccount.map((userInfo) => (
          <div
            key={userInfo._id}
            className={`privateChat-userCard flex flex-col items-center cursor-pointer mx-2 ${
              chatRoomUserInfo && chatRoomUserInfo.email === userInfo.email
                ? "active-user"
                : ""
            }`}
            onClick={() => {
              setView(0);
              handleChatRoom(userInfo);
            }}
          >
            {/* Avatar */}
            <div className="privateChat-avatar w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2">
              <span className="text-lg font-semibold text-gray-800">
                {userInfo?.firstName?.slice(0, 1).toUpperCase()}
              </span>
            </div>
            {/* Name */}
            <span className="privateChat-userName mt-2 text-gray-700 text-sm font-medium text-center">
              {userInfo?.firstName} {userInfo?.lastName}
            </span>
          </div>
        ))}
      </div>

      {/* Chatroom */}
      <div className="privateChat-chatroom flex-grow p-4">
        {view === 1 && chatRoomUserInfo && chatRoomUserInfo !== undefined && (
          <Chatroom chatRoomUserInfo={chatRoomUserInfo} />
        )}
      </div>
    </div>
  );
}

export default PrivateChat;
