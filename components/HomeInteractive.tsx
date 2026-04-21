"use client"
import { SectionReveal, ScrollHint, StaggerContainer, StaggerItem } from './InteractiveElements'
import ToonGuide from './ToonGuide'
import React from 'react'

export default function HomeInteractive({ children }: { children: React.ReactNode }) {
  const sections = React.Children.toArray(children)

  return (
    <div>
      {/* Hero section - first child, no reveal animation (it animates itself) */}
      {sections[0]}

      {/* Scroll hint below hero */}
      <ScrollHint />

      {/* Toon guide - first visit welcome */}
      <ToonGuide
        message="Hey there! 👋 I'm Dev's little helper. Scroll down to explore what he does!"
        mood="wave"
        position="bottom-right"
        delay={3}
        showOnce
        storageKey="home-welcome"
        dismissible
      />

      {/* Service cards section with stagger */}
      {sections[1] && (
        <SectionReveal>
          {sections[1]}
        </SectionReveal>
      )}

      {/* Projects section with stagger */}
      {sections[2] && (
        <SectionReveal delay={0.1}>
          {sections[2]}
        </SectionReveal>
      )}

      {/* Stats section */}
      {sections[3] && (
        <SectionReveal>
          {sections[3]}
        </SectionReveal>
      )}

      {/* Community section */}
      {sections[4] && (
        <SectionReveal>
          {sections[4]}
        </SectionReveal>
      )}

      {/* Subscribe section */}
      {sections[5] && (
        <SectionReveal>
          {sections[5]}
        </SectionReveal>
      )}

      {/* Featured writing section */}
      {sections[6] && (
        <SectionReveal>
          {sections[6]}
        </SectionReveal>
      )}

      {/* Any remaining sections */}
      {sections.slice(7).map((section, i) => (
        <SectionReveal key={i}>
          {section}
        </SectionReveal>
      ))}
    </div>
  )
}
