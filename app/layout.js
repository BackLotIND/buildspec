import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#E63946',
}

export const metadata = {
  title: 'BuildSpec — Plan Your Car Build',
  description: 'The smartest way to plan aftermarket car builds. PCPartPicker for cars. 9 manufacturers, 38 platforms, 229+ parts — budget tracker, DIY build guides, junkyard swap secrets, and the Delusion Meter.',
  keywords: 'car build planner, aftermarket parts, civic build, wrx build, 335i build, mustang build, silverado build, gti build, miata build, tacoma build, pcpartpicker cars, car mods, junkyard swaps, truck mods',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BuildSpec',
  },
  openGraph: {
    title: 'BuildSpec — Plan Your Car Build',
    description: '9 manufacturers, 38 platforms, 229+ parts. The smartest way to plan aftermarket car builds.',
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
      <body>{children}</body>
    </html>
  )
}
