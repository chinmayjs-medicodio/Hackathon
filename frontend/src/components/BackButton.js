import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ label = '← Back', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); // Go back to previous page in history
    }
  };

  return (
    <button className="back-button" onClick={handleClick}>
      {label}
    </button>
  );
};

export default BackButton;
