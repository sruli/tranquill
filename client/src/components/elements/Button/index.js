import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.scss';

const getButtonTypeClass = function getButtonTypeClass(type) {
  if (!type) return '';

  const typeMap = {
    primary: 'btn-primary',
    link: 'btn-link',
    'lg-primary': `btn-primary btn-lg px-md-5 py-md-3 text-uppercase ${styles.lgBtn}`,
    'outline-primary': `btn-outline-primary py-md-2 px-md-4 ${styles.outlineBtnPrimary}`,
  };

  return typeMap[type] || '';
};

const Button = ({ type, className, disabled, children }) => {
  const typeClass = getButtonTypeClass(type);

  return (
    <button
      disabled={disabled}
      type="submit"
      className={`btn ${typeClass} ${className} ${styles.btn}`}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: null,
  className: '',
  disabled: false,
};

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Button;
