import axios from "axios";
import { API_URL } from "../constants/urls";

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const fetchAvailableTimeSlots = async (userId, date) => {
  const response = await axios.get(
    `${API_URL}/users/${userId}/available-slots?date=${date}`
  );
  return response.data;
};
