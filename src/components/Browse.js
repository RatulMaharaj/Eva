import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom"

import Locationbar from "./Browse/Locationbar";
import FsItem from "./Browse/FsItem";

import "./iconColors.css"
import "./Browse.css"


function splitname(filename) {
    const lastSlashPos = filename.lastIndexOf('\\') + 1
    const path = filename.substr(0,lastSlashPos)
    const name = filename.substr(lastSlashPos,filename.length)
    return [path, name]    
}

function sortFiles(a, b) {
    if (a.hidden !== b.hidden) { return a.hidden ? 1 : -1 }    
    else { return 0 }
}

function useRoots() {
    const [roots, setRoots] = useState([])
    useEffect(() => {fetch('./api/settings')
        .then(res => res.json())
        .then(x => {
            console.log(x)
            setRoots(x.folders.split('\n'))
        })
    }, []) 
    return roots
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

function apiUrl(path) {
    return `/api/browse?path=${path}`
}

function frontendUrl(path) {
    return `/browse?path=${path}`
}

function Browse() {
    const history = useHistory()

    const roots = useRoots()

    const [path, setPath] = useState("");
    const [items, setItems] = useState([]);

    const setPathWithHist = (path) => {
        history.push(frontendUrl(path))
        setPath(path)
    }

    useEffect(() => {
        fetch(apiUrl(path))
            .then(res => res.json())
            .then(results => setItems(results.results.sort(sortFiles)))
    }, [path])

    return (
        <div className="area">
            <Locationbar path={path} setPath={setPathWithHist} />
            {/* <pre>{JSON.stringify(useQuery(), null, 2)}</pre> */}
            <div className="results-area">
                <ul className="results-list">
                    {(path==="") ? roots.map(root => {
                        const [path,name] = splitname(root)
                        return <FsItem item={{name:root, path:"", is_folder: true, num_files:0, num_subfolders:0, folder_size_bytes: 0}} setPath={setPathWithHist} />
                        }) : ''}
                    {items.map(item => (<FsItem item={item} setPath={setPathWithHist} />
                    ))}
                </ul>
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default Browse;
