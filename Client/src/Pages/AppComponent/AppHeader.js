import React, { useState } from "react";
import { getUserInfo, useAuth } from "../AuthProvider/AuthProvider";
import { toCamelCase } from "../../Utils/HelperFunction";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import "../../assests/Style/custom.css";
import logo from "../../assests/logo.webp";

function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInfo = getUserInfo();
  const navigate = useNavigate();
  const { logout } = useAuth();
  let loginInfo = userInfo?.loginInf;

  return (
    <div className="w-full flex justify-between items-center p-4 bg-blue-500 sm:bg-transparent">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="SocialApp Logo"
          className="w-12 h-12 object-cover"
        />
        {/* <span className="text-white text-lg font-semibold hidden sm:block">
          SocialApp
        </span> */}
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-white"
        >
          {isMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:flex items-center space-x-6 justify-between sm:justify-end absolute sm:static bg-blue-500 sm:bg-transparent w-full sm:w-auto top-16 left-0 sm:flex-row flex-col sm:space-x-6 sm:p-0 p-4`}
      >
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
            }`
          }
        >
          <AiOutlineHome className="inline-block mr-1" />
          Home
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
            }`
          }
        >
          <FaUserFriends className="inline-block mr-1" />
          Group Chat
        </NavLink>
        <NavLink
          to="/private-chat"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
            }`
          }
        >
          <AiOutlineMessage className="inline-block mr-1" />
          Private Chat
        </NavLink>
      </nav>

      {/* Profile & Logout */}
      <div className="hidden sm:flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-white font-semibold">
            {toCamelCase(loginInfo?.firstName)}{" "}
            {toCamelCase(loginInfo?.lastName)}
          </p>
          <p className="text-xs text-white">{loginInfo?.email || ""}</p>
        </div>
        <button
          onClick={() => {
            logout(() => {
              localStorage.removeItem("userInfo");
              navigate("/login");
            });
          }}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AppHeader;
