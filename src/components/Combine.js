import React from "react";
import Sidebar from "./Sidebar";

function Combine() {
  return (
    <div>
      <Sidebar />
      <div className="content">
        <p>This tool can be used to merge and/or encrypt pdf files.</p>
        <br />
        <p>
          If multiple files are selected, they will be combined in alphanumeric
          order. Rename the files if they need to be combined in a particular
          order.
        </p>
        <br />
        <form action="/combine" method="POST" enctype="multipart/form-data">
          <label for="files">Select your file(s):</label>
          <br />
          <br />
          <input
            type="file"
            id="files"
            accept="application/pdf"
            name="files"
            multiple
          />
          <br /> <br />
          <div>
            <label for="password">
              A password can be used to encrypt the file. Leave blank otherwise.
            </label>
            <br />
            <br />
            <input
              type="password"
              id="pwd"
              name="password"
              placeholder="Enter your password"
            />
            <br />
          </div>
          <div class="button_container">
            <center>
              <input class="button" type="submit" value="COMBINE" />
            </center>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Combine;
