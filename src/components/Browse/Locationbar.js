import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

import './Locationbar.css'

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
            <div className="location-icon-wrapper">
                <FontAwesomeIcon icon={faFolder} className="location-icon" />
            </div>
            <input type="search" className="location-inputbox" value={currentPath} onChange={onChange} onKeyDown={onKeyDown} />
        </form>
    </div>;
}

export default Locationbar
