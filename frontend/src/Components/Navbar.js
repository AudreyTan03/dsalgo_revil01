// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { BsSearch } from "react-icons/bs";

function Navbar({ handleSearch, searchTerm }) {
  const [click, setClick] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Add logic to toggle dark mode
  };

  useEffect(() => {
    // Add logic to handle dark mode styles
  }, [darkMode]);

  return (
    <nav className={darkMode ? 'navbar dark-mode' : 'navbar'}>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
          Revil
        </Link>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearch}
            className='search-input'
          />
          <BsSearch className='search-icon' />
        </div>
        <div className='dark-mode-toggle' onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </div>
        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/options' className='nav-links' onClick={closeMobileMenu}>
              Options
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/products' className='nav-links' onClick={closeMobileMenu}>
              Products
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/register' className='nav-links' onClick={closeMobileMenu}>
              Register
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
