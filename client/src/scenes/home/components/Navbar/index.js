import React from 'react';
import { FormattedMessage } from 'react-intl';
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
            <Link href={signInPath} type="btn-outline-primary">
              <FormattedMessage id="home.signIn" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Navbar;
