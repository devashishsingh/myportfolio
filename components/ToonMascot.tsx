"use client"
import { motion } from 'framer-motion'

type MascotMood = 'wave' | 'think' | 'celebrate' | 'point-right' | 'point-down' | 'cool' | 'rocket'

interface Props {
  mood?: MascotMood
  size?: number
  className?: string
  style?: React.CSSProperties
}

// A friendly cartoon character (simple geometric toon) with different moods
export default function ToonMascot({ mood = 'wave', size = 80, className, style }: Props) {
  const s = size
  const headR = s * 0.28
  const bodyW = s * 0.3
  const cx = s / 2
  const cy = s / 2

  return (
    <motion.svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      className={className}
      style={style}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
    >
      {/* Body */}
      <ellipse cx={cx} cy={cy + headR * 1.1} rx={bodyW * 0.55} ry={headR * 0.8} fill="#1a1a1a" />

      {/* Head */}
      <circle cx={cx} cy={cy - headR * 0.3} r={headR} fill="#FFD93D" stroke="#1a1a1a" strokeWidth={s * 0.025} />

      {/* Eyes */}
      {mood === 'cool' ? (
        <>
          {/* Sunglasses */}
          <rect x={cx - headR * 0.65} y={cy - headR * 0.55} width={headR * 0.5} height={headR * 0.3} rx={headR * 0.08} fill="#1a1a1a" />
          <rect x={cx + headR * 0.15} y={cy - headR * 0.55} width={headR * 0.5} height={headR * 0.3} rx={headR * 0.08} fill="#1a1a1a" />
          <line x1={cx - headR * 0.15} y1={cy - headR * 0.4} x2={cx + headR * 0.15} y2={cy - headR * 0.4} stroke="#1a1a1a" strokeWidth={s * 0.02} />
        </>
      ) : (
        <>
          <circle cx={cx - headR * 0.3} cy={cy - headR * 0.35} r={headR * 0.12} fill="#1a1a1a" />
          <circle cx={cx + headR * 0.3} cy={cy - headR * 0.35} r={headR * 0.12} fill="#1a1a1a" />
          {/* Eye shine */}
          <circle cx={cx - headR * 0.26} cy={cy - headR * 0.4} r={headR * 0.04} fill="#fff" />
          <circle cx={cx + headR * 0.34} cy={cy - headR * 0.4} r={headR * 0.04} fill="#fff" />
        </>
      )}

      {/* Mouth - varies by mood */}
      {(mood === 'wave' || mood === 'point-right' || mood === 'point-down') && (
        <path
          d={`M ${cx - headR * 0.2} ${cy - headR * 0.05} Q ${cx} ${cy + headR * 0.2} ${cx + headR * 0.2} ${cy - headR * 0.05}`}
          stroke="#1a1a1a"
          strokeWidth={s * 0.025}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'celebrate' && (
        <ellipse cx={cx} cy={cy + headR * 0.05} rx={headR * 0.18} ry={headR * 0.15} fill="#1a1a1a" />
      )}
      {mood === 'think' && (
        <>
          <line x1={cx - headR * 0.15} y1={cy} x2={cx + headR * 0.15} y2={cy} stroke="#1a1a1a" strokeWidth={s * 0.025} strokeLinecap="round" />
          {/* Thought bubble */}
          <circle cx={cx + headR * 0.8} cy={cy - headR * 1.0} r={headR * 0.08} fill="#e5e5e5" />
          <circle cx={cx + headR * 1.0} cy={cy - headR * 1.3} r={headR * 0.12} fill="#e5e5e5" />
          <circle cx={cx + headR * 1.1} cy={cy - headR * 1.7} r={headR * 0.2} fill="#e5e5e5" stroke="#ccc" strokeWidth={0.5} />
        </>
      )}
      {mood === 'cool' && (
        <path
          d={`M ${cx - headR * 0.15} ${cy - headR * 0.05} Q ${cx} ${cy + headR * 0.15} ${cx + headR * 0.15} ${cy - headR * 0.05}`}
          stroke="#1a1a1a"
          strokeWidth={s * 0.025}
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Arms - varies by mood */}
      {mood === 'wave' && (
        <motion.g
          animate={{ rotate: [0, 15, -15, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ transformOrigin: `${cx + bodyW * 0.5}px ${cy + headR * 0.7}px` }}
        >
          <line x1={cx + bodyW * 0.5} y1={cy + headR * 0.7} x2={cx + bodyW * 1.1} y2={cy - headR * 0.2} stroke="#1a1a1a" strokeWidth={s * 0.04} strokeLinecap="round" />
          {/* Hand */}
          <circle cx={cx + bodyW * 1.1} cy={cy - headR * 0.2} r={headR * 0.13} fill="#FFD93D" stroke="#1a1a1a" strokeWidth={s * 0.02} />
        </motion.g>
      )}

      {(mood === 'point-right' || mood === 'point-down') && (
        <motion.g
          animate={mood === 'point-right' ? { x: [0, 4, 0] } : { y: [0, 4, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        >
          <line
            x1={cx + bodyW * 0.5}
            y1={cy + headR * 0.7}
            x2={mood === 'point-right' ? cx + bodyW * 1.3 : cx + bodyW * 0.6}
            y2={mood === 'point-right' ? cy + headR * 0.7 : cy + headR * 1.5}
            stroke="#1a1a1a"
            strokeWidth={s * 0.04}
            strokeLinecap="round"
          />
          {/* Pointing finger */}
          <polygon
            points={
              mood === 'point-right'
                ? `${cx + bodyW * 1.3},${cy + headR * 0.55} ${cx + bodyW * 1.55},${cy + headR * 0.7} ${cx + bodyW * 1.3},${cy + headR * 0.85}`
                : `${cx + bodyW * 0.45},${cy + headR * 1.5} ${cx + bodyW * 0.6},${cy + headR * 1.75} ${cx + bodyW * 0.75},${cy + headR * 1.5}`
            }
            fill="#FFD93D"
            stroke="#1a1a1a"
            strokeWidth={s * 0.015}
          />
        </motion.g>
      )}

      {mood === 'celebrate' && (
        <>
          <motion.g
            animate={{ rotate: [0, -20, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
            style={{ transformOrigin: `${cx - bodyW * 0.5}px ${cy + headR * 0.7}px` }}
          >
            <line x1={cx - bodyW * 0.5} y1={cy + headR * 0.7} x2={cx - bodyW * 1.1} y2={cy - headR * 0.5} stroke="#1a1a1a" strokeWidth={s * 0.04} strokeLinecap="round" />
          </motion.g>
          <motion.g
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
            style={{ transformOrigin: `${cx + bodyW * 0.5}px ${cy + headR * 0.7}px` }}
          >
            <line x1={cx + bodyW * 0.5} y1={cy + headR * 0.7} x2={cx + bodyW * 1.1} y2={cy - headR * 0.5} stroke="#1a1a1a" strokeWidth={s * 0.04} strokeLinecap="round" />
          </motion.g>
          {/* Confetti particles */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              cx={cx + (i - 2) * (s * 0.12)}
              cy={cy - headR * 1.2}
              r={s * 0.02}
              fill={['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BCE'][i]}
              animate={{ y: [0, -s * 0.15, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </>
      )}

      {mood === 'rocket' && (
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {/* Rocket next to mascot */}
          <g transform={`translate(${cx + bodyW * 0.8}, ${cy - headR * 0.5})`}>
            <path d={`M 0 ${s * 0.12} L ${s * 0.04} 0 L ${s * 0.08} ${s * 0.12} Z`} fill="#FF6B6B" />
            <rect x={s * 0.015} y={s * 0.08} width={s * 0.05} height={s * 0.06} fill="#FF6B6B" rx={s * 0.01} />
            {/* Flame */}
            <motion.ellipse
              cx={s * 0.04}
              cy={s * 0.16}
              rx={s * 0.02}
              ry={s * 0.03}
              fill="#FFD93D"
              animate={{ ry: [s * 0.03, s * 0.05, s * 0.03] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </g>
        </motion.g>
      )}

      {/* Left arm (static for most moods) */}
      {(mood !== 'celebrate') && (
        <line x1={cx - bodyW * 0.5} y1={cy + headR * 0.7} x2={cx - bodyW * 0.9} y2={cy + headR * 1.3} stroke="#1a1a1a" strokeWidth={s * 0.04} strokeLinecap="round" />
      )}

      {/* Legs */}
      <line x1={cx - bodyW * 0.2} y1={cy + headR * 1.6} x2={cx - bodyW * 0.3} y2={cy + headR * 2.2} stroke="#1a1a1a" strokeWidth={s * 0.04} strokeLinecap="round" />
      <line x1={cx + bodyW * 0.2} y1={cy + headR * 1.6} x2={cx + bodyW * 0.3} y2={cy + headR * 2.2} stroke="#1a1a1a" strokeWidth={s * 0.04} strokeLinecap="round" />
    </motion.svg>
  )
}
