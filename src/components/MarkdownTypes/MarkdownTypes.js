import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import Octicon from 'react-octicon'
import RouterLink from 'react-router/Link'

import css from './MarkdownTypes.scss'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import theme from 'react-syntax-highlighter/dist/styles/tomorrow'

registerLanguage('xml', xml)
registerLanguage('javascript', javascript)
registerLanguage('json', json)

const isAbsolute = new RegExp('^([a-z]+://|//)', 'i')

export const Link = ({ href = '', title, children }) =>
  !isAbsolute.test(href) &&
  href.endsWith('.md') ? (
    <RouterLink to={href.slice(0, -3)}>
      {children}
    </RouterLink>
  ) : (
    <a href={href} title={title} target='_blank' rel='noopener'>
      {children}
    </a>
  )

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
