import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { fetchAvailableTimeSlots, fetchUsers } from "../services/users.service";
import { createMeeting } from "../services/meetings.service";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";

const Schedule = () => {
  const [freelancer, setFreelancer] = useState({});
  const [client, setClient] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetchUsers();
        setFreelancer(response[0]);
        setClient(response[1]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    if (formData.date) {
      setLoadingSlots(true);
      fetchAvailableTimeSlots(freelancer.id, formData.date)
        .then((response) => {
          setAvailableSlots(response.availableTimeSlots || []);
        })
        .catch((error) => {
          console.error("Error fetching available slots:", error);
          setAvailableSlots([]);
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [formData.date, freelancer.id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTimeSelection = (slot) => {
    const [processedTime] = slot.split(" - ");
    setSelectedSlot(slot);
    setFormData((prev) => ({ ...prev, time: processedTime }));
  };

  const handleDurationSelection = (event) => {
    const duration = event.target.value;
    let durationInMinutes = 30;
    if (duration === "1 hour") {
      durationInMinutes = 60;
    } else if (duration === "1.5 hours") {
      durationInMinutes = 90;
    } else if (duration === "2 hours") {
      durationInMinutes = 120;
    }

    setFormData((prev) => ({ ...prev, duration: durationInMinutes }));
  };

  const handleSchedule = async () => {
    const { title, location, date, time } = formData;
    if (!title || !location || !date || !time) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    try {
      await createMeeting({
        ...formData,
        participants: [freelancer.id, client.id],
      });

      setSuccessMessage("Meeting scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("An error occurred while scheduling the meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: "auto", mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 4 },
          alignItems: { xs: "center", sm: "flex-start" },
          mb: 2,
        }}
      >
        <img
          src="/sample-avatar.png"
          alt="Freelancer"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            textAlign: { xs: "center", sm: "left" },
            mt: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
            }}
          >
            Schedule a Meeting With
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
            }}
          >
            {freelancer.name || "Freelancer"} Johnson
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 0.5,
              color: "textSecondary",
              fontSize: { xs: "1rem", sm: "1.3rem" },
            }}
          >
            Senior UI/UX Designer
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
        <RateReviewOutlinedIcon
          color="action"
          sx={{ width: 30, height: 30, mt: 1 }}
        />
        <TextField
          label="Title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
          size="small"
          required
          margin="normal"
        />
      </Box>
      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
        <LocationOnOutlinedIcon
          color="action"
          sx={{ width: 30, height: 30, mt: 1 }}
        />
        <TextField
          label="Location"
          id="location"
          value={formData.location}
          onChange={handleInputChange}
          fullWidth
          required
          size="small"
          margin="normal"
        />
      </Box>
      <Box sx={{ display: "flex", gap: 4 }}>
        <DescriptionOutlinedIcon
          color="action"
          sx={{ width: 30, height: 30, mt: 3 }}
        />
        <TextField
          label="Description"
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          size="small"
          rows={3}
          margin="normal"
        />
      </Box>
      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
        <TodayOutlinedIcon
          color="action"
          sx={{ width: 30, height: 30, mt: 1 }}
        />
        <TextField
          label="Select Date"
          id="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          size="small"
          margin="normal"
        />
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Available Time Slots
      </Typography>
      {!formData.date ? (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Select a date to retrieve the user's available time slots.
        </Typography>
      ) : loadingSlots ? (
        <CircularProgress />
      ) : availableSlots.length > 0 ? (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {availableSlots.map((slot, index) => (
            <Grid item key={index}>
              <Button
                variant={selectedSlot === slot ? "contained" : "outlined"}
                onClick={() => handleTimeSelection(slot)}
              >
                {slot}
              </Button>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          No time slots available for the selected date.
        </Typography>
      )}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Duration
      </Typography>
      <Select
        id="duration"
        value={
          formData.duration === 30
            ? "30 minutes"
            : formData.duration === 60
            ? "1 hour"
            : formData.duration === 90
            ? "1.5 hours"
            : "2 hours"
        }
        onChange={handleDurationSelection}
        fullWidth
        size="small"
      >
        {["30 minutes", "1 hour", "1.5 hours", "2 hours"].map(
          (option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          )
        )}
      </Select>

      <Button
        onClick={handleSchedule}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? "Scheduling..." : "Schedule Meeting"}
      </Button>
      {successMessage && (
        <Typography sx={{ mt: 2, color: "green", fontWeight: "bold" }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default Schedule;
