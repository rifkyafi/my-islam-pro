import React from 'react'

export function ArrowRight({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StarSvg() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="50,5 61.8,38.2 95,50 61.8,61.8 50,95 38.2,61.8 5,50 38.2,38.2" stroke="currentColor" strokeWidth="1" fill="none" />
      <polygon points="50,15 59.5,40.5 85,50 59.5,59.5 50,85 40.5,59.5 15,50 40.5,40.5" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.5" />
    </svg>
  )
}
