import React from 'react';
import { Button } from '../elements';
import TranquillLogo from '../TranquillLogo';
import styles from './AppNavbar.module.scss';

const AppNavbar = () => (
  <div className={`container-fluid fixed-top bg-white ${styles.navbar}`}>
    <div className="row justify-content-center">
      <nav className="navbar col-10">
        <a className="navbar-brand" href="/"><TranquillLogo /></a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Button className="nav-link text-secondary">
              Account
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default AppNavbar;
