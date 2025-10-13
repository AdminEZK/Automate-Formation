import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>Automate Formation</h1>
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Demande de Formation</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
