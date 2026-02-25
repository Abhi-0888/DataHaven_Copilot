## Packages
recharts | Dashboard analytics charts and data visualization
framer-motion | Page transitions and scroll-triggered animations
date-fns | Human-readable date formatting

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}

Tailwind Config - extend animation/keyframes:
animation: {
  'blob': 'blob 7s infinite',
},
keyframes: {
  blob: {
    '0%': { transform: 'translate(0px, 0px) scale(1)' },
    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
    '100%': { transform: 'translate(0px, 0px) scale(1)' },
  }
}

Assuming file upload endpoint expects `multipart/form-data`.
