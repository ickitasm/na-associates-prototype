import { seedData } from '../data/seed';

export const STORE_KEY = 'na_associates_clean_v1';
export const THEME_KEY = 'na-theme-mode';
export const money = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n || 0));
export const dateFmt = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const nowLabel = () => new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
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
