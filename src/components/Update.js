import React, { useState, useEffect } from "react";

function Update(props) {
  const [sendRequest, setSendRequest] = useState(false);
  const [folders, setFolders] = useState(props.folders);
  console.log(sendRequest)

  useEffect(() => {
    if (sendRequest === true) {
      console.log("Sending post request")

      const data = { folders: 'Hello world' };
      
      fetch("api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
        setSendRequest(false);
      }
  }, [sendRequest]);

  return (
    <>
      <h4>UPDATE NOW</h4>
      <br />
      <p>
        Please enter the paths of the folders you would like to be indexed. Each
        path should be on a new line.
      </p>
      <br />

      <form>
        <div className="IndexTheseFolders">
          <textarea
            className="folder-list"
            id="folders"
            defaultValue={folders}
            onChange={(event) => setFolders(event.target.value)}
          ></textarea>
        </div>
      </form>
      <button className="button" onClick={(event) => setSendRequest(true)}>
        UPDATE
      </button>
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Update;
