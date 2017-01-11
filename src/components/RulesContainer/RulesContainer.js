import React from 'react'
import groupBy from 'lodash/groupBy'
import isEqual from 'lodash/isEqual'

import Rule from 'components/Rule'

import css from './RulesContainer.scss'

export default class RulesContainer extends React.Component {

  shouldComponentUpdate({ activeRuleConfig, filterText, expandedId }) {
    return (
      this.props.expandedId !== expandedId ||
      this.props.filterText !== filterText ||
      !isEqual(this.props.activeRuleConfig, activeRuleConfig)
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
            .filter(({ id, docs: { category }}) => (
              id.toLowerCase().includes(filterText.toLowerCase()) ||
              category.toLowerCase().includes(filterText.toLowerCase())
            ))

          if (subRules.length) {
            return (
              <div key={label}>
                <div className={css.label}>{label}</div>
                {subRules.map(rule => (
                  <Rule
                    key={rule.id}
                    isActive={activeRuleConfig[rule.id] !== 'off'}
                    isExpanded={this.props.expandedId === rule.id}
                    expandSection={expandedId => this.toggleSection(expandedId)}
                    onToggleRule={onToggleRule}
                    rule={rule}
                    ruleValue={activeRuleConfig[rule.id]}
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
