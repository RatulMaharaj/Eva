import React, { useState, useEffect } from "react";
import { useQueryParam, StringParam } from 'use-query-params';
import cachedFetch from "../../utils/cachedFetch";
import Searchbar from "./Searchbar";
import ResultItem from "./ResultItem";

import "../iconColors.css"
import "./index.css"

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
        return <ResultItem key={root} item={{ name: root, path: "", is_folder: true, num_files: 0, num_subfolders: 0, folder_size_bytes: 0 }} setPath={setPath} />
    })
}

function useResults(results, initialResults = []) {
    const [items, setItems] = useState(initialResults)
    useEffect(() => {
        const url = `/api/search?q=${results}`
        cachedFetch(url)
            .then(res => res.json())
            .then(({results}) => {
                // results.filter(item => item.is_folder).forEach(({path, name}) => cachedFetch(`/api/browse?path=${path ? (path + '\\' + name) : name}`))
                setItems(results.sort(sortFiles))
            })
    }, [results])

    return items
}

function Browse() {

    const [query, setQuery] = useQueryParam("q", StringParam);
    const items = useResults(query)
    useEffect(()=> {if(!query) {setQuery("")}},[query, setQuery])

    return (
        <div className="area">
            <Searchbar path={query} setPath={setQuery} />
            {/* <pre>{JSON.stringify(useQuery(), null, 2)}</pre> */}
            <div className="results-area">
                <ul className="results-list">
                    {(query === "") ? <Roots setPath={setQuery}/> : ''}
                    {items.map(item => <ResultItem key={item.name} item={item} setPath={setQuery} />)}
                </ul>
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default Browse;
