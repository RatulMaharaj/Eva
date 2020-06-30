import React, { useState, useEffect, useRef } from "react";
import { useQueryParam, StringParam } from 'use-query-params';
import cachedFetch from "../../utils/cachedFetch"
import Searchbar from "./Searchbar";
import ResultItem from "./ResultItem";
import MultiSelectList from "../MultiSelect/MultiList"

import "../iconColors.css"
import "./index.css"

function sortFiles(a, b) {
    if (a.hidden !== b.hidden) { return a.hidden ? 1 : -1 }
    else { return 0 }
}

function cached(f, cache = {}, keyFn = x => x) {
    const cachedFn = x => {
        const key = keyFn(x)
        const cachedResult = cache[key]
        if (cachedResult === undefined) {
            const result = f(x)
            return (cache[key] = result)
        } else {
            return cachedResult
        }
    }
    return cachedFn
}

// const cachedFetch = cached(fetch)

function useResults(query, initialResults = []) {
    const [items, setItems] = useState(initialResults)
    useEffect(() => {
        if (!query) {
            setItems([])
            return
        }
        const url = `/api/search?q=${query}`
        cachedFetch(url)
            .then(res => res.json())
            .then(({results}) => {
                // results.filter(item => item.is_folder).forEach(({path, name}) => cachedFetch(`/api/browse?path=${path ? (path + '\\' + name) : name}`))
                setItems(results.sort(sortFiles))
            })
    }, [query])

    return items
}

function Search() {

    const [query, setQuery] = useQueryParam("q", StringParam);
    const items = useResults(query)
    const [focus, setFocus] = useState(-1)
    const focusRef = useRef(null)
    useEffect(()=> {if(!query) {setQuery(undefined)}},[query, setQuery])

    useEffect(() => {
        const actives = document.querySelectorAll('.results-list .selected')
        if (actives.length < 1) return;
        actives[0].scrollIntoView({behavior:'smooth', block:'nearest'})
        // console.log(focusRef.current)
        // focusRef.current && focusRef.current.scrollIntoView()
    },[focus])
    
    return (
        <div className="search-area">
            <Searchbar path={query} setPath={setQuery} />
            {/* <pre>{JSON.stringify(useQuery(), null, 2)}</pre> */}
            <div className="results-area">
                <ul className="results-list">
                    <MultiSelectList onFocusChange={setFocus}>
                    {items.map((item, i) => <ResultItem key={i} item={item} setPath={setQuery} active={i === focus} />)}
                    </MultiSelectList>
                </ul>
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default Search;
