import React from 'react';
import TranquillLogo from './TranquillLogo';

const AppNavbar = () => (
  <div className="row justify-content-center">
    <nav className="navbar col-10">
      <a className="navbar-brand" href="/"><TranquillLogo /></a>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link text-secondary d-flex align-items-center" href="/">
            Account
            <i className="material-icons">expand_more</i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

export default AppNavbar;
