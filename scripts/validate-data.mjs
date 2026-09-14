import { readFile } from 'node:fs/promises'
import { validateData } from '../lib/validate.mjs'
const data=await Promise.all(['models','sources','astra-evidence','evaluation-policy'].map(async name=>JSON.parse(await readFile(new URL(`../data/${name}.json`,import.meta.url),'utf8'))))
validateData(...data)
console.log(`Validated ${data[0].length} models, ${data[1].length} sources and ${data[2].metrics.planned} evaluation cases. No measured results asserted.`)
