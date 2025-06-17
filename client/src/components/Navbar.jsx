import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("codeplayground-user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={`flex justify-between items-center px-6 py-4 shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">CodePlayground</h1>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className={`px-4 py-2 rounded border transition ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
              : "bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
          }`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
