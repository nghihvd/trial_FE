import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Spinner from "../components/Spinner"; // Import Spinner component

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "#ffffff",
  borderRadius: "15px",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: "auto",
  backgroundColor: "#f0f0f0",
  color: "#333333",
}));

const VerifyUser = () => {
  const { accountID } = useParams();
  const [userInfo, setUserInfo] = useState({
    accountID: "",
    name: "",
    sex: "",
    birthdate: "",
    phone: "",
    address: "",
    total_donation: 0,
    married: false,
    job: "",
    income: 0,
    citizen_serial: "",
    experience_caring: false,
    confirm_address: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`accounts/search/${accountID}`);
      const userData = response.data || {
        accountID: "",
        name: "",
        sex: "",
        birthdate: "",
        phone: "",
        address: "",
        total_donation: 0,
      };

      if (userData.birthdate) {
        userData.birthdate = new Date(userData.birthdate);
      }

      setUserInfo(userData);
    } catch (error) {
      toast.error("Failed to fetch user information");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("₫", "VND");
  };

  useEffect(() => {
    fetchUserInfo();
  }, [accountID]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ my: 5 }}>
      <StyledPaper elevation={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <ProfileAvatar src={getImageUrl(userInfo.avatarUrl)}>
            {!userInfo.avatarUrl &&
              (userInfo.name ? userInfo.name[0].toUpperCase() : "U")}
          </ProfileAvatar>
          <Typography
            component="h1"
            variant="h4"
            sx={{ mt: 2, fontWeight: "bold", color: "#333333" }}
          >
            {userInfo.name || "User Profile"}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={userInfo.name || "N/A"}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Sex"
                value={userInfo.sex || "N/A"}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Birthdate"
                value={
                  userInfo.birthdate
                    ? userInfo.birthdate.toLocaleDateString()
                    : "N/A"
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                value={userInfo.phone || "N/A"}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Total Donation"
                value={formatCurrency(userInfo.total_donation || 0)}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={userInfo.address || "N/A"}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: 2,
                mb: 3,
                backgroundColor: "#f9f9f9", // Màu nền nhẹ
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                paddingLeft: "16px",
                marginTop: "10px",
                marginBottom: "10px",
                marginLeft: "23px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Verify Information
                <p style={{ fontSize: "12px", color: "#888888" }}>
                  You can see the information, do not edit
                </p>
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Job"
                    value={userInfo.job || "N/A"}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Income"
                    value={formatCurrency(userInfo.income || 0)}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Citizen Serial"
                    value={userInfo.citizen_serial || "N/A"}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Experience Caring"
                    value={userInfo.experience_caring ? "Yes" : "No"}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Address"
                    value={userInfo.confirm_address || "N/A"}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default VerifyUser;
