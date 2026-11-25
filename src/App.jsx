import React, { useEffect, useState } from 'react';
import { PublicShell } from './pages/PublicSite';
import { ClientShell } from './pages/ClientPortal';
import { AdminShell } from './pages/AdminDashboard';
import { StaffShell } from './pages/StaffDashboard';
import { ModalHost } from './components/ModalHost';
import { STORE_KEY, loadDB, uid, nowLabel } from './lib/utils';
import { seedData } from './data/seed';
import { CheckCircle2 } from 'lucide-react';
import vectorLogo from './public/Vector.svg';

function IntroSplash({ leaving }) {
  return (
    <div className={`intro-splash ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="intro-splash-inner">
        <div className="intro-splash-logo-wrap">
          <img src={vectorLogo} alt="NA Associates" className="intro-splash-logo" />
        </div>
        <span className="intro-splash-line" />
      </div>
    </div>
  );
}

function resolveAppPath(pathname) {
  if (pathname.startsWith('/admin')) return { role: 'admin', page: 'home', adminTab: pathname.split('/')[2] || 'dashboard' };
  if (pathname.startsWith('/staff')) return { role: 'staff', page: 'home', staffTab: pathname.split('/')[2] || 'dashboard' };
  if (pathname.startsWith('/portal/client/projects/')) return { role: 'client', page: 'workspace', projectId: pathname.split('/')[4] || 'project-01' };
  if (pathname === '/portal/client' || pathname === '/portal') return { role: 'client', page: 'my-projects' };
  const publicRoutes = { '/': 'home', '/projects': 'projects', '/projects/fr-house': 'project-detail', '/projects/rumah-teduh': 'project-detail', '/services': 'services', '/about': 'about', '/career': 'career', '/contact': 'contact' };
  return { role: 'guest', page: publicRoutes[pathname] || 'home' };
}
function routePath(role,page,projectId,adminTab,staffTab) {
  if (role === 'admin') return `/admin/${adminTab || 'dashboard'}`;
  if (role === 'staff') return `/staff/${staffTab || 'dashboard'}`;
  if (role === 'client') return page === 'workspace' ? `/portal/client/projects/${projectId}` : '/portal/client';
  return ({ home: '/', projects: '/projects', 'project-detail': '/projects/fr-house', services: '/services', about: '/about', career: '/career', contact: '/contact' })[page] || '/';
}

function App() {
  const [db, setDb] = useState(loadDB);
  const [initialRoute] = useState(() => resolveAppPath(window.location.pathname));
  const [role, setRole] = useState(initialRoute.role);
  const [page, setPage] = useState(initialRoute.page || 'home');
  const [selectedProjectId, setSelectedProjectId] = useState(initialRoute.projectId || 'project-01');
  const [modal, setModal] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [workspaceSection, setWorkspaceSection] = useState('overview');
  const [adminTab, setAdminTab] = useState(initialRoute.adminTab || 'dashboard');
  const [staffTab, setStaffTab] = useState(initialRoute.staffTab || 'dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('na-theme-mode') || 'light');
  const [splashState, setSplashState] = useState(() => (initialRoute.role === 'guest' ? 'active' : 'done'));
  const [heroReady, setHeroReady] = useState(() => initialRoute.role !== 'guest');

  useEffect(() => {
    if (initialRoute.role !== 'guest') return;
    const leaveTimer = setTimeout(() => setSplashState('leaving'), 1600);
    const heroTimer = setTimeout(() => setHeroReady(true), 1880);
    const doneTimer = setTimeout(() => setSplashState('done'), 2150);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(heroTimer);
      clearTimeout(doneTimer);
    };
  }, [initialRoute.role]);

  useEffect(() => {
    localStorage.setItem('na-theme-mode', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }, [db]);
  useEffect(() => { const path = routePath(role,page,selectedProjectId,adminTab,staffTab); if (window.location.pathname !== path) window.history.pushState({}, '', path); }, [role,page,selectedProjectId,adminTab,staffTab]);
  useEffect(() => { const onPopState = () => { const next = resolveAppPath(window.location.pathname); setRole(next.role); setPage(next.page || 'home'); setAdminTab(next.adminTab || 'dashboard'); setStaffTab(next.staffTab || 'dashboard'); if (next.projectId) setSelectedProjectId(next.projectId); }; window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 3200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { const goHome = () => { setRole('guest'); setPage('home'); setMobileNav(false); }; window.addEventListener('na-home', goHome); return () => window.removeEventListener('na-home', goHome); }, []);

  const client = db.clients.find(c => c.id === db.currentClientId) || db.clients[0];
  const clientProjects = db.projects.filter(p => p.clientId === client?.id && client?.projects.includes(p.id));
  const staffMember = (db.staffMembers && db.staffMembers[0]) || seedData.staffMembers[0];
  const assignedStaffIds = staffMember?.assignedProjects || [];
  const staffAssigned = assignedStaffIds.length > 0 ? db.projects.filter(p => assignedStaffIds.includes(p.id)) : [];
  const staffProjects = staffAssigned.length > 0 ? staffAssigned : db.projects.filter(p => p.status === 'Active');
  const selectedProject = role === 'client'
    ? (clientProjects.find(p => p.id === selectedProjectId) || clientProjects[0] || null)
    : role === 'staff'
      ? (staffProjects.find(p => p.id === selectedProjectId) || staffProjects[0] || null)
      : (db.projects.find(p => p.id === selectedProjectId) || db.projects[0]);
  const clientPage = page === 'workspace' && !selectedProject ? 'my-projects' : page;
  const notify = (msg) => setToast(msg);
  const goPublic = (p) => { setRole('guest'); setPage(p); setMobileNav(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const enterClient = (preferredProjectId) => { setRole('client'); setPage('my-projects'); setSelectedProjectId(preferredProjectId || clientProjects[0]?.id || 'project-01'); setMobileNav(false); };
  const enterAdmin = () => { setRole('admin'); setAdminTab('dashboard'); setMobileNav(false); };
  const enterStaff = () => { setRole('staff'); setStaffTab('dashboard'); if (staffProjects[0]) setSelectedProjectId(staffProjects[0].id); setMobileNav(false); };
  const openWorkspace = (id) => { setSelectedProjectId(id); setRole('client'); setPage('workspace'); setWorkspaceSection('overview'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20); };
  const addActivity = (projectId, action, detail, actor = role === 'admin' ? 'Admin NA Associates' : role === 'staff' ? `${staffMember?.name || 'Staff NA Associates'} (Staff)` : client?.name || 'Guest', meta = {}) => {
    const isoStamp = meta.date || new Date().toISOString().slice(0, 16).replace('T', ' ');
    setDb(old => ({
      ...old,
      projects: old.projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              activity: [
                {
                  id: uid('act'),
                  date: isoStamp,
                  actor,
                  action,
                  detail,
                  ...(meta.category ? { category: meta.category } : {}),
                  ...(meta.visibility ? { visibility: meta.visibility } : {}),
                  ...(meta.crudType ? { crudType: meta.crudType } : {}),
                  ...(meta.module ? { module: meta.module } : {}),
                  ...(meta.internal ? { internal: true } : {})
                },
                ...(p.activity || [])
              ]
            }
          : p
      )
    }));
  };
  const updateProject = (id, updater) => setDb(old => ({ ...old, projects: old.projects.map(p => p.id === id ? updater(p) : p) }));
  const resetDemo = () => { setDb(structuredClone(seedData)); setRole('guest'); setPage('home'); setAdminTab('dashboard'); setStaffTab('dashboard'); setModal(null); notify('Data workspace berhasil direset.'); };
  const changeRole = (r) => { setRole(r); setMobileNav(false); if (r === 'guest') setPage('home'); if (r === 'client') setPage('my-projects'); if (r === 'admin') setAdminTab('dashboard'); if (r === 'staff') setStaffTab('dashboard'); };

  const isDarkActive = role !== 'guest' && theme === 'dark';

  return <div className={`app-shell ${isDarkActive ? 'dark-mode' : ''}`} data-theme={isDarkActive ? 'dark' : 'light'} data-role={role}>
    {splashState !== 'done' && <IntroSplash leaving={splashState === 'leaving'} />}
    {role === 'guest' && <PublicShell page={page} setPage={setPage} go={goPublic} onLogin={() => setModal({ type: 'login' })} role={role} changeRole={changeRole} mobileNav={mobileNav} setMobileNav={setMobileNav} heroReady={heroReady} />}
    {role === 'client' && <ClientShell db={db} client={client} projects={clientProjects} selectedProject={selectedProject} page={clientPage} setPage={setPage} onOpen={openWorkspace} onBack={() => setPage('my-projects')} onLogout={() => changeRole('guest')} onReset={resetDemo} onNotify={notify} setModal={setModal} updateProject={updateProject} addActivity={addActivity} workspaceSection={workspaceSection} setWorkspaceSection={setWorkspaceSection} mobileNav={mobileNav} setMobileNav={setMobileNav} theme={theme} toggleTheme={toggleTheme} />}
    {role === 'admin' && <AdminShell db={db} setDb={setDb} projects={db.projects} clients={db.clients} selectedProject={selectedProject} selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId} tab={adminTab} setTab={setAdminTab} onLogout={() => changeRole('guest')} onReset={resetDemo} onNotify={notify} setModal={setModal} updateProject={updateProject} addActivity={addActivity} theme={theme} toggleTheme={toggleTheme} />}
    {role === 'staff' && <StaffShell db={db} setDb={setDb} staffMember={staffMember} projects={staffProjects} selectedProject={selectedProject} selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId} tab={staffTab} setTab={setStaffTab} onLogout={() => changeRole('guest')} onNotify={notify} setModal={setModal} updateProject={updateProject} addActivity={addActivity} theme={theme} toggleTheme={toggleTheme} />}
    {modal && <ModalHost modal={modal} setModal={setModal} close={() => setModal(null)} db={db} setDb={setDb} projects={role === 'staff' ? staffProjects : db.projects} selectedProject={selectedProject} updateProject={updateProject} addActivity={addActivity} notify={notify} role={role} changeRole={changeRole} enterClient={enterClient} enterAdmin={enterAdmin} enterStaff={enterStaff} theme={theme} />}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

export default App;
