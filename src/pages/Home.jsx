import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState([
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2024/12/21 09:30"),
      end: new Date("2024/12/21 10:30"),
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date("2021/5/4 10:00"),
      end: new Date("2021/5/4 11:00"),
    },
  ]);

  const customEditor = (scheduler) => {
    const { state, close, onConfirm, loading, edited } = scheduler;

    // Use `edited` for prefilled values when editing an event
    const [title, setTitle] = useState(edited?.title || "");
    const [start, setStart] = useState(edited?.start || new Date());
    const [end, setEnd] = useState(edited?.end || new Date());

    // Update states if `edited` changes
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
          event_id: edited?.event_id || Math.random(), // Use existing ID or generate a new one
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

  return (
    <div className="w-screen flex-1">
      <Scheduler
        view="week"
        week={{
          weekDays: [0, 1, 2, 3, 4, 5],
          weekStartOn: 6,
          startHour: 9,
          endHour: 17,
          step: 30,
          navigation: true,
          disableGoToDay: false,
        }}
        events={events}
        customEditor={customEditor}
        onEventChange={(updatedEvent, action) => {
          if (action === "delete") {
            setEvents(
              events.filter((e) => e.event_id !== updatedEvent.event_id)
            );
          } else if (action === "edit") {
            setEvents(
              events.map((e) =>
                e.event_id === updatedEvent.event_id ? updatedEvent : e
              )
            );
          } else if (action === "create") {
            setEvents([...events, updatedEvent]);
          }
        }}
      />
    </div>
  );
}
