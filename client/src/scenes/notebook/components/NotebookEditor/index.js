import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import enforceCursorLocation from '../../../../utilities/cursorUtils';
import 'draft-js/dist/Draft.css';
import styles from './NotebookEditor.module.scss';
import './DraftEditorStyles.scss';
import { getEditorState } from '../../reducer';
import { editorChanged } from '../../actions';

class NotebookEditor extends React.Component {
  static keyBindingFn(e) {
    enforceCursorLocation(e);
    return getDefaultKeyBinding(e);
  }

  render() {
    const { editorState, triggerEditorChange } = this.props;

    if (editorState) {
      return (
        <div className={`${styles.editor} pb-5 h-100 ls-1`}>
          <Editor
            editorState={editorState}
            onChange={triggerEditorChange}
            placeholder="Start typing something…" // i18n!
            keyBindingFn={NotebookEditor.keyBindingFn}
            spellCheck
          />
        </div>
      );
    }

    return null;
  }
}

NotebookEditor.defaultProps = {
  editorState: null,
};

NotebookEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  triggerEditorChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  editorState: getEditorState(state),
});

const mapDispatchToProps = dispatch => ({
  triggerEditorChange: editorState => dispatch(editorChanged(editorState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotebookEditor);
