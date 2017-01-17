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
    setTimeout(() => (
      node.parentElement.parentElement.scrollTop = node.offsetTop - 99
    ), 50)
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
        deprecated: isDeprecated,
      },
      ruleValue,
      isActive,
      isExpanded,
      onToggleRule,
      setCode,
    } = this.props

    return (
      <div className={css.container} ref={node => this.props.isExpanded && node && this.scrollIntoView(node)}>
        <Flex className={css.header}>
          <Switch
            onChange={active => onToggleRule(name, active)}
            circleStyles={{ diameter: 15, onColor: '#4B32C3' }}
            switchStyles={{ width: 35, padding: 3, borderColor: '#DDDDDD' }}
            value={isActive}
          />

          <Link to={`/${isExpanded ? '' : name}`} className={css.link}>
            <Flex alignItems='center' grow={1} className={css.nameContainer}>
              <div className={ isDeprecated ? css.nameDeprecated : '' }>
                {name}
              </div>
              {isDeprecated && docs.replacedBy.length > 0 &&
                <div>
                  <Octicon name='arrow-right' style={{ margin: '0 10px' }} />
                  {docs.replacedBy.join(', ')}
                </div>
              }
            </Flex>

            {docs.recommended &&
              <Octicon name='thumbsup' className={css.recommended} />
            }
            <Octicon className={css.expando} name={isExpanded ? 'chevron-up' : 'chevron-down'} />
          </Link>
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
                  <div style={{ marginTop: 10 }}>Loading docs</div>
                </Flex>
              )}
            </Pinky>
          </div>
        }
      </div>
    )
  }
}
