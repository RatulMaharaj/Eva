import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import Logo from "./Logo";
import SearchResult from "./SearchResult";

function Search() {
  const [currentOS, setCurrentOS] = useState("");
  const [response, setResponse] = useState({
    hits: 0,
    results: [],
    returned_hits: 0,
    searchcriteria: "",
  });

  // custom hook to handle input changes
  const [getResults, setGetResults] = useState(false);
  const [input, setInput] = useState({ q: "" });

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGetResults(true);
  };

  useEffect(() => {
    fetch(`/api/os`)
      .then((res) => res.json())
      .then((data) => setCurrentOS(data["os"]))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`/api/search?q=${input.q}`)
      .then((res) => res.json())
      .then((data) => setResponse(data))
      .catch((error) => console.log(error));
  }, [input, getResults]);

  return (
    <div>
      <div className="content_header">
        <div className="searchresults_heading">
          <Logo />
        </div>
        <div className="results_searchbar">
          <form id="search-form" onSubmit={handleSubmit}>
            <input
              id="search-box"
              autoFocus
              placeholder="Search for a file"
              name="q"
              type="searchx"
              defaultValue={response.searchcriteria}
              onChange={handleInputChange}
            />
          </form>
        </div>
        <div className="header_links">
          <Link to="settings">
            <i
              style={{ color: `var(--light-grey)` }}
              className="material-icons nav-item-icon"
            >
              settings
            </i>
          </Link>
        </div>
      </div>
      <div className="content">
        {response.results.map((result) => {
          return (
            <SearchResult
              key={result.path + result.name}
              currentOS={currentOS}
              name={result.name}
              path={result.path}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Search;
