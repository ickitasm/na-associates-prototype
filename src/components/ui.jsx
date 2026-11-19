import React from 'react';
import { ArrowUpRight, CalendarDays, Clock3, FileText, FolderOpen, Image, Plus, Activity, ExternalLink } from 'lucide-react';
import { money, dateFmt } from '../lib/utils';
import vectorLogo from '../public/Vector.svg';

export function WhatsAppIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93Z"/>
    </svg>
  );
}

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
export function FileTile({ file, onOpen }) {
  const isImage = file.type === 'JPG' || file.type === 'PNG' || file.type === 'WEBP' || file.category === 'Rendering';
  return (
    <div className="file-tile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px', padding: '12px', background: 'var(--white)', border: '1px solid var(--line)' }} onClick={onOpen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <div className={`file-thumb ${isImage?'image-thumb':''}`}>{isImage?<Image size={28}/>:<FileText size={28}/>}<span>{file.type}</span></div>
        <div style={{ flex: 1, minWidth: 0 }}><strong>{file.name}</strong><small>{file.category} · {dateFmt(file.date)}</small></div>
        <ArrowUpRight size={16}/>
      </div>
    </div>
  );
}
export function InvoiceClientCard({ invoice, setModal }) { const paid=invoice.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0); const remaining=Math.max(0,invoice.amount-paid); const pending=invoice.payments.filter(p=>p.status==='Pending').reduce((s,p)=>s+p.claimed,0); return <article className="invoice-card"><div className="invoice-card-top"><div><small>{invoice.number}</small><strong>{money(invoice.amount)}</strong></div><StatusTag value={invoice.status}/></div><div className="invoice-meter"><div><span>Paid {money(paid)}</span><span>Remaining {money(remaining)}</span></div><ProgressBar value={invoice.amount ? paid/invoice.amount*100 : 0}/></div>{pending>0 && <div className="pending-inline"><Clock3 size={14}/> {money(pending)} menunggu verifikasi</div>}<div className="invoice-card-bottom"><span>Due date · {dateFmt(invoice.dueDate)}</span><button className="under-link" onClick={()=>setModal({type:'invoice-detail',invoice})}>View details <ArrowUpRight size={14}/></button></div></article>; }
export function MonthlyRecap({ invoices }) { const months = {}; invoices.filter(i=>i.status!=='Cancelled').forEach(i=>{const key=(i.issueDate||'').slice(0,7)||'Other'; if(!months[key]) months[key]={amount:0,paid:0,count:0}; months[key].amount+=i.amount; months[key].paid+=i.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0); months[key].count++;}); return <div className="recap-list">{Object.entries(months).sort((a,b)=>b[0].localeCompare(a[0])).map(([month,v])=><div className="recap-row" key={month}><div className="recap-month"><CalendarDays size={17}/><strong>{new Date(`${month}-01T00:00:00`).toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</strong></div><div><small>INVOICES</small><strong>{v.count}</strong></div><div><small>INVOICED</small><strong>{money(v.amount)}</strong></div><div><small>VERIFIED PAID</small><strong>{money(v.paid)}</strong></div></div>)}{!Object.keys(months).length && <EmptyState title="No monthly records" detail="Monthly financial recap will appear here."/>}</div>; }
export function StatusTag({ value }) { const cls = String(value||'').toLowerCase().replaceAll(' ','-'); return <span className={`status-tag tag-${cls}`}>{value}</span>; }
export function EmptyState({ title, detail }) { return <div className="empty-state"><span><FolderOpen size={22}/></span><strong>{title}</strong><p>{detail}</p></div>; }
export function AdminPageHeader({ eyebrow, title, description, action, onAction }) { return <div className="admin-page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="btn btn-dark" onClick={onAction}><Plus size={16}/>{action}</button>}</div>; }
export function Metric({icon:Icon,label,value,note,accent}) { return <div className={`metric-card ${accent?'metric-alert':''}`}><span className="metric-icon"><Icon size={18}/></span><small>{label}</small><strong>{value}</strong><p>{note}</p></div>; }
export function ActivityTable({projects,limit}) { const items=projects.flatMap(p=>(p.activity||[]).map(a=>({...a,project:p.name}))).slice(0,limit||100); return <div className="activity-table">{items.map(a=><div className="activity-row" key={a.id}><span className="activity-dot"><Activity size={14}/></span><div><strong>{a.action}</strong><p>{a.detail}</p><small>{a.actor} · {a.date} · {a.project}</small></div></div>)}{!items.length&&<EmptyState title="No activity recorded" detail="Changes to project records will appear here."/>}</div>; }
