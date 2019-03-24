import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Errors from './Errors';
import { Input, Button } from '../../../components/elements';
import TranquillLogo from '../../../components/TranquillLogo';
import { getEmail, getPassword, getErrors, getSubmitting } from '../reducer';
import { formChanged, formSubmitted } from '../actions';
import styles from './SignIn.module.scss';

const SignIn = ({ email, password, onFormChanged, onSubmit, errors, submitting }) => {
  const emailInput = useRef(null);
  useEffect(() => emailInput.current.focus(), []);

  return (
    <React.Fragment>
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100 flex-column justify-content-center">
          <div className="col-10 col-md-3 offset-1">
            <div className="row justify-content-center mb-3">
              <TranquillLogo size="lg" />
            </div>
            <div className="row justify-content-center mb-5">
              <h6 className="text-muted font-weight-normal">Sign in to your Tranquill account</h6>
            </div>

            <Errors errors={errors} />

            <div className="row">
              <div className="col">
                <form noValidate className="pt-5" onSubmit={onSubmit}>
                  <div className="form-row mb-4">
                    <div className="col">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => onFormChanged({ email: e.target.value })}
                        ref={emailInput}
                      />
                    </div>
                  </div>
                  <div className="form-row mb-3">
                    <div className="col">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => onFormChanged({ password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-row mb-3">
                    <div className="col">
                      <Button disabled={errors.length > 0 || submitting} className="w-100" type="lg-primary">
                        Sign in
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className={`row ls-2 ${styles.small}`}>
              <div className="col-12 mb-2">
                Don&#39;t have an account?&nbsp;
                <a href="/get-started">Create account.</a>
              </div>
              <div className="col-12">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

SignIn.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onFormChanged: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitting: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  email: getEmail(state),
  password: getPassword(state),
  errors: getErrors(state),
  submitting: getSubmitting(state),
});

const mapDispatchToProps = dispatch => ({
  onFormChanged: changedVal => dispatch(formChanged(changedVal)),
  onSubmit: (e) => {
    e.preventDefault();
    dispatch(formSubmitted());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
