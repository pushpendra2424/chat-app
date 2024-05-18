import React from "react";
import "./typing.css";

const Notification = ({ count }) => {
  return <span class="badgeNotify">{count > 0 ? count : ""}</span>;
};

export default Notification;
