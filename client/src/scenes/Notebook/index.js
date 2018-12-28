import React from 'react';
import NotebookEditor from './components/NotebookEditor';
import NameSection from './components/NameSection';

const Notebook = () => (
  <div className="row mt-5">
    <div className="col-6 offset-1">
      <NotebookEditor />
    </div>
    <div className="col-3 offset-2">
      <NameSection />
    </div>
  </div>
);

export default Notebook;
