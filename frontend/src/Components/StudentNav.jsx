import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { BsSearch } from "react-icons/bs";

function Navbar() {
  const [click, setClick] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Add logic to toggle dark mode
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Add logic for real-time search
  };

  useEffect(() => {
    // Add logic to handle dark mode styles
  }, [darkMode]);

  return (
    <nav className={darkMode ? 'navbar dark-mode' : 'navbar'}>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
          Revil student
        </Link>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='search-input'
          />
          <BsSearch className='search-icon' />
        </div>
        <div className={darkMode ? 'dark-mode-toggle dark' : 'dark-mode-toggle light'} onClick={toggleDarkMode}></div>
        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          
          <li className='nav-item'>
            <Link to='/studentproductscreen' className='nav-links' onClick={closeMobileMenu}>
              Products
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/register' className='nav-links' onClick={closeMobileMenu}>
              Settings
            </Link>
          </li>
          <li className='nav-item'>
          <Link to='/profile' className='nav-links' onClick={closeMobileMenu}>
              Profile
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;