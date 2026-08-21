import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageSkeleton } from '../components/SystemStates'
import { storiesSeed } from '../data/contentSeed'

const shell='mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'
function Hero(){return <section className="bg-rb-900 py-20 text-white"><div className={shell}><p className="text-xs font-black uppercase tracking-[.18em] text-gold">Stories of change</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.04em] sm:text-5xl lg:text-6xl">People, progress and field updates.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Stories connect campaign activity to the people, volunteers and communities behind the work.</p></div></section>}

export function DynamicStoriesPage(){
  const [state,setState]=useState({loading:true,items:[],failed:false})
  useEffect(()=>{let active=true;fetch('/api/public/stories').then(r=>r.json()).then(data=>{if(active)setState({loading:false,items:data.success?(data.items||[]):[],failed:!data.success})}).catch(()=>{if(active)setState({loading:false,items:[],failed:true})});return()=>{active=false}},[])
  const items=state.failed?storiesSeed:state.items
  return <main className="bg-[#f8fbff]"><Hero/><section className="py-16 sm:py-20"><div className={shell}>{state.loading?<PageSkeleton rows={6}/>:items.length?<div className="grid gap-6 lg:grid-cols-3">{items.map(story=>{const image=story.coverImage||story.image;return <article key={story._id||story.slug} className="overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm">{image?<img src={image} alt={story.title} className="h-60 w-full object-cover"/>:<div className="grid h-60 place-items-center bg-rb-50 text-rb-400"><BookOpen size={38}/></div>}<div className="p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-rb-600">{story.category||'Foundation update'}</p><h2 className="mt-3 text-2xl font-black text-rb-900">{story.title}</h2><p className="mt-3 leading-7 text-slate-600">{story.excerpt}</p><Link to={`/stories/${story.slug}`} className="mt-5 inline-flex items-center gap-2 font-black text-rb-700">Read story <ArrowRight size={17}/></Link></div></article>})}</div>:<div className="rounded-[2rem] border border-dashed border-rb-200 bg-white p-10 text-center"><BookOpen className="mx-auto text-rb-500"/><h2 className="mt-4 text-2xl font-black text-rb-900">No stories published yet</h2><p className="mt-2 text-slate-600">Published stories from the admin panel will appear here automatically.</p></div>}</div></section></main>
}

export function DynamicStoryDetailsPage(){
  const {slug}=useParams();const [state,setState]=useState({loading:true,item:null,failed:false})
  useEffect(()=>{let active=true;fetch(`/api/public/stories/${encodeURIComponent(slug)}`).then(async r=>{const data=await r.json();if(active)setState({loading:false,item:r.ok&&data.success?data.item:null,failed:!r.ok})}).catch(()=>{if(active)setState({loading:false,item:null,failed:true})});return()=>{active=false}},[slug])
  if(state.loading)return <main className="bg-[#f8fbff] py-16"><div className={shell}><PageSkeleton rows={5}/></div></main>
  let story=state.item
  if(!story&&state.failed)story=storiesSeed.find(x=>x.slug===slug)
  if(!story)return <main className="bg-[#f8fbff] py-20"><div className={shell}><h1 className="text-3xl font-black text-rb-900">Story not found</h1><Link to="/stories" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17}/>Back to stories</Link></div></main>
  const image=story.coverImage||story.image;const paragraphs=Array.isArray(story.content)?story.content:String(story.content||'').split(/\n{2,}/).filter(Boolean)
  return <main className="bg-[#f8fbff]"><section className="relative min-h-[430px] overflow-hidden bg-rb-900">{image&&<img src={image} alt={story.title} className="absolute inset-0 h-full w-full object-cover opacity-40"/>}<div className="absolute inset-0 bg-gradient-to-r from-rb-900 via-rb-900/80 to-transparent"/><div className={`${shell} relative py-20 text-white`}><Link to="/stories" className="inline-flex items-center gap-2 text-sm font-black text-white/70"><ArrowLeft size={16}/>Stories</Link><p className="mt-12 text-xs font-black uppercase tracking-[.18em] text-gold">{story.category||'Foundation update'}</p><h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] sm:text-6xl">{story.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{story.excerpt}</p></div></section><section className="py-16 sm:py-20"><div className="mx-auto max-w-3xl px-5 sm:px-6">{paragraphs.map((paragraph,index)=><p key={`${index}-${paragraph.slice(0,20)}`} className="mb-6 text-lg leading-8 text-slate-700">{paragraph}</p>)}</div></section></main>
}
