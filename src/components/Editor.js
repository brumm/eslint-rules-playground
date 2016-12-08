import React from 'react'
import CodeMirror from 'react-codemirror'

import 'react-codemirror/node_modules/codemirror/mode/javascript/javascript'
import 'react-codemirror/node_modules/codemirror/lib/codemirror.css'

import 'react-codemirror/node_modules/codemirror/addon/lint/lint.css'
import 'react-codemirror/node_modules/codemirror/addon/lint/lint'


function getSeverity(error) {
  switch (error.severity) {
    case 1:
      return 'warning'
    case 2:
      return 'error'
    default:
      return 'error'
  }
}

function getPos(error, from) {
  var line = error.line - 1,
    ch = from
      ? error.column
      : error.column + 1
  if (error.node && error.node.loc) {
    line = from
      ? error.node.loc.start.line - 1
      : error.node.loc.end.line - 1
    ch = from
      ? error.node.loc.start.column
      : error.node.loc.end.column
  }
  return { line, ch }
}

export default class Editor extends React.Component {

  onCodeMirrorInstance = component => {
    if (component !== null) {
      this.codeMirror = component.getCodeMirror()
      component.getCodeMirrorInstance().registerHelper(
        'lint', 'javascript', this.lint
      )
    }
  }

  componentDidUpdate() {
    const cursor = this.codeMirror.getCursor()
    this.codeMirror.setValue(
      this.codeMirror.getValue()
    )
    this.codeMirror.setCursor(cursor)
  }

  get lint() {
    return text => (
      window.eslint.verify(text, {
        parserOptions: {
          ecmaVersion: 6,
          sourceType: module,
          ecmaFeatures: {
              jsx: true
          }
        },
        rules: this.props.activeRuleConfig
      }).map(error => ({
        message: `${error.ruleId || 'Error'}: ${error.message}`,
        severity: getSeverity(error),
        from: getPos(error, true),
        to: getPos(error, false)
      }))
    )
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
    }

    return (
      <CodeMirror
        ref={this.onCodeMirrorInstance}
        value={this.props.value}
        onChange={this.props.onChange}
        options={options}
      />
    )
  }
}
