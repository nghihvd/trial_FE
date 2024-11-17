import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../Animation - 1728475105129.json';
import '../styles/spinner.scss';

const Spinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="spinner-overlay">
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};

export default Spinner;