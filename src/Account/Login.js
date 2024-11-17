import "@fortawesome/fontawesome-free/css/all.min.css";
import { jwtDecode } from "jwt-decode"; // Sử dụng named import
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import api from "../services/axios";
import "../styles/login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("accounts/login", {
        accountID: username,
        password,
      });
      if (response && response.data && response.data.jwt) {
        localStorage.setItem("token", response.data.jwt);
        const decodedToken = jwtDecode(response.data.jwt);
        const role = decodedToken.roles[0];
        localStorage.setItem("roleID", Number(role));
        localStorage.setItem("username", username);
        localStorage.setItem("accountID", decodedToken.sub);
        localStorage.setItem("isLoggedIn", true);
        toast.success("Login successfully!");

        if (role === "1") {
          navigate("/dashboard", { replace: true });
        } else if (role === "2") {
          navigate("/appointment", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="login-container col-12 col-sm-4">
      <form onSubmit={handleLogin}>
        <div className="title">Login</div>
        <div className="input-username">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="input-password">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <i
            className={
              isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
        </div>

        <button
          className={`button ${username && password ? "active" : ""}`}
          disabled={!username || !password}
        >
          Login
        </button>

        <div className="action-links">
          <div className="back" onClick={handleGoBack}>
            <i className="fa-solid fa-angles-left"></i>
            <span>Go back</span>
          </div>
          <div className="register">
            <p> Don't have an account?</p>
            <NavLink to="/register" className="register-link">
              Register
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
