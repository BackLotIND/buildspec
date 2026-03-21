import './globals.css'
import { AuthWrapper } from './AuthWrapper'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#E63946',
}

export const metadata = {
  title: 'BuildSpec — Plan Your Car Build',
  description: 'The smartest way to plan aftermarket car builds. 61 platforms, 372+ parts, 92 builds — budget tracker, DIY build guides, junkyard swap secrets, drift tax ratings, and the Delusion Meter.',
  keywords: 'car build planner, aftermarket parts, civic build, wrx build, 335i build, mustang build, silverado build, gti build, miata build, tacoma build, crown vic build, rx7 build, pcpartpicker cars, car mods, junkyard swaps, truck mods, drift tax',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BuildSpec',
  },
  openGraph: {
    title: 'BuildSpec — Plan Your Car Build',
    description: '61 platforms, 372+ parts, 92 builds. The smartest way to plan aftermarket car builds.',
    type: 'website',
    url: 'https://thebuildspec.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}
