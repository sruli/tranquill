import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../../components/elements';
import { FORM_STATUS } from '../../constants';

const EmailSignupButton = ({ disabled, formStatus }) => (
  <Button type="lg-primary" disabled={disabled}>
    { formStatus === FORM_STATUS.SUBMITTED ? 'Added' : 'Add me' }
  </Button>
);

EmailSignupButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  formStatus: PropTypes.string.isRequired,
};

export default EmailSignupButton;
