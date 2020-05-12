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
          Eva is a multi-purpose toolkit whose purpose is to assist it's users
          with their daily tasks.
        </p>
        <br />
        <br />

        <h3>CURRENT APPLICATIONS</h3>
        <br />
        <p> Below is a list of the current applications available on Eva: </p>
        <br />

        <ul className="applist">
          <li>Ask Eva - A shared drive search application.</li>
          <br />
          <li>
            Eva PDF - An application that can be used to merge and/or encrypt
            pdf files.
          </li>
          <br />
        </ul>

        <p>
          Eva is continuously being tweaked and improved. More features will be
          added in the future.
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
