import React from 'react';
import { Route } from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Notebook, { SCENE_PATH as notebookPath } from './scenes/notebook';
import Home, { SCENE_PATH as homePath } from './scenes/home';
import SignIn, { SCENE_PATH as signInPath } from './scenes/sign-in';

const App = () => (
  <div className="min-vh-100">
    <Route exact path={homePath} component={Home} />
    <Route path={signInPath} component={SignIn} />
    <AuthenticatedRoute path={notebookPath} component={Notebook} />
  </div>
);

export default App;
