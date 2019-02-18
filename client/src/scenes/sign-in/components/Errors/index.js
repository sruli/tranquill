import React from 'react';
import PropTypes from 'prop-types';
import styles from './Errors.module.scss';

const Message = ({ content }) => (
  <div className="row mb-md-1">
    <div className="col">
      { content }
    </div>
  </div>
);

Message.propTypes = {
  content: PropTypes.string.isRequired,
};

const Errors = ({ errors }) => (
  <div className={`row ls-2 font-italic text-danger text-center ${styles.errors} ${errors.length > 0 ? 'visble' : 'invisible'}`}>
    <div className="col">
      { errors.map(error => <Message content={error} key={error} />) }
    </div>
  </div>
);

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Errors;
