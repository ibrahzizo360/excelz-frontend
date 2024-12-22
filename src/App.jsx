import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
// import EditMeeting from "./pages/EditMeeting";
// import MeetingDetails from "./pages/MeetingDetails";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            {/* <Route path="/edit/:id" element={<EditMeeting />} />
            <Route path="/details/:id" element={<MeetingDetails />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
