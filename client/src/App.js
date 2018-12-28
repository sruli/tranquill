import React from 'react';
import AppNavbar from './components/AppNavbar';
import Notebook from './scenes/Notebook';

const App = () => (
  <div className="App">
    <div className="container-fluid">
      <AppNavbar />
      <Notebook />
    </div>
  </div>
);

export default App;
