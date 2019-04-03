import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import enforceCursorLocation from '../../../../utilities/cursorUtils';
import 'draft-js/dist/Draft.css';
import styles from './NotebookEditor.module.scss';
import './DraftEditorStyles.scss';
import { getEditorState, getOffset } from '../../reducer';
import { editorChanged } from '../../actions';

const keyBindingFn = function keyBindingFn(e) {
  enforceCursorLocation(e);
  return getDefaultKeyBinding(e);
};

const NotebookEditor = ({ editorState, offset, triggerEditorChange }) => (
  editorState && (
    <div className={`${styles.editor} pb-5 h-100 ls-1`}>
      <Editor
        editorState={editorState}
        onChange={newEditorState => triggerEditorChange(newEditorState, offset)}
        placeholder="Start typing something…" // i18n!
        keyBindingFn={keyBindingFn}
        spellCheck
      />
    </div>
  )
);

NotebookEditor.defaultProps = {
  editorState: null,
  offset: null,
};

NotebookEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  triggerEditorChange: PropTypes.func.isRequired,
  offset: PropTypes.number,
};

const mapStateToProps = state => ({
  editorState: getEditorState(state),
  offset: getOffset(state),
});

const mapDispatchToProps = dispatch => ({
  triggerEditorChange: (editorState, offset) => {
    dispatch(editorChanged(editorState, offset));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotebookEditor);
