import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Update from "./Update"

function Settings() {
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setResponse(data));
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="content">
        <h3>VERSION</h3>
        <br />

        <p>You are currently using Eva version {response.version}</p>
        <br />
        <br />

        <h3>ASK EVA</h3>
        <br />
        <h4>LAST UPDATED</h4>
        <br />

        <p>
          This application uses a static database to look up the locations of
          files.
        </p>
        <br />
        <p>
          The database was last updated on: <strong>{response.modtime}</strong>
        </p>
        <br />
        <br />

        <Update folders={response.folders}/>      
      </div>
    </div>
  );
}

export default Settings;
