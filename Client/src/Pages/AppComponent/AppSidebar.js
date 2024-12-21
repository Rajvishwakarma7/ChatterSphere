import React from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";

function AppSidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col p-4">
      {/* Logo or Title */}
      <div className="text-2xl font-bold mb-6 flex justify-between items-center">
        <span>Dashboard</span>
        <button className="lg:hidden text-xl font-bold" onClick={closeSidebar}>
          ✕
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg mb-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-600"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg mb-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-600"
            }`
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/category"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg mb-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-600"
            }`
          }
        >
          Category
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg mb-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-600"
            }`
          }
        >
          Group Chat
        </NavLink>
        <NavLink
          to="/private-chat"
          className={({ isActive }) =>
            `block py-2 px-4 rounded-lg mb-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-600"
            }`
          }
        >
          Private Chat
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div
        className="text-1xl font-bold mb-4 flex justify-start items-center cursor-pointer gap-3 bg-red-800 px-2 py-1 rounded-md"
        onClick={() => {
          logout(() => {
            localStorage.removeItem("userInfo");
            navigate("/login");
          });
        }}
      >
        <span>
          <IoLogOutOutline />
        </span>
        <span>Logout</span>
      </div>
    </div>
  );
}

export default AppSidebar;
