import React from "react";
import Button from "./Button"; // Adjust import path if necessary
import { useNavigate } from "react-router-dom";

const GettingStarted = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="bg-white h-screen w-screen overflow-x-hidden">
      <div className="absolute top-5 right-0">
        <Button label="Login" onClick={handleLoginClick} />
        <Button label="Sign Up" />
      </div>

      <div className="flow-root">
        <div className="float-left">
          <p>image</p>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
