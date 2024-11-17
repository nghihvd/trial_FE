import React from 'react';
import { Box, Button } from '@mui/material';
import moment from 'moment';

const AppointmentList = ({ 
  appointments, 
  onCancelAppointment,
}) => {
  const formatDateTime = (dateTimeString) => {
    return moment(dateTimeString).format("YYYY-MM-DD HH:mm:ss");
  };

  if (!appointments.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: 2,
        margin: '20px 0'
      }}
    >
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <div key={appointment.appointID} className="appointment-item">
            <p style={{ margin: 0, flex: 1 }}>
              <span className="appointment-highlight">
                You have an appointment on {formatDateTime(appointment.date_time)} to meet Staff {appointment.staffID} for adopt pet.
              </span>
            </p>
            <p>
              if you want to cancel, please click the button 
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => onCancelAppointment(appointment.appointID)}
              >
                Cancel
              </Button>
            </p>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default AppointmentList; 