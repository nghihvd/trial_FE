import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteDialog = ({ open, onClose, onConfirm, itemName }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px'
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Box display="flex" alignItems="center" mb={2}>
          <WarningIcon color="warning" style={{ fontSize: 40, marginRight: '16px' }} />
          <Typography variant="h5" component="span" fontWeight="bold">
            Delete {itemName}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this {itemName}? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', mt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: '20px', 
            px: 3,
            borderColor: 'grey.400',
            color: 'grey.700',
            '&:hover': {
              borderColor: 'grey.600',
              backgroundColor: 'grey.100'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ 
            borderRadius: '20px', 
            px: 3,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          Delete {itemName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
