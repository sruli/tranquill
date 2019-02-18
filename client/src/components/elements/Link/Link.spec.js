import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import Link from './index';

describe('Link', () => {
  it('renders a specific Link type', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Link type="btn-outline-primary" href="/">Click me</Link>
      </MemoryRouter>,
    );

    expect(wrapper.find('a').hasClass('btn-outline-primary')).toBe(true);
  });

  it('renders custom classNames', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Link className="custom" href="/">Click me</Link>
      </MemoryRouter>,
    );

    expect(wrapper.find('a').hasClass('custom')).toBe(true);
  });
});
