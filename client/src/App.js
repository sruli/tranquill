import React from 'react';
import { Route } from 'react-router-dom';
import Notebook, { PATH as notebookPath } from './scenes/Notebook';

const App = () => (
  <div className="min-vh-100">
    <Route path={notebookPath} component={Notebook} />
  </div>
);

export default App;
