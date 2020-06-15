import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"

import Locationbar from "./Browse/Locationbar";
import FsItem from "./Browse/FsItem";

import "./iconColors.css"
import "./Browse.css"

function sortFiles(a,b) {
    if(a.hidden !== b.hidden) {
        return a.hidden ? 1 : -1 
    }
    else return 0
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const urlSearchParams = new URLSearchParams(useLocation().search);
    const object = {}
    for (let [key, val] of urlSearchParams) {
        object[key] = val
    }
    return object
}

function Browse() {
    const [path, setPath] = useState("D:\\downloads");
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`/api/browse?path=${path}`)
            .then(res => res.json())
            .then(results => setItems(results.results.sort(sortFiles)))
    }, [path])

    return (
        <div className="area">
            <Locationbar path={path} setPath={setPath} />
            <div className="results-area">
                <ul className="results-list">
                    {items.map(item => (<FsItem item={item} setPath={setPath} />
                    ))}
                </ul>
                {/* <pre>{JSON.stringify(useLocation(), null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(useQuery(), null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default Browse;
