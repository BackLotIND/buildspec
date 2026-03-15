import './globals.css'

export const metadata = {
  title: 'BuildSpec — Plan Your Car Build',
  description: 'The smartest way to plan aftermarket car builds. PCPartPicker for cars. Honda, BMW, Subaru — parts catalog, budget tracker, DIY build guides, and junkyard swap secrets.',
  keywords: 'car build planner, aftermarket parts, civic build, wrx build, 335i build, pcpartpicker cars, car mods, junkyard swaps',
  openGraph: {
    title: 'BuildSpec — Plan Your Car Build',
    description: 'Parts catalog, budget tracker, DIY builds, and junkyard swap secrets for Honda, BMW, and Subaru.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
