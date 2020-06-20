import React, { useState, useEffect } from "react";
import { useQueryParam, StringParam } from 'use-query-params';

import Locationbar from "./Browse/Locationbar";
import FsItem from "./Browse/FsItem";

import "./iconColors.css"
import "./Browse.css"


function sortFiles(a, b) {
    if (a.hidden !== b.hidden) { return a.hidden ? 1 : -1 }
    else { return 0 }
}

function Roots({setPath}) {
    const [roots, setRoots] = useState([])
    useEffect(() => {
        fetch('./api/settings')
        .then(res => res.json())
        .then(x => setRoots(x.folders.split('\n')))
    }, [])

    return roots.map(root => {
        return <FsItem item={{ name: root, path: "", is_folder: true, num_files: 0, num_subfolders: 0, folder_size_bytes: 0 }} setPath={setPath} />
    })
}

function useItems(path, initialItems = []) {
    const [items, setItems] = useState(initialItems)
    useEffect(() => {
        const url = `/api/browse?path=${path}`
        fetch(url)
            .then(res => res.json())
            .then(results => setItems(results.results.sort(sortFiles)))
    }, [path])

    return items
}

function Browse() {

    const [path, setPath] = useQueryParam("path", StringParam);
    const items = useItems(path)

    return (
        <div className="area">
            <Locationbar path={path} setPath={setPath} />
            {/* <pre>{JSON.stringify(useQuery(), null, 2)}</pre> */}
            <div className="results-area">
                <ul className="results-list">
                    {(path === "") ? <Roots setPath={setPath}/> : ''}
                    {items.map(item => <FsItem item={item} setPath={setPath} />)}
                </ul>
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default Browse;
