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
    'secondary-link': `text-secondary ${styles.secondaryLink}`,
  };

  return typeMap[type] || '';
};

const Button = ({ type, className, disabled, onClick, children }) => {
  const typeClass = getButtonTypeClass(type);

  return (
    <button
      disabled={disabled}
      type="submit"
      className={`btn ${typeClass} ${className} ${styles.btn}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  type: null,
  className: '',
  disabled: false,
  onClick: () => {},
};

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Button;
