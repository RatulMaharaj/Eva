import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Search.css"

function Search() {
  const [response, setResponse] = useState({
    hits: 0,
    results: [],
    returned_hits: 0,
    searchcriteria: ""
  });

  // custom hook to handle input changes
  const [input, setInput] = useState({q:''})
  const handleInputChange = (e) => setInput({
    ...input,
    [e.currentTarget.name]: e.currentTarget.value
  })


  useEffect(() => {
    fetch(`/api/search?q=${input.q}`)
      .then((res) => res.json())
      .then((data) => setResponse(data));
  }, [input]);
  
  // need to add a debouncer to input in the useEffect Hook

  return (
    <div>
      <Sidebar />
      <div className="content_header">
        <div className="searchresults_heading">
          <h2>SEARCH RESULTS</h2>
        </div>
        <div className="results_searchbar">
          <form id="search-form" action="/search">
            <input
              id="search-box"
              autoFocus
              placeholder="Search for a file"
              type="search"
              name="q"
              defaultValue={response.searchcriteria}
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
      <div className="content">
        {response.results.map((result) => {
          return (
            <div class="search-content-section">
              <div class="search_result">
                <div class="search_name">{result.name}</div>
                <div class="search_path">
                  <a href="{{result.path}}" id="filepath">
                    {result.path}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Search;
