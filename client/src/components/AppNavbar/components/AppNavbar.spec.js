import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallowWithIntl, mountWithIntl } from '../../../spec/helpers/reactIntlEnzyme';
import { PlainAppNavbar } from './index';

describe('PlainAppNavbar', () => {
  it('displays the tranquill logo', () => {
    const wrapper = shallowWithIntl(<PlainAppNavbar onSignOutClicked={() => {}} />);
    expect(wrapper.find('TranquillLogo')).toHaveLength(1);
  });

  it('displays an account link', () => {
    const wrapper = mountWithIntl(
      <MemoryRouter>
        <PlainAppNavbar onSignOutClicked={() => {}} />
      </MemoryRouter>,
    );

    expect(wrapper.find('li > .nav-link').at(0).text()).toMatch(/account/i);
  });

  it('displays a sign out link', () => {
    const wrapper = mountWithIntl(
      <MemoryRouter>
        <PlainAppNavbar onSignOutClicked={() => {}} />
      </MemoryRouter>,
    );

    expect(wrapper.find('li > .nav-link').at(1).text()).toMatch(/sign out/i);
  });
});
