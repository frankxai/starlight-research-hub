'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Header() {
  const path = usePathname()
  return <header className="header"><div className="shell header-inner">
    <Link className="brand" href="/" aria-label="Starlight Research home"><span className="brand-mark" aria-hidden="true">✳</span><span>Starlight<span className="brand-sub">Research</span></span></Link>
    <nav aria-label="Primary">{[['/models','Models'],['/evaluations','Evaluations'],['/journal','Field notes'],['/sources','Sources']].map(([href,label]) => <Link key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined}>{label}</Link>)}</nav>
  </div></header>
}
