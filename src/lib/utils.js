import { seedData } from '../data/seed';

export const STORE_KEY = 'na-associates-demo-v1';
export const money = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n || 0));
export const dateFmt = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const nowLabel = () => new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
export const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
export const loadDB = () => {
  try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : structuredClone(seedData); }
  catch { return structuredClone(seedData); }
};
