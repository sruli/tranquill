import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { cookieToObject } from '../../utils/cookieUtils';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      cookieToObject().authenticated
        ? (
          <Component {...props} />
        ) : (
          <Redirect to="/sign-in" />
        )
    )}
  />
);

export default AuthenticatedRoute;
