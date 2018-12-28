import React from 'react';
import styles from './NameSection.module.scss';

const NameSection = () => (
  <React.Fragment>
    <div className="row">
      <input
        className={`col-8 form-control form-control-lg ${styles.nameInput}`}
        type="text"
        placeholder="Notebook name"
      />
    </div>
    <div className="row">
      <div className="col"><hr /></div>
    </div>
  </React.Fragment>
);

export default NameSection;
