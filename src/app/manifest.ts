import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ramesh Maharjan - Full Stack Developer',
    short_name: 'Ramesh Dev',
    description: 'Expert Full Stack Developer specializing in React, Next.js, Laravel, PHP, Python Django. Building scalable web applications and enterprise solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#10b981',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity', 'technology'],
    lang: 'en',
    dir: 'ltr',
  }
}
