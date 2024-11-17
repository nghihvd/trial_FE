import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box, Typography, Grid, TextField } from "@mui/material";

const UserInfoModal = ({ open, onClose, userInfo }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        }).format(amount).replace('₫', 'VND');
    };

    // Kiểm tra xem userInfo có tồn tại và có phải là object không
    if (!userInfo || typeof userInfo !== 'object') {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Box sx={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '8px', 
                    padding: 2, 
                    mb: 3, 
                    backgroundColor: '#f9f9f9', 
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        User Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Account ID"
                                value={userInfo.accountID || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Full Name"
                                value={userInfo.name || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                value={userInfo.email || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                value={userInfo.phone || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Job"
                                value={userInfo.job || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Income"
                                value={formatCurrency(userInfo.income || 0)}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Citizen Serial"
                                value={userInfo.citizen_serial || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Experience Caring"
                                value={userInfo.experience_caring ? "Yes" : "No"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                value={userInfo.address || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Confirm Address"
                                value={userInfo.confirm_address || "N/A"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Married"
                                value={userInfo.married ? "Yes" : "No"}
                                fullWidth
                                InputProps={{ readOnly: true }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="contained" 
                    onClick={onClose} 
                    color="primary"
                    sx={{ marginRight: '15px' }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserInfoModal; 