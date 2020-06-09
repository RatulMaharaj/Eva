import React, { useState, useEffect } from "react";
import Spinner from "react-spinners/PulseLoader";


function Update(props) {
  const {folders, setFolders, isUpdating, setIsUpdating} = props
  const [postRequest, setPostRequest] = useState(false);

  function handleClick(){
    setPostRequest(true)
  }

  useEffect(() => {
    if (postRequest === true) {
      console.log("Sending post request")      
      const data = { 'folders': folders };

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
          setPostRequest(false)
          setIsUpdating('no')
        })
        .catch((error) => {
          console.error("Error:", error);
          setPostRequest(false)
          setIsUpdating('no')
        });
        
      }
  }, [postRequest, isUpdating]);

  return (
    <>
    <div style={{display:`flex`}}>
      <h4 style={{marginRight:`1em`}}>UPDATE NOW</h4>
        <Spinner
          size={8}
          margin={2}
          loading={postRequest || isUpdating === 'yes'}
        />
      </div>
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
            defaultValue={props.folders}
            onChange={(event) => setFolders(event.target.value)}
          >
          </textarea>
        </div>
      </form>
      <button className="button" onClick={(event) => handleClick()}>
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
