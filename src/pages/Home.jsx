import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
import CustomEditor from "../components/CustomEditor";
import { deleteMeeting, fetchMeetings } from "../services/meetings.service";
import { transformMeetingData } from "../utils/meeting";

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

  if (loading) {
    return <p>Loading...</p>;
  }

  const fields = [
    {
      name: "location",
      type: "input",
      config: {
        label: "Location",
        required: true,
        variant: "outlined",
      },
    },
    {
      name: "participants",
      type: "chip",
      config: {
        label: "Participants",
        required: true,
        variant: "outlined",
        helperText: "Enter participants' IDs or emails",
      },
    },
  ];

  const ViewerExtraComponent = ({ event }) => (
    <div className="text-sm">
      <p>Location: {event.location || "N/A"}</p>
      <p className="mt-1.5">Participants: Clinton Smith & Fred Johnson</p>
    </div>
  );

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await deleteMeeting(eventId);
      if (response && response.id) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.event_id !== response.id)
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("An error occurred while deleting the meeting. Please try again.");
    }
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
        onDelete={(id) => handleDeleteEvent(id)}
        events={events}
        fields={fields}
        stickyNavigation
        customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
        viewerExtraComponent={(fields, event) => (
          <ViewerExtraComponent event={event} fields={fields} />
        )}
      />
    </div>
  );
}
