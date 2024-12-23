import React, { useEffect, useState } from "react";
import { createMeeting, updateMeeting } from "../services/meetings.service";
import { Alert } from "@mui/material";
import { transformMeetingData } from "../utils/meeting";

const CustomEditor = ({ scheduler }) => {
  const { state, close, onConfirm, loading, edited } = scheduler;

  const [title, setTitle] = useState(edited?.title || "");
  const [description, setDescription] = useState(edited?.subtitle || "");
  const [location, setLocation] = useState(edited?.location || "");
  const [start, setStart] = useState(edited?.start || new Date());
  const [end, setEnd] = useState(edited?.end || new Date());

  useEffect(() => {
    setTitle(edited?.title || "");
    setStart(edited?.start || state.start.value);
    setEnd(edited?.end || state.end.value);
  }, [edited]);

  const handleSave = async () => {
    if (!title) return alert("Title is required");
    if (!location) return alert("Location is required");

    loading(true);

    let newEvent;

    try {
      if (!edited) {
        const createdMeeting = await createMeeting({
          id: new Date().getTime().toString(),
          title,
          description,
          location,
          date: start.toISOString().slice(0, 10),
          time: start.toISOString().slice(11, 16),
          duration: (end - start) / 60000,
          participants: ["1", "2"],
        });

        newEvent = {
          ...transformMeetingData([createdMeeting])[0],
        };
      } else {
        await updateMeeting(edited.event_id, {
          title,
          description,
          location,
          date: start.toISOString().slice(0, 10),
          time: start.toISOString().slice(11, 16),
          duration: (end - start) / 60000,
          participants: ["1", "2"],
        });

        newEvent = {
          event_id: edited.event_id,
          title,
          subtitle: description || "No Description",
          start: new Date(start),
          end: new Date(end),
          location,
          participants: ["1", "2"],
        };
      }

      onConfirm(newEvent, edited ? "edit" : "create");
      close();
    } catch (error) {
      console.error("Error saving meeting:", error);
      alert("An error occurred while saving the meeting.");
    } finally {
      loading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-96">
      <h3 className="text-lg font-bold mb-4">
        {edited ? "Edit Event" : "Add Event"}
      </h3>
      <label className="block mb-2 text-sm font-medium">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-2 text-sm font-medium">Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-2 text-sm font-medium">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-2 text-sm font-medium">Start Date</label>
      <input
        type="datetime-local"
        value={start.toISOString().slice(0, 16)}
        onChange={(e) => setStart(new Date(e.target.value))}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-2 text-sm font-medium">End Date</label>
      <input
        type="datetime-local"
        value={end.toISOString().slice(0, 16)}
        onChange={(e) => setEnd(new Date(e.target.value))}
        className="w-full mb-4 p-2 border rounded"
      />

      <div className="flex justify-end gap-4">
        <button
          onClick={close}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomEditor;
