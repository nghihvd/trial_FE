import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roleID, children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRoleID = Number(localStorage.getItem("roleID"));

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(roleID) ? roleID : [roleID];
  if (!allowedRoles.includes(userRoleID)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;