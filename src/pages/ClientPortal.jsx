import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bell, Building2, CalendarDays,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Clock3, CreditCard,
  Download, ExternalLink, FileCheck2, FileImage, FileText, Folder, HardHat,
  Home, Image, LayoutDashboard, MapPin, Menu, MoreHorizontal, Package, Plus,
  RotateCcw, Search, Settings, ShieldCheck, ShoppingBag, Upload, User, UserPlus,
  Users, Wallet, X, Eye, Activity, AlertCircle, Sun, Moon, Camera, LogOut
} from 'lucide-react';
import { Brand, ProgressBar, SectionHeading, FileTile, InvoiceClientCard, MonthlyRecap, StatusTag, EmptyState } from '../components/ui';
import { money, dateFmt, getTimeGreeting, getProjectLatestUpdate, groupReportsByMonthAndWeek, filterClientNotifications } from '../lib/utils';

function ClientShell({ db, client, projects, selectedProject, page, setPage, onOpen, onBack, onLogout, onReset, onNotify, setModal, updateProject, addActivity, workspaceSection, setWorkspaceSection, mobileNav, setMobileNav, theme, toggleTheme }) {
  const notifications = db?.notifications || [];
  if (page === 'my-projects') return <ClientProjectsView client={client} projects={projects} notifications={notifications} onOpen={onOpen} onLogout={onLogout} onReset={onReset} setModal={setModal} theme={theme} toggleTheme={toggleTheme}/>;
  return <ClientWorkspace db={db} client={client} project={selectedProject} notifications={notifications} onBack={onBack} onLogout={onLogout} onReset={onReset} setModal={setModal} updateProject={updateProject} addActivity={addActivity} onNotify={onNotify} workspaceSection={workspaceSection} setWorkspaceSection={setWorkspaceSection} mobileNav={mobileNav} setMobileNav={setMobileNav} theme={theme} toggleTheme={toggleTheme}/>;
}
function ClientTopbar({ client, projects = [], notifications = [], onBack, onLogout, onReset, setModal, theme, toggleTheme }) {
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
  const visibleNotifications = filterClientNotifications(notifications, projects);
  const hasVerification = projects.some(p =>
    (p.activity || []).some(a =>
      a &&
      a.internal !== true &&
      a.visibility !== 'Draft' &&
      a.visibility !== 'Internal Only' &&
      a.visibility !== 'internal' &&
      (a.category === 'verification' || /approved client payment|rejected client payment|payment verified|payment rejected/i.test(a.action || ''))
    )
  );
  const hasUnpaidAlerts = projects.some(p =>
    (p.invoices || []).some(i => i.status !== 'Cancelled' && i.status !== 'Paid')
  );
  const hasActiveBell = visibleNotifications.some(n => !n.read) || hasVerification || hasUnpaidAlerts;

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
        <button className="icon-btn" onClick={() => setModal({ type: 'client-notifications', projects })} aria-label="Notifications">
          <Bell size={18}/>
          {hasActiveBell && <i className="notification-dot"/>}
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

function ClientProjectsView({ client, projects, notifications = [], onOpen, onLogout, onReset, setModal, theme, toggleTheme }) {
  const [greeting, setGreeting] = useState(() => getTimeGreeting());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const firstName = client?.name?.trim()?.split(/\s+/)[0] || 'there';

  return <div className="client-app"><ClientTopbar client={client} projects={projects} notifications={notifications} onLogout={onLogout} onReset={onReset} setModal={setModal} theme={theme} toggleTheme={toggleTheme}/><main className="client-list-page"><div className="client-welcome"><div><div className="eyebrow">CLIENT SPACE / YOUR PROJECTS</div><h1>{greeting},<br/><em>{firstName}.</em></h1><p>Here is an overview of your projects with NA Associates.</p></div><div className="welcome-stamp">NA<br/><span>CLIENT SPACE</span></div></div><div className="list-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>My projects <small>{projects.length.toString().padStart(2,'0')}</small></h2></div><span className="muted">Select a project to view its details and updates.</span></div><div className="client-project-grid">{projects.map(p => { const latestUpdate = getProjectLatestUpdate(p); return <button className="client-project-card" key={p.id} onClick={() => onOpen(p.id)}><div className="client-project-image"><img src={p.cover} alt={p.name}/><span className={`status-pill ${p.status === 'Completed' ? 'complete' : ''}`}>{p.status}</span></div><div className="client-project-info"><div className="project-card-top"><span>{p.code}</span><ArrowUpRight size={17}/></div><h3>{p.name}</h3><p><MapPin size={13}/>{p.location}</p><div className="progress-row"><span>PROJECT PROGRESS</span><strong>{p.progress}%</strong></div><ProgressBar value={p.progress}/><div className="client-project-bottom"><span>LATEST UPDATE</span><strong>{latestUpdate.label}</strong></div></div></button>; })}</div>{!projects.length && <EmptyState title="Belum ada proyek" detail="Tim NA Associates akan menambahkan proyek ke akun Anda."/>}</main></div>;
}

const workspaceNav = [
  ['overview','Overview',Home],['design','Output & Design',Image],['progress','Progress & Field Ops',Activity],['legal','Legal Documents',FileText],['billing','Billing & Payments',Wallet],['shopping','Shopping List',ShoppingBag],['recap','Monthly Recap',CalendarDays],['section-activity','Activity Log',Activity]
];
function formatActivityDate(d) {
  if (!d) return '—';
  const str = String(d).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return dateFmt(str);
  const m = str.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
  if (m) return `${dateFmt(m[1])} · ${m[2]}`;
  return str;
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function ClientWorkspace({ db, client, project, notifications = [], onBack, onLogout, onReset, setModal, updateProject, addActivity, onNotify, workspaceSection, setWorkspaceSection, mobileNav, setMobileNav, theme, toggleTheme }) {
  const [openSection, setOpenSection] = useState('overview');
  const [designQuery, setDesignQuery] = useState('');
  const [legalQuery, setLegalQuery] = useState('');
  const [expandedActivityIds, setExpandedActivityIds] = useState({});
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const scrollAnimRef = useRef(null);
  const scrollSpyLockRef = useRef(false);
  const prevScrollBehaviorRef = useRef(null);
  const interruptCleanupRef = useRef(null);

  const toggleActivityRow = (id) => {
    setExpandedActivityIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setDesignQuery('');
    setLegalQuery('');
    setExpandedActivityIds({});
    setActiveMonthIndex(0);
    setExpandedWeeks({});
  }, [project.id]);

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
        const domId = id.startsWith('section-') ? id : `section-${id}`;
        const el = document.getElementById(domId);
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

    const domId = id.startsWith('section-') ? id : `section-${id}`;
    const el = document.getElementById(domId);
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
  const publishedReports = [...(project.reports||[])]
    .filter(r=>r.visibility==='Published')
    .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const publishedFiles = [...(project.files||[])]
    .filter(f=>f.visibility==='Published')
    .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const normalizedDesignQuery = designQuery.trim().toLowerCase();
  const filteredDesignFiles = normalizedDesignQuery
    ? publishedFiles.filter(f => [f.name, f.category, f.type].filter(Boolean).some(v => String(v).toLowerCase().includes(normalizedDesignQuery)))
    : publishedFiles;
  const publishedLegal = [...(project.legal||[])]
    .filter(f=>f.visibility==='Published')
    .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const normalizedLegalQuery = legalQuery.trim().toLowerCase();
  const filteredLegalDocs = normalizedLegalQuery
    ? publishedLegal.filter(l => [l.name, l.version].filter(Boolean).some(v => String(v).toLowerCase().includes(normalizedLegalQuery)))
    : publishedLegal;
  const publishedShopping = [...(project.shopping||[])]
    .filter(s=>s.visibility==='Published')
    .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const invoices = project.invoices||[];
  const activeInvoices = invoices.filter(i=>i.status!=='Cancelled');
  const totalRemaining = activeInvoices.reduce((sum,i)=>sum + Math.max(0,i.amount - i.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0)),0);
  const clientNameLower = String(client?.name || '').trim().toLowerCase();
  const clientUploadLogs = [...(project.activity || [])]
    .filter(a => {
      if (!a) return false;
      if (a.internal === true) return false;
      if (a.visibility === 'Draft' || a.visibility === 'Internal Only' || a.visibility === 'internal') return false;
      const actorLower = String(a.actor || '').trim().toLowerCase();
      if (/\b(admin|staff)\b/i.test(actorLower)) return false;
      if (a.category === 'upload') return true;
      const isClientActor = actorLower === 'client' || (clientNameLower && actorLower === clientNameLower);
      const actionText = `${a.action || ''} ${a.detail || ''}`.toLowerCase();
      const isUploadAction = /upload|payment proof|bukti pembayaran|unggah/.test(actionText);
      return isClientActor && isUploadAction;
    })
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  
  // Check pending / due bills for In-App website alert banner
  const unpaidInvoices = invoices.filter(i => i.status !== 'Cancelled' && i.status !== 'Paid');
  const hasUnpaid = unpaidInvoices.length > 0;

  return <div className="client-app">
    <ClientTopbar client={client} projects={[project]} notifications={notifications} onBack={onBack} onLogout={onLogout} onReset={onReset} setModal={setModal} onNotify={onNotify} theme={theme} toggleTheme={toggleTheme}/>
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
                    ? 'Pembaruan progres dan daily log baru dijeda sementara. Anda tetap dapat mengakses laporan terdahulu, dokumen, melihat invoice, dan mengunggah bukti pembayaran.'
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

        <section className="workspace-hero" id="section-overview"><div className="workspace-hero-img"><img src={project.cover} alt={project.name}/><div className="workspace-hero-overlay"/></div><div className="workspace-hero-content"><div className="eyebrow light">{project.code} / PROJECT OVERVIEW</div><h1>{project.name}<span>.</span></h1><p><MapPin size={14}/>{project.location}</p><div className="hero-progress"><span>PROJECT PROGRESS</span><strong>{project.progress}%</strong></div><ProgressBar value={project.progress}/></div></section>
        {(() => { const latestUpdate = getProjectLatestUpdate(project); return <div className="workspace-stats"><div><small>LAND AREA</small><strong>{project.landArea || '—'}</strong></div><div><small>BUILDING AREA</small><strong>{project.buildingArea || '—'}</strong></div><div><small>LATEST UPDATE</small><strong>{latestUpdate.label}</strong>{latestUpdate.label !== '—' && latestUpdate.label !== 'DONE' && latestUpdate.date && <span>{dateFmt(latestUpdate.date)}</span>}</div><div><small>OUTSTANDING</small><strong>{money(totalRemaining)}</strong></div></div>; })()}
        <section className="workspace-section" id="section-design">
          <SectionHeading number="A" title="Output & Design"/>
          <div className="client-module-search">
            <Search size={15}/>
            <input
              type="text"
              placeholder="Search design outputs by title, category, or file type..."
              value={designQuery}
              onChange={e=>setDesignQuery(e.target.value)}
              aria-label="Search design outputs"
            />
            {designQuery && (
              <button
                type="button"
                className="client-search-clear"
                aria-label="Clear search"
                onClick={()=>setDesignQuery('')}
              >
                <X size={14}/>
              </button>
            )}
          </div>
          <div className="client-design-scroll">
            <div className="file-grid">
              {filteredDesignFiles.map(f=><FileTile key={f.id} file={f} onOpen={()=>setModal({type:'file-preview',file:f})}/>)}
              {!filteredDesignFiles.length && (
                <EmptyState
                  title={publishedFiles.length ? 'No matching design outputs' : 'No files published yet'}
                  detail={publishedFiles.length ? `No files match "${designQuery.trim()}". Try another title, category, or file type.` : 'New design outputs will appear here once shared by the studio.'}
                />
              )}
            </div>
          </div>
        </section>
        <section className="workspace-section" id="section-progress">
          <SectionHeading
            number="B"
            title="Progress & Field Operations"
            badge={`${publishedReports.length} ${publishedReports.length === 1 ? 'report' : 'reports'}`}
          />
          {(() => {
            const monthBuckets = groupReportsByMonthAndWeek(publishedReports);
            const safeMonthIndex = monthBuckets.length ? Math.min(activeMonthIndex, monthBuckets.length - 1) : 0;
            const selectedMonth = monthBuckets[safeMonthIndex] || null;
            const isWeekOpen = (weekId, idx) => (expandedWeeks[weekId] !== undefined ? expandedWeeks[weekId] : idx === 0);
            const toggleWeek = (weekId, idx) => {
              setExpandedWeeks(prev => ({ ...prev, [weekId]: !isWeekOpen(weekId, idx) }));
            };

            return (
              <div className="panel">
                {!monthBuckets.length ? (
                  <EmptyState title="No updates yet" detail="Published field reports will appear here." />
                ) : (
                  <>
                    <div className="client-month-stepper" role="group" aria-label="Navigasi bulan laporan">
                      <button
                        type="button"
                        className="client-month-nav-btn"
                        aria-label="Bulan sebelumnya"
                        disabled={safeMonthIndex >= monthBuckets.length - 1}
                        onClick={() => setActiveMonthIndex(i => Math.min(monthBuckets.length - 1, i + 1))}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="client-month-label">{selectedMonth?.label}</span>
                      <button
                        type="button"
                        className="client-month-nav-btn"
                        aria-label="Bulan berikutnya"
                        disabled={safeMonthIndex <= 0}
                        onClick={() => setActiveMonthIndex(i => Math.max(0, i - 1))}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="weekly-folder-list">
                      {(selectedMonth?.weeks || []).map((week, wIdx) => {
                        const open = isWeekOpen(week.id, wIdx);
                        return (
                          <div className={`weekly-folder-card ${open ? 'is-open' : ''}`} key={week.id}>
                            <button
                              type="button"
                              className="weekly-folder-head"
                              aria-expanded={open}
                              onClick={() => toggleWeek(week.id, wIdx)}
                            >
                              <div className="weekly-folder-head-top">
                                <span className="weekly-folder-title">
                                  <Folder size={15} />
                                  <strong>Minggu {week.weekNumber}</strong>
                                  <span>· {week.dateRange}</span>
                                </span>
                                <ChevronDown size={16} className="weekly-folder-chevron" />
                              </div>
                              <div className="weekly-stat-chips">
                                <span
                                  className="weekly-stat-chip"
                                  title="Daily Reports"
                                  aria-label={`${week.reportCount} Daily Reports`}
                                >
                                  <FileText size={13} />
                                  <span>{week.reportCount}</span>
                                </span>
                                <span
                                  className="weekly-stat-chip"
                                  title="Foto Lapangan"
                                  aria-label={`${week.totalPhotos} Foto`}
                                >
                                  <Camera size={13} />
                                  <span>{week.totalPhotos}</span>
                                </span>
                                <span
                                  className="weekly-stat-chip"
                                  title="Personil Aktif"
                                  aria-label={`${week.avgWorkers} Personil`}
                                >
                                  <Users size={13} />
                                  <span>{week.avgWorkers}</span>
                                </span>
                              </div>
                            </button>

                            {open && (
                              <div className="weekly-folder-body">
                                <div className="client-weekly-daily-scroll">
                                  {week.reports.map(r => {
                                    const fileCount = Array.isArray(r.photoUrls) && r.photoUrls.length
                                      ? r.photoUrls.length
                                      : (Array.isArray(r.photoNames) && r.photoNames.length ? r.photoNames.length : Number(r.photos || 1));
                                    return (
                                      <article key={r.id} className="client-update-card client-update-compact">
                                        <div className="client-update-card-top">
                                          <span className="client-update-date">{dateFmt(r.date)}</span>
                                          <span className="weekly-cat-tag">{r.category}</span>
                                        </div>
                                        <h4 className="client-update-title">{r.title}</h4>
                                        {r.description && <p className="client-update-excerpt">{r.description}</p>}
                                        <div className="client-update-compact-meta">
                                          <span className="client-update-file-count">
                                            <Camera size={13}/> {fileCount} Foto
                                          </span>
                                          <button type="button" className="btn btn-small btn-outline" onClick={() => setModal({ type: 'report-detail', report: r, project, isClient: true })}>
                                            View full log details <ArrowUpRight size={14}/>
                                          </button>
                                        </div>
                                      </article>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </section>
        <section className="workspace-section" id="section-legal">
          <SectionHeading number="C" title="Legal Documents"/>
          <div className="client-module-search">
            <Search size={15}/>
            <input
              type="text"
              placeholder="Search legal documents by title or version..."
              value={legalQuery}
              onChange={e=>setLegalQuery(e.target.value)}
              aria-label="Search legal documents"
            />
            {legalQuery && (
              <button
                type="button"
                className="client-search-clear"
                aria-label="Clear search"
                onClick={()=>setLegalQuery('')}
              >
                <X size={14}/>
              </button>
            )}
          </div>
          <div className="client-legal-scroll">
            <div className="document-list">
              {filteredLegalDocs.map(l=>(
                <div className="document-row" key={l.id}>
                  <span className="document-icon"><FileText size={19}/></span>
                  <div><strong>{l.name}</strong><small>{l.version} · {dateFmt(l.date)}</small></div>
                  <button className="icon-btn" onClick={()=>setModal({type:'file-preview',file:{name:l.name,type:'PDF',description:`${l.version} · ${dateFmt(l.date)}`}})}><Eye size={17}/></button>
                  <button className="icon-btn" onClick={()=>setModal({type:'info',title:'Legal document',body:'Dokumen proyek tersimpan dalam format resmi studio.'})}><Download size={17}/></button>
                </div>
              ))}
              {!filteredLegalDocs.length && (
                <EmptyState
                  title={publishedLegal.length ? 'No matching legal documents' : 'No legal documents'}
                  detail={publishedLegal.length ? `No documents match "${legalQuery.trim()}". Try another title or version.` : 'Approved documents will be shared here.'}
                />
              )}
            </div>
          </div>
        </section>
        <section className="workspace-section" id="section-billing">
          <SectionHeading
            number="D"
            title="Billing & Payments"
            action="Upload payment proof"
            actionClassName="btn-billing-upload"
            actionIcon={<Upload size={15}/>}
            onAction={()=>setModal({type:'payment-upload',project})}
          />
          <div className="billing-summary">
            <div><small>TOTAL OUTSTANDING</small><strong>{money(totalRemaining)}</strong></div>
            <div><small>INVOICES</small><strong>{activeInvoices.length}</strong></div>
            <div><small>PAYMENTS UNDER REVIEW</small><strong>{activeInvoices.reduce((s,i)=>s+i.payments.filter(p=>p.status==='Pending').length,0)}</strong></div>
          </div>
          {activeInvoices.length ? (
            <div className="invoice-list">
              {activeInvoices.map(inv=><InvoiceClientCard key={inv.id} invoice={inv} setModal={setModal}/>)}
            </div>
          ) : (
            <EmptyState title="No invoices yet" detail="Invoices issued by the studio will appear here."/>
          )}
        </section>
        <section className="workspace-section" id="section-shopping">
          <SectionHeading number="E" title="Shopping List"/>
          <div className="client-shopping-scroll">
            <div className="shopping-list">
              {publishedShopping.map(s=><div className="shopping-row" key={s.id}><div className="shopping-date">{dateFmt(s.date)}</div><div className="shopping-name"><strong>{s.material}</strong><small>{s.specification}</small></div><div className="shopping-qty">{s.quantity} {s.unit}</div><StatusTag value={s.status}/></div>)}
              {!publishedShopping.length && <EmptyState title="No materials published" detail="Material requirements will appear here."/>}
            </div>
          </div>
        </section>
        <section className="workspace-section" id="section-recap">
          <SectionHeading number="F" title="Monthly Recapitulation"/>
          <div className="client-recap-scroll">
            <MonthlyRecap invoices={invoices}/>
          </div>
        </section>
        <section className="workspace-section" id="section-activity">
          <SectionHeading
            title="Activity Log"
            badge={`${clientUploadLogs.length} ${clientUploadLogs.length === 1 ? 'upload' : 'uploads'}`}
          />
          <div className="client-activity-scroll">
            <div className="client-activity-list">
              {clientUploadLogs.map(a => {
                const isExpanded = Boolean(expandedActivityIds[a.id]);
                return (
                  <article className={`client-activity-row ${isExpanded ? 'is-expanded' : ''}`} key={a.id}>
                    <button
                      type="button"
                      className="client-activity-trigger"
                      aria-expanded={isExpanded}
                      onClick={() => toggleActivityRow(a.id)}
                    >
                      <strong className="client-activity-action">{a.action}</strong>
                      <span className="client-activity-meta">
                        <span className="client-activity-date">{formatActivityDate(a.date)}</span>
                        <span className="client-activity-chevron-btn" aria-hidden="true">
                          <ChevronDown size={15} className={`client-activity-chevron ${isExpanded ? 'is-open' : ''}`}/>
                        </span>
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="client-activity-expanded">
                        <p className="client-activity-detail">{a.detail}</p>
                        <small className="client-activity-actor">By {a.actor}</small>
                      </div>
                    )}
                  </article>
                );
              })}
              {!clientUploadLogs.length && (
                <EmptyState
                  title="No client uploads yet"
                  detail="Payment proofs you upload will be recorded here automatically."
                />
              )}
            </div>
          </div>
        </section>
        <footer className="workspace-footer">
          <Brand/>
          <span>Need assistance? Contact the NA Associates team.</span>
          <a
            href={`https://wa.me/6285174279328?text=${encodeURIComponent(`Halo tim NA Associates, saya ${client?.name || 'Klien'} ingin berkonsultasi mengenai proyek ${project.name} (${project.code}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="under-link"
          >
            Contact studio <ArrowUpRight size={14}/>
          </a>
        </footer>
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
