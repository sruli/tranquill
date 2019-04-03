import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import enforceCursorLocation from '../../../../utilities/cursorUtils';
import 'draft-js/dist/Draft.css';
import styles from './NotebookEditor.module.scss';
import './DraftEditorStyles.scss';
import { getEditorState, getOffset, getLoadMoreUrl, getLoadingBusy } from '../../reducer';
import { editorChanged, loadMoreContent } from '../../actions';

const loadMoreOffset = 100;

const keyBindingFn = function keyBindingFn(e) {
  enforceCursorLocation(e);
  return getDefaultKeyBinding(e);
};

const NotebookEditor = ({
  editorState,
  offset,
  triggerEditorChange,
  loadMoreUrl,
  onPageTopScroll,
  loadingBusy,
}) => {
  useEffect(() => {
    const loadMoreContentListener = () => {
      if (window.pageYOffset <= loadMoreOffset && loadMoreUrl != null && !loadingBusy) {
        onPageTopScroll(loadMoreUrl);
      }
    };

    window.addEventListener('scroll', loadMoreContentListener);
    return () => window.removeEventListener('scroll', loadMoreContentListener);
  });

  return editorState && (
    <div className={`${styles.editor} pb-5 h-100 ls-1`}>
      <Editor
        editorState={editorState}
        onChange={newEditorState => triggerEditorChange(newEditorState, offset)}
        placeholder="Start typing something…" // i18n!
        keyBindingFn={keyBindingFn}
        spellCheck
      />
    </div>
  );
};

NotebookEditor.defaultProps = {
  editorState: null,
  offset: null,
  loadMoreUrl: null,
};

NotebookEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  triggerEditorChange: PropTypes.func.isRequired,
  offset: PropTypes.number,
  loadMoreUrl: PropTypes.string,
  loadingBusy: PropTypes.bool.isRequired,
  onPageTopScroll: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  editorState: getEditorState(state),
  offset: getOffset(state),
  loadMoreUrl: getLoadMoreUrl(state),
  loadingBusy: getLoadingBusy(state),
});

const mapDispatchToProps = dispatch => ({
  triggerEditorChange: (editorState, offset) => {
    dispatch(editorChanged(editorState, offset));
  },
  onPageTopScroll: (loadMoreUrl) => {
    dispatch(loadMoreContent(loadMoreUrl));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotebookEditor);
