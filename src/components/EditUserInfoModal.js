import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, TextField, Select, MenuItem } from "@mui/material";

const EditUserInfoModal = ({ open, onClose, userInfo, onUpdate, onAccept }) => {
  const [formData, setFormData] = useState({
    accountID: '',
    name: '',
    job: '',
    income: '',
    citizen_serial: '',
    experience_caring: 'No',
    confirm_address: '',
    married: 'No'
  });

  const [errors, setErrors] = useState({
    job: '',
    income: '',
    citizen_serial: '',
    confirm_address: ''
  });

  const [initialData, setInitialData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    if (userInfo) {
      const initialFormData = {
        accountID: userInfo.accountID || '',
        name: userInfo.name || '',
        job: userInfo.job || '',
        income: userInfo.income || '',
        citizen_serial: userInfo.citizen_serial || '',
        experience_caring: userInfo.experience_caring === true ? "Yes" : "No",
        confirm_address: userInfo.confirm_address || '',
        married: userInfo.married === true ? "Yes" : "No"
      };
      setFormData(initialFormData);
      setInitialData(initialFormData);
      setIsFormChanged(false);
      setErrors({
        job: '',
        income: '',
        citizen_serial: '',
        confirm_address: ''
      });
    }
  }, [userInfo]);

  const validateForm = () => {
    let tempErrors = {
      job: '',
      income: '',
      citizen_serial: '',
      confirm_address: ''
    };
    let isValid = true;

    if (!formData.job.trim()) {
      tempErrors.job = 'Job is required';
      isValid = false;
    } else if (formData.job.length < 2) {
      tempErrors.job = 'Job must be at least 2 characters';
      isValid = false;
    }

    if (!formData.income) {
      tempErrors.income = 'Income is required';
      isValid = false;
    } else if (isNaN(formData.income) || Number(formData.income) < 0) {
      tempErrors.income = 'Income must be a positive number';
      isValid = false;
    }

    if (!formData.citizen_serial.trim()) {
      tempErrors.citizen_serial = 'Citizen serial is required';
      isValid = false;
    } else if (!/^\d{9,12}$/.test(formData.citizen_serial)) {
      tempErrors.citizen_serial = 'Citizen serial must be 9-12 digits';
      isValid = false;
    }

    if (!formData.confirm_address.trim()) {
      tempErrors.confirm_address = 'Address is required';
      isValid = false;
    } else if (formData.confirm_address.length < 10) {
      tempErrors.confirm_address = 'Address must be at least 10 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      
      const hasChanged = Object.keys(newFormData).some(key => 
        newFormData[key] !== initialData[key]
      );
      
      setIsFormChanged(hasChanged);

      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));

      return newFormData;
    });
  };

  const handleVerify = () => {
    if (!validateForm()) {
      return;
    }
    
    const experience_caring = formData.experience_caring === "Yes";
    const married = formData.married === "Yes";
    
    const params = {
      married,
      job: formData.job || '',
      income: formData.income || 0,
      citizen_serial: formData.citizen_serial || '',
      experience_caring,
      confirm_address: formData.confirm_address || ''
    };

    console.log("Params sent to API:", params);
    
    onUpdate({
      accountID: formData.accountID,
      params
    });
  };

  const handleAcceptClick = () => {
    console.log("Current userInfo:", userInfo);
    console.log("AppointID being sent:", userInfo.appointID);
    if (!userInfo.appointID || !userInfo.accountID) {
      console.error("Missing appointID or accountID");
      return;
    }
    onAccept(userInfo.appointID, userInfo.accountID);
  };

  useEffect(() => {
    console.log("userInfo changed:", userInfo);
  }, [userInfo]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit User Information</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: 2, 
          mb: 3, 
          backgroundColor: '#f9f9f9', 
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Account ID"
                value={formData.accountID}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Full Name"
                value={formData.name}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Job"
                name="job"
                value={formData.job}
                onChange={handleChange}
                fullWidth
                error={!!errors.job}
                helperText={errors.job}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Income"
                name="income"
                type="number"
                value={formData.income}
                onChange={handleChange}
                fullWidth
                error={!!errors.income}
                helperText={errors.income}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Citizen Serial"
                name="citizen_serial"
                value={formData.citizen_serial}
                onChange={handleChange}
                fullWidth
                error={!!errors.citizen_serial}
                helperText={errors.citizen_serial}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Experience Caring"
                name="experience_caring"
                value={formData.experience_caring}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Address"
                name="confirm_address"
                value={formData.confirm_address}
                onChange={handleChange}
                fullWidth
                error={!!errors.confirm_address}
                helperText={errors.confirm_address}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Married"
                name="married"
                value={formData.married}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        {isFormChanged && (
          <Button 
            onClick={handleVerify} 
            color="primary"
            variant="contained"
            sx={{ mr: 1 }}
          >
            Verify
          </Button>
        )}
        <Button 
          onClick={handleAcceptClick} 
          color="success" 
          variant="contained"
          disabled={!userInfo.appointID}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserInfoModal; 