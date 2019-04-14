import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Button } from '../../../../components/elements';
import { FORM_STATUS } from '../../constants';

const EmailSignupButton = ({ disabled, formStatus, intl }) => (
  <Button type="lg-primary" disabled={disabled} className="w-100">
    { formStatus === FORM_STATUS.SUBMITTED ? (
      intl.formatMessage({ id: 'home.okay' })
    ) : (
      intl.formatMessage({ id: 'home.gimmeAShout' })
    )}
  </Button>
);

EmailSignupButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  formStatus: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(EmailSignupButton);
