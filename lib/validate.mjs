export function validateData(models,sources,evidence,policy){
 const ids=new Set(sources.map(s=>s.id));
 if(ids.size!==sources.length)throw Error('Duplicate source id');
 for(const s of sources){if(!s.url.startsWith('https://')||!/^\d{4}-\d{2}-\d{2}$/.test(s.retrieved))throw Error('Source URL/date missing')}
 if(new Set(models.map(m=>m.id)).size!==models.length)throw Error('Duplicate model id');
 for(const m of models){
  if(!/^[a-z0-9.-]+$/.test(m.id)||!ids.has(m.priceSource)||!ids.has(m.evidenceSource))throw Error('Model identity/source missing');
  if(Object.keys(m.rates).sort().join()!=='cached,input,output')throw Error('Rate fields missing or unexpected');
  if(Object.keys(m.metrics).sort().join()!=='automation,deepswe,intelligence,terminal')throw Error('Score fields missing or unexpected');
  for(const value of Object.values(m.rates))if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw Error('Invalid rate');
  for(const value of Object.values(m.metrics))if(value!==null&&(typeof value!=='number'||!Number.isFinite(value)||value<0||value>100))throw Error('Invalid score');
 }
 if(evidence.schema_version!=='hub-evidence.v1'||evidence.evaluation_scope!=='synthetic_decision_contract')throw Error('Unrecognized evidence scope');
 if(!/^[a-f0-9]{64}$/.test(evidence.cases_sha256))throw Error('Missing case hash');
 if(evidence.metrics.planned!==evidence.cases.length||new Set(evidence.cases.map(c=>c.case_id)).size!==evidence.cases.length)throw Error('Case inventory mismatch');
 if(evidence.status!=='not_run')throw Error('Current renderer supports not_run only; extend renderer and provenance gate before measured import');
 if(['measured','passed','failed','errors'].some(key=>evidence.metrics[key]!==0)||evidence.metrics.pass_rate!==null)throw Error('Unrun work cannot have measurements');
 if(['run_id','completed_at','config_sha256','result_sha256','receipt_hash','runner_version','model_snapshot','actual_billed_cost_usd','retry_count','human_review_minutes'].some(key=>evidence[key]!==null))throw Error('Unrun work cannot have measurements or run provenance');
 if(evidence.cases.some(c=>c.status!=='not_run'||c.passed!==null||c.latency_ms!==null||c.estimated_cost_usd!==null))throw Error('Unrun work cannot have measurements');
 if(evidence.grading.kind!=='deterministic_contract'||evidence.grading.judge_model!==null||evidence.grading.calibration!=='not_performed'||evidence.grading.judge_independence!=='not_applicable')throw Error('Unexpected grading evidence');
 if(evidence.production_ready!==false)throw Error('Current protocol cannot promote production');
 if(policy.judge.selfJudgingAllowed!==false)throw Error('Candidate cannot judge itself');
 const model=models.find(m=>m.id===evidence.model_id);if(!model||model.localStatus!==evidence.status)throw Error('Catalog status differs from receipt');
 return true;
}
