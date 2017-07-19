import React from 'react'
import Flex from 'flex-component'
import Switch from 'react-flexible-switch'
import Pinky from 'react-pinky-promise'
import ReactMarkdown from 'react-markdown'
import Octicon from 'react-octicon'
import { MoonLoader } from 'halogen'
import Link from 'react-router/Link'

import Editor from 'components/Editor/Editor'
import * as MarkdownTypes from 'components/MarkdownTypes/MarkdownTypes.js'

import css from './Rule.scss'

const isPositionStickySupported = () => {
  const element = document.createElement('div')
  element.style.cssText = 'position: sticky'
  return element.style.position === 'sticky'
}

export default class Rule extends React.Component {

  scrollIntoView(node) {
    const canSticky = isPositionStickySupported()
    setTimeout(() => (
      node.parentElement.parentElement.scrollTop = node.offsetTop - (canSticky ? 50 : 0)
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
              {({ resolved, rejected }) => {
                if (resolved) {
                  return (
                    <ReactMarkdown
                      source={resolved}
                      renderers={{
                        ...MarkdownTypes,
                        CodeBlock: props => React.createElement(MarkdownTypes.CodeBlock, { setCode, ...props })
                      }}
                    />
                  )
                } else if (rejected) {
                  return (
                    <Flex direction='column' style={{ height: '100vh' }} alignItems='center' justifyContent='center'>
                      <div style={{ color: '#4B32C3', fontSize: 60 }}>:(</div>
                      <div style={{ marginTop: 30 }}>Something went wrong, please try again later.</div>
                    </Flex>
                  )
                } else {
                  return (
                    <Flex direction='column' style={{ height: 200 }} alignItems='center' justifyContent='center'>
                      <MoonLoader color='#4B32C3' />
                      <div style={{ marginTop: 30 }}>Loading docs</div>
                    </Flex>
                  )
                }
              }}
            </Pinky>
          </div>
        }
      </div>
    )
  }
}
