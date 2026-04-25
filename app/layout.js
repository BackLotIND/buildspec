import './globals.css'
import { AuthWrapper } from './AuthWrapper'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#E63946',
}

export const metadata = {
  title: 'BuildSpec — Car enthusiast platform with builds, parts knowledge, bounties, and community. 117 platforms. Free to browse.',
  description: 'BuildSpec — Car enthusiast platform with builds, parts knowledge, bounties, and community. 117 platforms. Free to browse.',
  keywords: 'car build planner, aftermarket parts, civic build, wrx build, 335i build, mustang build, silverado build, gti build, miata build, tacoma build, crown vic build, rx7 build, pcpartpicker cars, car mods, junkyard swaps, truck mods, drift tax',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BuildSpec',
  },
  openGraph: {
    title: 'BuildSpec — Car enthusiast platform with builds, parts knowledge, bounties, and community. 117 platforms. Free to browse.',
    description: 'BuildSpec — Car enthusiast platform with builds, parts knowledge, bounties, and community. 117 platforms. Free to browse.',
    type: 'website',
    url: 'https://thebuildspec.com',
    siteName: 'BuildSpec',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildSpec — Car enthusiast platform with builds, parts knowledge, bounties, and community. 117 platforms. Free to browse.',
    description: 'BuildSpec — Car enthusiast platform with builds, parts knowledge, bounties, and community. 117 platforms. Free to browse.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ background: '#08080B', colorScheme: 'dark' }}>
      <head>
        {/* Inline dark background to prevent white flash before CSS loads */}
        <style>{`html,body{background:#08080B;color-scheme:dark}`}</style>
        <link rel="manifest" href="/manifest.json" />

        {/* Apple touch icons — all requested sizes */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="72x72"   href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />

        {/* iOS PWA meta */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BuildSpec" />

        {/* Android / general PWA meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="BuildSpec" />
        <meta name="theme-color" content="#E63946" />

        {/* Favicon fallback */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

        {/* Service worker registration for PWA install prompt */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `}} />
      </head>
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}
