import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import Octicon from 'react-octicon'

import css from './MarkdownTypes.scss'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import theme from 'react-syntax-highlighter/dist/styles/tomorrow'

registerLanguage('javascript', javascript)
registerLanguage('json', json)

export const Code = ({ literal, inline }) => (
  <code style={{
    padding: 4,
    backgroundColor: '#fafafa',
    fontFamily: 'Consolas'
  }}>
    {literal}
  </code>
)

export const CodeBlock = ({ language, literal, setCode }) => (
  <div className={css.codeBlock}>

    <button
      className={css.button}
      onClick={() => setCode(literal)}
    >
      <span className={css.label}>Load code into editor</span>
      <Octicon className={css.icon} name='repo-push' />
    </button>

    <SyntaxHighlighter
      language={language}
      style={theme}
      customStyle={{
        margintop: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fafafa',
        fontFamily: 'Consolas',
        lineHeight: '20px',
      }}
      lineNumberStyle={{
        color: '#ddd',
        float: 'left',
        paddingRight: 10,
      }}
      showLineNumbers
      >
        {literal}
      </SyntaxHighlighter>
  </div>
)
