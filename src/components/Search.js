import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

function Search() {
  const [response, setResponse] = useState({
    hits: 0,
    results: [],
    returned_hits: 0,
    searchcriteria: "",
  });

  useEffect(() => {
    fetch("/api/search?q=omf")
      .then((res) => res.json())
      .then((data) => setResponse(data));
  }, []);

  const results = response.results;

  return (
    <div>
      <Sidebar />
      <div className="content_header">
        <div className="searchresults_heading">
          <h2>SEARCH RESULTS</h2>
        </div>
        <div className="results_searchbar">
          <form id="search-form" action="/api/search" method="get">
            <input
              id="search-box"
              autofocus
              placeholder="Search again"
              type="search"
              name="q"
              value="Placeholder"
            />
          </form>
        </div>
      </div>
      <div className="content">
        {results.map((result) => {
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
