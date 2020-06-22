import React, { useState, useEffect } from "react";
import { useQueryParam, StringParam } from 'use-query-params';
import cachedFetch from "../../utils/cachedFetch";
import Locationbar from "./Locationbar";
import FsItem from "./FsItem";

import "../iconColors.css"
import "./Browse.css"

function sortFiles(a, b) {
    if (a.hidden !== b.hidden) { return a.hidden ? 1 : -1 }
    else { return 0 }
}

function Roots({setPath}) {
    const [roots, setRoots] = useState([])
    useEffect(() => {
        cachedFetch('./api/settings')
        .then(res => res.json())
        .then(x => setRoots(x.folders.split('\n')))
    }, [])

    return roots.map(root => {
        return <FsItem key={root} item={{ name: root, path: "", is_folder: true, num_files: 0, num_subfolders: 0, folder_size_bytes: 0 }} setPath={setPath} />
    })
}

function useItems(path, initialItems = []) {
    const [items, setItems] = useState(initialItems)
    useEffect(() => {
        const url = `/api/browse?path=${path}`
        cachedFetch(url)
            .then(res => res.json())
            .then(({results}) => {
                // results.filter(item => item.is_folder).forEach(({path, name}) => cachedFetch(`/api/browse?path=${path ? (path + '\\' + name) : name}`))
                setItems(results.sort(sortFiles))
            })
    }, [path])

    return items
}

function Browse() {

    const [path, setPath] = useQueryParam("path", StringParam);
    const items = useItems(path)
    useEffect(()=> {if(!path) {setPath("")}},[path, setPath])

    return (
        <div className="area">
            <Locationbar path={path} setPath={setPath} />
            {/* <pre>{JSON.stringify(useQuery(), null, 2)}</pre> */}
            <div className="results-area">
                <ul className="results-list">
                    {(path === "") ? <Roots setPath={setPath}/> : ''}
                    {items.map(item => <FsItem key={item.name} item={item} setPath={setPath} />)}
                </ul>
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default Browse;
