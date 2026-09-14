'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Question = { id:string; position:number; section:'CL'|'RL'; topic:string; question:string; options:Record<string,string>; assets?:string[]; stimulus_assets?:string[]; option_assets?:Record<string,string> };
type Exam = { id:string; durationSeconds:number; questions:Question[] };
type Result = { status:string; elapsedSeconds:number; totals:Metric; sections:{CL:Metric;RL:Metric}; standardizedScoring:{available:boolean;reason:string}; historySaved:boolean; savedAt:string|null };
type Metric = { questions:number; correct:number; incorrect:number; omitted:number; percentage:number };
type Attempt = { id:string; submittedAt:string; elapsedSeconds:number; timedOut:boolean; totalCorrect:number; totalIncorrect:number; totalOmitted:number; percentage:number; clCorrect:number; rlCorrect:number };
type TopicInsight = { topic:string; label:string; section:'CL'|'RL'; total:number; correct:number; accuracy:number; historicalQuestionsAvailable:number; rank?:number; recommendedQuestions?:number; recommendation?:string };
type Recommendations = { attemptsAnalyzed:number; questionsAnalyzed:number; overallAccuracy:number; priorities:TopicInsight[]; strengths:TopicInsight[]; methodology:string };

const formatTime = (seconds:number) => [Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60].map(x=>String(x).padStart(2,'0')).join(':');

export default function Home() {
  const [view,setView]=useState<'home'|'exam'|'result'|'history'|'recommendations'>('home');
  const [exam,setExam]=useState<Exam|null>(null);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [remaining,setRemaining]=useState(10800);
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(false);
  const [history,setHistory]=useState<Attempt[]>([]);
  const [historyError,setHistoryError]=useState('');
  const [recommendations,setRecommendations]=useState<Recommendations|null>(null);
  const [recommendationsError,setRecommendationsError]=useState('');

  function learnerId(){
    const key='umbral-udea-learner';
    let value=localStorage.getItem(key);
    if(!value){value=crypto.randomUUID();localStorage.setItem(key,value)}
    return value;
  }

  const submit=useCallback(async(timedOut=false)=>{
    if(!exam||loading)return; setLoading(true);
    const response=await fetch('/api/exam',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers,elapsedSeconds:10800-remaining,timedOut,learnerId:learnerId()})});
    setResult(await response.json()); setView('result'); setLoading(false);
  },[exam,answers,remaining,loading]);

  useEffect(()=>{if(view!=='exam')return; const timer=setInterval(()=>setRemaining(value=>{if(value<=1){clearInterval(timer); queueMicrotask(()=>submit(true)); return 0} return value-1}),1000);return()=>clearInterval(timer)},[view,submit]);

  async function start(){setLoading(true);const response=await fetch('/api/exam');const data=await response.json() as Exam;setExam(data);setRemaining(data.durationSeconds);setAnswers({});setIndex(0);setView('exam');setLoading(false)}
  async function openHistory(){
    setLoading(true);setHistoryError('');
    try{const response=await fetch(`/api/history?learnerId=${encodeURIComponent(learnerId())}`);if(!response.ok)throw new Error();const data=await response.json() as {attempts:Attempt[]};setHistory(data.attempts);setView('history')}
    catch{setHistoryError('No fue posible consultar tu historial en este momento.');setView('history')}
    finally{setLoading(false)}
  }
  async function openRecommendations(){
    setLoading(true);setRecommendationsError('');
    try{const response=await fetch(`/api/recommendations?learnerId=${encodeURIComponent(learnerId())}`);if(!response.ok)throw new Error();setRecommendations(await response.json() as Recommendations);setView('recommendations')}
    catch{setRecommendationsError('No fue posible generar tus recomendaciones en este momento.');setView('recommendations')}
    finally{setLoading(false)}
  }
  const question=exam?.questions[index];
  const answered=Object.keys(answers).length;
  const progress=exam?Math.round(100*answered/exam.questions.length):0;
  const sectionLabel=question?.section==='CL'?'Competencia Lectora':'Razonamiento Lógico';

  if(view==='exam'&&exam&&question) return <main className="examShell">
    <header className="examHeader"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><div className="timer" aria-label="Tiempo restante">{formatTime(remaining)}</div><button className="submit" onClick={()=>submit(false)} disabled={loading}>Entregar examen</button></header>
    <aside className="navigator"><div className="navTitle"><span>Progreso</span><strong>{answered}/80</strong></div><div className="progress"><i style={{width:`${progress}%`}}/></div><div className="sectionTag">Competencia Lectora</div><div className="questionGrid">{exam.questions.slice(0,40).map((q,i)=><button key={q.id} className={`${i===index?'active ':''}${answers[q.id]?'done':''}`} onClick={()=>setIndex(i)}>{i+1}</button>)}</div><div className="sectionTag">Razonamiento Lógico</div><div className="questionGrid">{exam.questions.slice(40).map((q,i)=><button key={q.id} className={`${i+40===index?'active ':''}${answers[q.id]?'done':''}`} onClick={()=>setIndex(i+40)}>{i+41}</button>)}</div><div className="legend"><span><i className="answeredDot"/>Respondida</span><span><i/>Pendiente</span></div></aside>
    <section className="questionPanel"><div className="questionMeta"><span>{sectionLabel}</span><span>{question.topic?.replaceAll('_',' ')}</span></div><div className="questionNumber">Pregunta {index+1} de 80</div><h2>{question.question}</h2>{question.stimulus_assets?.map(src=><img className="stimulus" key={src} src={'/'+src} alt="Figura de apoyo de la pregunta"/>)}<div className="options">{Object.entries(question.options).map(([letter,text])=><button key={letter} className={answers[question.id]===letter?'selected':''} onClick={()=>setAnswers({...answers,[question.id]:letter})}><b>{letter}</b><span>{text}</span>{question.option_assets?.[letter]&&<img src={'/'+question.option_assets[letter]} alt={`Opción ${letter}`}/>}</button>)}</div><div className="questionActions"><button onClick={()=>setIndex(Math.max(0,index-1))} disabled={index===0}>← Anterior</button><button className="next" onClick={()=>setIndex(Math.min(79,index+1))} disabled={index===79}>Siguiente →</button></div></section>
  </main>;

  if(view==='result'&&result) return <main className="resultShell"><header className="topbar"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><button className="linkButton" onClick={()=>setView('home')}>Volver al inicio</button></header><section className="resultHero"><div className="eyebrow">RESULTADO BRUTO</div><h1>{result.totals.correct}<small>/ 80</small></h1><p>{result.totals.percentage}% de acierto · {formatTime(result.elapsedSeconds)} utilizados</p><div className={`saveState ${result.historySaved?'saved':'warning'}`}>{result.historySaved?'✓ Intento guardado en tu historial':'El resultado se calculó, pero no pudo guardarse.'}</div></section><section className="resultCards"><MetricCard title="Competencia Lectora" metric={result.sections.CL}/><MetricCard title="Razonamiento Lógico" metric={result.sections.RL}/><div className="scoreNotice"><strong>Puntaje estandarizado</strong><span>No disponible</span><p>{result.standardizedScoring.reason}</p></div></section><section className="resultStrip"><div><b>{result.totals.correct}</b><span>Correctas</span></div><div><b>{result.totals.incorrect}</b><span>Incorrectas</span></div><div><b>{result.totals.omitted}</b><span>Omitidas</span></div></section><div className="resultActions"><button className="primary" onClick={openRecommendations}>Ver plan recomendado <span>→</span></button><button className="linkButton" onClick={openHistory}>Ver mi evolución</button><button className="linkButton" onClick={start}>Presentar otro simulacro</button></div></main>;

  if(view==='history') return <History attempts={history} error={historyError} loading={loading} onBack={()=>setView('home')} onStart={start} onRecommend={openRecommendations}/>;
  if(view==='recommendations') return <RecommendationView data={recommendations} error={recommendationsError} loading={loading} onBack={openHistory} onStart={start}/>;

  return <main className="shell"><header className="topbar"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><div className="homeNav"><span className="phase">Banco histórico · 202 preguntas validadas</span><button className="historyLink" onClick={openHistory} disabled={loading}>Mi progreso</button></div></header><section className="hero"><div className="eyebrow">SIMULADOR DE ADMISIÓN</div><h1>Entrena como<br/>vas a presentar.</h1><p>Un simulacro construido desde exámenes históricos de la Universidad de Antioquia, con condiciones reales y diagnóstico honesto.</p><button className="primary" onClick={start} disabled={loading}>{loading?'Preparando…':'Comenzar simulacro completo'} <span>→</span></button><p className="privacyNote">Tus intentos se guardan de forma privada y quedan vinculados a este navegador.</p></section><section className="examCard" aria-label="Condiciones del simulacro"><div className="cardTop"><span>SIMULACRO COMPLETO</span><span className="liveDot">Condiciones UdeA</span></div><div className="clock">03:00:00</div><div className="metricGrid"><div><strong>80</strong><span>preguntas</span></div><div><strong>40 + 40</strong><span>CL · RL</span></div><div><strong>180</strong><span>minutos</span></div></div>{['Sin tiempo adicional','Preguntas históricas verificadas','Resultado bruto y diagnóstico'].map((x,i)=><div className="rule" key={x}><span>0{i+1}</span><p>{x}</p></div>)}</section></main>;
}

function MetricCard({title,metric}:{title:string;metric:Metric}){return <article className="metricCard"><span>{title}</span><strong>{metric.correct}<small>/40</small></strong><div><i style={{width:`${metric.percentage}%`}}/></div><p>{metric.percentage}% · {metric.omitted} omitidas</p></article>}

function History({attempts,error,loading,onBack,onStart,onRecommend}:{attempts:Attempt[];error:string;loading:boolean;onBack:()=>void;onStart:()=>void;onRecommend:()=>void}){
  const chronological=[...attempts].reverse();
  const best=attempts.length?Math.max(...attempts.map(x=>x.totalCorrect)):0;
  const average=attempts.length?Math.round(attempts.reduce((sum,x)=>sum+x.totalCorrect,0)/attempts.length):0;
  const change=chronological.length>1?chronological.at(-1)!.totalCorrect-chronological.at(-2)!.totalCorrect:null;
  return <main className="historyShell"><header className="topbar"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><button className="linkButton" onClick={onBack}>Volver al inicio</button></header><section className="historyHero"><div><div className="eyebrow">FASE 9 · EVOLUCIÓN</div><h1>Tu progreso,<br/>intento a intento.</h1><p>Resultados guardados en este navegador. Compara tu desempeño general y el equilibrio entre las dos áreas.</p></div><div className="heroActions"><button className="primary" onClick={onRecommend} disabled={loading}>Ver recomendaciones <span>→</span></button><button className="linkButton" onClick={onStart} disabled={loading}>Nuevo simulacro</button></div></section>{error?<div className="emptyHistory"><h2>No pudimos cargar el historial</h2><p>{error}</p></div>:attempts.length===0?<div className="emptyHistory"><span>01</span><h2>Aún no hay intentos guardados.</h2><p>Completa tu primer simulacro para activar las métricas de evolución.</p><button className="primary" onClick={onStart}>Comenzar ahora <span>→</span></button></div>:<><section className="summaryGrid"><article><span>Intentos</span><strong>{attempts.length}</strong></article><article><span>Promedio</span><strong>{average}<small>/80</small></strong></article><article><span>Mejor resultado</span><strong>{best}<small>/80</small></strong></article><article><span>Último cambio</span><strong className={change!==null&&change>=0?'positive':''}>{change===null?'—':`${change>=0?'+':''}${change}`}</strong></article></section><section className="trendPanel"><div className="panelHeading"><div><span>EVOLUCIÓN GENERAL</span><h2>Respuestas correctas por intento</h2></div><span>Máximo 80</span></div><div className="chart" role="img" aria-label="Gráfica de resultados por intento">{chronological.map((item,i)=><div className="barColumn" key={item.id}><span>{item.totalCorrect}</span><i style={{height:`${Math.max(5,item.totalCorrect/80*100)}%`}}/><small>{i+1}</small></div>)}</div></section><section className="attemptList"><div className="panelHeading"><div><span>HISTORIAL RECIENTE</span><h2>Últimos resultados</h2></div></div>{attempts.map((item,i)=><article key={item.id}><div className="attemptOrder">#{attempts.length-i}</div><div><strong>{new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeStyle:'short'}).format(new Date(item.submittedAt))}</strong><span>{formatTime(item.elapsedSeconds)} · {item.timedOut?'Tiempo agotado':'Entrega manual'}</span></div><div className="sectionScores"><span>CL <b>{item.clCorrect}/40</b></span><span>RL <b>{item.rlCorrect}/40</b></span></div><div className="attemptTotal"><strong>{item.totalCorrect}</strong><span>/80</span></div></article>)}</section></>}</main>
}

function RecommendationView({data,error,loading,onBack,onStart}:{data:Recommendations|null;error:string;loading:boolean;onBack:()=>void;onStart:()=>void}){
  const empty=!data||data.attemptsAnalyzed===0;
  return <main className="recommendShell"><header className="topbar"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><button className="linkButton" onClick={onBack}>Volver a mi progreso</button></header><section className="recommendHero"><div className="eyebrow">FASE 10 · ENTRENAMIENTO PERSONALIZADO</div><h1>Tu próxima sesión,<br/>con propósito.</h1><p>Un plan basado únicamente en tus respuestas reales y en preguntas históricas disponibles.</p></section>{error?<div className="emptyHistory"><h2>No pudimos generar el plan</h2><p>{error}</p></div>:empty?<div className="emptyHistory"><span>01</span><h2>Primero necesitamos un resultado.</h2><p>Completa un simulacro para identificar prioridades con evidencia suficiente.</p><button className="primary" onClick={onStart} disabled={loading}>Comenzar simulacro <span>→</span></button></div>:<><section className="recommendSummary"><div><span>Intentos analizados</span><strong>{data.attemptsAnalyzed}</strong></div><div><span>Preguntas analizadas</span><strong>{data.questionsAnalyzed}</strong></div><div><span>Precisión global</span><strong>{data.overallAccuracy}%</strong></div></section><section className="prioritySection"><div className="panelHeading"><div><span>ORDEN DE TRABAJO</span><h2>Tus prioridades actuales</h2></div></div><div className="priorityGrid">{data.priorities.map(item=><article key={`${item.section}-${item.topic}`}><div className="priorityTop"><span>PRIORIDAD {item.rank}</span><b>{item.section}</b></div><h3>{item.label}</h3><div className="accuracy"><strong>{item.accuracy}%</strong><span>{item.correct} de {item.total} correctas</span></div><p>{item.recommendation}</p><small>{item.historicalQuestionsAvailable} preguntas disponibles en el banco actual</small></article>)}</div></section><section className="strengthSection"><div><span>FORTALEZAS OBSERVADAS</span><h2>Lo que conviene mantener</h2></div><div>{data.strengths.length?data.strengths.map(item=><article key={`${item.section}-${item.topic}`}><span>{item.section}</span><strong>{item.label}</strong><b>{item.accuracy}%</b></article>):<p>Aún faltan respuestas suficientes para destacar una fortaleza estable.</p>}</div></section><section className="methodNote"><strong>Cómo se construyó este plan</strong><p>{data.methodology}</p></section><div className="planAction"><button className="primary" onClick={onStart}>Presentar otro simulacro completo <span>→</span></button></div></>}</main>
}
