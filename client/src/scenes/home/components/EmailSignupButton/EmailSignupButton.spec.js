import React from 'react';
import { shallowWithIntl } from '../../../../spec/helpers/reactIntlEnzyme';
import EmailSignupButton from './index';
import { FORM_STATUS } from '../../constants';

describe('EmailSignupButton', () => {
  describe('when disabled prop is true', () => {
    it('renders a disabled button', () => {
      const button = shallowWithIntl(
        <EmailSignupButton disabled formStatus={FORM_STATUS.UNSUBMITTED} />,
      );
      expect(button.prop('disabled')).toBe(true);
    });
  });

  describe('when disabled prop is false', () => {
    it('renders an active button', () => {
      const button = shallowWithIntl(
        <EmailSignupButton disabled={false} formStatus={FORM_STATUS.UNSUBMITTED} />,
      );
      expect(button.prop('disabled')).toBe(false);
    });
  });

  describe('when form is not submitted', () => {
    it('renders the correct button text', () => {
      const button = shallowWithIntl(
        <EmailSignupButton disabled={false} formStatus={FORM_STATUS.UNSUBMITTED} />,
      );
      expect(button.dive().dive().text()).toMatch(/gimme a shout/i);
    });
  });

  describe('when form is submitted', () => {
    it('renders the correct button text', () => {
      const button = shallowWithIntl(
        <EmailSignupButton disabled={false} formStatus={FORM_STATUS.SUBMITTED} />,
      );
      expect(button.dive().dive().text()).toMatch(/okay/i);
    });
  });
});
