import React from 'react';
import { Route } from 'react-router-dom';
import Notebook from './scenes/Notebook';

const App = () => (
  <div className="min-vh-100">
    <Route path="/notebooks/:id" component={Notebook} />
  </div>
);

export default App;
