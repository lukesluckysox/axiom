import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Liminal',
    short_name: 'Liminal',
    description: 'A cabinet of instruments for thought. Six serious thinking tools for the examined life.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#14120E',
    theme_color: '#14120E',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/api/pwa-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Archive',
        short_name: 'Archive',
        description: 'Review past sessions',
        url: '/archive',
      },
    ],
  };
}
