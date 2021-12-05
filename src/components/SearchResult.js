import React, { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

function SearchResult(props) {
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  function handleCopyToClipboard(name, path) {
    var delimiter = "/";
    if (props.currentOS !== "macos") {
      delimiter = `\\`;
    }
    navigator.clipboard.writeText(path + delimiter + name);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCopyMessage(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [showCopyMessage]);

  return (
    <div className="search-content-section" key={props.path + props.name}>
      <div className="search_result">
        <div>
          <div className="search_name">{props.name}</div>
          <div className="search_path">{props.path}</div>
        </div>

        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            justifyContent: `flex-end`,
          }}
        >
          {props.name !== "Search for a file" ? (
            <IoCopyOutline
              onClick={() => {
                setShowCopyMessage(true);
                handleCopyToClipboard(props.name, props.path);
              }}
            />
          ) : null}
          <div
            style={{
              fontSize: `10px`,
              display: `flex`,
              flexDirection: `column`,
              justifyContent: `center`,
              marginLeft: `0.5em`,
            }}
          >
            {showCopyMessage ? `COPIED!` : ``}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
