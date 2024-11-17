import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import "../styles/events.scss";
import { toast } from "react-toastify";
import { Card, Button, CardGroup } from "react-bootstrap";
import Spinner from "../components/Spinner";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import DeleteDialog from "../components/DeleteDialog";
import EventStatusDot from "../components/EventStatusDot";
import moment from "moment";

const EventList = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const roleID = localStorage.getItem("roleID");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [roleID]);

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      let response;
      const token = localStorage.getItem("token");
      if (!token || roleID === "3") {
        response = await api.get("/events/showEvents");
      } else if (roleID === "1" || roleID === "2") {
        response = await api.get("/events/showEventAdmin");
      }
      if (response.data.status === 200) {
        const sortedEvents = response.data.data.sort((a, b) => {
          return new Date(b.start_date) - new Date(a.start_date);
        });
        setEvents(sortedEvents);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => {
    navigate("/events/add");
  };

  const handleUpdateEvent = (eventID) => {
    const event = events.find((e) => e.eventID === eventID);
    if (!event) {
      toast.error("Invalid eventID");
      return;
    }
    if (isEventPushlished(event)) {
      toast.error("Cannot update event that has been published.");
      return;
    }
    if (isEventEnded(event)) {
      toast.error("Cannot update event that has ended.");
      return;
    }

    navigate(`/events/update/${eventID}`);
  };

  const handleDeleteEvent = async (eventID) => {
    const event = events.find((e) => e.eventID === eventID);
    if (!event) {
      toast.error("Invalid eventID");
      return;
    }

    if (isEventEnded(event)) {
      toast.error("Cannot delete event that has ended.");
      return;
    }

    setEventToDelete(eventID);
    setOpenDeleteDialog(true);
  };

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };


  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    deleteEvent(eventToDelete);
  };

  const deleteEvent = async (eventID) => {
    try {
      const response = await api.delete(`/events/${eventID}/deleteEvents`);
      if (response.data.status === 200) {
        if (response.data.data) {
          toast.success("Event status changed to Ending");
        } else {
          toast.success("Event deleted successfully");
        }
        fetchEvents();
      } else {
        toast.error(response.data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      if (error.response && error.response.status === 409) {
        toast.error(
          "Cannot delete the event. It may be referenced by other data."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete event. Please try again."
        );
      }
    }
    handleCloseDeleteDialog();
  };

  const handleMenuAction = (action) => {
    if (action === "update") {
      handleUpdateEvent(selectedEventId);
    } else if (action === "delete") {
      handleDeleteEvent(selectedEventId);
    }
    handleMenuClose();
  };

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getEventStatus = (event) => {
    const now = moment();
    const endDate = moment(event.end_date);
    if (now.isAfter(endDate)) {
      return "Ending";
    }
    return event.status;
  };

  const getEventTimeInfo = (event) => {
    const now = moment();
    const startDate = moment(event.start_date);
    const endDate = moment(event.end_date);

    if(getEventStatus(event) === "Ending"){
      return null;
    }
    if (now.isBefore(startDate)) {
      const daysUntilStart = startDate.diff(now, "days");
      if (daysUntilStart === 0) {
        // Nếu còn dưới 1 ngày (chỉ còn giờ hoặc phút)
        return "Event starts soon";
      }
      // Nếu còn nhiều ngày
      return `Event starts in ${daysUntilStart} day${
        daysUntilStart > 1 ? "s" : ""
      }`;
    } else if (now.isBetween(startDate, endDate)) {
      return "Event is ongoing";
    }
    return null; // Sự kiện đã kết thúc, không hiển thị gì
  };

  const handleEventClick = (event) => {
    if (event.eventID) {
      navigate(`/events/${event.eventID}`);
    } else {
      console.error("Event ID is undefined");
    }
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên Card
  };

  const isEventPushlished = (event) => {
    if (event.status === "Published") {
      return true;
    }
  };

  const isEventEnded = (event) => {
    // Kiểm tra nếu status là "Ending"
    if (event.status === "Ending") {
      return true;
    }

    // Kiểm tra nếu đã qua end_date
    const now = moment();
    const endDate = moment(event.end_date);
    if (now.isAfter(endDate)) {
      return true;
    }

    return false;
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="event-list-container">
      <h1 className="mb-4">Events List</h1>
      {roleID === "2" && (
        <Button onClick={handleAddEvent} className="mb-4 event-button">
          Add New Event
        </Button>
      )}
      <CardGroup>
        {currentEvents.map((event) => (
          <Card
            key={event.eventID}
            className="mb-4"
            onClick={() => handleEventClick(event)}
          >
            {(roleID === "1" || roleID === "2") && (
              <div className="dropdown-wrapper" onClick={handleDropdownClick}>
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{
                      root: { variant: "outlined", color: "neutral" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
                      handleMenuOpen(e, event.eventID);
                    }}
                  >
                    <MoreVert />
                  </MenuButton>
                  <Menu>
                    {roleID === "2" &&
                      !isEventEnded(event) &&
                      !isEventPushlished(event) && (
                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuAction("update");
                          }}
                        >
                          Update
                        </MenuItem>
                      )}
                    {!isEventEnded(event) && (
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuAction("delete");
                        }}
                      >
                        Delete
                      </MenuItem>
                    )}
                   
                  </Menu>
                </Dropdown>
              </div>
            )}
            <Card.Img
              variant="top"
              src={getImageUrl(event.img_url)}
              alt={event.title}
            />
            <Card.Body>
              <Card.Title>
                {event.event_name}
                <EventStatusDot status={getEventStatus(event)} />
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {event.title}
              </Card.Subtitle>

              <div className="event-description"> {event.description}</div>
              {getEventTimeInfo(event) && (
                <Card.Text
                  className="event-time-info"
                  style={{
                    fontSize: "14px",
                    color: "green",
                    fontWeight: "bold",
                    marginTop: "10px",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  {getEventTimeInfo(event)}
                </Card.Text>
              )}
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                Start Date: {new Date(event.start_date).toLocaleDateString()}
              </small>
              <br />
              <small className="text-muted">
                End Date: {new Date(event.end_date).toLocaleDateString()}
              </small>
              <br />
              <small
                className={`text-${
                  getEventStatus(event) === "Ending" ? "danger" : "success"
                }`}
              >
                Status: {getEventStatus(event)}
              </small>
            </Card.Footer>
          </Card>
        ))}
      </CardGroup>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(events.length / eventsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName="Event"
      />
    </div>
  );
};

export default EventList;
