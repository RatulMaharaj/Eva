import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Update from "./Update";

function Settings() {
  const [folders, setFolders] = useState("");
  const [version, setVersion] = useState("");
  const [modTime, setModTime] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [isUpdating, setIsUpdating] = useState("");

  const getRequest = () => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setFolders(data.folders);
        setVersion(data.version);
        setModTime(data.modtime);
        setUpdateTime(data.updatetime);
        setIsUpdating(data.isUpdating);
      });
  };

  useEffect(() => {
    getRequest();
  }, []);

  return (
    <div>
      <div style={{ padding: `2em 0` }}>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="content" style={{ marginTop: `0em` }}>
        <h4>About</h4>
        <br />
        <p>
          Eva is a search tool whose purpose is to assist it's users with
          finding files quickly and easily.
        </p>
        <br />
        <br />
        <h4>Version</h4>
        <br />

        <p>
          You are currently using Eva version{" "}
          <strong style={{ color: `var(--green)` }}>{version}</strong>
        </p>
        <br />
        <br />
        <h4>Last Update</h4>
        <br />

        <p>
          This application uses a static database to look up the locations of
          files.
        </p>
        <br />
        <p>
          The database was last updated on: <strong>{modTime}</strong> and took{" "}
          <strong>{updateTime}</strong> to update.
        </p>
        <br />
        <br />

        <Update
          folders={folders}
          setFolders={setFolders}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />

        <h4>Created By</h4>
        <br />
        <p>Ratul Maharaj & Simey de Klerk</p>
        <br />
        <p>20 February 2020</p>
        <br />
        <br />
      </div>
    </div>
  );
}

export default Settings;
