import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppHeader from "../AppComponent/AppHeader";
import { useAuth } from "../AuthProvider/AuthProvider";
import "../../assests/Style/custom.css";

function ProtectedRutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-blue-500 text-white shadow-md fixed top-0 left-0 right-0 h-12 z-20 flex items-center px-4">
            <AppHeader />
          </header>

          {/* Main Content */}
          <main className="flex-1 mt-12 bg-gray-50 overflow-y-auto p-4">
            {/* Adjust this div for centered or full-screen content */}
            <div className="w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

export default ProtectedRutes;
