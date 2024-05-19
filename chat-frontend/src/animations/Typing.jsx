import React from "react";
import "./typing.css";

const Typing = ({ user }) => {
  return (
    <div className="typing-container">
      <div className="typing-text">
        {user.name.charAt(0).toUpperCase() + user.name.slice(1)} is typing
      </div>
      <div className="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Typing;
