import type { Metadata } from 'next'
import Catalog from '@/components/Catalog'
import CostCalculator from '@/components/CostCalculator'
export const metadata:Metadata={title:'Compare large language models',description:'Compare seven LLM candidates by published benchmarks, current API prices and estimated cost per accepted task.',alternates:{canonical:'/models'}}
export default function Models(){return <><div className="page-head"><p className="eyebrow">Model registry · Checked 7 September 2026</p><h1>Choose for the work.</h1><p className="lede">Seven candidates, two providers. Published evidence and transparent pricing, with room for the measurements that matter to you.</p></div><Catalog/><CostCalculator/></>}
