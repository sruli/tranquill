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
          <div className="row mb-md-5">
            <div className="col">
              <h1 className={`display-1 ls-5 ${styles.display}`}>Create notebooks—Build ideas.</h1>
            </div>
          </div>
          <div className="row mb-md-4">
            <div className="col">
              <h5 className="font-weight-normal">
                Use Tranquill to develope your thoughts. Everything is encrypted so what you write is yours alone.
              </h5>
            </div>
          </div>
          <div className="row mb-md-4">
            <div className="col">
              <h5 className="font-weight-normal">
                Curently in limited Alpha. Wanna be added to the list? Leave your email and we&#39;ll let you know as soon as you can join.
              </h5>
            </div>
          </div>
          <div className="row mb-md-2">
            <div className="col">
              <form noValidate onSubmit={onSubmit}>
                <div className="form-row align-items-end">
                  <div className="col">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => onFormChanged({ email: e.target.value })}
                      disabled={formStatus === FORM_STATUS.SUBMITTED}
                    />
                  </div>
                  <div className="col-auto">
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
