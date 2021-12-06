import React from "react";

function Logo() {
  return (
    <h2
      style={{
        color: `var(--accent)`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <span className="logo">Eva</span>
      <span
        style={{
          fontFamily: "Century Gothic",
          fontWeight: "light",
          fontSize: `11px`,
          color: `var(--light-grey)`,
          margin: `0 0.65em`,
        }}
      >
        FROM
      </span>
      <span
        style={{
          fontFamily: "Century Gothic",
          fontWeight: "700",
          fontSize: `25px`,
          letterSpacing: `1.5px`,
          color: "#50B848",
        }}
      >
        O
      </span>
      <span
        style={{
          fontFamily: "Century Gothic",
          fontWeight: "700",
          fontSize: `25px`,
          letterSpacing: `1.5px`,
          color: "#F37024",
        }}
      >
        M
      </span>
      <span
        style={{
          fontFamily: "Century Gothic",
          fontWeight: "700",
          fontSize: `25px`,
          letterSpacing: `1.5px`,
          color: "#ED0E81",
        }}
      >
        A
      </span>
      <span
        style={{
          fontFamily: "Century Gothic",
          fontWeight: "700",
          fontSize: `25px`,
          letterSpacing: `1.5px`,
          color: "#099678",
        }}
      >
        R
      </span>
      <span
        style={{
          fontFamily: "Century Gothic",
          fontWeight: "700",
          fontSize: `25px`,
          letterSpacing: `1.5px`,
          color: "#0CC1E9",
        }}
      >
        T
      </span>
    </h2>
  );
}

export default Logo;
