import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ type, placeholder }) => (
  <input
    type={type}
    className="form-control border-top-0 border-right-0 border-left-0 rounded-0 shadow-none"
    placeholder={placeholder}
  />
);

Input.defaultProps = {
  type: 'text',
  placeholder: '',
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Input;
