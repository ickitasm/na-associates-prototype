import { seedData } from '../data/seed';

export const STORE_KEY = 'na_associates_clean_v2';
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
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(seedData);
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return structuredClone(seedData);
    if (!Array.isArray(parsed.admins)) parsed.admins = structuredClone(seedData.admins);
    if (!Array.isArray(parsed.allowedAdminEmails)) parsed.allowedAdminEmails = structuredClone(seedData.allowedAdminEmails);
    if (!Array.isArray(parsed.staffMembers)) parsed.staffMembers = structuredClone(seedData.staffMembers);
    if (!Array.isArray(parsed.allowedStaffEmails)) parsed.allowedStaffEmails = structuredClone(seedData.allowedStaffEmails);
    if (!Array.isArray(parsed.clients)) parsed.clients = [];
    if (!Array.isArray(parsed.projects)) parsed.projects = [];
    if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
    return parsed;
  }
  catch { return structuredClone(seedData); }
};

export const syncProjectFromMilestones = (project) => {
  if (!project) return project;
  const rawProgress = Number(project.progress ?? 0);
  const overallProgress = Number.isFinite(rawProgress)
    ? Math.round(Math.min(100, Math.max(0, rawProgress)))
    : 0;

  const isHeld = project.status === 'On Hold' || project.status === 'Ready to Resume';
  const status = isHeld
    ? project.status
    : (overallProgress >= 100 ? 'Completed' : 'Active');

  return {
    ...project,
    progress: overallProgress,
    status
  };
};

export const getProjectLatestUpdate = (project) => {
  if (!project) return { label: '—', date: null };
  const published = [...(Array.isArray(project.reports) ? project.reports : [])]
    .filter((r) => r && r.visibility === 'Published')
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const latestPublished = published[0] || null;

  if (project.status === 'Completed' || Number(project.progress) >= 100) {
    return {
      label: 'DONE',
      date: latestPublished?.date || project.targetDate || null
    };
  }
  if (!latestPublished) {
    return { label: '—', date: null };
  }
  return {
    label: latestPublished.title || '—',
    date: latestPublished.date || null
  };
};

const ID_MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const ID_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const getWeekOfMonth = (dayNum) => {
  if (dayNum <= 7) return 1;
  if (dayNum <= 14) return 2;
  if (dayNum <= 21) return 3;
  if (dayNum <= 28) return 4;
  return 5;
};

export const groupReportsByMonthAndWeek = (reports = []) => {
  const sorted = [...(Array.isArray(reports) ? reports : [])]
    .filter(Boolean)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  if (!sorted.length) return [];

  const monthMap = new Map();

  sorted.forEach((report) => {
    const dateStr = String(report.date || '').trim();
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const year = match ? match[1] : '0000';
    const monthIdx = match ? Math.max(0, Math.min(11, Number(match[2]) - 1)) : 0;
    const dayNum = match ? Math.max(1, Math.min(31, Number(match[3]))) : 1;
    const monthKey = match ? `${year}-${match[2]}` : 'unknown';
    const monthLabel = match ? `${ID_MONTHS[monthIdx]} ${year}` : 'Lainnya';
    const shortMonth = match ? ID_MONTHS_SHORT[monthIdx] : '';

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        key: monthKey,
        label: monthLabel,
        year,
        shortMonth,
        reports: [],
        weekMap: new Map()
      });
    }
    const mBucket = monthMap.get(monthKey);
    mBucket.reports.push(report);

    const weekNum = getWeekOfMonth(dayNum);
    if (!mBucket.weekMap.has(weekNum)) {
      mBucket.weekMap.set(weekNum, {
        weekNum,
        days: [],
        reports: []
      });
    }
    const wBucket = mBucket.weekMap.get(weekNum);
    wBucket.days.push(dayNum);
    wBucket.reports.push(report);
  });

  return Array.from(monthMap.values())
    .sort((a, b) => b.key.localeCompare(a.key))
    .map((mBucket) => {
      const weeks = Array.from(mBucket.weekMap.values())
        .sort((a, b) => b.weekNum - a.weekNum)
        .map((wBucket) => {
          const minDay = Math.min(...wBucket.days);
          const maxDay = Math.max(...wBucket.days);
          const dateRange = mBucket.shortMonth
            ? (minDay === maxDay
              ? `${minDay} ${mBucket.shortMonth} ${mBucket.year}`
              : `${minDay}–${maxDay} ${mBucket.shortMonth} ${mBucket.year}`)
            : '—';

          const categories = [...new Set(wBucket.reports.map((r) => r.category).filter(Boolean))];
          const totalPhotos = wBucket.reports.reduce((sum, r) => {
            if (Array.isArray(r.photoUrls) && r.photoUrls.length > 0) return sum + r.photoUrls.length;
            if (Array.isArray(r.photoNames) && r.photoNames.length > 0) return sum + r.photoNames.length;
            return sum + Number(r.photos || 0);
          }, 0);

          const totalHadir = wBucket.reports.reduce((sum, r) => {
            const list = Array.isArray(r.workers) ? r.workers : [];
            return sum + list.filter((w) => w?.attendance === 'Hadir').length;
          }, 0);
          const avgWorkers = wBucket.reports.length > 0
            ? Math.round(totalHadir / wBucket.reports.length)
            : 0;

          const highlights = wBucket.reports
            .map((r) => r.title)
            .filter(Boolean)
            .join(' · ');

          return {
            id: `${mBucket.key}-w${wBucket.weekNum}`,
            weekNumber: wBucket.weekNum,
            dateRange,
            reportCount: wBucket.reports.length,
            categories,
            totalPhotos,
            avgWorkers,
            highlights,
            reports: wBucket.reports
          };
        });

      return {
        key: mBucket.key,
        label: mBucket.label,
        count: mBucket.reports.length,
        weeks
      };
    });
};

export const createClientNotification = ({
  projectId,
  title,
  body,
  visibility = 'Published',
  date = new Date().toISOString().slice(0, 10)
}) => ({
  id: uid('notif'),
  projectId,
  title,
  body,
  visibility,
  date,
  read: false
});

export const filterClientNotifications = (notifications = [], projects = []) => {
  const projectIds = new Set((projects || []).map(p => p?.id).filter(Boolean));
  return (notifications || []).filter(n => {
    if (!n) return false;
    if (n.internal === true) return false;
    if (n.visibility === 'Draft' || n.visibility === 'Internal Only' || n.visibility === 'internal') return false;
    if (!n.projectId) return true;
    return projectIds.has(n.projectId);
  });
};


