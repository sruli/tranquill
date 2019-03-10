import React from 'react';
import { shallow } from 'enzyme';
import EmailSignupButton from './index';
import { FORM_STATUS } from '../../constants';

describe('EmailSignupButton', () => {
  describe('when disabled prop is true', () => {
    it('renders a disabled button', () => {
      const button = shallow(<EmailSignupButton disabled formStatus={FORM_STATUS.UNSUBMITTED} />);
      expect(button.prop('disabled')).toBe(true);
    });
  });

  describe('when disabled prop is false', () => {
    it('renders an active button', () => {
      const button = shallow(
        <EmailSignupButton disabled={false} formStatus={FORM_STATUS.UNSUBMITTED} />,
      );
      expect(button.prop('disabled')).toBe(false);
    });
  });

  describe('when form is not submitted', () => {
    it('renders the correct button text', () => {
      const button = shallow(
        <EmailSignupButton disabled={false} formStatus={FORM_STATUS.UNSUBMITTED} />,
      );
      expect(button.dive().text()).toMatch(/add me/i);
    });
  });

  describe('when form is submitted', () => {
    it('renders the correct button text', () => {
      const button = shallow(
        <EmailSignupButton disabled={false} formStatus={FORM_STATUS.SUBMITTED} />,
      );
      expect(button.dive().text()).toMatch(/added/i);
    });
  });
});
