import React from 'react';
import AppNavbar from './components/AppNavbar';
import Notebook from './scenes/Notebook';

const App = () => (
  <div className="App min-vh-100">
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <AppNavbar />
      <Notebook />
    </div>
  </div>
);

export default App;
