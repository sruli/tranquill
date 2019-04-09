import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isNil from 'lodash/isNil';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Navbar from './Navbar';
import { formSubmitted, formChanged } from '../actions';
import { getEmail, getError, getButtonDisabled, getStatus } from '../reducer';
import { FORM_STATUS } from '../constants';
import { Input } from '../../../components/elements';
import ArrowDownCircle from '../../../components/icons/ArrowDownCircle';
import EmailSignupButton from './EmailSignupButton';
import styles from './Home.module.scss';

const Home = ({ email, error, formStatus, buttonDisabled, onFormChanged, onSubmit, intl }) => (
  <React.Fragment>
    <Navbar />

    <div className="container-fluid min-vh-100 pt-5">
      <div className="row">
        <div className="col-md-5 offset-md-1 pt-5">
          <div className="row mb-4">
            <div className="col">
              <h1 className={`display-2 d-md-block d-none ls-5 ${styles.display}`}>
                <FormattedMessage id="home.grabANotebook" />
              </h1>
              <h1 className={`display-4 d-md-none ls-4 ${styles.display}`}>
                <FormattedMessage id="home.grabANotebook" />
              </h1>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
              <h5 className="font-weight-normal ls-2 ls-md-1">
                <FormattedMessage id="home.putYourThoughtsToWords" />
              </h5>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4 className="ls-3 ls-md-2 mb-md-2">
                <FormattedMessage id="home.holdThatThought" />
              </h4>
            </div>
          </div>
          <div className="row mb-5 mb-md-4">
            <div className="col">
              <h5 className="font-weight-normal ls-2 ls-md-1">
                <FormattedMessage id="home.weWorkingHard" />
              </h5>
            </div>
          </div>
          <div className="row mb-md-2">
            <div className="col">
              <form noValidate onSubmit={onSubmit}>
                <div className="form-row align-items-end">
                  <div className="col-6">
                    <Input
                      type="email"
                      placeholder={intl.formatMessage({ id: 'home.email' })}
                      value={email}
                      onChange={e => onFormChanged({ email: e.target.value })}
                      disabled={formStatus === FORM_STATUS.SUBMITTED}
                    />
                  </div>
                  <div className="col-6">
                    <EmailSignupButton disabled={buttonDisabled} formStatus={formStatus} />
                  </div>
                </div>
              </form>
            </div>
          </div>
          {
            !isNil(error) && (
              <div id="formError" className={`row ls-2 font-italic text-danger ${styles.errors}`}>
                <div className="col">
                  <FormattedMessage id={`home.${error.name}.message`} />
                </div>
              </div>
            )
          }
          <div className="row mb-md-4 d-none">
            <div className="col">
              <h5 className="font-weight-normal">
                <FormattedMessage id="home.cantHold" />
              </h5>
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

Home.defaultProps = {
  error: null,
};

Home.propTypes = {
  email: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error),
  buttonDisabled: PropTypes.bool.isRequired,
  formStatus: PropTypes.string.isRequired,
  onFormChanged: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Home));
