import React, { useState } from 'react';
import {
  Activity, AlertCircle, ArrowLeft, ArrowUpRight, Bell, Building2, Check,
  ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Edit3, Eye, FileText, HardHat,
  LayoutDashboard, MapPin, Moon, Menu, MoreHorizontal, Package, Plus,
  Sun, Trash2, Upload, X
} from 'lucide-react';
import { Brand, ProgressBar, StatusTag, EmptyState, Metric, ActivityTable, InfoHint, getActivityCrudType } from '../components/ui';
import { dateFmt, getTimeGreeting } from '../lib/utils';

const staffNav = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['operations', 'Field Operations', HardHat],
  ['documents', 'Output & Design', FileText],
  ['materials', 'Shopping & Materials', Package],
  ['notifications', 'Notifications', Bell],
  ['activity', 'Activity Log', Activity]
];

const isBillingNotification = (n) => /inv-|pembayaran|transfer|tagihan/i.test(`${n?.title || ''} ${n?.body || ''}`);

const isBillingActivity = (a) => /invoice|inv-|pembayaran|payment|whatsapp|billing|tagihan|kwitansi|receipt/i.test(`${a?.action || ''} ${a?.detail || ''}`);

function StaffPageHeader({ title, infoHint, action, onAction }) {
  return (
    <div className="admin-page-header staff-page-header">
      <div className="staff-heading-inline">
        <h1>{title}</h1>
        {infoHint && <InfoHint text={infoHint} />}
      </div>
      {action && (
        <button className="btn btn-dark" onClick={onAction}>
          <Plus size={16} />
          {action}
        </button>
      )}
    </div>
  );
}

function StaffShell({
  db,
  setDb,
  staffMember,
  projects,
  selectedProject,
  selectedProjectId,
  setSelectedProjectId,
  tab,
  setTab,
  onLogout,
  setModal,
  updateProject,
  addActivity,
  theme,
  toggleTheme
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const initials = (staffMember?.name || 'ST')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const scopedNotifications = (db.notifications || []).filter((n) => !isBillingNotification(n));
  const unreadCount = scopedNotifications.filter((n) => !n.read).length;

  return (
    <div className={`admin-app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {sidebarOpen && <div className="admin-nav-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Brand inverse />
            <span className="admin-label">FIELD STAFF WORKSPACE</span>
          </div>
          <button
            className="icon-btn mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#e9ebe3' }}
            title="Tutup Menu"
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-nav-title">FIELD WORKSPACE</div>
        <nav className="admin-nav">
          {staffNav.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setSidebarOpen(false);
              }}
              className={tab === id ? 'active' : ''}
            >
              <Icon size={17} />
              <span>{label}</span>
              {id === 'notifications' && unreadCount > 0 && <i className="nav-count">{unreadCount}</i>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <span className="avatar">{initials || 'ST'}</span>
            <div>
              <strong>{staffMember?.name || 'Staff NA Associates'}</strong>
              <small>{staffMember?.roleTitle || 'Field Architect / Staff'}</small>
            </div>
            <MoreHorizontal size={16} />
          </div>
          <button className="admin-logout" onClick={onLogout}>
            <ArrowLeft size={15} /> Back to public website
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-top-left">
            <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen((v) => !v)} aria-label="Open staff menu">
              <Menu />
            </button>
            <button
              className="icon-btn sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? 'Buka Panel Staff' : 'Tutup Panel Staff'}
              aria-label="Toggle staff sidebar"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <div className="breadcrumb">
              NA Associates <ChevronRight size={13} /> <strong>{staffNav.find((x) => x[0] === tab)?.[1] || 'Dashboard'}</strong>
            </div>
          </div>

          <div className="admin-top-actions">
            <button
              className="icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to night mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="icon-btn" onClick={() => setTab('notifications')} aria-label="Staff notifications">
              <Bell size={18} />
              {unreadCount > 0 && <i className="notification-dot" />}
            </button>
            <span className="avatar">{initials || 'ST'}</span>
          </div>
        </header>

        <div className="admin-content">
          {tab === 'dashboard' && (
            <StaffDashboardOverview
              staffMember={staffMember}
              projects={projects}
              selectedProject={selectedProject}
              setSelectedProjectId={setSelectedProjectId}
              setTab={setTab}
              setModal={setModal}
            />
          )}
          {tab === 'operations' && (
            <StaffOperations
              projects={projects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              setModal={setModal}
            />
          )}
          {tab === 'documents' && (
            <StaffDocuments
              projects={projects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              setModal={setModal}
            />
          )}
          {tab === 'materials' && (
            <StaffMaterials
              projects={projects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              updateProject={updateProject}
              addActivity={addActivity}
              setModal={setModal}
            />
          )}
          {tab === 'notifications' && (
            <StaffNotifications notifications={scopedNotifications} setDb={setDb} />
          )}
          {tab === 'activity' && <StaffActivity projects={projects} />}
        </div>
      </main>
      <button
        type="button"
        className={`mobile-admin-nav ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-expanded={sidebarOpen}
      >
        <Menu size={17} />
        <span>{staffNav.find((x) => x[0] === tab)?.[1] || 'Dashboard'}</span>
        <ChevronDown size={16} className="mobile-nav-chevron" />
      </button>
    </div>
  );
}

function StaffDashboardOverview({ staffMember, projects, selectedProject, setSelectedProjectId, setTab, setModal }) {
  const today = new Date();
  const greeting = getTimeGreeting(today);
  const firstName = (staffMember?.name || 'Team').split(' ')[0];
  const activeProject = projects.find((p) => p.id === selectedProject?.id) || projects[0];
  const activeSites = projects.filter((p) => p.status === 'Active').length;
  const draftLogs = projects.reduce((sum, p) => sum + (p.reports || []).filter((r) => r.visibility === 'Draft').length, 0);
  const pendingMaterials = projects.reduce((sum, p) => sum + (p.shopping || []).filter((s) => s.status !== 'Sudah Dibeli').length, 0);

  const scopedActivityProjects = projects.map((p) => ({
    ...p,
    activity: (p.activity || []).filter((a) => !isBillingActivity(a))
  }));

  return (
    <>
      <StaffPageHeader
        title={`${greeting}, ${firstName}.`}
        infoHint="Monitor assigned sites, submit daily field drafts, and track material needs. Staff submissions save as Draft for Admin review."
      />

      <div className="staff-metrics">
        <Metric className="staff-metric-card" icon={Building2} label="ASSIGNED PROJECTS" value={projects.length} />
        <Metric className="staff-metric-card" icon={HardHat} label="ACTIVE SITES" value={activeSites} />
        <Metric className="staff-metric-card" icon={ClipboardList} label="DRAFT LOGS" value={draftLogs} accent={draftLogs > 0} />
        <Metric className="staff-metric-card" icon={Package} label="OPEN MATERIALS" value={pendingMaterials} />
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div className="staff-panel-title-inline">
              <h3>Assigned project overview</h3>
              <InfoHint text="Progress across your active studio assignments." />
            </div>
            <button className="under-link" onClick={() => setTab('operations')}>
              Field operations <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="admin-project-list">
            {projects.map((p) => (
              <div
                className="admin-project-row"
                key={p.id}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedProjectId(p.id);
                  setTab('operations');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProjectId(p.id);
                    setTab('operations');
                  }
                }}
              >
                <img src={p.cover} alt={p.name} />
                <div className="admin-project-name">
                  <strong>{p.name}</strong>
                  <small>
                    {p.code} · {p.location}
                  </small>
                </div>
                <div className="admin-project-progress">
                  <div>
                    <span>{p.status}</span>
                    <strong>{p.progress}%</strong>
                  </div>
                  <ProgressBar value={p.progress} />
                </div>
                <ChevronRight size={16} />
              </div>
            ))}
            {!projects.length && <EmptyState title="No assigned projects" detail="Contact an Admin to receive project assignments." />}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div className="staff-panel-title-inline">
              <h3>Field Quick Actions</h3>
              <InfoHint text="Staff submissions save as Draft for Admin review." />
            </div>
          </div>
          <div className="quick-actions staff-quick-actions">
            <button
              disabled={!activeProject || activeProject.status === 'On Hold'}
              onClick={() => activeProject && setModal({ type: 'new-report', project: activeProject })}
            >
              <span>
                <ClipboardList />
              </span>
              <strong>New Daily Log</strong>
              <ArrowUpRight size={15} />
            </button>
            <button
              disabled={!activeProject}
              onClick={() => activeProject && setModal({ type: 'new-document', project: activeProject })}
            >
              <span>
                <Upload />
              </span>
              <strong>Upload Draft File</strong>
              <ArrowUpRight size={15} />
            </button>
            <button
              disabled={!activeProject}
              onClick={() => activeProject && setModal({ type: 'new-material', project: activeProject })}
            >
              <span>
                <Package />
              </span>
              <strong>Add Material Needs</strong>
              <ArrowUpRight size={15} />
            </button>
            <button
              disabled={!activeProject}
              onClick={() => activeProject && setModal({ type: 'new-usage', project: activeProject })}
            >
              <span>
                <MapPin />
              </span>
              <strong>Record Site Usage</strong>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </div>

      <section className="admin-panel recent-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Recent Field Activity</h3>
            <InfoHint text="Latest non-financial updates on your assigned projects." />
          </div>
          <button className="under-link" onClick={() => setTab('activity')}>
            View activity log <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="staff-activity-scroll">
          <ActivityTable projects={scopedActivityProjects} limit={8} />
        </div>
      </section>
    </>
  );
}

function StaffOperations({ projects, selectedProjectId, setSelectedProjectId, setModal }) {
  const p = projects.find((x) => x.id === selectedProjectId) || projects[0];
  const [filter, setFilter] = useState('All');
  const reports = p?.reports || [];
  const milestones = p?.milestones || [];
  const isOnHold = p?.status === 'On Hold';
  const visibleReports = reports.filter((r) => filter === 'All' || r.visibility === filter);

  return (
    <>
      <StaffPageHeader
        title="Field Operations"
        infoHint="Create draft daily site logs and review assigned milestones. New logs save as Draft and can be edited or deleted by Staff before Admin publishes them to the Client Portal. Published logs are read-only."
        action={!p || isOnHold ? null : 'New daily log'}
        onAction={() => p && setModal({ type: 'new-report', project: p })}
      />

      {isOnHold && (
        <div className="project-status-notice project-on-hold-banner" style={{ marginBottom: '20px' }}>
          <AlertCircle size={17} />
          <div>
            <strong>Proyek sedang On Hold</strong>
            <p>
              {p?.holdReason ? `Alasan: ${p.holdReason}. ` : ''}
              Pembuatan daily log baru sementara dikunci hingga Admin mengaktifkan kembali status proyek.
            </p>
          </div>
        </div>
      )}

      <div className="admin-toolbar">
        <select value={p?.id || ''} onChange={(e) => setSelectedProjectId(e.target.value)}>
          {projects.map((x) => (
            <option value={x.id} key={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
        <span className="muted">{visibleReports.length} daily records</span>
      </div>

      <div className="admin-panel project-control-panel">
        <div className="staff-panel-title-inline">
          <strong>
            Project status · {p?.status || '—'} ({p?.progress ?? 0}%)
          </strong>
          <InfoHint text="Read-only operational status. Project status and milestone transitions are managed by Admin." />
        </div>
        <StatusTag value={p?.status || 'Active'} />
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Milestones</h3>
            <InfoHint text="Read-only reference of scheduled project milestones." />
          </div>
          <span className="subtle-tag">READ ONLY</span>
        </div>
        <div className="milestone-admin-list">
          {milestones.map((m, i) => (
            <div className="milestone-admin-row" key={m.id || i}>
              <span className={`milestone-admin-num ${m.status === 'Completed' ? 'done' : ''}`}>
                {m.status === 'Completed' ? <Check size={14} /> : i + 1}
              </span>
              <div className="milestone-admin-info">
                <strong>{m.title}</strong>
                <small>
                  {dateFmt(m.date)} · Progress {m.progress}%
                </small>
              </div>
              <StatusTag value={m.status} />
            </div>
          ))}
          {!milestones.length && <EmptyState title="No milestones" detail="No timeline milestones scheduled yet." />}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Daily Progress</h3>
            <InfoHint text="Staff submissions save as Draft for Admin review. Draft logs can be edited or deleted; Published logs are read-only." />
          </div>
          <span className="subtle-tag">{p?.code}</span>
        </div>
        <div className="log-list">
          {visibleReports.map((r) => (
            <article className="log-card" key={r.id}>
              <div className="log-card-date">
                {dateFmt(r.date)}
                <span>{r.category}</span>
              </div>
              <div className="log-card-main">
                <h4>{r.title}</h4>
                <p>{r.description}</p>
                <small>
                  {r.photos || 1} attachments{r.fieldNote ? ` · ${r.fieldNote}` : ''} · {r.workers?.length || 0} pekerja
                </small>
              </div>
              <div className="log-card-actions">
                <StatusTag value={r.visibility} />
                <button
                  className="btn btn-small btn-dark"
                  onClick={() => setModal({ type: 'report-detail', report: r, project: p, isClient: false, isStaff: true })}
                >
                  <Eye size={13} /> View log
                </button>
                {r.visibility === 'Draft' && (
                  <>
                    <button
                      className="btn btn-small btn-outline"
                      onClick={() => setModal({ type: 'edit-report', report: r, project: p })}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      className="btn btn-small btn-outline staff-delete-btn"
                      onClick={() => setModal({ type: 'confirm-delete-draft', entity: 'report', item: r, project: p })}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
          {!visibleReports.length && <EmptyState title="No daily logs" detail="Create a new draft field report to begin." />}
        </div>
      </div>
    </>
  );
}

function StaffDocuments({ projects, selectedProjectId, setSelectedProjectId, setModal }) {
  const p = projects.find((x) => x.id === selectedProjectId) || projects[0];
  const docs = p?.files || [];

  return (
    <>
      <StaffPageHeader
        title="Output & Design"
        infoHint="Upload draft site drawings, renders, and field output files for Admin review. All Staff uploads save as Draft and can be edited or deleted before Admin publishes them."
        action={p ? 'Upload output / design' : null}
        onAction={() => p && setModal({ type: 'new-document', project: p })}
      />

      <div className="admin-toolbar">
        <select value={p?.id || ''} onChange={(e) => setSelectedProjectId(e.target.value)}>
          {projects.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <span className="subtle-tag">{docs.length} files</span>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Output & Design Files</h3>
            <InfoHint text="Upload draft site drawings, plans, and field output files for Admin review. Draft files can be edited or deleted; Published files are read-only." />
          </div>
          {p && (
            <button className="btn btn-outline btn-small" onClick={() => setModal({ type: 'new-document', project: p })}>
              <Plus size={14} /> Upload draft output
            </button>
          )}
        </div>
        <div className="document-list admin-doc-list">
          {docs.map((d) => (
            <div className="document-row staff-doc-row" key={d.id}>
              <span className="document-icon">
                <FileText size={19} />
              </span>
              <div>
                <strong>{d.name}</strong>
                <small>
                  {d.category} · {dateFmt(d.date)}
                </small>
              </div>
              <div className="staff-row-actions">
                <StatusTag value={d.visibility} />
                {d.visibility === 'Draft' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-small btn-outline"
                      onClick={() => setModal({ type: 'edit-document', file: d, project: p })}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-outline staff-delete-btn"
                      onClick={() => setModal({ type: 'confirm-delete-draft', entity: 'file', item: d, project: p })}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!docs.length && <EmptyState title="No output or design files" detail="Upload a draft file for Admin review." />}
        </div>
      </div>
    </>
  );
}

function StaffMaterials({ projects, selectedProjectId, setSelectedProjectId, updateProject, addActivity, setModal }) {
  const p = projects.find((x) => x.id === selectedProjectId) || projects[0];

  return (
    <>
      <StaffPageHeader
        title="Shopping & Materials"
        infoHint="Submit draft material needs (quantities & specifications) and record actual site usage. Staff submissions save as Draft and can be edited or deleted before Admin review."
        action={p ? 'Add material' : null}
        onAction={() => p && setModal({ type: 'new-material', project: p })}
      />

      <div className="admin-toolbar">
        <select value={p?.id || ''} onChange={(e) => setSelectedProjectId(e.target.value)}>
          {projects.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <span className="subtle-tag">{p?.code}</span>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Material requests for field procurement</h3>
            <InfoHint text="Internal cost estimates are restricted to Admin. New requests are saved as Draft and can be edited or deleted before Admin publishes them." />
          </div>
        </div>
        <div className="material-table">
          {(p?.shopping || []).map((s) => {
            const isDraft = s.visibility === 'Draft';
            return (
              <div className="material-row staff-material-row" key={s.id}>
                <div className="material-main">
                  <strong>{s.material}</strong>
                  <small>
                    {s.specification} · Need by {dateFmt(s.date)}
                  </small>
                </div>
                <div>
                  {s.quantity} {s.unit}
                </div>
                {isDraft ? (
                  <select
                    value={s.status}
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      updateProject(p.id, (x) => ({
                        ...x,
                        shopping: x.shopping.map((y) => (y.id === s.id ? { ...y, status: nextStatus } : y))
                      }));
                      addActivity(
                        p.id,
                        'Material status updated',
                        `${s.material} status diubah menjadi ${nextStatus}.`,
                        undefined,
                        { crudType: 'UPDATE', module: 'Shopping & Materials', visibility: 'Draft', internal: true }
                      );
                    }}
                  >
                    <option>Belum Dibeli</option>
                    <option>Dalam Proses</option>
                    <option>Sudah Dibeli</option>
                  </select>
                ) : (
                  <StatusTag value={s.status} />
                )}
                <div className="material-publish staff-row-actions">
                  <StatusTag value={s.visibility} />
                  {isDraft && (
                    <>
                      <button
                        type="button"
                        className="btn btn-small btn-outline"
                        onClick={() => setModal({ type: 'edit-material', material: s, project: p })}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-outline staff-delete-btn"
                        onClick={() => setModal({ type: 'confirm-delete-draft', entity: 'material', item: s, project: p })}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {!p?.shopping?.length && <EmptyState title="No materials yet" detail="Add field material requirements for this project." />}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Material usage</h3>
            <InfoHint text="Materials recorded as actually used on site. Draft usage entries can be edited or deleted before Admin approval." />
          </div>
          {p && (
            <button className="btn btn-outline btn-small" onClick={() => setModal({ type: 'new-usage', project: p })}>
              <Plus size={14} /> Record usage
            </button>
          )}
        </div>
        {(p?.usage || []).map((u) => {
          const usageVis = u.visibility || 'Approved';
          const isDraftUsage = usageVis === 'Draft';
          return (
            <div className="usage-row staff-usage-row" key={u.id}>
              <span>
                <Package size={17} />
              </span>
              <div>
                <strong>{u.material}</strong>
                <small>
                  {dateFmt(u.date)}
                  {u.area ? ` · ${u.area}` : ''}
                </small>
              </div>
              <strong>
                {u.quantity} {u.unit}
              </strong>
              <div className="staff-row-actions">
                <StatusTag value={usageVis} />
                {isDraftUsage && (
                  <>
                    <button
                      type="button"
                      className="btn btn-small btn-outline"
                      onClick={() => setModal({ type: 'edit-usage', usage: u, project: p })}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-outline staff-delete-btn"
                      onClick={() => setModal({ type: 'confirm-delete-draft', entity: 'usage', item: u, project: p })}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {!p?.usage?.length && <EmptyState title="No usage records" detail="Record material usage from daily site activity." />}
      </div>
    </>
  );
}

function StaffNotifications({ notifications, setDb }) {
  const markStaffRead = () => {
    setDb((old) => ({
      ...old,
      notifications: (old.notifications || []).map((n) => (isBillingNotification(n) ? n : { ...n, read: true }))
    }));
  };

  return (
    <>
      <StaffPageHeader
        title="Notifications"
        infoHint="Operational updates and field alerts for your assigned projects."
      />
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Field notifications</h3>
            <InfoHint text="Financial and invoice notifications are hidden in Staff view." />
          </div>
          <button className="under-link" onClick={markStaffRead}>
            Mark all read
          </button>
        </div>
        {notifications.map((n) => (
          <div className={`notification-row ${n.read ? 'read' : ''}`} key={n.id}>
            <span className="notification-icon">
              <Bell size={17} />
            </span>
            <div>
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <small>{dateFmt(n.date)}</small>
            </div>
            {!n.read && <i className="unread-dot" />}
          </div>
        ))}
        {!notifications.length && <EmptyState title="No field notifications" detail="Operational alerts will appear here." />}
      </div>
    </>
  );
}

function StaffActivity({ projects }) {
  const [crudFilter, setCrudFilter] = useState('ALL');
  const scopedProjects = projects.map((p) => ({
    ...p,
    activity: (p.activity || []).filter((a) => !isBillingActivity(a))
  }));

  const allActivities = scopedProjects.flatMap((p) => (p.activity || []).map((a) => getActivityCrudType(a)));
  const counts = {
    ALL: allActivities.length,
    CREATE: allActivities.filter((c) => c === 'CREATE').length,
    UPDATE: allActivities.filter((c) => c === 'UPDATE').length,
    DELETE: allActivities.filter((c) => c === 'DELETE').length
  };

  return (
    <>
      <StaffPageHeader
        title="Activity Log"
        infoHint="Operational timeline across your assigned projects (billing events excluded). Every Draft create, edit, and delete action is permanently recorded."
      />
      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="staff-panel-title-inline">
            <h3>Operational Audit Trail</h3>
            <InfoHint text="Immutable CRUD audit log of Staff and studio project actions. Deleted drafts remain permanently visible here." />
          </div>
        </div>
        <div className="staff-activity-filters" role="tablist" aria-label="Filter operational activity by CRUD type">
          {[
            ['ALL', 'All'],
            ['CREATE', 'Created'],
            ['UPDATE', 'Updated'],
            ['DELETE', 'Deleted']
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={crudFilter === key}
              className={`staff-activity-filter-pill ${crudFilter === key ? 'is-active' : ''}`}
              onClick={() => setCrudFilter(key)}
            >
              <span>{label}</span>
              <span className="staff-activity-filter-count">{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="staff-activity-scroll">
          <ActivityTable projects={scopedProjects} crudFilter={crudFilter} showCrudBadge />
        </div>
      </div>
    </>
  );
}

export { StaffShell };
