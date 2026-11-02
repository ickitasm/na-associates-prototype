import React from 'react';
import { ArrowUpRight, CalendarDays, Clock3, FileText, FolderOpen, Image, Plus, Activity } from 'lucide-react';
import { money, dateFmt } from '../lib/utils';
import vectorLogo from '../public/Vector.svg';

export function Brand({ inverse = false }) {
  return (
    <button 
      className={`brand ${inverse ? 'brand-inverse' : ''}`} 
      onClick={() => window.dispatchEvent(new CustomEvent('na-home'))} 
      aria-label="NA Associates home"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <img 
        src={vectorLogo} 
        alt="NA Associates Logo" 
        style={{ height: '18px', width: 'auto', display: 'block' }} 
      />
    </button>
  );
}
export function PageIntro({ eyebrow, title, italic, desc }) { return <section className="page-intro wrap"><div className="eyebrow">{eyebrow}</div><h1>{title} <em>{italic}</em></h1>{desc && <p>{desc}</p>}</section>; }
export function Field({ label, required, placeholder, type='text', textarea=false }) { return <label className="field"><span>{label}{required && <b> *</b>}</span>{textarea ? <textarea placeholder={placeholder} required={required} rows="4"/> : <input type={type} placeholder={placeholder} required={required}/>}</label>; }
export function PublicFooter({ go }) { return <footer className="public-footer"><div className="wrap footer-top"><div><Brand inverse/><p>Architecture shaped by context,<br/>clarity, and everyday life.</p></div><div className="footer-links"><div><small>EXPLORE</small><button onClick={() => go('projects')}>Projects</button><button onClick={() => go('services')}>Services</button><button onClick={() => go('about')}>About</button></div><div><small>CONNECT</small><button onClick={() => go('career')}>Career</button><button onClick={() => go('contact')}>Contact</button><button onClick={() => go('home')}>Back to top ↑</button></div></div></div><div className="wrap footer-bottom"><span>© 2026 NA Associates</span><span>ARCHITECTURE & DESIGN · JAKARTA, INDONESIA</span></div></footer>; }
export function ProgressBar({ value=0 }) { return <div className="progress-bar"><span style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>; }
export function SectionHeading({ number, title, description, action, onAction }) { return <div className="workspace-section-head"><div><div className="eyebrow">{number} / PROJECT MODULE</div><h2>{title}</h2><p>{description}</p></div>{action && <button className="btn btn-outline" onClick={onAction}>{action} <ArrowUpRight size={14}/></button>}</div>; }
export function FileTile({ file, onOpen }) { return <button className="file-tile" onClick={onOpen}><div className={`file-thumb ${file.type==='JPG'?'image-thumb':''}`}>{file.type==='JPG'?<Image size={28}/>:<FileText size={28}/>}<span>{file.type}</span></div><div><strong>{file.name}</strong><small>{file.category} · {dateFmt(file.date)}</small></div><ArrowUpRight size={16}/></button>; }
export function InvoiceClientCard({ invoice, setModal }) { const paid=invoice.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0); const remaining=Math.max(0,invoice.amount-paid); const pending=invoice.payments.filter(p=>p.status==='Pending').reduce((s,p)=>s+p.claimed,0); return <article className="invoice-card"><div className="invoice-card-top"><div><small>{invoice.number}</small><strong>{money(invoice.amount)}</strong></div><StatusTag value={invoice.status}/></div><div className="invoice-meter"><div><span>Paid {money(paid)}</span><span>Remaining {money(remaining)}</span></div><ProgressBar value={invoice.amount ? paid/invoice.amount*100 : 0}/></div>{pending>0 && <div className="pending-inline"><Clock3 size={14}/> {money(pending)} menunggu verifikasi</div>}<div className="invoice-card-bottom"><span>Due date · {dateFmt(invoice.dueDate)}</span><button className="under-link" onClick={()=>setModal({type:'invoice-detail',invoice})}>View details <ArrowUpRight size={14}/></button></div></article>; }
export function MonthlyRecap({ invoices }) { const months = {}; invoices.filter(i=>i.status!=='Cancelled').forEach(i=>{const key=(i.issueDate||'').slice(0,7)||'Other'; if(!months[key]) months[key]={amount:0,paid:0,count:0}; months[key].amount+=i.amount; months[key].paid+=i.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0); months[key].count++;}); return <div className="recap-list">{Object.entries(months).sort((a,b)=>b[0].localeCompare(a[0])).map(([month,v])=><div className="recap-row" key={month}><div className="recap-month"><CalendarDays size={17}/><strong>{new Date(`${month}-01T00:00:00`).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</strong></div><div><small>INVOICES</small><strong>{v.count}</strong></div><div><small>INVOICED</small><strong>{money(v.amount)}</strong></div><div><small>VERIFIED PAID</small><strong>{money(v.paid)}</strong></div></div>)}{!Object.keys(months).length && <EmptyState title="No monthly records" detail="Monthly financial recap will appear here."/>}</div>; }
export function StatusTag({ value }) { const cls = String(value||'').toLowerCase().replaceAll(' ','-'); return <span className={`status-tag tag-${cls}`}>{value}</span>; }
export function EmptyState({ title, detail }) { return <div className="empty-state"><span><FolderOpen size={22}/></span><strong>{title}</strong><p>{detail}</p></div>; }
export function AdminPageHeader({ eyebrow, title, description, action, onAction }) { return <div className="admin-page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="btn btn-dark" onClick={onAction}><Plus size={16}/>{action}</button>}</div>; }
export function Metric({icon:Icon,label,value,note,accent}) { return <div className={`metric-card ${accent?'metric-alert':''}`}><span className="metric-icon"><Icon size={18}/></span><small>{label}</small><strong>{value}</strong><p>{note}</p></div>; }
export function ActivityTable({projects,limit}) { const items=projects.flatMap(p=>(p.activity||[]).map(a=>({...a,project:p.name}))).slice(0,limit||100); return <div className="activity-table">{items.map(a=><div className="activity-row" key={a.id}><span className="activity-dot"><Activity size={14}/></span><div><strong>{a.action}</strong><p>{a.detail}</p><small>{a.actor} · {a.date} · {a.project}</small></div></div>)}{!items.length&&<EmptyState title="No activity recorded" detail="Changes to project records will appear here."/>}</div>; }
