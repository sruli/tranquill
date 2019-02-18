import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from './index';
import { stubAuth, unstubAuth } from '../../spec/helpers/authStubs';

const Private = () => <div />;
const SignIn = () => <div />;

const App = () => (
  <MemoryRouter>
    <Switch>
      <Route path="/sign-in" component={SignIn} />
      <AuthenticatedRoute component={Private} />
    </Switch>
  </MemoryRouter>
);

describe('AuthenticatedRoute', () => {
  describe('when user is authenticated', () => {
    beforeAll(() => stubAuth());
    afterAll(() => unstubAuth());

    it('renders the desired component', () => {
      const wrapper = mount(<App />);
      expect(wrapper.find('Private')).toHaveLength(1);
      expect(wrapper.find('SignIn')).toHaveLength(0);
    });
  });

  describe('when user is note authenticated', () => {
    it('redirects to sign in page', () => {
      const wrapper = mount(<App />);
      expect(wrapper.find('Private')).toHaveLength(0);
      expect(wrapper.find('SignIn')).toHaveLength(1);
    });
  });
});
