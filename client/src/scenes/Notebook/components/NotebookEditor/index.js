import React from 'react';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import { enforceCursorLocation } from '../../../../utils/cursorUtils';
import 'draft-js/dist/Draft.css';
import styles from './NotebookEditor.module.scss';
import './DraftEditorStyles.scss';

class NotebookEditor extends React.Component {
  static keyBindingFn(e) {
    enforceCursorLocation();
    return getDefaultKeyBinding(e);
  }

  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
    this.draftEditor = React.createRef();
  }

  componentDidMount() {
    this.draftEditor.current.focus();
  }

  render() {
    const { editorState } = this.state;

    return (
      <div className={`${styles.editor} pb-5 h-100 ls-1`}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          placeholder="Start typing something…"
          keyBindingFn={NotebookEditor.keyBindingFn}
          ref={this.draftEditor}
          spellCheck
        />
      </div>
    );
  }
}

export default NotebookEditor;
