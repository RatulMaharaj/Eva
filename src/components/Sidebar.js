import React from 'react';
import { Link } from 'react-router-dom';
import "./Sidebar.css"

function sidebar() {
    return (
    <div id='mySidebar' className='sidebar' >
        <div id='myLogo' className="logo">
            <Link to="/"><h2>Eva</h2></Link>
        </div>

        <nav className='nav'>
            <ul className='nav-list' >
                <li className='nav-item' >
                    <Link to="/">
                        <i className="material-icons nav-item-icon">home</i><span className="icon-text">Home</span>
                    </Link>
                </li>
                <li className='nav-item' >
                    <Link to="search">
                        <i className="material-icons nav-item-icon">search</i><span className="icon-text">Search</span>
                    </Link>
                </li>
                {/* <li className='nav-item' >
                    <Link to="combine">
                        <i className="material-icons nav-item-icon">picture_as_pdf</i><span className="icon-text">Combine</span>
                    </Link>
                </li> */}
                <li className='nav-item' >
                    <Link to="about">
                        <i className="material-icons nav-item-icon">info</i><span className="icon-text">About</span>
                    </Link>
                </li>
                <li className='nav-item' >
                    <Link to="settings">
                        <i className="material-icons nav-item-icon">settings</i><span className="icon-text">Settings</span>
                    </Link>
                </li>
            </ul>
        </nav>
    </div>
    );
  }
  
  export default sidebar;

