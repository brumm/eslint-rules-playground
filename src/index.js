import 'css/global.scss'

import React from 'react'
import { render } from 'react-dom'
import Pinky from 'react-pinky-promise'
import Flex from 'flex-component'
import { MoonLoader } from 'halogen'
import Router from 'react-router/BrowserRouter'

import App from 'components/App'
import mockPromise from 'mock'

const fetchJSON = url => fetch(url).then(response => response.json())

const fetchPromise = process.env.NODE_ENV === 'development'
  ? mockPromise
  : Promise.all([
    fetchJSON('https://runkit.io/brumm/serve-eslint-rules-fixed/branches/master/defaults'),
    fetchJSON('https://runkit.io/brumm/serve-eslint-rules-fixed/branches/master/rules'),
  ])

render(
  <Router>
    <Pinky promise={fetchPromise}>
        {({ resolved }) => {
          if (resolved) {
            const [
              defaults,
              ruleDefinitions
            ] = resolved

            const {
              rules: defaultRuleConfig,
              ...defaultLinterConfig
            } = defaults

            return (
              <App
                defaultRuleConfig={defaultRuleConfig}
                defaultLinterConfig={defaultLinterConfig}
                ruleDefinitions={ruleDefinitions}
              />
            )
          } else {
              return (
                <Flex direction='column' style={{ height: '100vh' }} alignItems='center' justifyContent='center'>
                  <MoonLoader color='#777777' />
                  <div style={{ marginTop: 30 }}>Fetching latest eslint rules...</div>
                </Flex>
              )
          }
        }}
    </Pinky>
  </Router>,
  document.querySelector('#app')
)
