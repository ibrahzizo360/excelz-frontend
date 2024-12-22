import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">Meeting Scheduler</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className="text-white hover:text-blue-300 transition duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/schedule"
              className="text-white hover:text-blue-300 transition duration-200"
            >
              Schedule Meeting
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
