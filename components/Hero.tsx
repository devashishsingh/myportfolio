"use client"
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import FlipBook from './FlipBook'
import { Sparkle } from './InteractiveElements'
import TextReveal from './TextReveal'
import MagneticButton from './MagneticButton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export default function Hero(){
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const orb3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const flipY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <section className="hero-outer" style={{perspective:'1200px'}} ref={heroRef}>
      {/* Floating orbs with parallax */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position:'absolute', top:'15%', right:'20%', width:200, height:200, borderRadius:'50%', background:'rgba(0,0,0,0.04)', filter:'blur(80px)', pointerEvents:'none', y: orb1Y }}
      />
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position:'absolute', bottom:'20%', left:'10%', width:160, height:160, borderRadius:'50%', background:'rgba(0,0,0,0.03)', filter:'blur(80px)', pointerEvents:'none', y: orb2Y }}
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position:'absolute', top:'50%', left:'60%', width:120, height:120, borderRadius:'50%', background:'rgba(0,0,0,0.025)', filter:'blur(80px)', pointerEvents:'none', y: orb3Y }}
      />

      <div className="container-wide hero-inner" id="main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{transformStyle:'preserve-3d', y: textY, opacity: textOpacity}}
        >
          {/* LIVE badge */}
          <motion.div variants={childVariants}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, border:'1px solid var(--accent-primary)', marginBottom:20, animation:'pulse-border 2s infinite' }}>
              <span style={{ color:'var(--accent-primary)', animation:'blink 1.5s infinite', fontSize:10 }}>●</span>
              <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--accent-glow)', letterSpacing:'0.1em', textTransform:'uppercase' }}>LIVE</span>
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <div className="muted-label" style={{display:'flex',alignItems:'center',gap:6}}>
              Cybersecurity practitioner · Cohort instructor · Indie founder
              <Sparkle />
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <h1 className="display-font hero-heading" style={{transform:'translateZ(30px)'}}>
              Devashish{' '}
              <span style={{ position:'relative', display:'inline-block' }}>
                Singh
              </span>
            </h1>
          </motion.div>

          <motion.div variants={childVariants}>
            <p className="hero-lead" style={{transform:'translateZ(15px)'}}>I help career-switchers break into <strong>cybersecurity &amp; AI</strong> with 12-week cohorts, real labs, and recruiter intros for top grads.<br/><br/>14+ years shipping security at scale (ex-AirAsia InfoSec, founder of InMyBox + DMARC Labs). I teach what I run in production every week — no outdated slides, no theory that doesn&apos;t survive triage.<br/><br/>Start free with the 5-day email mini-course, or reserve a seat in Cohort #1.</p>
          </motion.div>

          <motion.div variants={childVariants}>
            <div className="hero-cta" style={{transform:'translateZ(20px)', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap'}}>
              <MagneticButton strength={0.35}>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link href="/study" className="btn btn-3d" style={{ height:44, minWidth:200, display:'inline-flex', alignItems:'center', justifyContent:'center', borderRadius:8 }}>See the cohort →</Link>
                </motion.div>
              </MagneticButton>
              <MagneticButton strength={0.35}>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link href="/study#free" className="btn-outline btn-3d" style={{ height:44, minWidth:200, display:'inline-flex', alignItems:'center', justifyContent:'center', borderRadius:8 }}>Free 5-day mini-course</Link>
                </motion.div>
              </MagneticButton>
            </div>
          </motion.div>

          <motion.div variants={childVariants}>
            <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--text-muted)', letterSpacing:'0.05em', marginTop:16 }}>
              Next cohort starts Aug 2026 · 30 seats · Early-bird for first 10
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{opacity:0, y:20, rotateX:8}}
          animate={{opacity:1, y:0, rotateX:0}}
          transition={{duration:0.9, ease:'easeOut', delay:0.3}}
          style={{transformStyle:'preserve-3d', y: flipY}}
        >
          <FlipBook />
        </motion.div>
      </div>
    </section>
  )
}
