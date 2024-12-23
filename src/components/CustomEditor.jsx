import React, { useEffect, useState } from "react";

const CustomEditor = ({ scheduler }) => {
  const { state, close, onConfirm, loading, edited } = scheduler;

  const [title, setTitle] = useState(edited?.title || "");
  const [start, setStart] = useState(edited?.start || new Date());
  const [end, setEnd] = useState(edited?.end || new Date());

  useEffect(() => {
    setTitle(edited?.title || "");
    setStart(edited?.start || new Date());
    setEnd(edited?.end || new Date());
  }, [edited]);

  const handleSave = () => {
    if (!title) return alert("Title is required");
    loading(true);

    setTimeout(() => {
      const newEvent = {
        event_id: edited?.event_id || Math.random(),
        title,
        start: new Date(start),
        end: new Date(end),
      };

      onConfirm(newEvent, edited ? "edit" : "create");
      loading(false);
      close();
    }, 500);
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
