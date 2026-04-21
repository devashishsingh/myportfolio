"use client"
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  style?: React.CSSProperties
  delay?: number
  by?: 'word' | 'char'
  once?: boolean
}

export default function TextReveal({
  children,
  as: Tag = 'h2',
  className,
  style,
  delay = 0,
  by = 'word',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-80px' })
  const [tokens, setTokens] = useState<string[]>([])

  useEffect(() => {
    if (by === 'char') {
      setTokens(children.split(''))
    } else {
      setTokens(children.split(' '))
    }
  }, [children, by])

  return (
    <Tag ref={ref as any} className={className} style={{ ...style, overflow: 'hidden' }}>
      {tokens.map((token, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: delay + i * (by === 'char' ? 0.025 : 0.06),
            }}
          >
            {token}{by === 'word' && i < tokens.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
