import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppNavbar from '../../../components/AppNavbar';
import NotebookEditor from './NotebookEditor';
import NameSection from './NameSection';
import { getLoadMoreUrl } from '../reducer';
import { loadMoreContent } from '../actions';
import styles from './Notebook.module.scss';

// TODO: see if I can move the load more functionality to the NotebookEditor component
const Notebook = ({ loadMoreUrl, onPageTopScroll }) => {
  useEffect(() => {
    const loadMoreContentListener = () => {
      if (window.pageYOffset === 0 && loadMoreUrl != null) {
        onPageTopScroll(loadMoreUrl);
      }
    };

    window.addEventListener('scroll', loadMoreContentListener);
    return () => window.removeEventListener('scroll', loadMoreContentListener);
  });

  return (
    <React.Fragment>
      <AppNavbar />

      <div className={`container-fluid min-vh-100 d-flex flex-column ${styles.notebook}`}>
        <div className="row mt-5 flex-grow-1">
          <div className="col-7 offset-1">
            <NotebookEditor />
          </div>
          <div className={`col-3 position-fixed ${styles.sideBar}`}>
            <NameSection />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

Notebook.defaultProps = {
  loadMoreUrl: null,
};

Notebook.propTypes = {
  loadMoreUrl: PropTypes.string,
  onPageTopScroll: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loadMoreUrl: getLoadMoreUrl(state),
});

const mapDispatchToProps = dispatch => ({
  onPageTopScroll: loadMoreUrl => dispatch(loadMoreContent(loadMoreUrl)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notebook);
