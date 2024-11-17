import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';

const ReasonModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  title = "Enter Reason",
  submitText = "Submit",
  cancelText = "Cancel",
  placeholder = "Enter your reason here..."
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }
    onSubmit(reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder={placeholder}
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReasonModal; 