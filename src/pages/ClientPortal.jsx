import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bell, Building2, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Clock3, CreditCard,
  Download, ExternalLink, FileCheck2, FileImage, FileText, FolderOpen, HardHat,
  Home, Image, LayoutDashboard, MapPin, Menu, MoreHorizontal, Package, Plus,
  RotateCcw, Search, Settings, ShieldCheck, ShoppingBag, Upload, User, UserPlus,
  Users, Wallet, X, Eye, Activity, AlertCircle, Sun, Moon, Camera, LogOut
} from 'lucide-react';
import { Brand, ProgressBar, SectionHeading, FileTile, InvoiceClientCard, MonthlyRecap, StatusTag, EmptyState } from '../components/ui';
import { money, dateFmt, getTimeGreeting, getProjectNextUp } from '../lib/utils';

function ClientShell({ db, client, projects, selectedProject, page, setPage, onOpen, onBack, onLogout, onReset, onNotify, setModal, updateProject, addActivity, workspaceSection, setWorkspaceSection, mobileNav, setMobileNav, theme, toggleTheme }) {
  if (page === 'my-projects') return <ClientProjectsView client={client} projects={projects} onOpen={onOpen} onLogout={onLogout} onReset={onReset} setModal={setModal} theme={theme} toggleTheme={toggleTheme}/>;
  return <ClientWorkspace db={db} client={client} project={selectedProject} onBack={onBack} onLogout={onLogout} onReset={onReset} setModal={setModal} updateProject={updateProject} addActivity={addActivity} onNotify={onNotify} workspaceSection={workspaceSection} setWorkspaceSection={setWorkspaceSection} mobileNav={mobileNav} setMobileNav={setMobileNav} theme={theme} toggleTheme={toggleTheme}/>;
}
function ClientTopbar({ client, onBack, onLogout, onReset, setModal, theme, toggleTheme }) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onMouseDown = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setAccountMenuOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountMenuOpen]);

  const initials = client?.name?.split(' ').map(x => x[0]).slice(0, 2).join('') || 'CL';

  return (
    <header className="portal-topbar">
      <div className="portal-top-left">
        <Brand/>
        <span className="portal-label">CLIENT PORTAL</span>
      </div>
      <div className="portal-top-right">
        <button className="icon-btn theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to night mode'} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
        <button className="icon-btn" onClick={() => setModal({ type: 'client-notifications' })} aria-label="Notifications">
          <Bell size={18}/>
          <i className="notification-dot"/>
        </button>
        <div className="account-menu-wrap" ref={accountMenuRef}>
          <button
            type="button"
            className={`user-chip user-chip-trigger ${accountMenuOpen ? 'is-open' : ''}`}
            onClick={() => setAccountMenuOpen(v => !v)}
            aria-expanded={accountMenuOpen}
            aria-haspopup="menu"
            aria-label="Client account menu"
          >
            <span className="avatar">{initials}</span>
            <span className="user-chip-text">
              <strong>{client?.name || 'Client'}</strong>
              <small>Client account</small>
            </span>
          </button>
          {accountMenuOpen && (
            <div className="account-dropdown" role="menu">
              <div className="account-dropdown-head">
                <span className="avatar">{initials}</span>
                <div>
                  <strong>{client?.name || 'Client'}</strong>
                  <small>{client?.username ? `@${client.username}` : (client?.email || 'Client account')}</small>
                </div>
              </div>
              <button
                type="button"
                className="account-signout-btn"
                role="menuitem"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={15}/>
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
        <button className="icon-btn mobile-menu" onClick={onReset} title="Reset data" aria-label="Reset data">
          <RotateCcw size={16}/>
        </button>
      </div>
    </header>
  );
}

function ClientProjectsView({ client, projects, onOpen, onLogout, onReset, setModal, theme, toggleTheme }) {
  const [greeting, setGreeting] = useState(() => getTimeGreeting());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const firstName = client?.name?.trim()?.split(/\s+/)[0] || 'there';

  return <div className="client-app"><ClientTopbar client={client} onLogout={onLogout} onReset={onReset} setModal={setModal} theme={theme} toggleTheme={toggleTheme}/><main className="client-list-page"><div className="client-welcome"><div><div className="eyebrow">CLIENT SPACE / YOUR PROJECTS</div><h1>{greeting},<br/><em>{firstName}.</em></h1><p>Here is an overview of your projects with NA Associates.</p></div><div className="welcome-stamp">NA<br/><span>CLIENT SPACE</span></div></div><div className="list-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>My projects <small>{projects.length.toString().padStart(2,'0')}</small></h2></div><span className="muted">Select a project to view its details and updates.</span></div><div className="client-project-grid">{projects.map(p => { const nextUp = getProjectNextUp(p); return <button className="client-project-card" key={p.id} onClick={() => onOpen(p.id)}><div className="client-project-image"><img src={p.cover}/><span className={`status-pill ${p.status === 'Completed' ? 'complete' : ''}`}>{p.status}</span></div><div className="client-project-info"><div className="project-card-top"><span>{p.code}</span><ArrowUpRight size={17}/></div><h3>{p.name}</h3><p><MapPin size={13}/>{p.location}</p><div className="progress-row"><span>PROJECT PROGRESS</span><strong>{p.progress}%</strong></div><ProgressBar value={p.progress}/><div className="client-project-bottom"><span>NEXT UP</span><strong>{nextUp.label}</strong></div></div></button>; })}</div>{!projects.length && <EmptyState title="Belum ada proyek" detail="Tim NA Associates akan menambahkan proyek ke akun Anda."/>}</main></div>;
}

const workspaceNav = [
  ['overview','Overview',Home],['design','A. Output & Design',Image],['progress','B. Progress & Field Ops',Activity],['legal','C. Legal Documents',FileText],['billing','D. Billing & Payments',Wallet],['shopping','E. Shopping List',ShoppingBag],['recap','F. Monthly Recap',CalendarDays]
];
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function ClientWorkspace({ db, client, project, onBack, onLogout, onReset, setModal, updateProject, addActivity, onNotify, workspaceSection, setWorkspaceSection, mobileNav, setMobileNav, theme, toggleTheme }) {
  const [openSection, setOpenSection] = useState('overview');
  const scrollAnimRef = useRef(null);
  const scrollSpyLockRef = useRef(false);
  const prevScrollBehaviorRef = useRef(null);
  const interruptCleanupRef = useRef(null);

  const cancelSoftScroll = useCallback(() => {
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
    if (interruptCleanupRef.current) {
      interruptCleanupRef.current();
      interruptCleanupRef.current = null;
    }
    if (prevScrollBehaviorRef.current !== null) {
      document.documentElement.style.scrollBehavior = prevScrollBehaviorRef.current;
      prevScrollBehaviorRef.current = null;
    }
    scrollSpyLockRef.current = false;
  }, []);

  useEffect(() => {
    cancelSoftScroll();
    setOpenSection('overview');
  }, [project?.id, cancelSoftScroll]);

  useEffect(() => {
    return () => cancelSoftScroll();
  }, [cancelSoftScroll]);

  useEffect(() => {
    const handler = () => {
      if (scrollSpyLockRef.current) return;
      const topbar = document.querySelector('.portal-topbar');
      const triggerLine = (topbar ? topbar.getBoundingClientRect().height : 72) + 98;
      const ids = workspaceNav.map(x => x[0]);
      let current = 'overview';
      ids.forEach(id => {
        const el = document.getElementById(`section-${id}`);
        if (el && el.getBoundingClientRect().top <= triggerLine) current = id;
      });
      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 24)) {
        current = ids[ids.length - 1];
      }
      setOpenSection(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const jump = useCallback((id) => {
    cancelSoftScroll();
    setWorkspaceSection(id);
    setOpenSection(id);
    setMobileNav(false);

    const el = document.getElementById(`section-${id}`);
    if (!el) return;

    const topbar = document.querySelector('.portal-topbar');
    const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 72;
    const clearance = topbarHeight + 20;
    const rawTarget = id === 'overview'
      ? 0
      : Math.max(0, el.getBoundingClientRect().top + window.scrollY - clearance);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = Math.min(rawTarget, maxScroll);
    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReduced) {
      window.scrollTo(0, targetY);
      return;
    }

    scrollSpyLockRef.current = true;
    prevScrollBehaviorRef.current = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    const onUserInterrupt = (e) => {
      if (e.type === 'keydown') {
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (!scrollKeys.includes(e.key)) return;
      }
      cancelSoftScroll();
    };

    window.addEventListener('wheel', onUserInterrupt, { passive: true, once: true });
    window.addEventListener('touchstart', onUserInterrupt, { passive: true, once: true });
    window.addEventListener('keydown', onUserInterrupt);
    interruptCleanupRef.current = () => {
      window.removeEventListener('wheel', onUserInterrupt);
      window.removeEventListener('touchstart', onUserInterrupt);
      window.removeEventListener('keydown', onUserInterrupt);
    };

    const duration = 400;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        cancelSoftScroll();
        setOpenSection(id);
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  }, [cancelSoftScroll, setMobileNav, setWorkspaceSection]);
  const publishedReports = (project.reports||[]).filter(r=>r.visibility==='Published');
  const publishedFiles = (project.files||[]).filter(f=>f.visibility==='Published');
  const publishedLegal = (project.legal||[]).filter(f=>f.visibility==='Published');
  const publishedShopping = (project.shopping||[]).filter(s=>s.visibility==='Published');
  const invoices = project.invoices||[];
  const totalRemaining = invoices.filter(i=>i.status!=='Cancelled').reduce((sum,i)=>sum + Math.max(0,i.amount - i.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0)),0);
  
  // Check pending / due bills for In-App website alert banner
  const unpaidInvoices = invoices.filter(i => i.status !== 'Cancelled' && i.status !== 'Paid');
  const hasUnpaid = unpaidInvoices.length > 0;

  return <div className="client-app">
    <ClientTopbar client={client} onBack={onBack} onLogout={onLogout} onReset={onReset} setModal={setModal} onNotify={onNotify} theme={theme} toggleTheme={toggleTheme}/>
    <div className="workspace-shell">
      {mobileNav && <div className="mobile-nav-backdrop" onClick={() => setMobileNav(false)} aria-hidden="true" />}
      <aside className={`workspace-sidebar ${mobileNav?'sidebar-open':''}`}>
        <button className="back-projects" onClick={onBack}><ArrowLeft size={15}/> All projects</button>
        <div className="sidebar-project"><img src={project.cover} alt={project.name}/><small>{project.code}</small><strong>{project.name}</strong><span><MapPin size={12}/>{project.location}</span></div>
        <div className="workspace-nav-label">PROJECT WORKSPACE</div>
        <nav className="workspace-nav">{workspaceNav.map(([id,label,Icon])=><button key={id} type="button" className={openSection===id?'active':''} aria-current={openSection===id?'location':undefined} onClick={()=>jump(id)}><Icon size={16}/><span>{label}</span>{id==='billing' && <i className="nav-count"/>}</button>)}</nav>
        <div className="sidebar-progress"><div><small>OVERALL PROGRESS</small><strong>{project.progress}%</strong></div><ProgressBar value={project.progress}/><span>Target completion · {dateFmt(project.targetDate)}</span></div>
      </aside>
      <main className="workspace-main">
        <div className="workspace-topline"><div className="breadcrumb">My Projects <ChevronRight size={13}/> {project.name}</div><span className={`status-pill ${project.status==='Completed'?'complete':''}`}>{project.status}</span></div>

        <div className="workspace-banners">
          {(project.status==='On Hold'||project.status==='Ready to Resume') && (
            <div className={`project-status-notice ${project.status==='On Hold'?'project-on-hold-banner':'ready'}`}>
              <AlertCircle size={18}/>
              <div>
                <strong>
                  {project.status==='On Hold'
                    ? 'Pemberitahuan: Proyek Sedang Ditahan (On Hold)'
                    : 'Proyek Siap Dilanjutkan (Ready to Resume)'}
                </strong>
                {project.status==='On Hold' && (
                  <p className="hold-reason-text">
                    <strong>Alasan Penahanan:</strong> {project.holdReason || project.invoices?.find(i=>i.reason)?.reason || 'Penahanan sementara oleh tim studio (terkait penagihan atau tinjauan teknis).'}
                  </p>
                )}
                <p>
                  {project.status==='On Hold'
                    ? 'Pembaruan milestone dan daily log baru dijeda sementara. Anda tetap dapat mengakses laporan terdahulu, dokumen, melihat invoice, dan mengunggah bukti pembayaran.'
                    : 'Kondisi penahanan telah diselesaikan. Tim studio sedang menjadwalkan aktivasi kembali operasional proyek.'}
                </p>
              </div>
            </div>
          )}

          {hasUnpaid && (
            <div className="project-status-notice project-billing-banner">
              <AlertCircle size={18}/>
              <div>
                <strong>Pengingat Tagihan & Termin (H-7 / Jatuh Tempo)</strong>
                <p>Terdapat termin pembayaran aktif sejumlah <strong>{money(totalRemaining)}</strong> ({unpaidInvoices.map(i=>i.number).join(', ')}). Silakan lakukan pembayaran dan unggah bukti transfer melalui modul Billing.</p>
              </div>
            </div>
          )}
        </div>

        <section className="workspace-hero" id="section-overview"><div className="workspace-hero-img"><img src={project.cover}/><div className="workspace-hero-overlay"/></div><div className="workspace-hero-content"><div className="eyebrow light">{project.code} / PROJECT OVERVIEW</div><h1>{project.name}<span>.</span></h1><p><MapPin size={14}/>{project.location}</p><div className="hero-progress"><span>PROJECT PROGRESS</span><strong>{project.progress}%</strong></div><ProgressBar value={project.progress}/></div></section>
        {(() => { const nextUp = getProjectNextUp(project); return <div className="workspace-stats"><div><small>LAND AREA</small><strong>{project.landArea || '—'}</strong></div><div><small>BUILDING AREA</small><strong>{project.buildingArea || '—'}</strong></div><div><small>NEXT UP</small><strong>{nextUp.label}</strong>{nextUp.label !== '—' && nextUp.label !== 'DONE' && nextUp.date && <span>{dateFmt(nextUp.date)}</span>}</div><div><small>OUTSTANDING</small><strong>{money(totalRemaining)}</strong></div></div>; })()}
        <section className="workspace-section" id="section-design"><SectionHeading number="A" title="Output & Design" description="Design development and project deliverables shared by the studio." action="Browse files" onAction={()=>setModal({type:'file-list',project})}/><div className="file-grid">{publishedFiles.map(f=><FileTile key={f.id} file={f} onOpen={()=>setModal({type:'file-preview',file:f})}/>)}{!publishedFiles.length && <EmptyState title="No files published yet" detail="New design outputs will appear here once shared by the studio."/>}</div></section>
        <section className="workspace-section" id="section-progress">
          <SectionHeading number="B" title="Progress & Field Operations" description="A transparent view of milestones and published site updates."/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="panel">
              <div className="panel-heading">
                <h3>Project timeline milestones</h3>
                <span className="subtle-tag">{project.milestones?.length||0} milestones</span>
              </div>
              <div className="timeline">
                {(project.milestones||[]).map((m,i)=>(
                  <div className={`timeline-item ${m.status==='Completed'?'done':''} ${m.status==='In Progress'?'current':''}`} key={m.id}>
                    <div className="timeline-marker">{m.status==='Completed'?<Check size={12}/>:i+1}</div>
                    <div className="timeline-body">
                      <div><strong>{m.title}</strong><span>{dateFmt(m.date)}</span></div>
                      <small>{m.status} · Progress {m.progress}%</small>
                      {m.status==='In Progress' && <ProgressBar value={m.progress}/>}
                    </div>
                  </div>
                ))}
              </div>
              {!project.milestones?.length && <EmptyState title="Timeline not available" detail="Milestones will appear here."/>}
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h3>Published daily progress updates</h3>
                <span className="subtle-tag">{publishedReports.length} reports</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {publishedReports.map(r => {
                  const workers = r.workers || [];
                  const hadirCount = workers.filter(w => w.attendance === 'Hadir').length;
                  const photoNames = r.photoNames || ['Foto-lapangan-1.jpg', 'Foto-lapangan-2.jpg'];
                  return (
                    <article key={r.id} className="client-update-card">
                      <div className="client-update-head">
                        <span className="client-update-meta">{dateFmt(r.date)} · {r.category}</span>
                        <span className="client-update-prog">{r.fieldNote || 'Log Operasional'}</span>
                      </div>
                      <h4 className="client-update-title">{r.title}</h4>
                      <p className="client-update-desc">{r.description}</p>
                      
                      <div className="client-update-workforce">
                        <div><strong>Personil Lapangan Bertugas:</strong> {hadirCount > 0 ? `${hadirCount} Personil Aktif` : `${workers.length} Pekerja`}</div>
                        <div><strong>Cakupan Kerja:</strong> {workers.map(w => w.task).filter(Boolean).slice(0, 3).join(' · ') || 'Pekerjaan konstruksi & struktur'}</div>
                        {r.tools && <div><strong>Peralatan Operasional:</strong> {r.tools}</div>}
                      </div>

                      <div className="client-update-photos">
                        {photoNames.map((pName, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="client-photo-chip"
                            onClick={() => setModal({ type: 'photo-lightbox', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', caption: `${r.title} — ${pName}` })}
                            title="Klik untuk memperbesar foto"
                          >
                            <Camera size={14}/>
                            <span>{pName}</span>
                          </button>
                        ))}
                      </div>

                      <div className="client-update-actions">
                        <button className="btn btn-small btn-outline" onClick={() => setModal({ type: 'report-detail', report: r, project, isClient: true })}>
                          View full log details <ArrowUpRight size={14}/>
                        </button>
                      </div>
                    </article>
                  );
                })}
                {!publishedReports.length && <EmptyState title="No updates yet" detail="Published field reports will appear here."/>}
              </div>
            </div>
          </div>
        </section>
        <section className="workspace-section" id="section-legal"><SectionHeading number="C" title="Legal Documents" description="Contracts, addenda, and approved supporting documents."/><div className="document-list">{publishedLegal.map(l=><div className="document-row" key={l.id}><span className="document-icon"><FileText size={19}/></span><div><strong>{l.name}</strong><small>{l.version} · {dateFmt(l.date)}</small></div><button className="icon-btn" onClick={()=>setModal({type:'file-preview',file:{name:l.name,type:'PDF',description:`${l.version} · ${dateFmt(l.date)}`}})}><Eye size={17}/></button><button className="icon-btn" onClick={()=>setModal({type:'info',title:'Legal document',body:'Dokumen proyek tersimpan dalam format resmi studio.'})}><Download size={17}/></button></div>)}{!publishedLegal.length && <EmptyState title="No legal documents" detail="Approved documents will be shared here."/>}</div></section>
        <section className="workspace-section" id="section-billing"><SectionHeading number="D" title="Billing & Payments" description="Invoices, payment records, and official receipts." action="Upload payment proof" onAction={()=>setModal({type:'payment-upload',project})}/><div className="billing-summary"><div><small>TOTAL OUTSTANDING</small><strong>{money(totalRemaining)}</strong></div><div><small>INVOICES</small><strong>{invoices.filter(i=>i.status!=='Cancelled').length}</strong></div><div><small>PAYMENTS UNDER REVIEW</small><strong>{invoices.filter(i=>i.status!=='Cancelled').reduce((s,i)=>s+i.payments.filter(p=>p.status==='Pending').length,0)}</strong></div></div><div className="invoice-list">{invoices.filter(i=>i.status!=='Cancelled').map(inv=><InvoiceClientCard key={inv.id} invoice={inv} setModal={setModal}/>)}{!invoices.length && <EmptyState title="No invoices yet" detail="Invoices issued by the studio will appear here."/>}</div></section>
        <section className="workspace-section" id="section-shopping"><SectionHeading number="E" title="Shopping List" description="Materials planned for your project and their procurement status."/><div className="shopping-list">{publishedShopping.map(s=><div className="shopping-row" key={s.id}><div className="shopping-date">{dateFmt(s.date)}</div><div className="shopping-name"><strong>{s.material}</strong><small>{s.specification}</small></div><div className="shopping-qty">{s.quantity} {s.unit}</div><StatusTag value={s.status}/></div>)}{!publishedShopping.length && <EmptyState title="No materials published" detail="Material requirements will appear here."/>}</div></section>
        <section className="workspace-section" id="section-recap"><SectionHeading number="F" title="Monthly Recapitulation" description="A monthly overview of your invoices and verified payments."/><MonthlyRecap invoices={invoices}/></section>
        <footer className="workspace-footer"><Brand/><span>Need assistance? Contact the NA Associates team.</span><button className="under-link" onClick={()=>setModal({type:'info',title:'Contact the studio',body:'For project questions, contact hello@naassociates.com or use the official studio WhatsApp channel.'})}>Contact studio <ArrowUpRight size={14}/></button></footer>
      </main>
    </div>
    <button type="button" className={`mobile-workspace-nav ${mobileNav ? 'is-open' : ''}`} onClick={()=>setMobileNav(v=>!v)} aria-expanded={mobileNav}>
      <Menu size={17}/>
      <span>{workspaceNav.find(x => x[0] === openSection)?.[1] || 'Project sections'}</span>
      <ChevronDown size={16} className="mobile-nav-chevron"/>
    </button>
  </div>;
}
export { ClientShell };
