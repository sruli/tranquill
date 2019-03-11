import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import { formSubmitted, formChanged } from '../actions';
import { getEmail, getError, getButtonDisabled, getStatus } from '../reducer';
import { FORM_STATUS } from '../constants';
import { Input } from '../../../components/elements';
import ArrowDownCircle from '../../../components/icons/ArrowDownCircle';
import EmailSignupButton from './EmailSignupButton';
import styles from './Home.module.scss';

const Home = ({ email, error, formStatus, buttonDisabled, onFormChanged, onSubmit }) => (
  <React.Fragment>
    <Navbar />

    <div className="container-fluid min-vh-100 pt-5">
      <div className="row">
        <div className="col-md-5 offset-md-1 pt-5">
          <div className="row mb-4">
            <div className="col">
              <h1 className={`display-2 d-md-block d-none ls-5 ${styles.display}`}>Grab a notebook—</h1>
              <h1 className={`display-4 d-md-none ls-4 ${styles.display}`}>Grab a notebook—</h1>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <h5 className="font-weight-normal ls-2 ls-md-1">
                Get ideas out of your head and into concepts you can run with. Every notebook is encrypted so you and your ideas have privacy to grow confidently.
              </h5>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4 className="ls-3 ls-md-2 mb-md-2">
                Hold that thought…
              </h4>
            </div>
          </div>
          <div className="row mb-5 mb-md-4">
            <div className="col">
              <h5 className="font-weight-normal ls-2 ls-md-1">
                We&#39;re working hard to get Tranquill live. If you leave your email we&#39;ll give a shout when it&#39;s ready for ya.
              </h5>
            </div>
          </div>
          <div className="row mb-md-2">
            <div className="col">
              <form noValidate onSubmit={onSubmit}>
                <div className="form-row align-items-end">
                  <div className="col-6 col-md-7">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => onFormChanged({ email: e.target.value })}
                      disabled={formStatus === FORM_STATUS.SUBMITTED}
                    />
                  </div>
                  <div className="col-6 col-md-5">
                    <EmailSignupButton disabled={buttonDisabled} formStatus={formStatus} />
                  </div>
                </div>
              </form>
            </div>
          </div>
          {
            error !== '' && (
              <div id="formError" className={`row ls-2 font-italic text-danger ${styles.errors}`}>
                <div className="col">{error}</div>
              </div>
            )
          }
          <div className="row mb-md-4 d-none">
            <div className="col">
              <h5 className="font-weight-normal">Can&#39;t hold that thought? Scroll down and get started.</h5>
            </div>
          </div>
          <div className="row d-none">
            <div className="col d-flex justify-content-center">
              <ArrowDownCircle />
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

Home.propTypes = {
  email: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  buttonDisabled: PropTypes.bool.isRequired,
  formStatus: PropTypes.string.isRequired,
  onFormChanged: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  email: getEmail(state),
  error: getError(state),
  formStatus: getStatus(state),
  buttonDisabled: getButtonDisabled(state),
});

const mapDispatchToProps = dispatch => ({
  onFormChanged: payload => dispatch(formChanged(payload)),
  onSubmit: (e) => {
    e.preventDefault();
    dispatch(formSubmitted());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
