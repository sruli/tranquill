import React from 'react';
import TranquillLogo from '../../../../components/TranquillLogo';
import { Button } from '../../../../components/elements';
import styles from './Navbar.module.scss';

const Navbar = () => (
  <div className={`container-fluid fixed-top bg-white pt-md-2 ${styles.navbar}`}>
    <div className="row justify-content-center">
      <nav className="navbar col-10">
        <a className="navbar-brand" href="/"><TranquillLogo /></a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Button type="outline-primary">Sign in</Button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Navbar;
