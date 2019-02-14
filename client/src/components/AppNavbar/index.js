import React from 'react';
import { Button, Link } from '../elements';
import TranquillLogo from '../TranquillLogo';
import styles from './AppNavbar.module.scss';

const AppNavbar = () => (
  <div className={`container-fluid fixed-top bg-white ${styles.navbar}`}>
    <div className="row justify-content-center">
      <nav className="navbar col-10">
        <a className="navbar-brand" href="/"><TranquillLogo /></a>
        <ul className="nav align-items-end">
          <li>
            <Link href="/" type="secondary" className="nav-link">
              Account
            </Link>
          </li>
          <li>
            <Button type="secondary-link" className="nav-link">
              Sign out
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default AppNavbar;
