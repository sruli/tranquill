import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Link } from '../../elements';
import TranquillLogo from '../../TranquillLogo';
import { signOut } from '../actions';
import styles from './AppNavbar.module.scss';

export const PlainAppNavbar = ({ onSignOutClicked }) => (
  <div className={`container-fluid fixed-top bg-white ${styles.navbar}`}>
    <div className="row justify-content-center">
      <nav className="navbar col-md-10">
        <a className="navbar-brand" href="/"><TranquillLogo /></a>
        <ul className="nav align-items-end">
          <li>
            <Link href="/" type="secondary" className="nav-link">
              <FormattedMessage id="AppNavbar.account" />
            </Link>
          </li>
          <li>
            <Button type="secondary-link" className="nav-link" onClick={onSignOutClicked}>
              <FormattedMessage id="AppNavbar.signOut" />
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

PlainAppNavbar.propTypes = {
  onSignOutClicked: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onSignOutClicked: () => {
    dispatch(signOut());
  },
});

export default connect(null, mapDispatchToProps)(PlainAppNavbar);
