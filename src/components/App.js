import React from 'react'
import Flex from 'flex-component'
import SimpleInput from 'react-simple-input'
import Switch from 'react-flexible-switch'

import CodeMirror from 'react-codemirror'

import 'react-codemirror/node_modules/codemirror/mode/javascript/javascript'
import 'react-codemirror/node_modules/codemirror/lib/codemirror.css'


import Editor from 'components/Editor'
import RulesContainer from 'components/RulesContainer/RulesContainer'

import css from './App.scss'


class App extends React.Component {
  state = {
    filterText: '',
    localLinterConfig: {},
    localRuleConfig: {},
    editorValue: `var foo = "bar"`,
    showEditor: true,
  }

  updateCode = editorValue => this.setState({ editorValue })

  onToggleRule = (ruleId, active) => {
    this.setState({
      localRuleConfig: {
        ...this.state.localRuleConfig,
        [ruleId]: active ? 'error' : 'off'
      }
    })
  }

  render() {
    const {
      defaultRuleConfig,
      defaultLinterConfig,
      ruleDefinitions
    } = this.props

    const {
      showEditor
    } = this.state

    // merge default rule config and local rule config
    const activeRuleConfig = {
      ...defaultRuleConfig,
      ...this.state.localRuleConfig,
    }

    return (
      <Flex direction='column' className={css.app}>

        <Flex shrink={0} className={css.header}>

          <Flex justifyContent='center' style={{ width: '50vw', padding: '0 10px' }} alignItems='center'>
              <div onClick={() => this.setState({ showEditor: false })}>Eslint Config</div>
              <Switch
                value={showEditor}
                circleStyles={{ diameter: 15 }}
                switchStyles={{ width: 35, padding: 3, borderColor: '#DDDDDD', margin: '0 20px' }}
                onChange={showEditor => this.setState({ showEditor })}
              />
              <div onClick={() => this.setState({ showEditor: true })}>Example Code</div>
          </Flex>

          <SimpleInput
            clearButton
            changeTimeout={200}
            classNameContainer={css.searchContainer}
            className={css.search}
            placeholder='Filter...'
            defaultValue={this.state.filterText}
            onChange={({ target: { value: filterText }}) => this.setState({ filterText })}
            type='text'
          />
        </Flex>

        <Flex>
          {showEditor ? (
            <Editor
              value={this.state.editorValue}
              onChange={this.updateCode}
              activeRuleConfig={activeRuleConfig}
            />
          ) : (
            <CodeMirror
              value={JSON.stringify(activeRuleConfig, null, '  ')}
              options={{
                lineNumbers: true,
                readOnly: true,
                mode: 'javascript',
              }}
            />
          )}

          <Flex className={css.rules} direction='column'>
            <RulesContainer
              ruleDefinitions={ruleDefinitions}
              activeRuleConfig={activeRuleConfig}
              filterText={this.state.filterText}
              onToggleRule={this.onToggleRule}
              setCode={this.updateCode}
            />
          </Flex>
        </Flex>

      </Flex>
    )
  }
}

export default App
