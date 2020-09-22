import React from "react";
import Sidebar from "./Sidebar";

function About() {
  return (
    <div>
      <Sidebar />
      <div className="content">
        <h3>ABOUT</h3>
        <br />

        <p>
          Eva is a search tool whose purpose is to assist it's users
          with finding files quickly and easily.
        </p>
        <br />
        <br />

        <h3>CREATED BY</h3>
        <br />
        <p>Ratul Maharaj & Simey de Klerk</p>
        <br />
        <p>20 February 2020</p>
      </div>
    </div>
  );
}

export default About;
