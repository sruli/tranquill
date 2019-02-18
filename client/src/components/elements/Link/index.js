import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import styles from './Link.module.scss';

const getLinkTypeClass = function getLinkTypeClass(type) {
  if (!type) return '';

  const typeMap = {
    'btn-outline-primary': `btn btn-outline-primary py-md-2 px-md-4 ${styles.outlineBtnPrimary}`,
    secondary: 'text-secondary',
  };

  return typeMap[type] || '';
};

const Link = ({ type, href, className, children }) => {
  const typeClass = getLinkTypeClass(type);

  return (
    <RouterLink
      to={href}
      className={`${typeClass} ${className}`}
    >
      {children}
    </RouterLink>
  );
};

Link.defaultProps = {
  type: '',
  className: '',
};

Link.propTypes = {
  type: PropTypes.string,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Link;
