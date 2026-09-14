import Link from 'next/link'
export default function NotFound(){return <div className="page-head"><p className="eyebrow">404</p><h1>This page is outside<br/>the current registry.</h1><p className="lede">The model catalog and its source ledger are a good place to continue.</p><Link className="button" href="/models">Explore the models →</Link></div>}
