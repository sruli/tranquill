import React from 'react';
import { shallow } from 'enzyme';
import Input from './index';

describe('Input', () => {
  it('renders an input with a given type', () => {
    const input = shallow(<Input type="email" />);
    expect(input.prop('type')).toEqual('email');
  });

  it('renders a placeholder', () => {
    const input = shallow(<Input placeholder="holding my place" />);
    expect(input.prop('placeholder')).toEqual('holding my place');
  });

  it('defaults to text input', () => {
    const input = shallow(<Input />);
    expect(input.prop('type')).toEqual('text');
  });

  it('has a border only on the bottom', () => {
    const input = shallow(<Input />);
    expect(input.hasClass('border-top-0')).toBe(true);
    expect(input.hasClass('border-right-0')).toBe(true);
    expect(input.hasClass('border-left-0')).toBe(true);
    expect(input.hasClass('border-bottom-0')).toBe(false);
  });

  it('does not have rounded corners', () => {
    const input = shallow(<Input />);
    expect(input.hasClass('rounded-0')).toBe(true);
  });

  it('does not have any shadows', () => {
    const input = shallow(<Input />);
    expect(input.hasClass('shadow-none')).toBe(true);
  });
});
