import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

function Settings() {
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setResponse(data));
  }, []);

  console.log(response.folders)
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

        <h4>UPDATE NOW</h4>
        <br />
        <p>
          Please enter the paths of the folders you would like to be indexed.
          Each path should be on a new line.
        </p>
        <br />

        <form action="/api/settings" method="POST">
          <div class="IndexTheseFolders">
            <textarea class="folder-list" name="folders" placeholder={response.folders}></textarea>
          </div>
          <div class="button_container">
            <center>
              <input class="button" type="submit" value="UPDATE" />
            </center>
          </div>
        </form>

        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default Settings;
