import Link from 'next/link'
import type { Metadata } from 'next'
import ArticleLinks from '@/components/ArticleLinks'
import { models, site } from '@/lib/catalog'
export const metadata: Metadata = { alternates: { canonical: '/' } }
export default function Home() {
 const comparison = models.filter(m=>['gpt-6-astra','gpt-5.6-sol','claude-fable-5-1'].includes(m.id))
 return <>
 <section className="hero">
  <div className="hero-copy"><p className="eyebrow"><span className="dot"/> Large language model hub · September 2026</p><h1>Better models.<br/><em>Better decisions.</em></h1><p className="lede">Understand what changed. Compare the evidence. Choose the model that earns its place in your workflow.</p><div className="actions"><Link className="button" href="/models">Compare models <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/evaluations">How we evaluate <span aria-hidden="true">→</span></Link></div><div className="hero-foot"><span>07 models</span><span>02 providers</span><span>Source-led. Task-tested when measured.</span></div></div>
  <div className="spotlight"><div className="spotlight-top"><span className="eyebrow">New model dossier</span><span className="tag">03 Sep 2026</span></div><h2>GPT-6 <em>Astra</em></h2><p>A candidate for demanding, multi-step work. Start with the workload, then inspect the evidence.</p><div className="chart-heading"><span>AutomationBench</span><span>Vendor-reported · %</span></div><div className="bars">{comparison.map(m=><div className={`bar-row ${m.id==='gpt-6-astra'?'accent':''}`} key={m.id}><div><span>{m.name}</span><strong>{m.metrics.automation}</strong></div><div className="bar-track"><span style={{width:`${m.metrics.automation! / 50 * 100}%`}}/></div></div>)}</div><p className="caption">Same-source launch comparison. Benchmark performance is not a guarantee for your tools or tasks.</p><Link className="spotlight-link" href="/models/gpt-6-astra">Read the Astra dossier <span aria-hidden="true">→</span></Link></div>
 </section>
 <div className="editor-note"><span className="eyebrow">The useful distinction</span><p>Astra leads the workflow test above. Fable 5.1 leads the cited intelligence index. <Link href="/models">There is no single winner across the table.</Link></p></div>
 <section className="section"><div className="section-head"><div><p className="eyebrow">From release to decision</p><h2>Three questions worth asking.</h2></div></div><div className="three-grid">{[
  ['01','What can it do?','Inspect primary sources, published results and the limits of what those results establish.','/models','Explore the models'],
  ['02','Will it work for us?','Use repeatable cases, independent judgment and receipts. Unmeasured work stays unmeasured.','/evaluations','Inspect the evaluation'],
  ['03','What does it cost?','Include retries, tool charges and human correction time in the price of an accepted result.','/models#cost','Model your workload'],
 ].map(([n,t,d,url,label])=><div className="question" key={n}><span className="index">{n}</span><h3>{t}</h3><p>{d}</p><Link className="text-link" href={url}>{label} <span aria-hidden="true">→</span></Link></div>)}</div></section>
 <section className="section"><div className="section-head"><div><p className="eyebrow">The application layer</p><h2>Put the update to work.</h2></div><Link className="text-link" href="/journal">All field notes →</Link></div><ArticleLinks/></section>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'Starlight Research',url:site,description:'An independent large language model research and evaluation hub.'})}}/>
 </>
}
