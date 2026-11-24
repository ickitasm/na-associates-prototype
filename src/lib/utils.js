import { seedData } from '../data/seed';

export const STORE_KEY = 'na_associates_clean_v1';
export const THEME_KEY = 'na-theme-mode';
export const money = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n || 0));
export const dateFmt = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const nowLabel = () => new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
export const getTimeGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
};
export const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
export const loadDB = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem('na-associates-demo-v3') || localStorage.getItem('na-associates-demo-v2') || localStorage.getItem('na-associates-demo-v1');
    if (!raw) return structuredClone(seedData);
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return structuredClone(seedData);
    if (!Array.isArray(parsed.admins)) parsed.admins = structuredClone(seedData.admins);
    if (!Array.isArray(parsed.allowedAdminEmails)) parsed.allowedAdminEmails = structuredClone(seedData.allowedAdminEmails);
    if (!Array.isArray(parsed.clients)) parsed.clients = [];
    if (!Array.isArray(parsed.projects)) parsed.projects = [];
    if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
    return parsed;
  }
  catch { return structuredClone(seedData); }
};

export const syncProjectFromMilestones = (project) => {
  if (!project) return project;
  const rawMilestones = Array.isArray(project.milestones) ? project.milestones : [];

  const milestones = rawMilestones.map((m) => {
    const rawStatus = m?.status || 'Upcoming';
    let status = rawStatus;
    let progress = Number(m?.progress ?? 0);
    if (!Number.isFinite(progress)) progress = 0;

    if (rawStatus === 'Completed') {
      status = 'Completed';
      progress = 100;
    } else if (rawStatus === 'Upcoming') {
      status = 'Upcoming';
      progress = 0;
    } else {
      const clamped = Math.round(Math.min(100, Math.max(0, progress)));
      if (clamped <= 0) {
        status = 'Upcoming';
        progress = 0;
      } else if (clamped >= 100) {
        status = 'Completed';
        progress = 100;
      } else {
        status = 'In Progress';
        progress = clamped;
      }
    }

    return { ...m, status, progress };
  });

  const overallProgress = milestones.length === 0
    ? 0
    : Math.round(milestones.reduce((sum, m) => sum + Number(m.progress || 0), 0) / milestones.length);

  const allDone = milestones.length > 0 && milestones.every((m) => m.status === 'Completed');
  const latestMilestone = milestones.length > 0 ? milestones[milestones.length - 1] : null;

  let nextMilestone = '—';
  let nextMilestoneDate = null;

  if (allDone) {
    nextMilestone = 'DONE';
    nextMilestoneDate = latestMilestone?.date || project.targetDate || project.nextMilestoneDate || null;
  } else if (latestMilestone) {
    nextMilestone = latestMilestone.title || '—';
    nextMilestoneDate = latestMilestone.date || project.nextMilestoneDate || null;
  }

  const isHeld = project.status === 'On Hold' || project.status === 'Ready to Resume';
  const status = isHeld
    ? project.status
    : (allDone && overallProgress === 100 ? 'Completed' : 'Active');

  return {
    ...project,
    milestones,
    progress: overallProgress,
    nextMilestone: status === 'Completed' ? 'DONE' : nextMilestone,
    nextMilestoneDate,
    status
  };
};

export const getProjectNextUp = (project) => {
  if (!project) return { label: '—', date: null };
  const milestones = Array.isArray(project.milestones) ? project.milestones : [];
  const allDone = milestones.length > 0 && milestones.every((m) => m.status === 'Completed');
  if (project.status === 'Completed' || (allDone && Number(project.progress) === 100)) {
    return {
      label: 'DONE',
      date: milestones[milestones.length - 1]?.date || project.targetDate || null
    };
  }
  if (milestones.length === 0) {
    return { label: '—', date: null };
  }
  const latest = milestones[milestones.length - 1];
  return {
    label: latest?.title || '—',
    date: latest?.date || null
  };
};

