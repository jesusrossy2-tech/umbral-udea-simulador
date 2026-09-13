'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Question = { id:string; position:number; section:'CL'|'RL'; topic:string; question:string; options:Record<string,string>; assets?:string[]; stimulus_assets?:string[]; option_assets?:Record<string,string> };
type Exam = { id:string; durationSeconds:number; questions:Question[] };
type Result = { status:string; elapsedSeconds:number; totals:Metric; sections:{CL:Metric;RL:Metric}; standardizedScoring:{available:boolean;reason:string} };
type Metric = { questions:number; correct:number; incorrect:number; omitted:number; percentage:number };

const formatTime = (seconds:number) => [Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60].map(x=>String(x).padStart(2,'0')).join(':');

export default function Home() {
  const [view,setView]=useState<'home'|'exam'|'result'>('home');
  const [exam,setExam]=useState<Exam|null>(null);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [remaining,setRemaining]=useState(10800);
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(false);

  const submit=useCallback(async(timedOut=false)=>{
    if(!exam||loading)return; setLoading(true);
    const response=await fetch('/api/exam',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers,elapsedSeconds:10800-remaining,timedOut})});
    setResult(await response.json()); setView('result'); setLoading(false);
  },[exam,answers,remaining,loading]);

  useEffect(()=>{if(view!=='exam')return; const timer=setInterval(()=>setRemaining(value=>{if(value<=1){clearInterval(timer); queueMicrotask(()=>submit(true)); return 0} return value-1}),1000);return()=>clearInterval(timer)},[view,submit]);

  async function start(){setLoading(true);const response=await fetch('/api/exam');const data=await response.json() as Exam;setExam(data);setRemaining(data.durationSeconds);setAnswers({});setIndex(0);setView('exam');setLoading(false)}
  const question=exam?.questions[index];
  const answered=Object.keys(answers).length;
  const progress=exam?Math.round(100*answered/exam.questions.length):0;
  const sectionLabel=question?.section==='CL'?'Competencia Lectora':'Razonamiento Lógico';

  if(view==='exam'&&exam&&question) return <main className="examShell">
    <header className="examHeader"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><div className="timer" aria-label="Tiempo restante">{formatTime(remaining)}</div><button className="submit" onClick={()=>submit(false)} disabled={loading}>Entregar examen</button></header>
    <aside className="navigator"><div className="navTitle"><span>Progreso</span><strong>{answered}/80</strong></div><div className="progress"><i style={{width:`${progress}%`}}/></div><div className="sectionTag">Competencia Lectora</div><div className="questionGrid">{exam.questions.slice(0,40).map((q,i)=><button key={q.id} className={`${i===index?'active ':''}${answers[q.id]?'done':''}`} onClick={()=>setIndex(i)}>{i+1}</button>)}</div><div className="sectionTag">Razonamiento Lógico</div><div className="questionGrid">{exam.questions.slice(40).map((q,i)=><button key={q.id} className={`${i+40===index?'active ':''}${answers[q.id]?'done':''}`} onClick={()=>setIndex(i+40)}>{i+41}</button>)}</div><div className="legend"><span><i className="answeredDot"/>Respondida</span><span><i/>Pendiente</span></div></aside>
    <section className="questionPanel"><div className="questionMeta"><span>{sectionLabel}</span><span>{question.topic?.replaceAll('_',' ')}</span></div><div className="questionNumber">Pregunta {index+1} de 80</div><h2>{question.question}</h2>{question.stimulus_assets?.map(src=><img className="stimulus" key={src} src={'/'+src} alt="Figura de apoyo de la pregunta"/>)}<div className="options">{Object.entries(question.options).map(([letter,text])=><button key={letter} className={answers[question.id]===letter?'selected':''} onClick={()=>setAnswers({...answers,[question.id]:letter})}><b>{letter}</b><span>{text}</span>{question.option_assets?.[letter]&&<img src={'/'+question.option_assets[letter]} alt={`Opción ${letter}`}/>}</button>)}</div><div className="questionActions"><button onClick={()=>setIndex(Math.max(0,index-1))} disabled={index===0}>← Anterior</button><button className="next" onClick={()=>setIndex(Math.min(79,index+1))} disabled={index===79}>Siguiente →</button></div></section>
  </main>;

  if(view==='result'&&result) return <main className="resultShell"><header className="topbar"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><button className="linkButton" onClick={()=>setView('home')}>Volver al inicio</button></header><section className="resultHero"><div className="eyebrow">RESULTADO BRUTO</div><h1>{result.totals.correct}<small>/ 80</small></h1><p>{result.totals.percentage}% de acierto · {formatTime(result.elapsedSeconds)} utilizados</p></section><section className="resultCards"><MetricCard title="Competencia Lectora" metric={result.sections.CL}/><MetricCard title="Razonamiento Lógico" metric={result.sections.RL}/><div className="scoreNotice"><strong>Puntaje estandarizado</strong><span>No disponible</span><p>{result.standardizedScoring.reason}</p></div></section><section className="resultStrip"><div><b>{result.totals.correct}</b><span>Correctas</span></div><div><b>{result.totals.incorrect}</b><span>Incorrectas</span></div><div><b>{result.totals.omitted}</b><span>Omitidas</span></div></section></main>;

  return <main className="shell"><header className="topbar"><div className="brand"><span className="brandMark">U</span><span>Umbral UdeA</span></div><div className="phase">Banco histórico · 202 preguntas validadas</div></header><section className="hero"><div className="eyebrow">SIMULADOR DE ADMISIÓN</div><h1>Entrena como<br/>vas a presentar.</h1><p>Un simulacro construido desde exámenes históricos de la Universidad de Antioquia, con condiciones reales y diagnóstico honesto.</p><button className="primary" onClick={start} disabled={loading}>{loading?'Preparando…':'Comenzar simulacro completo'} <span>→</span></button></section><section className="examCard" aria-label="Condiciones del simulacro"><div className="cardTop"><span>SIMULACRO COMPLETO</span><span className="liveDot">Condiciones UdeA</span></div><div className="clock">03:00:00</div><div className="metricGrid"><div><strong>80</strong><span>preguntas</span></div><div><strong>40 + 40</strong><span>CL · RL</span></div><div><strong>180</strong><span>minutos</span></div></div>{['Sin tiempo adicional','Preguntas históricas verificadas','Resultado bruto y diagnóstico'].map((x,i)=><div className="rule" key={x}><span>0{i+1}</span><p>{x}</p></div>)}</section></main>;
}

function MetricCard({title,metric}:{title:string;metric:Metric}){return <article className="metricCard"><span>{title}</span><strong>{metric.correct}<small>/40</small></strong><div><i style={{width:`${metric.percentage}%`}}/></div><p>{metric.percentage}% · {metric.omitted} omitidas</p></article>}
