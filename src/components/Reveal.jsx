import { useScrollReveal } from '../hooks/useScrollReveal'

function Reveal({ as: Tag = 'div', direction = 'up', delay = 0, once = true, className = '', children, ...rest }) {
  const [ref, visible] = useScrollReveal({ once })
  const classes = ['reveal', `reveal-${direction}`, visible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={classes} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

export default Reveal
