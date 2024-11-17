import React from "react";
import "../styles/StatusDot.scss";

const StatusDot = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "available":
        return "green";
      case "unavailable":
        return "red";
      case "waiting":
        return "yellow";
      default:
        return "gray";
    }
  };

  return <span className={`status-dot ${getStatusColor()}`}></span>;
};

export default StatusDot;
