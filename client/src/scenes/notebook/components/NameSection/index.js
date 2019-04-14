import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import styles from './NameSection.module.scss';
import NotebookIcon from '../../../../components/icons/NotebookIcon';
import { getNotebookName } from '../../reducer';

const NameSection = ({ name, intl }) => (
  <React.Fragment>
    <div className="row align-items-center no-gutters">
      <div className="col-1"><NotebookIcon /></div>
      <input
        className={`col-7 form-control form-control-lg ls-1 ${styles.nameInput}`}
        type="text"
        placeholder={intl.formatMessage({ id: 'notebook.namePlaceholder' })}
        value={name}
        onChange={() => {}}
      />
    </div>
    <div className="row">
      <div className="col"><hr /></div>
    </div>
  </React.Fragment>
);

NameSection.propTypes = {
  name: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = state => ({
  name: getNotebookName(state),
});

export default connect(mapStateToProps)(injectIntl(NameSection));
