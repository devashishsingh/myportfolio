"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import FlipBook from './FlipBook'
import { Sparkle } from './InteractiveElements'

export default function Hero(){
  return (
    <section className="hero-outer" style={{perspective:'1200px'}}>
      <div className="container-wide hero-inner" id="main">
        <motion.div
          initial={{opacity:0, x:-20, rotateY:-6}}
          animate={{opacity:1, x:0, rotateY:0}}
          transition={{duration:0.8, ease:'easeOut'}}
          style={{transformStyle:'preserve-3d'}}
        >
          <div className="muted-label" style={{display:'flex',alignItems:'center',gap:6}}>
            Leader · Mentor · Builder · Innovator · Futuristic
            <Sparkle />
          </div>
          <h1 className="display-font hero-heading" style={{transform:'translateZ(30px)'}}>Devashish Singh</h1>
          <p className="hero-lead" style={{transform:'translateZ(15px)'}}>Drawing on 14+ years of experience across cybersecurity, digital transformation, and innovation, I help individuals, startups, and organizations turn ideas into impactful solutions, build strong digital foundations, and thrive securely in an evolving world.</p>
          <div className="hero-cta" style={{transform:'translateZ(20px)', display:'flex', gap:12, alignItems:'center'}}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/work" className="btn btn-3d">View work</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/contact" className="btn-outline btn-3d">Contact</Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity:0, y:20, rotateX:8}}
          animate={{opacity:1, y:0, rotateX:0}}
          transition={{duration:0.9, ease:'easeOut'}}
          style={{transformStyle:'preserve-3d'}}
        >
          <FlipBook />
        </motion.div>
      </div>
    </section>
  )
}
