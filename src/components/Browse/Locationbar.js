import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faArrowUp } from '@fortawesome/free-solid-svg-icons';

import './Locationbar.css'
import useEventListener from "../MultiSelect/utils/useEventListener";

function upPath(path) {
    return path.slice(0, path.lastIndexOf('\\'))
}

function Locationbar({ path = "", setPath = () => { } }) {
    const [currentPath, setCurrentPath] = useState(path);
    useEffect(() => { setCurrentPath(path); }, [path]);

    
    const inputRef = useRef(null)

    useEffect(()=> inputRef.current.focus(),[])

    useEventListener('keydown',e => {
        // console.log(e)
        if((e.key === 'l') && (e.altKey)) {
            inputRef.current.focus()
        }
    },document)

    const onChange = e => setCurrentPath(e.target.value);
    const onSubmit = e => {
        e.preventDefault();
        setPath(currentPath);
    };
    const onKeyDown = e => {
        if ((e.key === 'Escape') && (e.target.value === "")) {
            e.preventDefault();
            setCurrentPath(path);
        }
    };


    const up = () => {
        setPath(upPath(path))
    }

    return <div className="locationbar">
        <button className="up-button" onClick={up}>
            <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <form className="location-form" onSubmit={onSubmit}>
            <div className="location-icon-wrapper">
                <FontAwesomeIcon icon={faFolder} className="location-icon" />
            </div>
            <input ref={inputRef} type="search" className="location-inputbox" value={currentPath} onChange={onChange} onKeyDown={onKeyDown} />
        </form>
    </div>;
}

export default Locationbar
