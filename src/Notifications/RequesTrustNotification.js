import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';
import moment from 'moment';
import Spinner from "../components/Spinner";

const RequesTrustNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);


    const apiRequestTrustNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/notification/showTrustRequest");
            console.log(response.data);
            if (response.data && response.data.data) {
                const notifications = response.data.data;
                const pendingCount = notifications.filter(noti => noti.button_status).length;
                setNewNotificationsCount(pendingCount);
                setNotifications(notifications);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        apiRequestTrustNotifications();
    }, [apiRequestTrustNotifications]);

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = moment(dateString);
        if (!date.isValid()) return 'Invalid Date';
        
        const now = moment();
        const diffHours = now.diff(date, 'hours');
        
        if (diffHours < 24) {
          return date.fromNow();
        } else {
          return date.format('MMMM D, YYYY HH:mm');
        }
      };
    
      const handleAccept = async (notiID) => {
        setIsUpdating(true);
        try {
          const response = await axios.put(`appointment/trust/${notiID}`);
          if (response.status === 200 && response.data.message) {
            toast.success(response.data.message);
            apiRequestTrustNotifications();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to accept trust request");
        } finally {
          setIsUpdating(false);
        }
      };
    
      const handleDeny = async (notiID) => {
        setIsUpdating(true);
        try {
          const response = await axios.delete(`/notification/refuseTrustRequest/${notiID}`);
          if (response.status === 200 && response.data.message) {
            toast.success(response.data.message);
            
            setNotifications(prev => {
              const updatedNotifications = prev.filter(noti => noti.notiID !== notiID);
              const newCount = updatedNotifications.filter(noti => noti.button_status).length;
              setNewNotificationsCount(newCount);
              return updatedNotifications;
            });
            
          }
        } catch (error) {
          if (error.response?.status === 404) {
            toast.error("Request not found");
          } else if (error.response?.status === 400) {
            toast.error("Invalid request");
          } else {
            toast.error(error.response?.data?.message || "Failed to refuse trust request");
          }
        } finally {
          setIsUpdating(false);
        }
      };
    
      if (isLoading || isUpdating) {
        return <Spinner />;
    }

    
    return (
        <div className="admin-notifications">
      <div className="notifications-content">
        <h2>
          Request Trust Notifications{" "}
          {newNotificationsCount > 0 && (
            <span className="notification-count">
              ({newNotificationsCount})
            </span>
          )}
        </h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((noti) => (
              <li
                key={noti.notiID}
                className={`notification-item ${noti.button_status ? "new" : ""}`}
              >
                <div className="notification-message">{noti.message}</div>
                <p className="notification-date">
                  {formatRelativeTime(noti.createdAt)}
                </p>
                {noti.button_status && (
                  <div className="notification-actions">
                    <button onClick={() => handleAccept(noti.notiID)}>
                      Accept
                    </button>
                    <button onClick={() => handleDeny(noti.notiID)}>
                      Deny
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No register request notifications found</p>
        )}
      </div>
    </div>
    );
};

export default RequesTrustNotification;