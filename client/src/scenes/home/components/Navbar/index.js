import React from 'react';
import TranquillLogo from '../../../../components/TranquillLogo';
import { Link } from '../../../../components/elements';
import { SCENE_PATH as signInPath } from '../../../sign-in';
import styles from './Navbar.module.scss';

const Navbar = () => (
  <div className={`container-fluid fixed-top bg-white pt-md-2 ${styles.navbar}`}>
    <div className="row justify-content-center">
      <nav className="navbar col-md-10">
        <a className="navbar-brand" href="/"><TranquillLogo /></a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link href={signInPath} type="btn-outline-primary">Sign in</Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Navbar;
