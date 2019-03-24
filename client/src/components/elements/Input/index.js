import React from 'react';
import PropTypes from 'prop-types';

const Input = React.forwardRef(({ type, placeholder, value, onChange, disabled }, ref) => (
  <input
    type={type}
    className="form-control border-top-0 border-right-0 border-left-0 rounded-0 shadow-none"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    ref={ref}
  />
));

Input.defaultProps = {
  type: 'text',
  placeholder: '',
  value: '',
  disabled: false,
  onChange: () => {},
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Input;
