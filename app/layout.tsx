import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import { site } from '@/lib/catalog'
import './globals.css'
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Starlight Research — Large language model hub', template: '%s | Starlight Research' },
  description: 'Compare LLM prices and published benchmarks, inspect evaluation evidence, and turn model updates into useful work. Featuring GPT-6 Astra.',
  openGraph: { type: 'website', siteName: 'Starlight Research', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image' },
}
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
 return <html lang="en"><body><a className="skip" href="#main">Skip to content</a><Header/><main id="main" className="shell">{children}</main><footer className="shell footer"><div><Link className="footer-name" href="/">Starlight Research</Link><p>Research for people who build.</p></div><div><p>Sources checked 7 September 2026.</p><p><Link href="/sources">Source ledger</Link> · <a href="https://github.com/frankxai/starlight-research-hub">Open repository</a> · <a href="https://frankx.ai">FrankX</a></p></div><p className="footer-note">Independent editorial analysis. Vendor reports and local measurements are labeled separately. No vendor affiliation or endorsement.</p></footer></body></html>
}
