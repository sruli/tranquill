import React from 'react';
import { Input, Button } from '../../../components/elements';
import TranquillLogo from '../../../components/TranquillLogo';
import styles from './SignIn.module.scss';

const SignIn = () => (
  <React.Fragment>
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100 flex-column justify-content-center">
        <div className="col-3 offset-1">
          <div className="row justify-content-center mb-md-3">
            <TranquillLogo size="lg" />
          </div>
          <div className="row justify-content-center mb-md-3">
            <h6 className="text-muted font-weight-normal">Sign in to your Tranquill account</h6>
          </div>
          <div className="row">
            <div className="col">
              <form className="pt-md-5">
                <div className="form-row mb-md-4">
                  <div className="col">
                    <Input type="email" placeholder="Email" />
                  </div>
                </div>
                <div className="form-row mb-md-3">
                  <div className="col">
                    <Input type="password" placeholder="Password" />
                  </div>
                </div>
                <div className="form-row mb-md-3">
                  <div className="col">
                    <Button className="w-100" type="lg-primary">Sign in</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className={`row ls-2 ${styles.small}`}>
            <div className="col">
              Don&#39;t have an account?
              <a href="/get-started">Create account.</a>
            </div>
            <div className="col text-right">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default SignIn;
