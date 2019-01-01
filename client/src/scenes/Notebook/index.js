import React from 'react';
import AppNavbar from '../../components/AppNavbar';
import NotebookEditor from './components/NotebookEditor';
import NameSection from './components/NameSection';
import styles from './Notebook.module.scss';

const Notebook = () => (
  <React.Fragment>
    <AppNavbar />

    <div className={`container-fluid min-vh-100 d-flex flex-column ${styles.notebook}`}>
      <div className="row mt-5 flex-grow-1">
        <div className="col-6 offset-1">
          <NotebookEditor />
        </div>
        <div className={`col-3 offset-2 position-fixed ${styles.sideBar}`}>
          <NameSection />
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default Notebook;
