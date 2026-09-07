import evidence from '@/data/astra-evidence.json'
import policy from '@/data/evaluation-policy.json'
export const dynamic='force-static'
export function GET(){return Response.json({evidence,policy},{headers:{'Cache-Control':'public, max-age=3600'}})}
