import React from 'react';
import { Route } from 'react-router-dom';
import Notebook, { SCENE_PATH as notebookPath } from './scenes/notebook';

const App = () => (
  <div className="min-vh-100">
    <Route path={notebookPath} component={Notebook} />
  </div>
);

export default App;
