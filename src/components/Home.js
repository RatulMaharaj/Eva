import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Notification from "./Notification"
import "./Home.css"

function Home() {
  return (
    <div>
      {/* <Notification message={"Update Successful"}/> */}
      <Sidebar />
      <div className="content">
        <div className="home_grid">
          <div className="home_intro">
            <center>
              <h2>Hi, I'm Eva!</h2>
              <br />
              <p> Choose one of the options below to get started!</p>
            </center>
          </div>
          <div className="home_apps">
            <Link to="search">
              <div>
                <center>
                  <h3>Ask Eva</h3>
                  <p>Search shared drives</p>
                </center>
              </div>
            </Link>
            <Link to="about">
              <div>
                <center>
                  <h3>About</h3>
                  <p>Learn more about Eva</p>
                </center>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
