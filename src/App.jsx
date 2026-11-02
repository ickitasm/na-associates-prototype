import React, { useEffect, useState } from 'react';
import { PublicShell } from './pages/PublicSite';
import { ClientShell } from './pages/ClientPortal';
import { AdminShell } from './pages/AdminDashboard';
import { ModalHost } from './components/ModalHost';
import { STORE_KEY, loadDB, uid, nowLabel } from './lib/utils';
import { seedData } from './data/seed';
import { CheckCircle2 } from 'lucide-react';

function resolveAppPath(pathname) {
  if (pathname.startsWith('/admin')) return { role: 'admin', page: 'home', adminTab: pathname.split('/')[2] || 'dashboard' };
  if (pathname.startsWith('/portal/client/projects/')) return { role: 'client', page: 'workspace', projectId: pathname.split('/')[4] || 'project-01' };
  if (pathname === '/portal/client' || pathname === '/portal') return { role: 'client', page: 'my-projects' };
  const publicRoutes = { '/': 'home', '/projects': 'projects', '/projects/rumah-teduh': 'project-detail', '/services': 'services', '/about': 'about', '/career': 'career', '/contact': 'contact' };
  return { role: 'guest', page: publicRoutes[pathname] || 'home' };
}
function routePath(role,page,projectId,adminTab) {
  if (role === 'admin') return `/admin/${adminTab || 'dashboard'}`;
  if (role === 'client') return page === 'workspace' ? `/portal/client/projects/${projectId}` : '/portal/client';
  return ({ home: '/', projects: '/projects', 'project-detail': '/projects/rumah-teduh', services: '/services', about: '/about', career: '/career', contact: '/contact' })[page] || '/';
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

  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }, [db]);
  useEffect(() => { const path = routePath(role,page,selectedProjectId,adminTab); if (window.location.pathname !== path) window.history.pushState({}, '', path); }, [role,page,selectedProjectId,adminTab]);
  useEffect(() => { const onPopState = () => { const next = resolveAppPath(window.location.pathname); setRole(next.role); setPage(next.page || 'home'); setAdminTab(next.adminTab || 'dashboard'); if (next.projectId) setSelectedProjectId(next.projectId); }; window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 3200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { const goHome = () => { setRole('guest'); setPage('home'); setMobileNav(false); }; window.addEventListener('na-home', goHome); return () => window.removeEventListener('na-home', goHome); }, []);

  const client = db.clients.find(c => c.id === db.currentClientId) || db.clients[0];
  const clientProjects = db.projects.filter(p => p.clientId === client?.id && client?.projects.includes(p.id));
  const selectedProject = role === 'client'
    ? (clientProjects.find(p => p.id === selectedProjectId) || clientProjects[0] || null)
    : (db.projects.find(p => p.id === selectedProjectId) || db.projects[0]);
  const clientPage = page === 'workspace' && !selectedProject ? 'my-projects' : page;
  const notify = (msg) => setToast(msg);
  const goPublic = (p) => { setRole('guest'); setPage(p); setMobileNav(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const enterClient = () => { setRole('client'); setPage('my-projects'); setSelectedProjectId(clientProjects[0]?.id || 'project-01'); setMobileNav(false); };
  const enterAdmin = () => { setRole('admin'); setAdminTab('dashboard'); setMobileNav(false); };
  const openWorkspace = (id) => { setSelectedProjectId(id); setRole('client'); setPage('workspace'); setWorkspaceSection('overview'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20); };
  const addActivity = (projectId, action, detail, actor = role === 'admin' ? 'Admin NA Associates' : client?.name || 'Guest') => {
    setDb(old => ({ ...old, projects: old.projects.map(p => p.id === projectId ? { ...p, activity: [{ id: uid('act'), date: nowLabel(), actor, action, detail }, ...(p.activity || [])] } : p) }));
  };
  const updateProject = (id, updater) => setDb(old => ({ ...old, projects: old.projects.map(p => p.id === id ? updater(p) : p) }));
  const resetDemo = () => { setDb(structuredClone(seedData)); setRole('guest'); setPage('home'); setAdminTab('dashboard'); setModal(null); notify('Data demo berhasil direset.'); };
  const changeRole = (r) => { setRole(r); setMobileNav(false); if (r === 'guest') setPage('home'); if (r === 'client') setPage('my-projects'); if (r === 'admin') setAdminTab('dashboard'); };

  return <div className="app-shell">
    {role === 'guest' && <PublicShell page={page} setPage={setPage} go={goPublic} onLogin={() => setModal({ type: 'login' })} role={role} changeRole={changeRole} mobileNav={mobileNav} setMobileNav={setMobileNav} />}
    {role === 'client' && <ClientShell db={db} client={client} projects={clientProjects} selectedProject={selectedProject} page={clientPage} setPage={setPage} onOpen={openWorkspace} onBack={() => setPage('my-projects')} onLogout={() => changeRole('guest')} onReset={resetDemo} onNotify={notify} setModal={setModal} updateProject={updateProject} addActivity={addActivity} workspaceSection={workspaceSection} setWorkspaceSection={setWorkspaceSection} mobileNav={mobileNav} setMobileNav={setMobileNav} />}
    {role === 'admin' && <AdminShell db={db} setDb={setDb} projects={db.projects} clients={db.clients} selectedProject={selectedProject} selectedProjectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId} tab={adminTab} setTab={setAdminTab} onLogout={() => changeRole('guest')} onReset={resetDemo} onNotify={notify} setModal={setModal} updateProject={updateProject} addActivity={addActivity} />}
    {modal && <ModalHost modal={modal} close={() => setModal(null)} db={db} setDb={setDb} selectedProject={selectedProject} updateProject={updateProject} addActivity={addActivity} notify={notify} changeRole={changeRole} enterClient={enterClient} enterAdmin={enterAdmin} />}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

export default App;
