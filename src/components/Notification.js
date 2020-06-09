import React, { useState } from "react";
import "./Notification.css";

export default function Notification(props) {
  const [hide, setHide] = useState("")

  return (
    <div id="popup" className={`popup ${hide}`}>
      <p>{props.message}</p>
      <p className="close" onClick={(event) => setHide("hide")}>x</p>
    </div>
  );
}
