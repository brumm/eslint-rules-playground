import React from 'react'
import css from './GithubBadge.scss'

export default ({ href, target , children }) => (
  <a href={href} target={target} className={css.githubBadge}>
    {children}
  </a>
)
