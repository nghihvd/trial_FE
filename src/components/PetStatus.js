import React from "react";

const PetStatus = ({ status }) => {
  let statusStyle = {};

  switch (status.toLowerCase()) {
    case "available":
      statusStyle = { color: "green" }; // Màu xanh lá
      break;
    case "waiting":
      statusStyle = { color: "#f1ba3a" }; // Màu vàng
      break;
    case "unavailable":
      statusStyle = { color: "red" }; // Màu đỏ
      break;
    default:
      statusStyle = { color: "grey" }; // Mặc định
  }

  return <span style={statusStyle}>{status}</span>;
};

export default PetStatus;
