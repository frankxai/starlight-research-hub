import type { MetadataRoute } from 'next'
import { site, models, asOf } from '@/lib/catalog'
export default function sitemap():MetadataRoute.Sitemap{return ['','/models','/evaluations','/journal','/sources',...models.map(m=>`/models/${m.id}`)].map(path=>({url:site+path,lastModified:asOf,changeFrequency:'weekly',priority:path===''?1:0.8}))}
