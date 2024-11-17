import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import "../styles/addevent.scss";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { format } from "date-fns";

const AddEvent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    end_date: "",
    img_url: null,
    location: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [minDate, setMinDate] = useState("");
  const [errors, setErrors] = useState({});
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setMinDate(formattedDate);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.event_name.trim()) {
      newErrors.event_name = "Event name is required";
    }
    if (!eventData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (eventData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }
    if (!eventData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!eventData.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (eventData.start_date && eventData.end_date) {
      const start = new Date(eventData.start_date);
      const end = new Date(eventData.end_date);
      if (end <= start) {
        newErrors.end_date = "End date must be after start date";
      }
    }

    if (!eventData.img_url) {
      newErrors.img_url = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Nếu ngày kết thúc được chọn trước ngày bắt đầu, cập nhật ngày kết thúc
    if (
      name === "start_date" &&
      eventData.end_date &&
      value > eventData.end_date
    ) {
      setEventData((prev) => ({
        ...prev,
        end_date: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData((prev) => ({
        ...prev,
        img_url: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    const formData = new FormData();

    // Thêm các trường dữ liệu vào formData
    formData.append("event_name", eventData.event_name);
    formData.append("description", eventData.description);
    formData.append("start_date", eventData.start_date);
    formData.append("end_date", eventData.end_date);
    formData.append("status", eventData.status);

    // Chỉ thêm hình ảnh nếu có
    if (eventData.img_url) {
      formData.append("image", eventData.img_url);
    }

    try {
      const response = await api.post("/events/addEvents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        toast.success("Event added successfully!");
        navigate("/events");
      } else {
        throw new Error(response.data.message || "Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error(error.message || "Failed to add event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container className="events-container">
      <h1 className="add-event__title">CREATE EVENT</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={6} md={6} sm={12} className="text-center">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Event Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                isInvalid={!!errors.img_url}
              />
              <Form.Control.Feedback type="invalid">
                {errors.img_url}
              </Form.Control.Feedback>
            </Form.Group>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event Preview"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            )}
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Form.Group className="mb-3" controlId="formEventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                name="event_name"
                value={eventData.event_name}
                onChange={handleChange}
                isInvalid={!!errors.event_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.event_name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={eventData.start_date}
                onChange={handleChange}
                min={minDate}
                isInvalid={!!errors.start_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.start_date}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={eventData.end_date}
                onChange={handleChange}
                min={eventData.start_date || minDate}
                isInvalid={!!errors.end_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.end_date}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="create-button">
              Create Event
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddEvent;
