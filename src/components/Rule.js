import React from 'react'
import Flex from 'flex-component'
import Switch from 'react-flexible-switch'
import Pinky from 'react-pinky-promise'
import FluidContainer from 'react-fluid-container'
import ReactMarkdown from 'react-markdown'
import Octicon from 'react-octicon'
import { MoonLoader } from 'halogen'

import * as MarkdownTypes from 'components/MarkdownTypes/MarkdownTypes.js'

import css from './Rule.scss'

export default class Rule extends React.Component {
  state = {
    isExpanded: false
  }

  renderScheme(scheme) {
  }

  fetchDocs(id) {
    return fetch(`https://raw.githubusercontent.com/eslint/eslint/master/docs/rules/${id}.md`)
      .then(res => res.text())
  }

  render() {
    const { isExpanded } = this.state
    const {
      rule: {
        id,
        docs,
        schema
      },
      isActive,
      onToggleRule,
      setCode,
    } = this.props

    return (
      <div className={css.container}>
        <Flex
          className={css.header}
          alignItems='center'
        >
          <Switch
            onChange={active => onToggleRule(id, active)}
            circleStyles={{ diameter: 15 }}
            switchStyles={{ width: 35, padding: 3, borderColor: '#DDDDDD' }}
            value={isActive}
          />
          <Flex
            alignItems='center'
            style={{
              height: '100%',
              marginLeft: 20, flexGrow: 1,
              opacity: isActive ? 1 : 0.5,
            }}
            onClick={() => this.setState({ isExpanded: !isExpanded })}
          >
            {id}
            {docs.recommended &&
              <Octicon style={{ marginLeft: 10, color: '#DDDDDD' }} name='thumbsup' />
            }
          </Flex>

          <Octicon style={{ color: '#DDDDDD' }} name={isExpanded ? 'dash' : 'plus'} />
        </Flex>

        {isExpanded &&
          <Pinky promise={this.fetchDocs(id)}>
            {({ resolved }) => resolved ? (
              <ReactMarkdown
                className={css.body}
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
        }
      </div>
    )
  }
}
