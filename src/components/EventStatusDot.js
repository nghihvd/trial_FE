import React from 'react';

const EventStatusDot = ({ status }) => {
  let color;
  switch (status) {
    case 'Waiting':
      color = 'orange';
      break;
    case 'Ending':
      color = 'red';
      break;
    case 'Updating':
      color = 'blue';
      break;
    default:
      color = 'green';
  }

  return (
    <span
      style={{
        height: '10px',
        width: '10px',
        backgroundColor: color,
        borderRadius: '50%',
        display: 'inline-block',
        marginLeft: '5px',
      }}
    />
  );
};

export default EventStatusDot;
