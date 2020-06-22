import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCog } from '@fortawesome/free-solid-svg-icons';

import './Searchbar.css'

function Locationbar({ path = "", setPath = () => { } }) {
    const [currentPath, setCurrentPath] = useState(path);
    useEffect(() => { setCurrentPath(path); }, [path]);
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

    return <div className="locationbar">
        <form className="location-form" onSubmit={onSubmit}>
            <input type="search" className="location-inputbox" value={currentPath} onChange={onChange} onKeyDown={onKeyDown} />
            <div className="location-icon-wrapper">
                <FontAwesomeIcon icon={faSearch} className="location-icon" />
            </div>
        </form>
        <button className="up-button">
            <FontAwesomeIcon icon={faCog} />
        </button>
    </div>;
}

export default Locationbar
