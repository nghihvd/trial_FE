import React, { useCallback, useEffect, useState } from "react";
import axios from "../services/axios";
import moment from 'moment';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Notification = ({ roleID }) => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const apiNotifications = useCallback(async () => {
        try {
            let response;
            if (roleID === "1") {
                response = await axios.get("notification/otherAdminNoti");
            } else if (roleID === "2") {
                response = await axios.get("notification/showStaffNoti");
            } else if (roleID === "3") {
                response = await axios.get("notification/memberNoti");
            }
            
            if (response && response.data && response.data.data) {
                const notificationData = response.data.data;
                const processedNotifications = notificationData.map(noti => ({
                    ...noti,
                    isRead: localStorage.getItem(`noti_${noti.notiID}_read`) === 'true',
                    createdAt: noti.createdAt || noti.created_at || new Date().toISOString()
                }));
                
                processedNotifications.sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());
                
                setNotifications(processedNotifications);
                setUnreadCount(processedNotifications.filter(noti => !noti.isRead).length);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [roleID]);

    useEffect(() => {
        apiNotifications();
        const interval = setInterval(apiNotifications, 60000); // Cập nhật mỗi phút
        return () => clearInterval(interval);
    }, [apiNotifications]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        markAllAsRead();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(noti => {
            if (!noti.isRead) {
                localStorage.setItem(`noti_${noti.notiID}_read`, 'true');
                return { ...noti, isRead: true };
            }
            return noti;
        });
        setNotifications(updatedNotifications);
        setUnreadCount(0);
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = moment(dateString);
        if (!date.isValid()) {
            console.error('Invalid date:', dateString);
            return 'Invalid Date';
        }
        
        const now = moment();
        const diffHours = now.diff(date, 'hours');
        
        if (diffHours < 24) {
            return date.fromNow();
        } else {
            return date.format('MMMM D, YYYY HH:mm');
        }
    };

    const getRemainingTime = (createdAt) => {
        const twoWeeksLater = moment(createdAt).add(2, 'weeks');
        const now = moment();
        const duration = moment.duration(twoWeeksLater.diff(now));
        const days = Math.floor(duration.asDays());
        if (days > 0) {
            return `Expires in ${days} day${days > 1 ? 's' : ''}`;
        } else {
            return 'Expiring soon';
        }
    };

    return (
        <Box>
            <IconButton
                aria-describedby={id}
                onClick={handleClick}
                color="inherit"
                sx={{ 
                    padding: 0.5,
                    margin: 1,
                }}
            >
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            right: -3,
                            top: 3,
                            border: `2px solid #fff`,
                            padding: '0 4px',
                        },
                    }}
                >
                    {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 360, maxHeight: 'calc(100% - 100px)' }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Notifications</Typography>
                </Box>
                <Divider />
                <List sx={{ width: '100%', maxHeight: 400, overflow: 'auto' }}>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <React.Fragment key={index}>
                                <ListItem 
                                    alignItems="flex-start" 
                                    sx={{ 
                                        bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        py: 1
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                component="div"
                                                variant="body1"
                                                sx={{ 
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap'
                                                }}
                                            >
                                                {notification.message}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {formatRelativeTime(notification.createdAt)}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ ml: 1 }}
                                                >
                                                    {getRemainingTime(notification.createdAt)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No new notifications" />
                        </ListItem>
                    )}
                </List>
            </Popover>
        </Box>
    );
};

export default Notification;
