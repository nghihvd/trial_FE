import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import "../styles/updateevent.scss";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const UpdateEvent = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    end_date: "",
    img_url: "",
    location: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [minDate, setMinDate] = useState("");
  const [canUpdate, setCanUpdate] = useState(true);
  const [errors, setErrors] = useState({});

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };

  useEffect(() => {
    if (!eventID) {
      toast.error("Invalid event ID");
      navigate("/events");
      return;
    }

    const fetchEventData = async () => {
      try {
        const response = await api.get(`/events/${eventID}/getEventById`, {
          params: { eventId: eventID },
        });
        if (response.data.status === 200) {
          setEventData(response.data.data);
          setImagePreview(getImageUrl(response.data.data.img_url));
          // Kiểm tra trạng thái sự kiện
          const status = response.data.data.status;
          console.log(status);
          if (status !== "Waiting" && status !== "Updating") {
            setCanUpdate(false);
          }
        } else {
          throw new Error(response.data.message || "Cannot load event data");
        }
      } catch (error) {
        console.error("Error loading event data:", error);
        toast.error(error.message || "Cannot load event data");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setMinDate(formattedDate);
  }, [eventID, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.event_name.trim())
      newErrors.event_name = "Event name is required";
    if (!eventData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (eventData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }
    if (!eventData.start_date) newErrors.start_date = "Start date is required";
    if (!eventData.end_date) newErrors.end_date = "End date is required";
    if (eventData.end_date < eventData.start_date)
      newErrors.end_date = "End date must be after start date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
        img_url: file, // Lưu file hình ảnh, không phải URL
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

    formData.append("event_name", eventData.event_name);
    formData.append("description", eventData.description);
    formData.append("start_date", eventData.start_date);
    formData.append("end_date", eventData.end_date);
    formData.append("status", eventData.status);

    // Chỉ gửi hình ảnh nếu người dùng đã chọn một hình ảnh mới
    if (eventData.img_url instanceof File) {
      formData.append("image", eventData.img_url);
    }

    try {
      const response = await api.post(
        `/events/${eventID}/updateEvents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from server:", response);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        navigate("/events");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container className="update-event-container">
      <h1 className="update-event__title">UPDATE EVENT</h1>
      {!canUpdate && (
        <Alert variant="warning">
          This event cannot be updated because the current status is Ended.
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={6} md={6} sm={12} className="text-center">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Event Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </Form.Group>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Event Preview"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            ) : eventData.img_url ? (
              <img
                src={getImageUrl(eventData.img_url)}
                alt="Current Event Image"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            ) : null}
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
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="update-button"
              disabled={!canUpdate}
            >
              Update Event
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UpdateEvent;
