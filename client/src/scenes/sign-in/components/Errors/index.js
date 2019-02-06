import React from 'react';
import PropTypes from 'prop-types';
import styles from './Errors.module.scss';

const Message = ({ visible, content }) => (
  <div className={`row mb-md-1 ${visible ? 'visible' : 'invisible'}`}>
    <div className="col">
      { content }
    </div>
  </div>
);

Message.propTypes = {
  content: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

const Errors = ({ hasErrors, errors: { email, password } }) => (
  <div className={`row ls-2 font-italic text-danger text-center ${styles.errors} ${hasErrors ? 'visble' : 'invisible'}`}>
    <div className="col">
      { <Message visible={!!email} content="Enter an email" /> }
      { <Message visible={!!password} content="Enter a password" /> }
    </div>
  </div>
);

Errors.propTypes = {
  hasErrors: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    email: PropTypes.bool,
    password: PropTypes.bool,
  }).isRequired,
};

export default Errors;
