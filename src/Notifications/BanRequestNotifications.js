import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';
import moment from 'moment';
import Spinner from "../components/Spinner";

const BanRequestNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const apiBanRequestNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/notification/showBanRequest");
            console.log(response.data);
            if (response.data && response.data.data) {
                console.log(response.data.data);
                const notifications = response.data.data;
                const pendingCount = notifications.filter(noti => noti.button_status).length;
                setNewNotificationsCount(pendingCount);
                setNotifications(notifications);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response && error.response.status === 404) {
                setError(error.response.data.message || 'No notifications found');
            } else {
                setError('An error occurred. Please try again later.');
            }
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        apiBanRequestNotifications();
    }, [apiBanRequestNotifications]);

    const extractAccountID = (message) => {
        try {
            const accountWithName = message.split(" ")[1];
            const accountID = accountWithName.split("_")[0];
            return accountID;
        } catch (error) {
            console.error('Error extracting accountID:', error);
            return null;
        }
    };

    const handleStatusUpdate = async (notiID, status) => {
        setIsUpdating(true);
        try {
            if (!notiID) {
                toast.error('Invalid notification ID');
                return;
            }

            const notification = notifications.find(noti => noti.notiID === notiID);
            if (!notification) {
                toast.error('Notification not found');
                return;
            }

            const accountID = extractAccountID(notification.message);

            const response = await axios.put(
                `/notification/banAccountByReason/${accountID}`, 
                null,
                { params: { status } }
            );

            if (response.data.message) {
                toast.success(response.data.message);
                setNotifications(prev => {
                    const updatedNotifications = prev.filter(noti => noti.notiID !== notiID);
                    const newCount = updatedNotifications.filter(noti => noti.button_status).length;
                    setNewNotificationsCount(newCount);
                    return updatedNotifications;
                });
            }

        } catch (error) {
            console.error('Error updating notification status:', error);
            if (error.response?.status === 404) {
                toast.error("Account not found");
            } else {
                toast.error(error.response?.data?.message || 'Failed to update status');
            }
        } finally {
            setIsUpdating(false);
        }
    };

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


    if (isLoading || isUpdating) {
        return <Spinner />;
    }

    return (
        <div className="admin-notifications">
            <div className="notifications-content">
                <h2>Ban Request Notifications {newNotificationsCount > 0 && <span className="notification-count">({newNotificationsCount})</span>}</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li key={noti.notiID} className={`notification-item ${noti.button_status ? 'new' : ''}`}>
                                {(noti.message)}
                                <p className="notification-date">
                                    {formatRelativeTime(noti.createdAt)}
                                </p>
                                {noti.button_status && (
                                    <div className="notification-actions">
                                        <button onClick={() => handleStatusUpdate(noti.notiID, true)} disabled={isUpdating}>Accept</button>
                                        <button onClick={() => handleStatusUpdate(noti.notiID, false)} disabled={isUpdating}>Deny</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ban request notifications found</p>
                )}
            </div>            
        </div>
    );
};

export default BanRequestNotifications;
