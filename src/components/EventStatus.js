import React from "react";

const EventStatus = ({ status }) => {
  let statusStyle = {};

  switch (status.toLowerCase()) {
    case "published":
      statusStyle = { color: "green" }; // Màu xanh lá
      break;
    case "waiting":
      statusStyle = { color: "#f1ba3a" }; // Màu vàng
      break;
    case "updating":
      statusStyle = { color: "#f1ba3a" }; // Màu vàng
      break;
    case "ending":
      statusStyle = { color: "red" }; // Màu đỏ
      break;
    default:
      statusStyle = { color: "grey" }; // Mặc định
  }

  return <span style={statusStyle}>{status}</span>;
};

export default EventStatus;
