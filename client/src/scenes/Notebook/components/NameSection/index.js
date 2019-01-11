import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './NameSection.module.scss';
import NotebookIcon from '../../../../components/icons/NotebookIcon';

const NameSection = ({ name }) => (
  <React.Fragment>
    <div className="row align-items-center no-gutters">
      <div className="col-1"><NotebookIcon /></div>
      <input
        className={`col-7 form-control form-control-lg ls-1 ${styles.nameInput}`}
        type="text"
        placeholder="Notebook #1"
        value={name}
      />
    </div>
    <div className="row">
      <div className="col"><hr /></div>
    </div>
  </React.Fragment>
);

NameSection.defaultProps = {
  name: '',
};

NameSection.propTypes = {
  name: PropTypes.string,
};

const mapStateToProps = state => ({
  name: state.notebook.name,
});

export default connect(mapStateToProps)(NameSection);
