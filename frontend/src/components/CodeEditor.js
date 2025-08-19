import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

function CodeEditor({ initialCode = '', language = 'javascript', onCodeChange }) {
    const [code, setCode] = useState(initialCode);

    const handleEditorChange = (value) => {
        setCode(value);
        if (onCodeChange) {
            onCodeChange(value);
        }
    };

    const handleEditorDidMount = (editor, monaco) => {
        // Editor mounted successfully
    };

    return (
        <div className="code-editor" style={{height: '100%', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0}}>
            <MonacoEditor
                height="100%"
                language={language}
                value={code}
                defaultValue={initialCode}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    tabSize: 2,
                    automaticLayout: true,
                    scrollbar: { vertical: 'auto', horizontal: 'auto' },
                    overviewRulerLanes: 0,
                    renderLineHighlight: 'none',
                    renderIndentGuides: false,
                    folding: false,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    border: 'none',
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    cursorBlinking: 'blink',
                    cursorStyle: 'line',
                    background: 'transparent',
                }}
                style={{background: 'transparent', border: 'none', boxShadow: 'none', height: '100%'}}
            />
        </div>
    );
}

export default CodeEditor;
