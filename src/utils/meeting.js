export const transformMeetingData = (data) => {
  return data.map((meeting, index) => {
    const startDate = new Date(`${meeting.date}T${meeting.time}`);
    const endDate = new Date(startDate.getTime() + meeting.duration * 60000);

    return {
      event_id: meeting.id || index,
      title: meeting.title || "No Title",
      subtitle: meeting.description || "No Description",
      start: startDate,
      end: endDate,
      location: meeting.location,
      participants: meeting.participants,
    };
  });
};
