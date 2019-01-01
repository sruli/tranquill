import React from 'react';
import styles from './NameSection.module.scss';
import NotebookIcon from '../../../../components/icons/NotebookIcon';

const NameSection = () => (
  <React.Fragment>
    <div className="row align-items-center no-gutters">
      <div className="col-1"><NotebookIcon /></div>
      <input
        className={`col-7 form-control form-control-lg ls-1 ${styles.nameInput}`}
        type="text"
        placeholder="Notebook #1"
      />
    </div>
    <div className="row">
      <div className="col"><hr /></div>
    </div>
  </React.Fragment>
);

export default NameSection;
