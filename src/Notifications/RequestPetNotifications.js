import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from "react-toastify";
import moment from "moment";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
const AddPetNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const apiAddPetNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/notification/showAdminAdoptNoti");
      if (response.data && Array.isArray(response.data)) {
        console.log(response.data);
        const notifications = response.data;
        const pendingCount = notifications.filter(noti => noti.button_status).length;
        setNewNotificationsCount(pendingCount);
        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data || "No notifications found");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    apiAddPetNotifications();
  }, [apiAddPetNotifications]);

  const HandleStatusUpdate = async (notiID, status) => {
    setIsUpdating(true);
    try {
      if (!notiID) {
        toast.error("Invalid notification ID");
        return;
      }
      // Fetch the notification to check the message
      const notification = notifications.find((noti) => noti.notiID === notiID);
      if (!notification) {
        toast.error("Notification not found");
        return;
      }
      // Check if the message contains "deleted"
      if (notification.message.includes("deleted")) {
        console.log(notification.message);
        // Call API to delete the notification
        const response = await axios.delete(
          `notification/deleteNotiByPetID/${notiID}/status?status=${status}`
        );
        if (response.status === 200) {
          setNotifications((prev) =>
            prev.filter((noti) => noti.notiID !== notiID)
          );
          const newCount = notifications.filter(noti => noti.button_status).length;
          setNewNotificationsCount(newCount);
          toast.success("Notification deleted successfully");
          apiAddPetNotifications();
        }
      } else {
        // Call API to update the status
        const response = await axios.put(
          `notification/${notiID}/status?status=${status}`
        );
        if (response.status === 200) {
          // Update notifications and count of new notifications
          setNotifications((prev) => {
            const updatedNotifications = prev.map((noti) =>
              noti.notiID === notiID
                ? { ...noti, button_status: false }
                : noti
            );
            const newCount = updatedNotifications.filter(
              (noti) => noti.button_status
            ).length;
            setNewNotificationsCount(newCount);
            return updatedNotifications;
          });

          toast.success(
            `Notification ${status ? "Accepted" : "Denied"} successfully`
          );
          apiAddPetNotifications();
        }
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update notification status";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Date not available";
    const date = moment(dateString);
    if (!date.isValid()) return "Invalid Date";

    const now = moment();
    const diffHours = now.diff(date, "hours");

    if (diffHours < 24) {
      return date.fromNow();
    } else {
      return date.format("MMMM D, YYYY HH:mm");
    }
  };

  const extractMessageBeforeID = (message) => {
    const parts = message.split('ID:');
    return parts[0].trim();
  };

  const extractName = (message) => {
    const match = message.match(/_(.*?)\s+can/);
    return match ? match[1] : null;
  };

  const extractPetID = (message) => {
    const match = message.match(/ID: (\w+)/);
    return match ? match[1] : null;
  };

  const getNotificationStyle = (message) => {
    if (message.toLowerCase().includes("deleted")) {
      return {
        backgroundColor: "#ffebee", // Màu đỏ nhạt
        borderLeft: "4px solid #d32f2f", // Màu đỏ đậm
        padding: "15px",
        marginBottom: "10px",
      };
    }
    return {
      backgroundColor: "#e3f2fd", // Màu xanh dương nhạt
      borderLeft: "4px solid #1976d2", // Màu xanh dương đậm
      padding: "15px",
      marginBottom: "10px",
    };
  };

  if (isLoading || isUpdating) {
    return <Spinner />;
  }

  return (
    <div className="admin-notifications">
      <div className="notifications-content">
        <h2>
          Request Pet Notifications
          {newNotificationsCount > 0 && (
            <span className="notification-count">
              ({newNotificationsCount})
            </span>
          )}
        </h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((noti) => (
              <li
                key={noti.notiID}
                className={`notification-item ${noti.button_status ? "new" : ""}`}
                style={getNotificationStyle(noti.message)}
              >
                <div className="notification-message">
                  {extractMessageBeforeID(noti.message)}
                </div>

                <Link to={`/petdetail/${extractPetID(noti.message)}`}
                style={{
                  color: '#534ee1',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                className="notification-message">
                  Pet Name: {extractName(noti.message)}
                </Link>

                <p className="notification-date">
                  {formatRelativeTime(noti.createdAt)}
                </p>
                {noti.button_status && (
                  <div className="notification-actions">
                    <button
                      onClick={() => HandleStatusUpdate(noti.notiID, true)}
                      disabled={isUpdating}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => HandleStatusUpdate(noti.notiID, false)}
                      disabled={isUpdating}
                    >
                      Deny
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No adopt notifications found</p>
        )}
      </div>
    </div>
  );
};

export default AddPetNotifications;
