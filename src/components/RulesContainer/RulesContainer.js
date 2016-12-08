import React from 'react'
import groupBy from 'lodash/groupBy'
import isEqual from 'lodash/isEqual'

import Rule from 'components/Rule'

import css from './RulesContainer.scss'

export default class RulesContainer extends React.Component {

  shouldComponentUpdate({ activeRuleConfig, filterText }) {
    return (
      !isEqual(this.props.activeRuleConfig, activeRuleConfig) ||
      !isEqual(this.props.filterText, filterText)
    )
  }

  render() {
    const {
      ruleDefinitions,
      activeRuleConfig,
      filterText,
      onToggleRule,
      setCode,
    } = this.props
    const groupedRules = groupBy(ruleDefinitions, 'docs.category')

    return (
      <div className={css.scrollContainer}>
        {Object.keys(groupedRules).map(label => {
          const subRules = groupedRules[label]
            .filter(({ id }) => id.includes(filterText))

          if (subRules.length) {
            return (
              <div key={label}>
                <div className={css.label}>{label}</div>
                {subRules.map(rule => (
                  <Rule
                    isActive={activeRuleConfig[rule.id] !== 'off'}
                    onToggleRule={onToggleRule}
                    key={rule.id}
                    rule={rule}
                    setCode={setCode}
                  />
                ))}
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
    )

  }
}
