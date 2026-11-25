import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bell, Building2, CalendarDays, Camera, Check,
  CheckCircle2, ChevronDown, ChevronRight, ChevronLeft, ClipboardList, Clock3, CreditCard,
  Download, Edit3, ExternalLink, EyeOff, FileCheck2, FileImage, FileText, Globe, HardHat,
  Home, Image, LayoutDashboard, MapPin, Menu, MoreHorizontal, MoreVertical, Package, Plus,
  RotateCcw, Search, Settings, ShieldCheck, ShoppingBag, Trash2, Upload, User, UserPlus,
  Users, Wallet, X, Eye, Activity, AlertCircle, Sun, Moon
} from 'lucide-react';
import { Brand, ProgressBar, StatusTag, EmptyState, AdminPageHeader, Metric, ActivityTable, InfoHint, WhatsAppIcon } from '../components/ui';
import { money, dateFmt, syncProjectFromMilestones, createClientNotification, groupReportsByMonthAndWeek } from '../lib/utils';

const pushPublishedNotif = (setDb, projectId, title, body) => {
  setDb?.(old => ({
    ...old,
    notifications: [createClientNotification({ projectId, title, body, visibility: 'Published' }), ...(old.notifications || [])]
  }));
};

const adminNav = [
  ['dashboard','Dashboard',LayoutDashboard],['projects','Projects',Building2],['clients','Clients & Accounts',Users],['operations','Field Operations',HardHat],['documents','Output, Design & Legal',FileText],['materials','Shopping & Materials',Package],['billing','Billing & Payments',Wallet],['notifications','Notifications',Bell],['activity','Activity Log',Activity],['content','Website Content',GlobeIcon],['settings','Settings',Settings]
];
function GlobeIcon(props) { return <ExternalLink {...props}/>; }
function AdminShell({ db,setDb,projects,clients,selectedProject,selectedProjectId,setSelectedProjectId,tab,setTab,onLogout,onReset,onNotify,setModal,updateProject,addActivity,theme,toggleTheme }) {
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false);
  return <div className={`admin-app ${sidebarCollapsed?'sidebar-collapsed':''}`}>{sidebarOpen && <div className="admin-nav-backdrop" onClick={()=>setSidebarOpen(false)} aria-hidden="true"/>}<aside className={`admin-sidebar ${sidebarOpen?'admin-sidebar-open':''}`}><div className="admin-brand" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><Brand inverse/><span className="admin-label">STUDIO MANAGEMENT</span></div><button className="icon-btn mobile-close-btn" onClick={()=>setSidebarOpen(false)} style={{color:'#e9ebe3'}} title="Tutup Menu"><X size={18}/></button></div><div className="admin-nav-title">WORKSPACE</div><nav className="admin-nav">{adminNav.map(([id,label,Icon])=><button key={id} onClick={()=>{setTab(id);setSidebarOpen(false);}} className={tab===id?'active':''}><Icon size={17}/><span>{label}</span>{id==='billing' && <i className="nav-count">{db.projects.reduce((s,p)=>s+p.invoices.reduce((t,i)=>t+i.payments.filter(x=>x.status==='Pending').length,0),0)||''}</i>}</button>)}</nav><div className="admin-sidebar-bottom"><div className="admin-profile"><span className="avatar">NA</span><div><strong>NA Associates</strong><small>Primary Admin</small></div><MoreHorizontal size={16}/></div><button className="admin-reset" onClick={onReset}><RotateCcw size={14}/> Reset workspace data</button><button className="admin-logout" onClick={onLogout}><ArrowLeft size={15}/> Back to public website</button></div></aside><main className="admin-main"><header className="admin-topbar"><div className="admin-top-left"><button className="icon-btn mobile-menu" onClick={()=>setSidebarOpen(v=>!v)}><Menu/></button><button className="icon-btn sidebar-collapse-btn" onClick={()=>setSidebarCollapsed(v=>!v)} title={sidebarCollapsed?'Buka Panel Admin':'Tutup Panel Admin'} aria-label="Toggle admin sidebar">{sidebarCollapsed?<ChevronRight size={18}/>:<ChevronLeft size={18}/>}</button><div className="breadcrumb">NA Associates <ChevronRight size={13}/> <strong>{adminNav.find(x=>x[0]===tab)?.[1]}</strong></div></div><div className="admin-top-actions"><button className="icon-btn theme-toggle-btn" onClick={toggleTheme} title={theme==='dark'?'Switch to light mode':'Switch to night mode'} aria-label="Toggle theme">{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button><button className="icon-btn" onClick={()=>setTab('notifications')}><Bell size={18}/><i className="notification-dot"/></button><span className="avatar">NA</span></div></header><div className="admin-content">{tab==='dashboard' && <AdminDashboard db={db} setTab={setTab} setModal={setModal} setSelectedProjectId={setSelectedProjectId}/>} {tab==='projects' && <AdminProjects projects={projects} clients={clients} setSelectedProjectId={setSelectedProjectId} setTab={setTab} setModal={setModal}/>} {tab==='clients' && <AdminClients clients={clients} projects={projects} setModal={setModal}/>} {tab==='operations' && <AdminOperations projects={projects} selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId} updateProject={updateProject} addActivity={addActivity} setModal={setModal} setDb={setDb} onNotify={onNotify}/>} {tab==='documents' && <AdminDocuments projects={projects} updateProject={updateProject} addActivity={addActivity} setModal={setModal} setDb={setDb}/>} {tab==='materials' && <AdminMaterials projects={projects} updateProject={updateProject} addActivity={addActivity} setModal={setModal}/>} {tab==='billing' && <AdminBilling projects={projects} clients={clients} updateProject={updateProject} addActivity={addActivity} setModal={setModal}/>} {tab==='notifications' && <AdminNotifications db={db} setDb={setDb}/>} {tab==='activity' && <AdminActivity projects={projects}/>} {tab==='content' && <AdminContent/>} {tab==='settings' && <AdminSettings onReset={onReset} admins={db.admins||[]} allowedAdminEmails={db.allowedAdminEmails||[]} allowedStaffEmails={db.allowedStaffEmails||[]} setDb={setDb} setModal={setModal} theme={theme} toggleTheme={toggleTheme}/>}</div></main><button type="button" className={`mobile-admin-nav ${sidebarOpen?'is-open':''}`} onClick={()=>setSidebarOpen(v=>!v)} aria-expanded={sidebarOpen}><Menu size={17}/><span>{adminNav.find(x=>x[0]===tab)?.[1]||'Dashboard'}</span><ChevronDown size={16} className="mobile-nav-chevron"/></button></div>;
}

function AdminDashboard({ db,setTab,setModal,setSelectedProjectId }) {
  const projects=db.projects;
  const today=new Date(); today.setHours(0,0,0,0);
  const invoices=projects.flatMap(p=>p.invoices).filter(i=>i.status!=='Cancelled');
  const pending=invoices.reduce((s,i)=>s+i.payments.filter(p=>p.status==='Pending').length,0);
  const overdue=invoices.filter(i=>{const paid=i.payments.filter(p=>p.status==='Approved').reduce((sum,p)=>sum+p.approved,0);return i.status!=='Paid'&&i.amount>paid&&new Date(`${i.dueDate}T00:00:00`)<today;}).length;
  const onHold=projects.filter(p=>p.status==='On Hold').length;
  const openProjectOperations = (projectId) => {
    setSelectedProjectId?.(projectId);
    setTab('operations');
  };
  return (
    <>
      <AdminPageHeader title="Good morning, NA team."/>
      <div className="admin-metrics dashboard-metrics">
        <Metric className="staff-metric-card" icon={Building2} label="PROJECTS" value={projects.length}/>
        <Metric className="staff-metric-card" icon={Activity} label="ONGOING" value={projects.filter(p=>p.status==='Active').length}/>
        <Metric className="staff-metric-card" icon={Users} label="CLIENTS" value={db.clients.filter(c=>c.status==='Active').length}/>
        <Metric className="staff-metric-card" icon={Wallet} label="TO VERIFY" value={pending} accent={pending>0}/>
        <Metric className="staff-metric-card" icon={AlertCircle} label="OVERDUE" value={overdue} accent={overdue>0}/>
        <Metric className="staff-metric-card" icon={Clock3} label="ON HOLD" value={onHold} accent={onHold>0}/>
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h3>
              <button type="button" className="panel-title-link" onClick={()=>setTab('projects')}>
                Project overview <ArrowUpRight size={16}/>
              </button>
            </h3>
          </div>
          <div className="admin-project-list admin-project-scroll">
            {projects.map(p=>(
              <div
                className="admin-project-row"
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => openProjectOperations(p.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectOperations(p.id);
                  }
                }}
              >
                <img src={p.cover} alt={p.name}/>
                <div className="admin-project-name">
                  <strong>{p.name}</strong>
                  <small>{p.code}</small>
                </div>
                <div className="admin-project-progress">
                  <div>
                    <span>{p.status}</span>
                    <strong>{p.progress}%</strong>
                  </div>
                  <ProgressBar value={p.progress}/>
                </div>
                <ChevronRight size={16}/>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div className="staff-panel-title-inline">
              <h3>Quick actions</h3>
              <InfoHint text="Create new projects, invite clients, record site updates, and verify pending payment proofs across active studio projects."/>
            </div>
          </div>
          <div className="quick-actions staff-quick-actions">
            <button type="button" onClick={()=>setModal({type:'create-project'})}>
              <span><Plus/></span>
              <strong>Create project</strong>
              <ArrowUpRight size={15}/>
            </button>
            <button type="button" onClick={()=>setModal({type:'invite-client'})}>
              <span><UserPlus/></span>
              <strong>Invite client</strong>
              <ArrowUpRight size={15}/>
            </button>
            <button type="button" onClick={()=>setTab('operations')}>
              <span><ClipboardList/></span>
              <strong>Add progress report</strong>
              <ArrowUpRight size={15}/>
            </button>
            <button type="button" onClick={()=>setTab('billing')}>
              <span><CreditCard/></span>
              <div className="quick-action-label">
                <strong>Review payments</strong>
                {pending > 0 && <span className="subtle-tag">{pending}</span>}
              </div>
              <ArrowUpRight size={15}/>
            </button>
          </div>
        </section>
      </div>
      <section className="admin-panel recent-panel">
        <div className="admin-panel-head">
          <h3>
            <button type="button" className="panel-title-link" onClick={()=>setTab('activity')}>
              Recent activity <ArrowUpRight size={16}/>
            </button>
          </h3>
        </div>
        <ActivityTable projects={projects} limit={5}/>
      </section>
    </>
  );
}
function AdminProjects({ projects,clients,setSelectedProjectId,setTab,setModal }) { const [q,setQ]=useState(''); const [status,setStatus]=useState('All'); const filtered=projects.filter(p=>(status==='All'||p.status===status)&&`${p.name} ${p.code} ${p.location}`.toLowerCase().includes(q.toLowerCase())); return <><AdminPageHeader title="Projects" infoHint="Manage studio project details, client assignments, status filters, and overall completion progress." action="Create project" onAction={()=>setModal({type:'create-project'})}/><div className="admin-toolbar"><div className="search-field"><Search size={16}/><input placeholder="Search projects..." value={q} onChange={e=>setQ(e.target.value)}/></div><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Active</option><option>Completed</option><option>On Hold</option></select><span className="muted">{filtered.length} projects</span></div><div className="admin-project-cards">{filtered.map(p=><article className="admin-project-card" key={p.id}><div className="admin-project-card-photo"><img src={p.cover} alt={p.name}/><button type="button" className="project-cover-edit-btn" onClick={()=>setModal({type:'edit-project-cover',project:p})}><Camera size={13}/> Ubah Cover</button><span className={`status-pill ${p.status==='Completed'?'complete':''}`}>{p.status}</span></div><div className="admin-project-card-body"><div className="eyebrow">{p.code} · {p.category}</div><h3>{p.name}</h3><p><MapPin size={13}/>{p.location}</p><div className="admin-card-progress"><div><small>PROGRESS</small><strong>{p.progress}%</strong></div><ProgressBar value={p.progress}/></div><div className="admin-project-card-foot"><span>{clients.find(c=>c.id===p.clientId)?.name||'Unassigned'}</span><button className="under-link" onClick={()=>{setSelectedProjectId(p.id);setTab('operations');}}>Manage project <ArrowUpRight size={14}/></button></div></div></article>)}</div>{!filtered.length&&<EmptyState title="No matching projects" detail="Try a different search or filter."/>}</>; }
function AdminClients({ clients,projects,setModal }) {
  const [q,setQ]=useState('');
  const [status,setStatus]=useState('All');
  const filtered=clients.filter(c=>(status==='All'||c.status===status)&&`${c.name} ${c.username||''} ${c.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <AdminPageHeader title="Clients & Accounts" infoHint="Manage invited client accounts, contact records, and project workspace access permissions." action="Invite client" onAction={()=>setModal({type:'invite-client'})}/>
      <div className="admin-toolbar">
        <div className="search-field">
          <Search size={16}/>
          <input placeholder="Search clients..." value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Filter client status">
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
        <span className="muted">{filtered.length} client accounts</span>
      </div>
      <div className="admin-panel table-panel">
        <table className="data-table">
          <thead><tr><th>CLIENT</th><th>EMAIL</th><th>PHONE</th><th>ASSIGNED PROJECTS</th><th>STATUS</th><th></th></tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id}>
                <td><div className="table-person"><span className="avatar">{c.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><strong>{c.name}</strong></div></td>
                <td>{c.email||'—'}</td>
                <td>{c.phone||'—'}</td>
                <td>{c.projects.map(id=>projects.find(p=>p.id===id)?.name).filter(Boolean).join(', ')||'—'}</td>
                <td><StatusTag value={c.status}/></td>
                <td><button type="button" className="icon-btn" aria-label={`Manage ${c.name}`} onClick={()=>setModal({type:'client-detail',clientId:c.id})}><MoreHorizontal size={17}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length&&<EmptyState title="No clients found" detail="Try adjusting your search or status filter."/>}
      </div>
    </>
  );
}
function AdminOperations({ projects,selectedProjectId,setSelectedProjectId,updateProject,addActivity,setModal,setDb,onNotify }) {
  const p=projects.find(x=>x.id===selectedProjectId)||projects[0];
  const [filter,setFilter]=useState('All');
  const [progressDraft,setProgressDraft]=useState(String(p?.progress??0));
  const [activeMonthIndex,setActiveMonthIndex]=useState(0);
  const [expandedWeeks,setExpandedWeeks]=useState({});
  const [menuState,setMenuState]=useState(null);
  const [undoState,setUndoState]=useState(null);
  const popoverRef=useRef(null);

  const reports=p?.reports||[];
  const filteredReports=reports.filter(r=>filter==='All'||r.visibility===filter);
  const monthBuckets=groupReportsByMonthAndWeek(filteredReports);
  const safeMonthIndex=monthBuckets.length?Math.min(activeMonthIndex,monthBuckets.length-1):0;
  const selectedMonth=monthBuckets[safeMonthIndex]||null;
  const isOnHold=p?.status==='On Hold';

  useEffect(()=>{
    setProgressDraft(String(p?.progress??0));
  },[p?.id,p?.progress]);

  useEffect(()=>{
    setMenuState(null);
    setActiveMonthIndex(0);
  },[p?.id,filter]);

  useLayoutEffect(()=>{
    if(!menuState||!popoverRef.current) return;
    popoverRef.current.style.setProperty('--doc-menu-top',`${menuState.top}px`);
    popoverRef.current.style.setProperty('--doc-menu-left',`${menuState.left}px`);
  },[menuState]);

  useEffect(()=>{
    if(!menuState) return;
    const onMouseDown=(e)=>{
      if(popoverRef.current?.contains(e.target)) return;
      if(e.target.closest?.('.doc-menu-trigger')) return;
      setMenuState(null);
    };
    const onKeyDown=(e)=>{
      if(e.key==='Escape') setMenuState(null);
    };
    document.addEventListener('mousedown',onMouseDown);
    document.addEventListener('keydown',onKeyDown);
    return()=>{
      document.removeEventListener('mousedown',onMouseDown);
      document.removeEventListener('keydown',onKeyDown);
    };
  },[Boolean(menuState)]);

  useEffect(()=>{
    if(!menuState?.confirmDelete) return;
    const timer=setTimeout(()=>{
      setMenuState(prev=>(prev?{...prev,confirmDelete:false}:null));
    },4000);
    return()=>clearTimeout(timer);
  },[menuState?.confirmDelete,menuState?.report?.id]);

  useEffect(()=>{
    if(!undoState) return;
    const timer=setTimeout(()=>{
      setUndoState(null);
    },5000);
    return()=>clearTimeout(timer);
  },[undoState]);

  const isWeekOpen=(weekId,idx)=>(expandedWeeks[weekId]!==undefined?expandedWeeks[weekId]:idx===0);
  const toggleWeek=(weekId,idx)=>{
    setExpandedWeeks(prev=>({...prev,[weekId]:!isWeekOpen(weekId,idx)}));
  };

  const handleSaveProgress=(e)=>{
    e.preventDefault();
    if(!p||isOnHold) return;
    const parsed=Number(progressDraft);
    const clampedProgress=Number.isFinite(parsed)?Math.min(100,Math.max(0,Math.round(parsed))):0;
    setModal({
      type:'confirm-progress',
      project:p,
      nextProgress:clampedProgress,
      onConfirm:()=>{
        setProgressDraft(String(clampedProgress));
        updateProject(p.id,x=>{
          const nextStatus=x.status==='On Hold'
            ?'On Hold'
            :(clampedProgress>=100?'Completed':(x.status==='Completed'?'Active':x.status));
          return {...x,progress:clampedProgress,status:nextStatus};
        });
        addActivity(
          p.id,
          'Project progress updated',
          `Admin memperbarui progres proyek ${p.name} menjadi ${clampedProgress}%.`,
          undefined,
          {crudType:'UPDATE',module:'Field Operations'}
        );
        if(clampedProgress>=100){
          pushPublishedNotif(setDb,p.id,'Proyek Selesai (100%)',`Progres proyek ${p.name} telah mencapai 100% dan ditandai selesai.`);
        }else{
          pushPublishedNotif(setDb,p.id,'Progres Proyek Diperbarui',`Progres proyek ${p.name} diperbarui menjadi ${clampedProgress}%.`);
        }
        onNotify?.(`Progres proyek ${p.name} berhasil disimpan (${clampedProgress}%).`);
      }
    });
  };

  const markProjectCompleted=()=>{
    if(!p) return;
    setModal({
      type:'confirm-complete',
      project:p,
      onConfirm:()=>{
        updateProject(p.id,x=>({
          ...x,
          status:'Completed',
          holdReason:'',
          progress:100
        }));
        addActivity(
          p.id,
          'Project completed',
          `Admin menandai proyek ${p.name} selesai (100%).`,
          undefined,
          {crudType:'UPDATE',module:'Field Operations'}
        );
        pushPublishedNotif(setDb,p.id,'Proyek Selesai (100%)',`Proyek ${p.name} telah mencapai penyelesaian 100% (Completed).`);
        onNotify?.(`Proyek ${p.name} berhasil ditandai Completed (100%).`);
      }
    });
  };

  const reactivateProject=()=>{
    if(!p) return;
    updateProject(p.id,x=>{
      const nextProg=Number(x.progress||0)>=100?90:Number(x.progress||0);
      return {
        ...x,
        status:'Active',
        holdReason:'',
        progress:nextProg
      };
    });
    addActivity(p.id,'Project reactivated',`Admin mengaktifkan kembali status proyek ${p.name}.`);
    pushPublishedNotif(setDb,p.id,'Proyek Diaktifkan Kembali',`Status proyek ${p.name} diaktifkan kembali oleh studio.`);
  };

  const openReportMenu=(e,report)=>{
    if(menuState?.report?.id===report.id){
      setMenuState(null);
      return;
    }
    const rect=e.currentTarget.getBoundingClientRect();
    const menuW=216;
    const menuH=192;
    const left=Math.max(12,Math.min(rect.right-menuW,window.innerWidth-menuW-12));
    const placeAbove=rect.bottom+menuH>window.innerHeight-12&&rect.top>menuH+12;
    const top=placeAbove?Math.max(12,rect.top-menuH+20):Math.min(rect.bottom+6,window.innerHeight-menuH-12);
    setMenuState({report,top,left,confirmDelete:false});
  };

  const toggleReportVisibility=(report)=>{
    if(!p||!report) return;
    const nextVis=report.visibility==='Published'?'Draft':'Published';
    updateProject(p.id,x=>({...x,reports:(x.reports||[]).map(y=>y.id===report.id?{...y,visibility:nextVis}:y)}));
    addActivity(
      p.id,
      'Report visibility changed',
      `${report.title} diubah menjadi ${nextVis}.`,
      undefined,
      {crudType:'UPDATE',module:'Field Operations',visibility:nextVis,...(nextVis!=='Published'?{internal:true}:{})}
    );
    if(nextVis==='Published'){
      pushPublishedNotif(setDb,p.id,'Laporan Lapangan Dipublikasikan',`Daily Progress "${report.title}" untuk proyek ${p.name} telah dipublikasikan.`);
    }
    setMenuState(null);
  };

  const confirmDeleteReport=()=>{
    if(!menuState?.report||!p) return;
    const report=menuState.report;
    const list=p.reports||[];
    const originalIndex=list.findIndex(x=>x.id===report.id);
    updateProject(p.id,x=>({
      ...x,
      reports:(x.reports||[]).filter(y=>y.id!==report.id)
    }));
    addActivity(
      p.id,
      'Daily log deleted',
      `Daily log "${report.title}" (${dateFmt(report.date)}) dihapus dari proyek.`,
      undefined,
      {crudType:'DELETE',module:'Field Operations',internal:true}
    );
    setMenuState(null);
    setUndoState({
      projectId:p.id,
      report,
      index:originalIndex>=0?originalIndex:0
    });
  };

  const handleUndoDelete=()=>{
    if(!undoState) return;
    const {projectId,report,index}=undoState;
    updateProject(projectId,x=>{
      const current=[...(x.reports||[])];
      if(current.some(item=>item.id===report.id)) return x;
      const safeIndex=Math.min(index,current.length);
      current.splice(safeIndex,0,report);
      return {...x,reports:current};
    });
    addActivity(
      projectId,
      'Daily log restored',
      `Daily log "${report.title}" dipulihkan oleh Admin.`,
      undefined,
      {crudType:'UPDATE',module:'Field Operations',visibility:report.visibility||'Draft',...(report.visibility!=='Published'?{internal:true}:{})}
    );
    setUndoState(null);
  };

  return (
    <>
      <AdminPageHeader
        title="Field Operations"
        infoHint="Kelola persentase progres proyek secara langsung, tinjau folder bulanan & ringkasan mingguan, serta publikasikan atau edit daily progress log lapangan."
        action={isOnHold?null:'New daily log'}
        onAction={()=>setModal({type:'new-report',project:p})}
      />
      {isOnHold && (
        <div className="project-status-notice project-on-hold-banner admin-hold-notice">
          <AlertCircle size={17}/>
          <div>
            <strong>Proyek sedang On Hold (Penagihan / Tertahan)</strong>
            <p>{p?.holdReason?`Alasan: ${p.holdReason}. `:''}Pembaruan progres dan pembuatan daily log baru dikunci hingga status proyek diaktifkan kembali.</p>
          </div>
        </div>
      )}
      <div className="admin-toolbar">
        <select value={p?.id||''} onChange={e=>{setSelectedProjectId(e.target.value);setActiveMonthIndex(0);}}>
          {projects.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}
        </select>
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
        <span className="muted">{filteredReports.length} daily records</span>
      </div>

      <div className="admin-panel project-control-panel">
        <div className="project-status-left">
          <h3 className="project-status-heading">Project Status</h3>
          <form className="progress-inline-control" onSubmit={handleSaveProgress}>
            <label htmlFor="admin-progress-input">Project Progress (%)</label>
            <input
              id="admin-progress-input"
              type="number"
              min="0"
              max="100"
              value={progressDraft}
              disabled={isOnHold}
              onChange={e=>setProgressDraft(e.target.value)}
            />
            <button type="submit" className="btn btn-small btn-dark" disabled={isOnHold}>Simpan</button>
          </form>
        </div>
        <div className="project-status-actions">
          {(p?.status==='Active'||p?.status==='On Hold') && (
            <>
              <button type="button" className="btn btn-small btn-dark project-status-primary" onClick={markProjectCompleted}>
                <Check size={14}/> Mark as completed
              </button>
              {p?.status==='Active' && (
                <button type="button" className="btn btn-small btn-outline" onClick={()=>setModal({type:'hold-reason',project:p})}>
                  Place on hold
                </button>
              )}
              <button type="button" className="btn btn-small btn-outline" onClick={()=>setModal({type:'rollback-reason',project:p})}>
                <RotateCcw size={14}/> Roll Back Month
              </button>
            </>
          )}
          {p?.status==='Completed' && (
            <button type="button" className="btn btn-small btn-outline project-status-primary" onClick={reactivateProject}>
              <RotateCcw size={14}/> Reactivate project
            </button>
          )}
          {p?.status==='On Hold' && (
            <button
              type="button"
              className="btn btn-small btn-outline"
              onClick={()=>{
                updateProject(p.id,x=>({...x,status:'Ready to Resume'}));
                addActivity(p.id,'Project ready to resume','Admin marked project ready for resume review.');
              }}
            >
              Mark ready to resume
            </button>
          )}
          {p?.status==='Ready to Resume' && (
            <button
              type="button"
              className="btn btn-small btn-dark project-status-primary"
              onClick={()=>{
                updateProject(p.id,x=>syncProjectFromMilestones({...x,status:'Active',holdReason:'',billingPaused:false}));
                addActivity(p.id,'Project resumed','Admin confirmed project resume.');
              }}
            >
              Confirm resume
            </button>
          )}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <h3>{p?.name} / Daily project logs</h3>
          <span className="subtle-tag">{p?.code}</span>
        </div>

        {!monthBuckets.length ? (
          <EmptyState
            title="No daily logs"
            detail={reports.length?'Tidak ada laporan yang cocok dengan filter status ini.':'Create the first field report for this project.'}
          />
        ) : (
          <>
            <div className="client-month-stepper" role="group" aria-label="Navigasi bulan laporan">
              <button
                type="button"
                className="client-month-nav-btn"
                aria-label="Bulan sebelumnya"
                disabled={safeMonthIndex>=monthBuckets.length-1}
                onClick={()=>{setActiveMonthIndex(i=>Math.min(monthBuckets.length-1,i+1));setMenuState(null);}}
              >
                <ChevronLeft size={16}/>
              </button>
              <span className="client-month-label">{selectedMonth?.label}</span>
              <button
                type="button"
                className="client-month-nav-btn"
                aria-label="Bulan berikutnya"
                disabled={safeMonthIndex<=0}
                onClick={()=>{setActiveMonthIndex(i=>Math.max(0,i-1));setMenuState(null);}}
              >
                <ChevronRight size={16}/>
              </button>
            </div>

            <div className="weekly-folder-list">
              {(selectedMonth?.weeks||[]).map((week,wIdx)=>{
                const open=isWeekOpen(week.id,wIdx);
                return (
                  <div className={`weekly-folder-card ${open?'is-open':''}`} key={week.id}>
                    <button
                      type="button"
                      className="weekly-folder-head"
                      aria-expanded={open}
                      onClick={()=>toggleWeek(week.id,wIdx)}
                    >
                      <div className="weekly-folder-head-top">
                        <span className="weekly-folder-title">
                          <strong>Minggu {week.weekNumber}</strong>
                          <span>· {week.dateRange}</span>
                        </span>
                        <ChevronDown size={16} className="weekly-folder-chevron"/>
                      </div>
                      <div className="weekly-stat-chips">
                        <span
                          className="weekly-stat-chip"
                          title="Daily Reports"
                          aria-label={`${week.reportCount} Daily Reports`}
                        >
                          <FileText size={13}/>
                          <span>{week.reportCount}</span>
                        </span>
                        <span
                          className="weekly-stat-chip"
                          title="Foto Lapangan"
                          aria-label={`${week.totalPhotos} Foto`}
                        >
                          <Camera size={13}/>
                          <span>{week.totalPhotos}</span>
                        </span>
                        <span
                          className="weekly-stat-chip"
                          title="Personil Aktif"
                          aria-label={`${week.avgWorkers} Personil`}
                        >
                          <Users size={13}/>
                          <span>{week.avgWorkers}</span>
                        </span>
                      </div>
                    </button>

                    {open && (
                      <div className="weekly-folder-body">
                        <div className="admin-weekly-daily-scroll">
                          {week.reports.map(r=>{
                            const photoCount=Array.isArray(r.photoUrls)&&r.photoUrls.length
                              ?r.photoUrls.length
                              :(Array.isArray(r.photoNames)&&r.photoNames.length?r.photoNames.length:Number(r.photos||1));
                            const isOpen=menuState?.report?.id===r.id;
                            return (
                              <article className="log-card admin-log-row" key={r.id}>
                                <div className="log-card-date">{dateFmt(r.date)}<span>{r.category}</span></div>
                                <div className="log-card-main">
                                  <h4>{r.title}</h4>
                                  <p>{r.description}</p>
                                  <small>{photoCount} foto{r.fieldNote?` · ${r.fieldNote}`:''} · {r.workers?.length||0} pekerja</small>
                                </div>
                                <div className="log-card-actions">
                                  <StatusTag value={r.visibility}/>
                                  <button
                                    type="button"
                                    className="btn btn-small btn-dark admin-view-log-btn"
                                    onClick={()=>setModal({type:'report-detail',report:r,project:p,isClient:false})}
                                  >
                                    <Eye size={14}/> View log
                                  </button>
                                  <button
                                    type="button"
                                    className="icon-btn doc-menu-trigger"
                                    aria-label={`Actions for ${r.title}`}
                                    aria-expanded={isOpen}
                                    onClick={e=>openReportMenu(e,r)}
                                  >
                                    <MoreVertical size={16}/>
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

      {menuState && (
        <div
          ref={popoverRef}
          className="doc-action-popover"
          role="menu"
          aria-label="Daily log actions"
        >
          <button
            type="button"
            className="doc-menu-item"
            role="menuitem"
            onClick={()=>toggleReportVisibility(menuState.report)}
          >
            {menuState.report.visibility==='Published'?<EyeOff size={14}/>:<Globe size={14}/>}
            <span>{menuState.report.visibility==='Published'?'Unpublish':'Publish'}</span>
          </button>
          <button
            type="button"
            className="doc-menu-item"
            role="menuitem"
            onClick={()=>{
              const target=menuState.report;
              setMenuState(null);
              setModal({type:'edit-report',report:target,project:p});
            }}
          >
            <Edit3 size={14}/>
            <span>Edit</span>
          </button>
          <hr className="doc-menu-divider"/>
          {!menuState.confirmDelete ? (
            <button
              type="button"
              className="doc-menu-item doc-menu-item-danger"
              role="menuitem"
              onClick={()=>setMenuState(prev=>(prev?{...prev,confirmDelete:true}:null))}
            >
              <Trash2 size={14}/>
              <span>Hapus</span>
            </button>
          ) : (
            <div className="doc-delete-confirm-row">
              <button
                type="button"
                className="doc-confirm-yes"
                onClick={confirmDeleteReport}
              >
                <Check size={13}/> Ya, Hapus
              </button>
              <button
                type="button"
                className="doc-confirm-cancel"
                onClick={()=>setMenuState(prev=>(prev?{...prev,confirmDelete:false}:null))}
              >
                Batal
              </button>
            </div>
          )}
        </div>
      )}

      {undoState && (
        <div className="doc-undo-toast" role="status" aria-live="polite">
          <span>Daily log dihapus.</span>
          <button type="button" className="doc-undo-btn" onClick={handleUndoDelete}>
            <RotateCcw size={13}/> Urungkan
          </button>
        </div>
      )}
    </>
  );
}
function AdminDocuments({projects,updateProject,addActivity,setModal,setDb}) {
  const [pid,setPid]=useState(projects[0]?.id);
  const [statusFilter,setStatusFilter]=useState('All');
  const [menuState,setMenuState]=useState(null);
  const [undoState,setUndoState]=useState(null);
  const popoverRef=useRef(null);
  const p=projects.find(x=>x.id===pid)||projects[0];
  const docs=(p?.files||[]).filter(d=>statusFilter==='All'||d.visibility===statusFilter);
  const legalDocs=(p?.legal||[]).filter(d=>statusFilter==='All'||d.visibility===statusFilter);

  useLayoutEffect(() => {
    if (!menuState || !popoverRef.current) return;
    popoverRef.current.style.setProperty('--doc-menu-top', `${menuState.top}px`);
    popoverRef.current.style.setProperty('--doc-menu-left', `${menuState.left}px`);
  }, [menuState]);

  useEffect(() => {
    if (!menuState) return;
    const onMouseDown = (e) => {
      if (popoverRef.current?.contains(e.target)) return;
      if (e.target.closest?.('.doc-menu-trigger')) return;
      setMenuState(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuState(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [Boolean(menuState)]);

  useEffect(() => {
    if (!menuState?.confirmDelete) return;
    const timer = setTimeout(() => {
      setMenuState(prev => (prev ? { ...prev, confirmDelete: false } : null));
    }, 4000);
    return () => clearTimeout(timer);
  }, [menuState?.confirmDelete, menuState?.item?.id, menuState?.collection]);

  useEffect(() => {
    if (!undoState) return;
    const timer = setTimeout(() => {
      setUndoState(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [undoState]);

  const openMenu = (e, collection, item) => {
    if (menuState?.collection === collection && menuState?.item?.id === item.id) {
      setMenuState(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuW = 216;
    const menuH = 192;
    const left = Math.max(12, Math.min(rect.right - menuW, window.innerWidth - menuW - 12));
    const placeAbove = rect.bottom + menuH > window.innerHeight - 12 && rect.top > menuH + 12;
    const top = placeAbove ? Math.max(12, rect.top - menuH + 20) : Math.min(rect.bottom + 6, window.innerHeight - menuH - 12);
    setMenuState({ collection, item, top, left, confirmDelete: false });
  };

  const toggleDocVisibility = (d) => {
    const nextVis = d.visibility === 'Published' ? 'Internal Only' : 'Published';
    if (nextVis === 'Published' && p?.status === 'On Hold') {
      if (!window.confirm('Proyek ini sedang berstatus On Hold. Tetap publikasikan file output ke Client Portal?')) return;
    }
    updateProject(p.id, x => ({
      ...x,
      files: (x.files || []).map(y => y.id === d.id ? { ...y, visibility: nextVis } : y)
    }));
    addActivity(
      p.id,
      'File visibility changed',
      `${d.name} visibility diperbarui menjadi ${nextVis}.`,
      undefined,
      { crudType: 'UPDATE', module: 'Output & Design', visibility: nextVis, ...(nextVis !== 'Published' ? { internal: true } : {}) }
    );
    if (nextVis === 'Published') {
      pushPublishedNotif(setDb, p.id, 'Output & Desain Dipublikasikan', `File "${d.name}" (${d.category}) untuk proyek ${p.name} telah dipublikasikan.`);
    }
    setMenuState(null);
  };

  const toggleLegalVisibility = (d) => {
    const nextVis = d.visibility === 'Published' ? 'Internal Only' : 'Published';
    updateProject(p.id, x => ({
      ...x,
      legal: (x.legal || []).map(y => y.id === d.id ? { ...y, visibility: nextVis } : y)
    }));
    addActivity(
      p.id,
      'Legal visibility changed',
      `${d.name} (${d.version}) visibility diperbarui menjadi ${nextVis}.`,
      undefined,
      { crudType: 'UPDATE', module: 'Legal & Contracts', visibility: nextVis, ...(nextVis !== 'Published' ? { internal: true } : {}) }
    );
    if (nextVis === 'Published') {
      pushPublishedNotif(setDb, p.id, 'Dokumen Legal Dipublikasikan', `Dokumen "${d.name}" (${d.version}) untuk proyek ${p.name} telah dipublikasikan.`);
    }
    setMenuState(null);
  };

  const confirmRemoveItem = () => {
    if (!menuState || !p) return;
    const { collection, item } = menuState;
    const list = p[collection] || [];
    const originalIndex = list.findIndex(x => x.id === item.id);
    updateProject(p.id, x => ({
      ...x,
      [collection]: (x[collection] || []).filter(y => y.id !== item.id)
    }));
    addActivity(
      p.id,
      collection === 'files' ? 'File deleted' : 'Legal document deleted',
      collection === 'files'
        ? `File "${item.name}" (${item.category}) dihapus dari proyek.`
        : `Dokumen "${item.name}" (${item.version}) dihapus dari proyek.`,
      undefined,
      { crudType: 'DELETE', module: collection === 'files' ? 'Output & Design' : 'Legal & Contracts', internal: true }
    );
    setMenuState(null);
    setUndoState({
      projectId: p.id,
      collection,
      item,
      index: originalIndex >= 0 ? originalIndex : 0
    });
  };

  const handleUndoDelete = () => {
    if (!undoState) return;
    const { projectId, collection, item, index } = undoState;
    updateProject(projectId, x => {
      const current = (x[collection] || []).filter(y => y.id !== item.id);
      const insertAt = Math.max(0, Math.min(index, current.length));
      const restored = [...current.slice(0, insertAt), item, ...current.slice(insertAt)];
      return { ...x, [collection]: restored };
    });
    addActivity(
      projectId,
      collection === 'files' ? 'File restored' : 'Legal document restored',
      `Dokumen "${item.name}" dikembalikan dari Undo.`,
      undefined,
      { crudType: 'CREATE', module: collection === 'files' ? 'Output & Design' : 'Legal & Contracts', visibility: item.visibility, ...(item.visibility !== 'Published' ? { internal: true } : {}) }
    );
    setUndoState(null);
  };

  const handleEditFromMenu = () => {
    if (!menuState) return;
    const { collection, item } = menuState;
    setMenuState(null);
    if (collection === 'files') {
      setModal({ type: 'edit-document', file: item, project: p });
    } else {
      setModal({ type: 'edit-legal', legal: item, project: p });
    }
  };

  const handleToggleFromMenu = () => {
    if (!menuState) return;
    if (menuState.collection === 'files') {
      toggleDocVisibility(menuState.item);
    } else {
      toggleLegalVisibility(menuState.item);
    }
  };

  return <>
    <AdminPageHeader title="Output, Design & Legal" infoHint="Upload and publish architectural renders, floor plans, DED drawings, and legal contracts or addenda to the Client Portal." action="Upload output / document" onAction={()=>setModal({type:'new-document',project:p})}/>
    <div className="admin-toolbar">
      <select value={pid} onChange={e=>{setPid(e.target.value);setMenuState(null);}}>{projects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
      <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setMenuState(null);}}>
        <option value="All">All</option>
        <option value="Draft">Draft</option>
        <option value="Published">Published</option>
        <option value="Internal Only">Internal Only</option>
      </select>
    </div>
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>{p?.name} / Project Output & Design Files</h3>
      </div>
      <div className="document-list admin-doc-list admin-doc-scroll" onScroll={()=>{if(menuState) setMenuState(null);}}>
        {docs.map(d=>{
          const isOpen=menuState?.collection==='files'&&menuState?.item?.id===d.id;
          return <div className="document-row admin-doc-row" key={d.id}>
            <span className="document-icon"><FileText size={19}/></span>
            <div className="admin-doc-meta"><strong>{d.name}</strong><small>{d.category} · {dateFmt(d.date)}</small></div>
            <div className="doc-row-actions">
              <StatusTag value={d.visibility}/>
              <button type="button" className="icon-btn doc-preview-btn" title="Preview file" aria-label={`Preview ${d.name}`} onClick={()=>setModal({type:'file-preview',file:d})}><Eye size={15}/></button>
              <button type="button" className="icon-btn doc-menu-trigger" aria-label="Document actions" aria-expanded={isOpen} onClick={e=>openMenu(e,'files',d)}><MoreVertical size={16}/></button>
            </div>
          </div>;
        })}
        {!docs.length&&<EmptyState title="No output or design files" detail="Upload design renders or project output files to begin."/>}
      </div>
    </div>
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Legal documents & Contracts</h3>
        <button className="btn btn-outline btn-small" onClick={()=>setModal({type:'new-legal',project:p})}><Plus size={14}/> Add legal document</button>
      </div>
      <div className="document-list admin-doc-list admin-doc-scroll" onScroll={()=>{if(menuState) setMenuState(null);}}>
        {legalDocs.map(d=>{
          const isOpen=menuState?.collection==='legal'&&menuState?.item?.id===d.id;
          return <div className="document-row admin-doc-row" key={d.id}>
            <span className="document-icon"><FileCheck2 size={19}/></span>
            <div className="admin-doc-meta"><strong>{d.name}</strong><small>{d.version} · {dateFmt(d.date)}</small></div>
            <div className="doc-row-actions">
              <StatusTag value={d.visibility}/>
              <button type="button" className="icon-btn doc-menu-trigger" aria-label="Document actions" aria-expanded={isOpen} onClick={e=>openMenu(e,'legal',d)}><MoreVertical size={16}/></button>
            </div>
          </div>;
        })}
        {!legalDocs.length&&<EmptyState title="No legal documents" detail="Add contracts or addenda for this project."/>}
      </div>
    </div>
    {menuState && (
      <div className="doc-action-popover" ref={popoverRef} role="menu">
        <button type="button" className="doc-menu-item" role="menuitem" onClick={handleToggleFromMenu}>
          {menuState.item.visibility === 'Published' ? <EyeOff size={15}/> : <Globe size={15}/>}
          <span>{menuState.item.visibility === 'Published' ? 'Make internal' : 'Publish'}</span>
        </button>
        <button type="button" className="doc-menu-item" role="menuitem" onClick={handleEditFromMenu}>
          <Edit3 size={15}/>
          <span>Edit / Update Revisi</span>
        </button>
        <hr className="doc-menu-divider"/>
        {!menuState.confirmDelete ? (
          <button
            type="button"
            className="doc-menu-item doc-menu-item-danger"
            role="menuitem"
            onClick={() => setMenuState(prev => (prev ? { ...prev, confirmDelete: true } : null))}
          >
            <Trash2 size={15}/>
            <span>Hapus Dokumen</span>
          </button>
        ) : (
          <div className="doc-delete-confirm-row">
            <button type="button" className="doc-confirm-yes" onClick={confirmRemoveItem}>Ya, Hapus</button>
            <button type="button" className="doc-confirm-cancel" onClick={() => setMenuState(prev => (prev ? { ...prev, confirmDelete: false } : null))}><X size={13}/> Batal</button>
          </div>
        )}
      </div>
    )}
    {undoState && (
      <div className="doc-undo-toast" role="status" aria-live="polite">
        <span>Dokumen dihapus.</span>
        <button type="button" className="doc-undo-btn" onClick={handleUndoDelete}>
          <RotateCcw size={13}/> Urungkan
        </button>
      </div>
    )}
  </>;
}
function AdminMaterials({projects,updateProject,addActivity,setModal}) { const [pid,setPid]=useState(projects[0]?.id); const p=projects.find(x=>x.id===pid)||projects[0]; return <><AdminPageHeader title="Shopping & Materials" infoHint="Manage material procurement lists, internal unit cost estimates (hidden from Clients), publication visibility, and on-site material usage logs." action="Add material" onAction={()=>setModal({type:'new-material',project:p})}/><div className="admin-toolbar"><select value={pid} onChange={e=>setPid(e.target.value)}>{projects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select><span className="subtle-tag">{p?.code}</span></div><div className="admin-panel"><div className="admin-panel-head"><h3>Shopping list / Procurement</h3></div><div className="material-table">{(p?.shopping||[]).map(s=><div className="material-row" key={s.id}><div className="material-main"><strong>{s.material}</strong><small>{s.specification} · Need by {dateFmt(s.date)}</small></div><div>{s.quantity} {s.unit}</div><div className="material-cost"><small>INTERNAL ESTIMATE</small><strong>{money(s.unitCost*s.quantity)}</strong></div><select value={s.status} onChange={e=>updateProject(p.id,x=>({...x,shopping:x.shopping.map(y=>y.id===s.id?{...y,status:e.target.value}:y)}))}><option>Belum Dibeli</option><option>Dalam Proses</option><option>Sudah Dibeli</option></select><div className="material-publish"><StatusTag value={s.visibility}/><button className="btn btn-small btn-outline" onClick={()=>{updateProject(p.id,x=>({...x,shopping:x.shopping.map(y=>y.id===s.id?{...y,visibility:y.visibility==='Published'?'Draft':'Published'}:y)}));addActivity(p.id,'Shopping list visibility changed',`${s.material} visibility diperbarui.`);}}>{s.visibility==='Published'?'Unpublish':'Publish'}</button></div></div>)}{!p?.shopping?.length&&<EmptyState title="No materials yet" detail="Add requirements for this project."/>}</div></div><div className="admin-panel"><div className="admin-panel-head"><h3>Material usage</h3><button className="btn btn-outline btn-small" onClick={()=>setModal({type:'new-usage',project:p})}><Plus size={14}/> Record usage</button></div>{(p?.usage||[]).map(u=><div className="usage-row" key={u.id}><span><Package size={17}/></span><div><strong>{u.material}</strong><small>{dateFmt(u.date)} · {u.area}</small></div><strong>{u.quantity} {u.unit}</strong></div>)}{!p?.usage?.length&&<EmptyState title="No usage records" detail="Record material usage from daily site activity."/>}</div></>; }
function AdminBilling({projects,clients,updateProject,addActivity,setModal}) {
  const [pid,setPid]=useState(projects[0]?.id);
  const [invoiceMenuState,setInvoiceMenuState]=useState(null);
  const popoverRef=useRef(null);
  const p=projects.find(x=>x.id===pid)||projects[0];
  const client=clients.find(c=>c.id===p?.clientId)||clients[0];
  const invoices=p?.invoices||[];
  const activeInvoices=invoices.filter(i=>i.status!=='Cancelled');
  const pending=activeInvoices.flatMap(i=>i.payments.map(pay=>({...pay,invoice:i}))).filter(x=>x.status==='Pending');
  const verifiedTotal=activeInvoices.reduce((s,i)=>s+i.payments.filter(x=>x.status==='Approved').reduce((t,x)=>t+x.approved,0),0);
  const outstandingTotal=activeInvoices.reduce((s,i)=>s+Math.max(0,i.amount-i.payments.filter(x=>x.status==='Approved').reduce((t,x)=>t+x.approved,0)),0);
  const today=new Date(); today.setHours(0,0,0,0);
  const holdCandidates=invoices.filter(i=>{const paid=i.payments.filter(x=>x.status==='Approved').reduce((s,x)=>s+x.approved,0);const daysLate=Math.floor((today-new Date(`${i.dueDate}T00:00:00`))/86400000);return i.status!=='Cancelled'&&i.status!=='Paid'&&paid<i.amount&&daysLate>=7&&!i.payments.some(x=>x.status==='Pending');});

  useLayoutEffect(()=>{
    if(!invoiceMenuState || !popoverRef.current) return;
    popoverRef.current.style.setProperty('--doc-menu-top', `${invoiceMenuState.top}px`);
    popoverRef.current.style.setProperty('--doc-menu-left', `${invoiceMenuState.left}px`);
  }, [invoiceMenuState]);

  useEffect(()=>{
    if(!invoiceMenuState) return;
    const onMouseDown=(e)=>{
      if(popoverRef.current?.contains(e.target)) return;
      if(e.target.closest?.('.doc-menu-trigger')) return;
      setInvoiceMenuState(null);
    };
    const onKeyDown=(e)=>{
      if(e.key==='Escape') setInvoiceMenuState(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return ()=>{
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [Boolean(invoiceMenuState)]);

  const openInvoiceMenu=(e, invoice)=>{
    if(invoiceMenuState?.invoice?.id===invoice.id){
      setInvoiceMenuState(null);
      return;
    }
    const rect=e.currentTarget.getBoundingClientRect();
    const canRevise=invoice.status!=='Paid'&&invoice.status!=='Cancelled';
    const menuW=216;
    const menuH=canRevise?104:60;
    const left=Math.max(12, Math.min(rect.right - menuW, window.innerWidth - menuW - 12));
    const placeAbove=rect.bottom + menuH > window.innerHeight - 12 && rect.top > menuH + 12;
    const top=placeAbove ? Math.max(12, rect.top - menuH - 6) : Math.min(rect.bottom + 6, window.innerHeight - menuH - 12);
    setInvoiceMenuState({ invoice, top, left });
  };

  return <>
    <AdminPageHeader title="Billing & Payments" infoHint="Issue project invoices, verify or reject uploaded client payment proofs, track outstanding balances, and enforce H+7 overdue hold rules." action="Create invoice" onAction={()=>setModal({type:'new-invoice',project:p})}/>
    <div className="admin-toolbar">
      <select value={pid} onChange={e=>{setPid(e.target.value);setInvoiceMenuState(null);}}>{projects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
      <span className="muted">{invoices.length} invoices</span>
    </div>
    <div className="admin-metrics billing-metrics">
      <Metric className="staff-metric-card" icon={FileText} label="ACTIVE INVOICES" value={activeInvoices.length}/>
      <Metric className="staff-metric-card" icon={Clock3} label="PENDING PROOFS" value={pending.length} accent={pending.length>0}/>
      <Metric className="staff-metric-card" icon={Wallet} label="VERIFIED PAYMENTS" value={money(verifiedTotal)}/>
      <Metric className="staff-metric-card" icon={AlertCircle} label="OUTSTANDING" value={money(outstandingTotal)}/>
    </div>
    {holdCandidates.length>0&&p?.status==='Active'&&<div className="admin-panel hold-recommendation"><div><strong><AlertCircle size={16}/> Hold recommendation · H+7</strong><p>{holdCandidates.map(i=>i.number).join(', ')} has remaining payment beyond seven days after due date. Pending verification pauses this clock.</p></div><button className="btn btn-small btn-dark" onClick={()=>{if(window.confirm('Confirm placing this project on hold? Existing portal access and payment uploads will remain available.')){updateProject(p.id,x=>({...x,status:'On Hold',holdReason:`Tagihan termin ${holdCandidates.map(i=>i.number).join(', ')} melewati batas waktu H+7.`}));addActivity(p.id,'Project placed on hold','H+7 payment recommendation confirmed by Admin.');}}}>Confirm hold</button></div>}
    <div className="admin-panel billing-panel">
      <div className="admin-panel-head">
        <h3>Payment verification</h3>
        <span className="subtle-tag">{pending.length} pending</span>
      </div>
      {pending.length>0 ? (
        <div className="billing-review-scroll">
          {pending.map(pay=>{
            const invPurpose = pay.invoice?.purpose || pay.invoice?.description || '';
            return (
              <div className="payment-review-row" key={pay.id}>
                <div className="proof-placeholder"><FileImage size={22}/><small>PROOF</small></div>
                <div className="payment-review-main">
                  <strong>{pay.invoice.number}</strong>
                  {invPurpose && <span className="invoice-purpose-text">Tagihan: {invPurpose}</span>}
                  <small>{dateFmt(pay.date)} · Claimed {money(pay.claimed)}</small>
                  {pay.purpose && <span className="payment-review-purpose">Keterangan: {pay.purpose}</span>}
                  <span>{pay.proof||'Payment proof uploaded'}</span>
                </div>
                <div className="payment-review-actions">
                  <button className="btn btn-small btn-dark" onClick={()=>setModal({type:'verify-payment',project:p,invoice:pay.invoice,payment:pay})}><Check size={14}/> Review & verify</button>
                  <button className="btn btn-small btn-outline" onClick={()=>setModal({type:'reject-payment',project:p,invoice:pay.invoice,payment:pay})}>Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="All caught up" detail="There are no payment proofs waiting for review."/>
      )}
    </div>
    <div className="admin-panel billing-panel">
      <div className="admin-panel-head">
        <h3>Invoice register</h3>
        <span className="subtle-tag">{invoices.length} invoices</span>
      </div>
      {invoices.length>0 ? (
        <div className="billing-register-scroll" onScroll={()=>{if(invoiceMenuState) setInvoiceMenuState(null);}}>
          {invoices.map(i=>(
            <InvoiceAdminRow
              key={i.id}
              invoice={i}
              project={p}
              client={client}
              addActivity={addActivity}
              isMenuOpen={invoiceMenuState?.invoice?.id===i.id}
              onOpenMenu={e=>openInvoiceMenu(e, i)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No invoices" detail="Create an invoice for this project."/>
      )}
    </div>
    {invoiceMenuState && (
      <div
        className="doc-action-popover"
        ref={popoverRef}
        role="menu"
        aria-label={`Actions for ${invoiceMenuState.invoice.number}`}
      >
        <button
          type="button"
          className="doc-menu-item"
          role="menuitem"
          onClick={()=>{
            const inv=invoiceMenuState.invoice;
            setInvoiceMenuState(null);
            setModal({type:'invoice-detail-admin',invoice:inv,project:p});
          }}
        >
          <Eye size={14}/>
          <span>View details</span>
        </button>
        {invoiceMenuState.invoice.status!=='Paid'&&invoiceMenuState.invoice.status!=='Cancelled'&&(
          <button
            type="button"
            className="doc-menu-item"
            role="menuitem"
            onClick={()=>{
              const inv=invoiceMenuState.invoice;
              setInvoiceMenuState(null);
              setModal({type:'revise-invoice',project:p,invoice:inv});
            }}
          >
            <RotateCcw size={14}/>
            <span>Revise invoice</span>
          </button>
        )}
      </div>
    )}
  </>;
}
function InvoiceAdminRow({invoice,project,client,addActivity,isMenuOpen,onOpenMenu}) {
  const paid=invoice.payments.filter(p=>p.status==='Approved').reduce((s,p)=>s+p.approved,0);
  const statusLabel = invoice.status === 'Paid' ? 'Sudah Dibayar — Terima Kasih Pembayarannya' : 'Belum Dibayar (Tenggat Termin)';
  const msg = encodeURIComponent(`Halo ${client?.name || 'Klien'}, informasi penagihan ${invoice.number} untuk proyek ${project.name}. Status: ${statusLabel}. Silakan periksa Portal Klien NA Associates.`);
  const waLink = `https://wa.me/6289533706007?text=${msg}`;
  const purposeText = invoice.purpose || invoice.description || '';

  return <div className="invoice-admin-row">
    <div className="invoice-admin-meta">
      <strong>{invoice.number}</strong>
      {purposeText && <span className="invoice-purpose-text">{purposeText}</span>}
      <small>Issued {dateFmt(invoice.issueDate)} · Due {dateFmt(invoice.dueDate)}</small>
    </div>
    <strong className="invoice-admin-amount">{money(invoice.amount)}</strong>
    <span className="invoice-admin-paid">{money(paid)} paid</span>
    <StatusTag value={invoice.status}/>
    <div className="invoice-actions">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-small btn-whatsapp billing-wa-btn"
        onClick={()=>addActivity(project.id,'WhatsApp notification triggered','Admin mengirim pengingat WhatsApp ke klien untuk invoice '+invoice.number)}
      >
        <WhatsAppIcon size={13}/> WhatsApp
      </a>
      <button
        type="button"
        className="icon-btn doc-menu-trigger"
        aria-label="Invoice actions"
        aria-expanded={Boolean(isMenuOpen)}
        onClick={onOpenMenu}
      >
        <MoreVertical size={16}/>
      </button>
    </div>
  </div>;
}
function AdminNotifications({db,setDb}) { return <><AdminPageHeader title="Notifications" infoHint="Monitor studio-wide system alerts, client payment proof submissions, and published project updates."/><div className="admin-panel"><div className="admin-panel-head"><h3>Recent notifications</h3><button className="under-link" onClick={()=>setDb(old=>({...old,notifications:old.notifications.map(n=>({...n,read:true}))}))}>Mark all read</button></div>{db.notifications.map(n=><div className={`notification-row ${n.read?'read':''}`} key={n.id}><span className="notification-icon"><Bell size={17}/></span><div><strong>{n.title}</strong><p>{n.body}</p><small>{dateFmt(n.date)}</small></div>{!n.read&&<i className="unread-dot"/>}</div>)}</div></>; }
function AdminActivity({projects}) { return <><AdminPageHeader title="Activity Log" infoHint="Chronological, immutable audit trail recording all Admin, Staff, and Client actions across active projects."/><div className="admin-panel"><ActivityTable projects={projects}/></div><div className="admin-panel note-panel"><ShieldCheck size={19}/><div><strong>Production security note</strong><p>Activity records are synchronized and recorded across all active projects.</p></div></div></>; }
function AdminContent() { return <><AdminPageHeader title="Website Content" infoHint="Preview and manage content sections for the public-facing NA Associates website."/><div className="admin-content-grid">{[['Projects','Portfolio items and project detail pages','Manage portfolio'],['Services','Service descriptions and supporting images','Edit services'],['About','Studio profile and approach','Edit about'],['Career','Career introduction and positions','Edit career'],['Contact','Studio email, phone, and WhatsApp','Edit contact'],['Homepage','Hero text and featured projects','Edit homepage']].map(([title,desc,cta])=><div className="admin-panel content-manage-card" key={title}><span><FileText size={19}/></span><h3>{title}</h3><p>{desc}</p><button className="under-link" onClick={()=>alert('Content editor belum dihubungkan.')}>{cta} <ArrowUpRight size={14}/></button></div>)}</div></>; }
function AdminSettings({onReset,admins,allowedAdminEmails,allowedStaffEmails,setDb,setModal,theme,toggleTheme}) {
  const [newEmail, setNewEmail] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const addAdminEmail = (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;
    setDb(old => ({
      ...old,
      allowedAdminEmails: Array.from(new Set([...(old.allowedAdminEmails || []), newEmail.trim().toLowerCase()]))
    }));
    setNewEmail('');
  };
  const removeAdminEmail = (email) => {
    setDb(old => ({
      ...old,
      allowedAdminEmails: (old.allowedAdminEmails || []).filter(e => e !== email)
    }));
  };
  const addStaffEmail = (e) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffEmail.includes('@')) return;
    setDb(old => ({
      ...old,
      allowedStaffEmails: Array.from(new Set([...(old.allowedStaffEmails || []), newStaffEmail.trim().toLowerCase()]))
    }));
    setNewStaffEmail('');
  };
  const removeStaffEmail = (email) => {
    setDb(old => ({
      ...old,
      allowedStaffEmails: (old.allowedStaffEmails || []).filter(e => e !== email)
    }));
  };

  return <><AdminPageHeader title="Settings" infoHint="Configure workspace theme, studio profile, Primary Admin accounts, Google OAuth login whitelists for Admin/Staff, and prototype data reset."/><div className="admin-panel settings-section"><div className="settings-row"><div><strong>Workspace theme</strong><p>Toggle between Architectural Charcoal (Night Mode) and Editorial Light mode.</p></div><button className="btn btn-outline btn-small" onClick={toggleTheme}>{theme==='dark'?<><Sun size={14}/> Light mode</>:<><Moon size={14}/> Night mode</>}</button></div><div className="settings-row"><div><strong>Studio profile</strong><p>NA Associates · Architecture & Design · Jakarta, Indonesia</p></div><button className="btn btn-outline btn-small" onClick={()=>alert('Studio profile editor belum aktif.')}>Edit profile</button></div><div className="settings-row"><div><strong>Admin accounts</strong><p>Only the Primary Admin can invite or promote another Admin. All Admin accounts share operational permissions.</p><div className="admin-account-list">{admins.map(a=><span key={a.id}><strong>{a.name}</strong><small>{a.email} · {a.isPrimary?'Primary Admin':'Admin'}</small></span>)}</div></div><button className="btn btn-outline btn-small" onClick={()=>setModal({type:'invite-admin'})}><UserPlus size={14}/> Invite Admin</button></div><div className="settings-row"><div><strong>Admin Google Login Whitelist</strong><p>Daftar email Google yang diizinkan masuk ke Dashboard Admin. Sistem memeriksa database allowedAdminEmails.</p><div className="admin-account-list">{(allowedAdminEmails || ['owner@example.com', 'admin@na-associates.id', 'mike777rafael@gmail.com']).map(em=><span key={em} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}><strong>{em}</strong><button type="button" className="icon-btn" style={{padding:'2px'}} onClick={()=>removeAdminEmail(em)}><X size={12}/></button></span>)}</div><form onSubmit={addAdminEmail} style={{display:'flex',gap:'8px',marginTop:'10px'}}><input type="email" placeholder="tambah-admin@studio.com" value={newEmail} onChange={e=>setNewEmail(e.target.value)} style={{padding:'6px 8px',fontSize:'9px',border:'1px solid #dcded5',background:'#f8f7f3',flex:'1',color:'var(--ink)'}}/><button type="submit" className="btn btn-small btn-dark">Tambah Email</button></form><small style={{display:'block',marginTop:'6px',fontSize:'8px',color: '#889083', lineHeight: '1.5'}}>Cara mendaftarkan: Masukkan email Google admin baru di atas. Admin dapat langsung melakukan Login dengan Google menggunakan email tersebut pada modal login utama.</small></div></div><div className="settings-row"><div><strong>Staff / Karyawan Google Login Whitelist</strong><p>Daftar email Google yang diizinkan masuk ke Dashboard Staff (Field Operations, Output Draft, & Materials). Sistem memeriksa database allowedStaffEmails.</p><div className="admin-account-list">{(allowedStaffEmails || []).map(em=><span key={em} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}><strong>{em}</strong><button type="button" className="icon-btn" style={{padding:'2px'}} onClick={()=>removeStaffEmail(em)}><X size={12}/></button></span>)}</div><form onSubmit={addStaffEmail} style={{display:'flex',gap:'8px',marginTop:'10px'}}><input type="email" placeholder="tambah-staff@na-associates.id" value={newStaffEmail} onChange={e=>setNewStaffEmail(e.target.value)} style={{padding:'6px 8px',fontSize:'9px',border:'1px solid #dcded5',background:'#f8f7f3',flex:'1',color:'var(--ink)'}}/><button type="submit" className="btn btn-small btn-dark">Tambah Staff</button></form><small style={{display:'block',marginTop:'6px',fontSize:'8px',color: '#889083', lineHeight: '1.5'}}>Cara mendaftarkan: Masukkan email Google karyawan/arsitek lapangan di atas. Akun Staff hanya dapat membuat dan mengedit Draft tanpa akses Billing maupun kontrol Publish.</small></div></div><div className="settings-row"><div><strong>Backend connection</strong><p>Supabase Auth, Database, and Storage are not connected in this prototype.</p></div><StatusTag value="Not connected"/></div><div className="settings-row"><div><strong>Reset workspace data</strong><p>Restore all sample projects, invoices, and activity to their initial state.</p></div><button className="btn btn-outline btn-small" onClick={onReset}><RotateCcw size={14}/> Reset data</button></div></div></>;
}
export { AdminShell };
