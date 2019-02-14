import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import AppNavbar from './index';

describe('AppNavbar', () => {
  it('displays the tranquill logo', () => {
    const wrapper = shallow(<AppNavbar />);
    expect(wrapper.find('TranquillLogo')).toHaveLength(1);
  });

  it('displays an account link', () => {
    const wrapper = mount(
      <MemoryRouter>
        <AppNavbar />
      </MemoryRouter>,
    );

    expect(wrapper.find('li > .nav-link').at(0).text()).toMatch(/account/i);
  });

  it('displays a sign out link', () => {
    const wrapper = mount(
      <MemoryRouter>
        <AppNavbar />
      </MemoryRouter>,
    );

    expect(wrapper.find('li > .nav-link').at(1).text()).toMatch(/sign out/i);
  });
});
