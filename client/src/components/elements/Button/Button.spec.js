import React from 'react';
import { shallow } from 'enzyme';
import Button from './index';

describe('Button', () => {
  it('renders a button', () => {
    const button = shallow(<Button>Button</Button>);
    expect(button.find('button')).toHaveLength(1);
  });

  it('renders custom classNames', () => {
    const button = shallow(<Button className="custom">Button</Button>);
    expect(button.hasClass('custom')).toBe(true);
  });

  it('renders specific button types', () => {
    const button = shallow(<Button type="link">Button</Button>);
    expect(button.hasClass('btn-link')).toBe(true);
  });
});
