export const seedData = {
  currentClientId: 'client-01',
  admins: [{ id: 'admin-primary', name: 'NA Owner', email: 'owner@example.com', isPrimary: true, status: 'Active' }],
  clients: [
    { id: 'client-01', name: 'Aditya Pratama', email: 'aditya@example.com', phone: '+62 812 3456 7890', projects: ['project-01', 'project-02'], status: 'Active' },
    { id: 'client-02', name: 'Nadia Putri', email: 'nadia@example.com', phone: '+62 813 1111 2222', projects: ['project-03'], status: 'Active' }
  ],
  projects: [
    {
      id: 'project-01', code: 'NA-026', name: 'Rumah Teduh', location: 'Kemang, Jakarta Selatan', category: 'Residential', landArea: '240 m²', buildingArea: '185 m²', year: '2026', status: 'Active', progress: 62, clientId: 'client-01', cover: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85', startDate: '2026-02-01', targetDate: '2027-01-31', nextMilestone: 'Struktur lantai 2', nextMilestoneDate: '2026-11-12', nextPayment: '2026-11-10',
      milestones: [
        { id: 'm1', title: 'Concept & Brief', date: '2026-03-01', status: 'Completed', progress: 100 },
        { id: 'm2', title: 'Schematic Design', date: '2026-04-10', status: 'Completed', progress: 100 },
        { id: 'm3', title: 'Design Development', date: '2026-06-15', status: 'Completed', progress: 100 },
        { id: 'm4', title: 'Construction Documentation', date: '2026-08-20', status: 'Completed', progress: 100 },
        { id: 'm5', title: 'Struktur & Pekerjaan Lapangan', date: '2026-11-12', status: 'In Progress', progress: 62 },
        { id: 'm6', title: 'Finishing & Handover', date: '2027-01-31', status: 'Upcoming', progress: 0 }
      ],
      files: [
        { id: 'f1', name: 'Concept Design — Rumah Teduh.pdf', category: 'Presentation', date: '2026-04-12', type: 'PDF', visibility: 'Published', description: 'Konsep awal dan arah desain hunian.' },
        { id: 'f2', name: 'Living Room — Final Render.jpg', category: 'Rendering', date: '2026-08-18', type: 'JPG', visibility: 'Published', description: 'Visualisasi ruang keluarga.' },
        { id: 'f3', name: 'Working Drawing — Structure.pdf', category: 'Drawing', date: '2026-10-03', type: 'PDF', visibility: 'Published', description: 'Gambar kerja struktur.' },
        { id: 'f4', name: 'Internal Cost Review.xlsx', category: 'Internal', date: '2026-10-15', type: 'XLSX', visibility: 'Internal Only', description: 'Dokumen internal tim.' }
      ],
      reports: [
        { id: 'r1', date: '2026-10-30', category: 'Struktur', title: 'Pekerjaan balok lantai dua', description: 'Pemasangan bekisting balok dan persiapan pengecoran pada area utama.', progress: 62, visibility: 'Published', photos: 3 },
        { id: 'r2', date: '2026-10-28', category: 'Masonry', title: 'Pekerjaan dinding area servis', description: 'Pemasangan bata ringan pada area servis dan ruang penyimpanan.', progress: 60, visibility: 'Published', photos: 4 },
        { id: 'r3', date: '2026-11-01', category: 'Struktur', title: 'Pemeriksaan tulangan', description: 'Catatan pemeriksaan internal sebelum pengecoran.', progress: 63, visibility: 'Draft', photos: 2 }
      ],
      shopping: [
        { id: 's1', date: '2026-11-08', material: 'Besi beton Ø10', specification: 'SNI, panjang 12 m', quantity: 120, unit: 'batang', status: 'Dalam Proses', visibility: 'Published', supplier: 'Baja Sentosa', unitCost: 78000 },
        { id: 's2', date: '2026-11-12', material: 'Semen Portland', specification: '50 kg / sak', quantity: 80, unit: 'sak', status: 'Belum Dibeli', visibility: 'Published', supplier: 'Toko Bangunan Jaya', unitCost: 69000 },
        { id: 's3', date: '2026-11-15', material: 'Pasir beton', specification: 'Kualitas cor', quantity: 4, unit: 'm³', status: 'Sudah Dibeli', visibility: 'Draft', supplier: 'CV Sumber Alam', unitCost: 280000 }
      ],
      usage: [{ id: 'u1', date: '2026-10-30', material: 'Besi beton Ø10', quantity: 36, unit: 'batang', area: 'Balok lantai 2' }],
      legal: [
        { id: 'l1', name: 'Perjanjian Jasa Arsitektur', version: 'v1.0', date: '2026-02-01', visibility: 'Published' },
        { id: 'l2', name: 'Addendum 01 — Penyesuaian Area', version: 'v1.0', date: '2026-06-20', visibility: 'Published' },
        { id: 'l3', name: 'Legal Review Internal', version: 'v1.0', date: '2026-10-01', visibility: 'Internal Only' }
      ],
      invoices: [
        { id: 'i1', number: 'INV-NA-026-001', revision: 0, amount: 10000000, dueDate: '2026-11-10', issueDate: '2026-10-25', status: 'Partially Paid', payments: [{ id: 'p1', date: '2026-11-01', claimed: 4000000, approved: 4000000, status: 'Approved', receipt: 'RCPT-026-001', proof: 'Bukti-transfer-1.jpg' }] , replacedBy: null, reason: '' },
        { id: 'i2', number: 'INV-NA-026-002', revision: 0, amount: 7500000, dueDate: '2026-12-10', issueDate: '2026-11-01', status: 'Unpaid', payments: [], replacedBy: null, reason: '' }
      ],
      activity: [
        { id: 'a1', date: '2026-11-01 10:42', actor: 'Admin NA', action: 'Payment verified', detail: 'Pembayaran Rp4.000.000 pada INV-NA-026-001 disetujui.' },
        { id: 'a2', date: '2026-10-30 16:10', actor: 'Admin NA', action: 'Progress published', detail: 'Pekerjaan balok lantai dua dipublikasikan.' },
        { id: 'a3', date: '2026-10-25 09:30', actor: 'Admin NA', action: 'Invoice issued', detail: 'INV-NA-026-001 diterbitkan.' }
      ]
    },
    {
      id: 'project-02', code: 'NA-031', name: 'Villa Aruna', location: 'Ubud, Bali', category: 'Residential', landArea: '620 m²', buildingArea: '310 m²', year: '2026', status: 'Active', progress: 28, clientId: 'client-01', cover: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85', startDate: '2026-06-01', targetDate: '2027-05-30', nextMilestone: 'Design development', nextMilestoneDate: '2026-11-20', nextPayment: '2026-11-18', milestones: [], files: [], reports: [], shopping: [], usage: [], legal: [], invoices: [], activity: []
    },
    {
      id: 'project-03', code: 'NA-019', name: 'Ruang Karya Office', location: 'Bandung, Jawa Barat', category: 'Commercial', landArea: '410 m²', buildingArea: '520 m²', year: '2025', status: 'Completed', progress: 100, clientId: 'client-02', cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85', startDate: '2025-02-01', targetDate: '2025-12-20', nextMilestone: 'Handover selesai', nextMilestoneDate: '2025-12-20', nextPayment: null, milestones: [], files: [], reports: [], shopping: [], usage: [], legal: [], invoices: [], activity: []
    }
  ],
  notifications: [
    { id: 'n1', title: 'Bukti pembayaran diterima', body: 'Bukti transfer untuk INV-NA-026-001 sedang menunggu pemeriksaan.', date: '2026-11-01', read: false },
    { id: 'n2', title: 'Progress proyek diperbarui', body: 'Laporan pekerjaan balok lantai dua telah dipublikasikan.', date: '2026-10-30', read: true }
  ]
};
