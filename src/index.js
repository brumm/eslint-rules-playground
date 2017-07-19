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
// const isDev = process.env.NODE_ENV === 'development'
const isDev = false

const fetchPromise = isDev
  ? mockPromise
  : Promise.all([
    fetchJSON('https://runkit.io/brumm/serve-eslint-rules-fixed/branches/master/defaults'),
    fetchJSON('https://runkit.io/brumm/serve-eslint-rules-fixed/branches/master/rules'),
  ])

render(
  <Router>
    <Pinky promise={fetchPromise}>
        {({ resolved, rejected }) => {
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
          } else if (rejected) {
            return (
              <Flex direction='column' style={{ height: '100vh' }} alignItems='center' justifyContent='center'>
                Something went wrong, please try again later.
              </Flex>
            )
          } else {
              return (
                <Flex direction='column' style={{ height: '100vh' }} alignItems='center' justifyContent='center'>
                  <MoonLoader color='#4B32C3' />
                  <div style={{ marginTop: 30 }}>Fetching latest eslint rules...</div>
                </Flex>
              )
          }
        }}
    </Pinky>
  </Router>,
  document.querySelector('#app')
)
