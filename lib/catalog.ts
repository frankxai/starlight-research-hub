import models from '@/data/models.json'
import sources from '@/data/sources.json'
export { models, sources }
export type Model = typeof models[number]
export const asOf = '2026-09-07'
export const site = 'https://starlight-research-hub.vercel.app'
export const metrics = {
  automation: { label: 'AutomationBench', unit: '%', version: 'Launch table; version not specified' },
  terminal: { label: 'Terminal-Bench 4.0', unit: '%', version: '4.0' },
  deepswe: { label: 'DeepSWE', unit: '%', version: 'v1.1' },
  intelligence: { label: 'AA Intelligence Index', unit: '', version: 'v4.1.1' },
}
export const articles = [
  { slug: 'gpt-6-astra-chatgpt-work-codex-founders', category: 'For founders', title: 'Put Astra to work in ChatGPT, Work and Codex', description: 'A practical commission for research, a marketing campaign and a working website. Choose the surface, then define the handoff.', time: '7 min' },
  { slug: 'gpt-6-astra-for-content-creators', category: 'For creators', title: 'Build a creative studio that finishes the work', description: 'Adobe, Canva, HeyGen and interactive content: what is documented, what access you need, and how to judge the result.', time: '8 min' },
  { slug: 'gpt-6-astra-ai-architecture-model-economics', category: 'For AI architects', title: 'Choose models by the cost of accepted work', description: 'Model routing, independent evaluation, operational controls and a path from candidate to production.', time: '8 min' },
]
export function source(id: string) { return sources.find(item => item.id === id)! }
