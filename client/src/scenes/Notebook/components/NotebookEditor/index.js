import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import { enforceCursorLocation } from '../../../../utils/cursorUtils';
import 'draft-js/dist/Draft.css';
import styles from './NotebookEditor.module.scss';
import './DraftEditorStyles.scss';
import { getEditorState } from '../../reducer';
import { editorChanged } from '../../actions';

class NotebookEditor extends React.Component {
  static keyBindingFn(e) {
    enforceCursorLocation();
    return getDefaultKeyBinding(e);
  }

  constructor(props) {
    super(props);
    this.draftEditor = React.createRef();
  }

  componentDidMount() {
    this.draftEditor.current.focus();
  }

  render() {
    const { editorState, onEditorChange } = this.props;

    return (
      <div className={`${styles.editor} pb-5 h-100 ls-1`}>
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          placeholder="Start typing something…" // i18n!
          keyBindingFn={NotebookEditor.keyBindingFn}
          ref={this.draftEditor}
          spellCheck
        />
      </div>
    );
  }
}

NotebookEditor.propTypes = {
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  onEditorChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  editorState: getEditorState(state),
});

const mapDispatchToProps = dispatch => ({
  onEditorChange: editorState => dispatch(editorChanged(editorState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotebookEditor);
