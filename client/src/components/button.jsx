import React from 'react';

const Button = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick} // Handle click event
    >
      {label}
    </button>
  );
};

export default Button;
