import React from 'react';
import { shallow } from 'enzyme';
import AppNavbar from './index';

describe('AppNavbar', () => {
  it('displays the tranquill logo', () => {
    const wrapper = shallow(<AppNavbar />);
    expect(wrapper.find('TranquillLogo')).toHaveLength(1);
  });

  it('displays an account link', () => {
    const wrapper = shallow(<AppNavbar />);
    expect(wrapper.find('.nav-link').text()).toMatch(/account/i);
  });
});
