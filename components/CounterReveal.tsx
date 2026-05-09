"use client"
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  style?: React.CSSProperties
  duration?: number
}

// Static reveal: shows the real number immediately. The previous count-up
// animation could leave the value stuck at "0+" if useInView didn't fire,
// which is worse than no animation at all. We keep the entrance fade/slide.
export default function CounterReveal({ value, suffix = '', prefix = '', className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {prefix}{value}{suffix}
    </motion.span>
  )
}
