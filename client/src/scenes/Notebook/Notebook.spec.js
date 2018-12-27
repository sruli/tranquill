import React from 'react';
import { shallow } from 'enzyme';
import Notebook from './index';

describe('Notebook', () => {
  it('renders a <NameSection />', () => {
    const wrapper = shallow(<Notebook />);
    expect(wrapper.find('NameSection')).toHaveLength(1);
  });
});
