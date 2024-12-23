import axios from "axios";
import { API_URL } from "../constants/urls";

export const fetchMeetings = async () => {
  const response = await axios.get(`${API_URL}/meetings`);
  return response.data;
};

export const createMeeting = async (meetingData) => {
  const response = await axios.post(`${API_URL}/meetings`, meetingData);
  return response.data;
};

export const updateMeeting = async (meetingId, meetingData) => {
  const response = await axios.put(
    `${API_URL}/meetings/${meetingId}`,
    meetingData
  );
  return response.data;
};

export const deleteMeeting = async (meetingId) => {
  const response = await axios.delete(`${API_URL}/meetings/${meetingId}`);
  return response.data;
};
