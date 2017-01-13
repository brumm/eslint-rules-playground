import React from 'react'
import Flex from 'flex-component'
import Switch from 'react-flexible-switch'
import Pinky from 'react-pinky-promise'
import FluidContainer from 'react-fluid-container'
import ReactMarkdown from 'react-markdown'
import Octicon from 'react-octicon'
import { MoonLoader } from 'halogen'
import Link from 'react-router/Link'

import Editor from 'components/Editor/Editor'
import * as MarkdownTypes from 'components/MarkdownTypes/MarkdownTypes.js'

import css from './Rule.scss'

export default class Rule extends React.Component {

  scrollIntoView(node) {
    node = node && node._reactInternalInstance._renderedComponent._hostNode
    this.props.isExpanded && node && node.scrollIntoView && node.scrollIntoView()
  }

  shouldComponentUpdate({ isExpanded, isActive, ruleValue}) {
    return (
      this.props.ruleValue !== ruleValue ||
      this.props.isExpanded !== isExpanded ||
      this.props.isExpanded !== isExpanded ||
      this.props.isActive !== isActive
    )
  }

  fetchDocs(id) {
    return fetch(`https://cdn.rawgit.com/eslint/eslint/master/docs/rules/${id}.md`)
      .then(res => res.text())
  }

  render() {
    const {
      rule: {
        id: name,
        docs,
        schema,
      },
      ruleValue,
      isActive,
      isExpanded,
      onToggleRule,
      setCode,
    } = this.props

    return (
      <div className={css.container}>
        <Flex className={css.header} ref={node => this.scrollIntoView(node)}>
          <Switch
            onChange={active => onToggleRule(name, active)}
            circleStyles={{ diameter: 15 }}
            switchStyles={{ width: 35, padding: 3, borderColor: '#DDDDDD' }}
            value={isActive}
          />
          <Link to={`/${isExpanded ? '' : name}`} className={css.header}>
            <Flex
              alignItems='center'
              style={{
                height: '100%',
                marginLeft: 20, flexGrow: 1,
                opacity: isActive ? 1 : 0.5,
              }}
            >
              {name}
              {docs.recommended &&
                <Octicon style={{ marginLeft: 10, color: '#DDDDDD' }} name='thumbsup' />
              }
            </Flex>
          </Link>
          <Octicon style={{ color: '#DDDDDD' }} name={isExpanded ? 'dash' : 'plus'} />
        </Flex>

        {isExpanded &&
          <div className={css.body}>

            {/* <Editor
              className={css.miniEditor}
              value={JSON.stringify(ruleValue, null, 2)}
              options={{
                lineNumbers: false
              }}
            /> */}

            <Pinky promise={this.fetchDocs(name)}>
              {({ resolved }) => resolved ? (
                <ReactMarkdown
                  source={resolved}
                  renderers={{
                    ...MarkdownTypes,
                    CodeBlock: props => React.createElement(MarkdownTypes.CodeBlock, { setCode, ...props })
                  }}
                />
              ) : (
                <Flex direction='column' style={{ height: 200 }} alignItems='center' justifyContent='center'>
                  <MoonLoader color='#777777' />
                </Flex>
              )}
            </Pinky>
          </div>
        }
      </div>
    )
  }
}
