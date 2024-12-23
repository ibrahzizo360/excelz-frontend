import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
import CustomEditor from "../components/CustomEditor";
import { fetchMeetings } from "../services/meetings.service";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings()
      .then((data) => {
        const transformedData = transformMeetingData(data);
        setEvents(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const transformMeetingData = (data) => {
    return data.map((meeting, index) => {
      const startDate = new Date(`${meeting.date}T${meeting.time}`);
      const endDate = new Date(startDate.getTime() + meeting.duration * 60000);

      return {
        event_id: index + 1,
        title: meeting.title || "No Title",
        start: startDate,
        end: endDate,
        location: meeting.location,
        participants: meeting.participants,
      };
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
        customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
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
