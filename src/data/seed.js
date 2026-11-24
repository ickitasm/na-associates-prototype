export const seedData = {
  currentClientId: null,
  admins: [{ id: 'admin-primary', name: 'NA Owner', email: 'owner@example.com', isPrimary: true, status: 'Active' }],
  allowedAdminEmails: ['owner@example.com', 'admin@na-associates.id', 'mike777rafael@gmail.com'],
  clients: [
    { id: 'client-01', username: 'aditya_frhouse', name: 'Aditya Pratama', email: 'aditya@example.com', phone: '+62 812 3456 7890', date: '2026-02-01', projects: ['project-01'], status: 'Active' },
    { id: 'client-02', username: 'budi_kuningan', name: 'Budi Santoso', email: 'budi@example.com', phone: '+62 819 8765 4321', date: '2026-05-10', projects: ['project-02'], status: 'Active' },
    { id: 'client-03', username: 'citra_bintaro', name: 'Citra Lestari', email: 'citra@example.com', phone: '+62 811 2233 4455', date: '2025-01-15', projects: ['project-03'], status: 'Active' }
  ],
  projects: [
    {
      id: 'project-01', code: 'NA-026', name: 'FR HOUSE', location: 'Kemang, Jakarta Selatan', category: 'Residential', landArea: '240 m²', buildingArea: '185 m²', year: '2026', status: 'Active', progress: 62, clientId: 'client-01', cover: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85', startDate: '2026-02-01', targetDate: '2027-01-31', nextMilestone: 'Struktur lantai 2', nextMilestoneDate: '2026-11-12', nextPayment: '2026-11-10',
      milestones: [
        { id: 'm1', title: 'Concept & Brief', date: '2026-03-01', status: 'Completed', progress: 100 },
        { id: 'm2', title: 'Schematic Design', date: '2026-04-10', status: 'Completed', progress: 100 },
        { id: 'm3', title: 'Design Development', date: '2026-06-15', status: 'Completed', progress: 100 },
        { id: 'm4', title: 'Construction Documentation', date: '2026-08-20', status: 'Completed', progress: 100 },
        { id: 'm5', title: 'Struktur & Pekerjaan Lapangan', date: '2026-11-12', status: 'In Progress', progress: 62 },
        { id: 'm6', title: 'Finishing & Handover', date: '2027-01-31', status: 'Upcoming', progress: 0 }
      ],
      files: [
        { id: 'f1', name: 'Concept Design — FR HOUSE.pdf', category: 'Presentation', date: '2026-04-12', type: 'PDF', visibility: 'Published', description: 'Konsep awal dan arah desain hunian.' },
        { id: 'f2', name: 'Living Room — Final Render.jpg', category: 'Rendering', date: '2026-08-18', type: 'JPG', visibility: 'Published', description: 'Visualisasi ruang keluarga.' },
        { id: 'f3', name: 'Working Drawing — Structure.pdf', category: 'Drawing', date: '2026-10-03', type: 'PDF', visibility: 'Published', description: 'Gambar kerja struktur.' }
      ],
      reports: [
        {
          id: 'r1',
          date: '2026-10-30',
          category: 'Struktur',
          title: 'Pekerjaan balok lantai dua',
          description: 'Pemasangan bekisting balok dan persiapan pengecoran pada area utama.',
          progress: 62,
          visibility: 'Published',
          photos: 3,
          photoNames: ['bekisting-balok-lt2.jpg', 'pembesian-utama.jpg', 'inspeksi-sambungan.jpg'],
          workers: [
            { id: 'w1', name: 'Pak Joko', attendance: 'Hadir', task: 'Pembesian & perakitan tulangan balok' },
            { id: 'w2', name: 'Pak Slamet', attendance: 'Hadir', task: 'Pemasangan bekisting kayu & perancah cor' },
            { id: 'w3', name: 'Pak Asep', attendance: 'Hadir', task: 'Pengecoran & operator mesin molen' },
            { id: 'w4', name: 'Pak Budi', attendance: 'Hadir', task: 'Penyusunan semen & angkut material pasir' }
          ],
          tools: 'Molen beton 1 unit, Vibrator cor 2 unit, Bar bender, Scaffolding 16 set',
          internalNotes: 'Pengecoran area as balok utama berjalan lancar. Cuaca cerah hingga sore.'
        },
        {
          id: 'r2',
          date: '2026-10-28',
          category: 'Masonry',
          title: 'Pekerjaan dinding area servis',
          description: 'Pemasangan bata ringan pada area servis dan ruang penyimpanan.',
          progress: 60,
          visibility: 'Published',
          photos: 4,
          photoNames: ['pasang-bata-ringan.jpg', 'plester-sudut.jpg', 'cek-lot-vertikal.jpg', 'area-servis.jpg'],
          workers: [
            { id: 'w5', name: 'Pak Slamet', attendance: 'Hadir', task: 'Pasang bata hebel & perekat semen instan' },
            { id: 'w6', name: 'Pak Joko', attendance: 'Hadir', task: 'Plesteran dasar & roskam dinding' },
            { id: 'w7', name: 'Pak Rohim', attendance: 'Izin', task: 'Bantu adukan mortar (izin keperluan keluarga)' }
          ],
          tools: 'Waterpass digital, Sendok semen, Palu karet, Ember cor, Steger kayu',
          internalNotes: 'Kedatangan bata hebel tambahan 5 m3 sudah diterima di lokasi.'
        },
        {
          id: 'r3',
          date: '2026-11-01',
          category: 'Struktur',
          title: 'Pemeriksaan tulangan (Draft)',
          description: 'Catatan pemeriksaan internal sebelum pengecoran lantai dua.',
          progress: 63,
          visibility: 'Draft',
          photos: 2,
          photoNames: ['cek-selimut-beton.jpg', 'ikatan-kawat-bendrat.jpg'],
          workers: [
            { id: 'w8', name: 'Pak Joko', attendance: 'Hadir', task: 'Pemeriksaan jarak sengkang & ikatan bendrat' },
            { id: 'w9', name: 'Pak Asep', attendance: 'Sakit', task: 'Istirahat (Sakit demam ringan)' }
          ],
          tools: 'Meteran laser, Caliper besi, Kompresor angin pembersih bekisting',
          internalNotes: 'Draft laporan internal tim lapangan sebelum dipublikasikan ke klien.'
        }
      ],
      shopping: [
        { id: 's1', date: '2026-11-08', material: 'Besi beton Ø10', specification: 'SNI, panjang 12 m', quantity: 120, unit: 'batang', status: 'Dalam Proses', visibility: 'Published', supplier: 'Baja Sentosa', unitCost: 78000 },
        { id: 's2', date: '2026-11-12', material: 'Semen Portland', specification: '50 kg / sak', quantity: 80, unit: 'sak', status: 'Belum Dibeli', visibility: 'Published', supplier: 'Toko Bangunan Jaya', unitCost: 69000 }
      ],
      usage: [{ id: 'u1', date: '2026-10-30', material: 'Besi beton Ø10', quantity: 36, unit: 'batang', area: 'Balok lantai 2' }],
      legal: [
        { id: 'l1', name: 'Perjanjian Jasa Arsitektur', version: 'v1.0', date: '2026-02-01', visibility: 'Published' },
        { id: 'l2', name: 'Addendum 01 — Penyesuaian Area', version: 'v1.0', date: '2026-06-20', visibility: 'Published' }
      ],
      invoices: [
        { id: 'i1', number: 'INV-NA-026-001', revision: 0, amount: 10000000, dueDate: '2026-11-10', issueDate: '2026-10-25', status: 'Partially Paid', documentFile: 'INV-NA-026-001-Termin1.pdf', payments: [{ id: 'p1', date: '2026-11-01', claimed: 4000000, approved: 4000000, status: 'Approved', receipt: 'RCPT-026-001', receiptFile: 'Kwitansi-RCPT-026-001.pdf', proof: 'Bukti-transfer-1.jpg' }] , replacedBy: null, reason: '' },
        { id: 'i2', number: 'INV-NA-026-002', revision: 0, amount: 7500000, dueDate: '2026-12-10', issueDate: '2026-11-01', status: 'Unpaid', documentFile: 'INV-NA-026-002-Termin2.pdf', payments: [], replacedBy: null, reason: '' }
      ],
      activity: [
        { id: 'a1', date: '2026-11-01 10:42', actor: 'Admin NA', action: 'Payment verified', detail: 'Pembayaran Rp4.000.000 pada INV-NA-026-001 disetujui.' },
        { id: 'a2', date: '2026-10-30 16:10', actor: 'Admin NA', action: 'Progress published', detail: 'Pekerjaan balok lantai dua dipublikasikan.' }
      ]
    },
    {
      id: 'project-02', code: 'NA-031', name: 'KUNINGAN COMMERCIAL HUB', location: 'Kuningan, Jakarta Selatan', category: 'Commercial', landArea: '1250 m²', buildingArea: '2400 m²', year: '2026', status: 'On Hold', holdReason: 'Pembayaran termin INV-KNG-001 telah melewati jatuh tempo H+7.', progress: 45, clientId: 'client-02', cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85', startDate: '2026-04-01', targetDate: '2027-06-30', nextMilestone: 'Pelunasan Termin Overdue', nextMilestoneDate: '2026-10-15', nextPayment: '2026-10-10',
      milestones: [
        { id: 'm01', title: 'Permit & Zoning', date: '2026-05-01', status: 'Completed', progress: 100 },
        { id: 'm02', title: 'Substructure & Piling', date: '2026-07-15', status: 'Completed', progress: 100 },
        { id: 'm03', title: 'Steel Frame Structure', date: '2026-10-15', status: 'In Progress', progress: 45 }
      ],
      files: [
        { id: 'f21', name: 'Masterplan — Kuningan Hub.pdf', category: 'Presentation', date: '2026-04-20', type: 'PDF', visibility: 'Published', description: 'Masterplan komersial.' }
      ],
      reports: [
        {
          id: 'r21',
          date: '2026-10-10',
          category: 'Struktur',
          title: 'Pemasangan kolom baja utama',
          description: 'Ereksi kolom baja WF pada zona A dan B.',
          progress: 45,
          visibility: 'Published',
          photos: 2,
          photoNames: ['kolom-baja-01.jpg', 'crane-ereksi.jpg'],
          workers: [
            { id: 'w21', name: 'Pak Darsono', attendance: 'Hadir', task: 'Operator crane & rigging' }
          ],
          tools: 'Mobile crane 25 ton, Welding machine',
          internalNotes: 'Proyek ditahan sementara menunggu pelunasan termin H+7.'
        }
      ],
      shopping: [],
      usage: [],
      legal: [
        { id: 'l21', name: 'Kontrak Utama Konstruksi', version: 'v1.0', date: '2026-04-01', visibility: 'Published' }
      ],
      invoices: [
        { id: 'i21', number: 'INV-KNG-001', revision: 0, amount: 45000000, dueDate: '2026-10-01', issueDate: '2026-09-15', status: 'Unpaid', documentFile: 'INV-KNG-001.pdf', payments: [], replacedBy: null, reason: 'Overdue H+7 auto-hold' }
      ],
      activity: [
        { id: 'act21', date: '2026-10-09 11:00', actor: 'Admin NA', action: 'Project placed on hold', detail: 'H+7 payment overdue recommendation confirmed by Admin.' }
      ]
    },
    {
      id: 'project-03', code: 'NA-019', name: 'BINTARO COURTYARD VILLA', location: 'Bintaro, Tangerang Selatan', category: 'Residential', landArea: '520 m²', buildingArea: '380 m²', year: '2025', status: 'Completed', progress: 100, clientId: 'client-03', cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85', startDate: '2025-01-15', targetDate: '2025-12-15', nextMilestone: 'Handover selesai', nextMilestoneDate: '2025-12-15', nextPayment: null,
      milestones: [
        { id: 'mb1', title: 'Design & Planning', date: '2025-03-01', status: 'Completed', progress: 100 },
        { id: 'mb2', title: 'Structure & MEP', date: '2025-08-10', status: 'Completed', progress: 100 },
        { id: 'mb3', title: 'Interior & Landscape Handover', date: '2025-12-15', status: 'Completed', progress: 100 }
      ],
      files: [
        { id: 'fb1', name: 'Showcase Brochure — Bintaro Villa.pdf', category: 'Presentation', date: '2025-12-20', type: 'PDF', visibility: 'Published', description: 'Dokumentasi lengkap showcase arsitektur.' },
        { id: 'fb2', name: 'Courtyard — Final Photography.jpg', category: 'Rendering', date: '2025-12-18', type: 'JPG', visibility: 'Published', description: 'Foto akhir courtyard.' }
      ],
      reports: [
        {
          id: 'rb1',
          date: '2025-12-14',
          category: 'Finishing',
          title: 'Selesai pembersihan & handover',
          description: 'Inspeksi akhir dan penyerahan kunci kepada klien.',
          progress: 100,
          visibility: 'Published',
          photos: 5,
          photoNames: ['handover-01.jpg', 'taman-belakang.jpg'],
          workers: [],
          tools: 'Peralatan pembersihan akhir',
          internalNotes: 'Handover selesai dengan sukses.'
        }
      ],
      shopping: [],
      usage: [],
      legal: [
        { id: 'lb1', name: 'Berita Acara Serah Terima (BAST)', version: 'v1.0', date: '2025-12-15', visibility: 'Published' }
      ],
      invoices: [
        { id: 'ib1', number: 'INV-BIN-001', revision: 0, amount: 25000000, dueDate: '2025-12-01', issueDate: '2025-11-15', status: 'Paid', documentFile: 'INV-BIN-001.pdf', payments: [{ id: 'pb1', date: '2025-11-28', claimed: 25000000, approved: 25000000, status: 'Approved', receipt: 'RCPT-BIN-001', receiptFile: 'Kwitansi-RCPT-BIN-001.pdf', proof: 'Bukti-lunas.jpg' }], replacedBy: null, reason: '' }
      ],
      activity: [
        { id: 'actb1', date: '2025-12-15 14:00', actor: 'Admin NA', action: 'Project completed', detail: 'Bintaro Courtyard Villa selesai dan diserahterimakan.' }
      ]
    }
  ],
  notifications: [
    { id: 'n1', title: 'Bukti pembayaran diterima', body: 'Bukti transfer untuk INV-NA-026-001 sedang menunggu pemeriksaan.', date: '2026-11-01', read: false },
    { id: 'n2', title: 'Progress proyek diperbarui', body: 'Laporan pekerjaan balok lantai dua telah dipublikasikan.', date: '2026-10-30', read: true }
  ]
};
