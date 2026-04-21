"use client"
import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

type Props = {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  style?: React.CSSProperties
  duration?: number
}

export default function CounterReveal({ value, suffix = '', prefix = '', className, style, duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20, duration: duration * 1000 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionVal.set(value)
    }
  }, [isInView, value, motionVal])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v: number) => {
      setDisplay(Math.round(v))
    })
    return unsubscribe
  }, [spring])

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', ...style }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {prefix}{display}{suffix}
    </motion.span>
  )
}
