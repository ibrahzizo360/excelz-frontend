import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../constants/urls";

const Schedule = () => {
  const [freelancer, setFreelancer] = useState({
    id: "123",
    name: "John Doe",
    profilePicture: "https://via.placeholder.com/150",
    profession: "Web Developer",
    email: "john.doe@example.com",
  });

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [duration, setDuration] = useState("1 hour");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch available dates when the component mounts
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoadingDates(true);
      try {
        const response = await axios.get(
          `${API_URL}/users/${freelancer.id}/available-dates`
        );
        setAvailableDates(response.data.availableDates); // e.g., ["2024-12-25", "2024-12-26"]
      } catch (error) {
        console.error("Error fetching available dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchAvailableDates();
  }, [freelancer.id]);

  // Fetch available slots for the selected date
  useEffect(() => {
    if (!date) return;

    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await axios.get(
          `${API_URL}/users/${freelancer.id}/available-slots?date=${date}`
        );
        setAvailableSlots(response.data.availableTimeSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [date, freelancer.id]);

  const handleSchedule = async () => {
    if (!date || !time) {
      alert("Please select both date and time for the meeting!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/meetings`, {
        date,
        time,
        duration,
        notes,
        participants: [freelancer.id, "clientId"], // Replace 'clientId' with actual client ID
      });
      setSuccessMessage("Meeting scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("An error occurred while scheduling the meeting.");
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (dateString) => !availableDates.includes(dateString);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Schedule a Meeting</h2>

      {/* Freelancer Details */}
      <div className="flex items-center mb-6">
        <img
          src={freelancer.profilePicture}
          alt="Freelancer"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{freelancer.name}</h3>
          <p className="text-gray-500">{freelancer.profession}</p>
          <p className="text-gray-500">{freelancer.email}</p>
        </div>
      </div>

      {/* Meeting Scheduling Form */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="date">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={new Date().toISOString().split("T")[0]} // Disable past dates
          onKeyDown={(e) => e.preventDefault()} // Prevent manual input
          disabled={loadingDates} // Disable while loading dates
          style={{
            backgroundColor: loadingDates ? "#f3f3f3" : "",
            cursor: loadingDates ? "not-allowed" : "",
          }}
        />
        {loadingDates && (
          <p className="text-sm text-gray-500">Loading dates...</p>
        )}
      </div>

      {/* Available Time Slots */}
      {date && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">Available Time Slots</h3>
          {loadingSlots ? (
            <p>Loading available slots...</p>
          ) : availableSlots.length > 0 ? (
            <ul className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot, index) => (
                <li key={index}>
                  <button
                    onClick={() => setTime(slot)}
                    className={`px-4 py-2 rounded ${
                      time === slot ? "bg-blue-500 text-white" : "bg-gray-200"
                    } hover:bg-blue-300`}
                  >
                    {slot}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available time slots for this date.</p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="duration">
          Duration
        </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="30 minutes">30 minutes</option>
          <option value="1 hour">1 hour</option>
          <option value="1.5 hours">1.5 hours</option>
          <option value="2 hours">2 hours</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="notes">
          Meeting Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Add any additional notes for the meeting..."
        ></textarea>
      </div>

      {/* Schedule Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSchedule}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <p className="mt-4 text-green-600 font-semibold">{successMessage}</p>
      )}
    </div>
  );
};

export default Schedule;
