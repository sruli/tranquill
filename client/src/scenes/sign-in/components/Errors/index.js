import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
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

const Errors = ({ errors, intl }) => (
  <div className={`row ls-2 font-italic text-danger text-center ${styles.errors} ${errors.length > 0 ? 'visble' : 'invisible'}`}>
    <div className="col">
      {
        errors.map((error) => {
          const message = intl.formatMessage({ id: `sign-in.${error.name}.message` });
          return <Message content={message} key={message} />;
        })
      }
    </div>
  </div>
);

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(Errors);
