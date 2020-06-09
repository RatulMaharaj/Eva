import React, { useState, useEffect } from "react";
import Loader from "react-spinners/PulseLoader";

function Update(props) {
  const [folders, setFolders] = useState(props.folders);
  const [isUpdating, setIsUpdating] = useState(localStorage.getItem('isUpdating')==='yes');
  
  console.log(folders)

  function handleClick(){
    localStorage.setItem('isUpdating', 'yes')
    setIsUpdating(true)
  }

  useEffect(() => {
    if (localStorage.getItem('isUpdating') === 'yes') {
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
          setIsUpdating(false)
          localStorage.setItem("isUpdating", 'no')
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsUpdating(false)
          localStorage.setItem("isUpdating", 'no')
        });
        
      }
  }, [isUpdating]);

  return (
    <>
    <div style={{display:`flex`}}>
      <h4 style={{marginRight:`1em`}}>UPDATE NOW</h4>
        <Loader
          size={8}
          margin={2}
          loading={isUpdating}
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
          >{props.folders}</textarea>
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
