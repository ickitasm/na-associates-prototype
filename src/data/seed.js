export const seedData = {
  currentClientId: null,
  admins: [
    { id: 'admin-primary', name: 'NA Owner', email: 'owner@example.com', isPrimary: true, status: 'Active' }
  ],
  allowedAdminEmails: ['owner@example.com', 'admin@na-associates.id', 'mike777rafael@gmail.com'],
  staffMembers: [
    {
      id: 'staff-01',
      name: 'Raka Pratama',
      roleTitle: 'Field Architect / Staff',
      email: 'raka.staff@na-associates.id',
      assignedProjects: ['project-01', 'project-02', 'project-03'],
      status: 'Active'
    }
  ],
  allowedStaffEmails: ['raka.staff@na-associates.id'],
  clients: [
    {
      id: 'client-01',
      username: 'fajar.ramadhan',
      name: 'Fajar Ramadhan',
      email: 'fajar.ramadhan@example.com',
      phone: '+62 895-3370-60007',
      date: '2026-02-01',
      projects: ['project-01', 'project-02'],
      status: 'Active'
    },
    {
      id: 'client-02',
      username: 'nadia.kusuma',
      name: 'Nadia Kusuma',
      email: 'nadia.kusuma@example.com',
      phone: '+62 895-3370-60007',
      date: '2026-04-12',
      projects: ['project-03'],
      status: 'Active'
    },
    {
      id: 'client-03',
      username: 'citra_bintaro',
      name: 'Citra Lestari',
      email: 'citra@example.com',
      phone: '+62 895-3370-60007',
      date: '2025-01-15',
      projects: ['project-04'],
      status: 'Active'
    }
  ],
  projects: [
    {
      id: 'project-01',
      code: 'NA-026',
      name: 'FR HOUSE',
      location: 'Kemang, Jakarta Selatan',
      category: 'Residential',
      landArea: '240 m²',
      buildingArea: '185 m²',
      year: '2026',
      status: 'Active',
      progress: 62,
      clientId: 'client-01',
      cover: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85',
      startDate: '2026-02-01',
      targetDate: '2027-01-31',
      nextMilestone: '2nd Floor Beam & Slab Work',
      nextMilestoneDate: '2026-11-18',
      nextPayment: '2026-11-15',
      milestones: [
        { id: 'm1', title: 'Concept & Brief', date: '2026-03-01', status: 'Completed', progress: 100 },
        { id: 'm2', title: 'Schematic Design', date: '2026-04-10', status: 'Completed', progress: 100 },
        { id: 'm3', title: 'DED & Structural Drawings', date: '2026-06-15', status: 'Completed', progress: 100 },
        { id: 'm4', title: 'Foundation & Lower Structure', date: '2026-08-24', status: 'Completed', progress: 100 },
        { id: 'm5', title: '2nd Floor Beam & Slab Work', date: '2026-11-18', status: 'In Progress', progress: 34 },
        { id: 'm6', title: 'MEP & Interior Fit-Out', date: '2026-12-22', status: 'Upcoming', progress: 0 },
        { id: 'm7', title: 'Final Handover', date: '2027-01-31', status: 'Upcoming', progress: 0 }
      ],
      files: [
        { id: 'f1', name: 'Facade Exterior — Night Lighting Render.jpg', category: 'Rendering', date: '2026-10-29', type: 'JPG', visibility: 'Published', description: 'Visualisasi fasad malam hari dengan pencahayaan arsitektural hangat.', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85' },
        { id: 'f2', name: 'DED Struktur & Detail Pembesian Balok Lt. 2.pdf', category: 'DED', date: '2026-10-14', type: 'PDF', visibility: 'Published', description: 'Gambar kerja detail pembesian balok induk, anak balok, dan plat lantai dua.' },
        { id: 'f3', name: 'Floor Plan Lt. 1 & Lt. 2 — Rev 04.pdf', category: 'Floor Plan', date: '2026-09-26', type: 'PDF', visibility: 'Published', description: 'Denah revisi tata ruang lantai dasar dan lantai dua pasca peninjauan servis.' },
        { id: 'f4', name: '3D BIM Architectural Model — FR HOUSE.pdf', category: '3D Model', date: '2026-09-08', type: 'PDF', visibility: 'Published', description: 'Ekspor potongan perspektif 3D koordinasi struktur dan bukaan cahaya.' },
        { id: 'f5', name: 'Living & Double-Height Dining Render.jpg', category: 'Rendering', date: '2026-08-18', type: 'JPG', visibility: 'Published', description: 'Visualisasi interior ruang keluarga dan ruang makan berplafon tinggi.', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85' },
        { id: 'f6', name: 'DED Jalur Plumbing & Titik Lampu MEP.pdf', category: 'DED', date: '2026-07-22', type: 'PDF', visibility: 'Published', description: 'Detail rencana jaringan air bersih, air kotor, dan panel elektrikal utama.' },
        { id: 'f7', name: 'Master Concept & Material Moodboard.pdf', category: 'Floor Plan', date: '2026-04-12', type: 'PDF', visibility: 'Published', description: 'Konsep awal zonasi tapak, sirkulasi silang, dan palet batu alam.' },
        { id: 'f8', name: 'Catatan Koordinasi Lapangan Internal.pdf', category: 'DED', date: '2026-11-01', type: 'PDF', visibility: 'Internal Only', description: 'Arsip internal pengecekan deviasi lapangan sebelum publikasi.' }
      ],
      reports: [
        {
          id: 'r1',
          date: '2026-10-30',
          category: 'Struktur',
          title: 'Pengecoran Balok & Plat Lantai 2',
          fieldNote: 'Zona as B–D selesai cor ready-mix K-300',
          description: 'Pengecoran balok induk dan plat lantai dua selesai menggunakan concrete pump dengan pengujian slump di lokasi (10 cm) serta pemadatan vibrator merata.',
          visibility: 'Published',
          photos: 4,
          photoNames: ['pengecoran-plat-lt2.jpg', 'slump-test-k300.jpg', 'vibrator-pemadatan.jpg', 'finishing-permukaan.jpg'],
          workers: [
            { id: 'w1', name: 'Pak Joko', attendance: 'Hadir', task: 'Mandor pengecoran & kontrol elevasi plat' },
            { id: 'w2', name: 'Pak Slamet', attendance: 'Hadir', task: 'Operator vibrator beton & perataan screeding' },
            { id: 'w3', name: 'Pak Asep', attendance: 'Hadir', task: 'Pengecekan bekisting & penguat perancah bawah' },
            { id: 'w4', name: 'Pak Budi', attendance: 'Hadir', task: 'Pengaturan selang concrete pump & curing awal' }
          ],
          tools: 'Concrete pump 1 unit, Vibrator cor 2 unit, Laser level, Scaffolding 24 set',
          internalNotes: 'Volume beton sesuai pesanan 14 m³. Tidak ada kebocoran bekisting.'
        },
        {
          id: 'r2',
          date: '2026-10-26',
          category: 'Struktur',
          title: 'Pemasangan Rangka Atap Baja Ringan',
          fieldNote: 'Kuda-kuda area atap servis terpasang 100%',
          description: 'Pemasangan profil kanal C75 untuk rangka atap area servis belakang beserta ikatan angin dan baut self-drilling sesuai detail gambar kerja.',
          visibility: 'Published',
          photos: 3,
          photoNames: ['rangka-baja-ringan.jpg', 'sambungan-baut-kuda.jpg', 'cek-kemiringan-atap.jpg'],
          workers: [
            { id: 'w5', name: 'Pak Slamet', attendance: 'Hadir', task: 'Perakitan kuda-kuda baja ringan C75' },
            { id: 'w6', name: 'Pak Joko', attendance: 'Hadir', task: 'Pemasangan reng & ikatan angin diagonal' },
            { id: 'w7', name: 'Pak Rohim', attendance: 'Hadir', task: 'Pengukuran sudut kemiringan 28°' }
          ],
          tools: 'Bor impact listrik, Waterpass laser, Tang potong baja, Tali safety harness',
          internalNotes: 'Sisa material kanal C75 disimpan di gudang kering.'
        },
        {
          id: 'r3',
          date: '2026-10-21',
          category: 'MEP',
          title: 'Instalasi Jalur Plumbing & Elektrikal',
          fieldNote: 'Pipa air bersih & sparing conduit lt. 1 terpasang',
          description: 'Pemasangan pipa air bersih PPR, jalur pipa air kotor PVC AW bergradien 2%, dan penanaman conduit listrik sebelum penutupan plester dinding.',
          visibility: 'Published',
          photos: 3,
          photoNames: ['pipa-ppr-kamar-mandi.jpg', 'sparing-conduit-dinding.jpg', 'uji-tekan-pipa.jpg'],
          workers: [
            { id: 'w8', name: 'Pak Hendra', attendance: 'Hadir', task: 'Penyambungan pipa PPR dengan mesin pemanas' },
            { id: 'w9', name: 'Pak Asep', attendance: 'Hadir', task: 'Bobok jalur conduit & pemasangan inbow dus' },
            { id: 'w10', name: 'Pak Budi', attendance: 'Izin', task: 'Bantu angkut pipa (izin setengah hari)' }
          ],
          tools: 'Mesin las pipa PPR, Pompa uji tekan, Gerinda potong dinding, Multimeter',
          internalNotes: 'Uji tekan pipa bertahan stabil di 6 bar selama 2 jam tanpa penurunan.'
        },
        {
          id: 'r4',
          date: '2026-10-15',
          category: 'Masonry',
          title: 'Plesteran & Aci Dinding Area Servis',
          fieldNote: 'Dinding dapur kotor & ruang cuci selesai aci',
          description: 'Penyelesaian plesteran dinding bata ringan menggunakan mortar instan dan perataan acian halus siap pelapisan cat dasar anti-lembap.',
          visibility: 'Published',
          photos: 3,
          photoNames: ['plester-dinding-servis.jpg', 'cek-lot-sudut.jpg', 'acian-halus-dapur.jpg'],
          workers: [
            { id: 'w11', name: 'Pak Slamet', attendance: 'Hadir', task: 'Plester kepalaan & tarikan jidar aluminium' },
            { id: 'w12', name: 'Pak Joko', attendance: 'Hadir', task: 'Acian halus & perapihan sudut tali air' }
          ],
          tools: 'Jidar aluminium 2 m, Roskam baja, Mixer adukan, Waterpass digital',
          internalNotes: 'Cek kerataan permukaan lolos toleransi 2 mm.'
        },
        {
          id: 'r5',
          date: '2026-10-08',
          category: 'Struktur',
          title: 'Perakitan Tulangan Kolom Utama Lt. 2',
          fieldNote: '12 kolom utama siap pasang bekisting',
          description: 'Pabrikasi tulangan ulir D16 dan sengkang Ø8 jarak 10 cm pada tumpuan untuk seluruh kolom struktural lantai dua.',
          visibility: 'Published',
          photos: 2,
          photoNames: ['tulangan-kolom-lt2.jpg', 'ikatan-sengkang-tumpuan.jpg'],
          workers: [
            { id: 'w13', name: 'Pak Joko', attendance: 'Hadir', task: 'Perakitan besi D16 & pengecekan panjang lewatan' },
            { id: 'w14', name: 'Pak Rohim', attendance: 'Hadir', task: 'Pengikatan kawat bendrat & pemasangan tahu beton' }
          ],
          tools: 'Bar bender, Bar cutter, Tang kawat, Meteran baja',
          internalNotes: 'Tahu beton 3 cm terpasang konsisten di keempat sisi.'
        },
        {
          id: 'r6',
          date: '2026-09-29',
          category: 'Pondasi',
          title: 'Pengecoran Sloof & Footplat Zona B',
          fieldNote: 'Struktur bawah zona taman selesai',
          description: 'Penyelesaian pengecoran sloof pengikat dan tapak footplat area taman belakang lengkap dengan bekisting batako serta penyiapan stek kolom.',
          visibility: 'Published',
          photos: 2,
          photoNames: ['sloof-zona-b.jpg', 'stek-kolom-terpasang.jpg'],
          workers: [
            { id: 'w15', name: 'Pak Budi', attendance: 'Hadir', task: 'Pengecoran sloof & pemadatan manual' },
            { id: 'w16', name: 'Pak Asep', attendance: 'Hadir', task: 'Pemasangan stek kolom & pengecekan as bangunan' }
          ],
          tools: 'Molen beton 1 unit, Vibrator cor, Benang ukur, Theodolite',
          internalNotes: 'Elevasi top sloof sesuai datum awal +0.00.'
        },
        {
          id: 'r7',
          date: '2026-11-02',
          category: 'Struktur',
          title: 'Pembongkaran Bekisting Tepi & Curing Plat Lt. 2 (Draft)',
          fieldNote: 'Menunggu inspeksi kuat tekan hari ke-3',
          description: 'Pembongkaran bekisting samping balok tepi dan penyiraman rutin curing beton dengan karung goni basah.',
          visibility: 'Draft',
          photos: 2,
          photoNames: ['curing-plat-karung.jpg', 'bekisting-samping.jpg'],
          workers: [
            { id: 'w17', name: 'Pak Joko', attendance: 'Hadir', task: 'Pembongkaran panel samping & cek permukaan beton' },
            { id: 'w18', name: 'Pak Asep', attendance: 'Sakit', task: 'Istirahat (sakit demam ringan)' }
          ],
          tools: 'Linggis, Palu kambing, Selang air curing',
          internalNotes: 'Draft internal Staff menunggu verifikasi Admin sebelum tayang ke klien.'
        },
        {
          id: 'r8',
          date: '2026-11-03',
          category: 'MEP',
          title: 'Persiapan Panel MCB & Grounding Utama (Draft)',
          fieldNote: 'Penarikan kabel NYM & NYY area panel',
          description: 'Pemasangan box panel MCB utama 3 phase dan pengecekan tahanan grounding tembaga.',
          visibility: 'Draft',
          photos: 2,
          photoNames: ['box-panel-mcb.jpg', 'earth-tester-grounding.jpg'],
          workers: [
            { id: 'w19', name: 'Pak Hendra', attendance: 'Hadir', task: 'Pemasangan box panel & terminasi grounding' }
          ],
          tools: 'Earth tester digital, Tang crimping, Obeng insulated',
          internalNotes: 'Tahanan tanah tercatat 1.8 ohm. Menunggu foto final sebelum dipublikasikan.'
        }
      ],
      shopping: [
        { id: 's1', date: '2026-10-12', material: 'Semen Portland Tiga Roda', specification: '50 kg / sak · SNI Tipe I', quantity: 140, unit: 'sak', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'TB Jaya Makmur', unitCost: 69000 },
        { id: 's2', date: '2026-10-18', material: 'Besi Beton Ulir D13 & Ø10', specification: 'SNI KS, panjang 12 m', quantity: 160, unit: 'batang', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'Baja Sentosa', unitCost: 96000 },
        { id: 's3', date: '2026-10-25', material: 'Profil Baja Ringan C75.075', specification: 'Galvalum AZ100, panjang 6 m', quantity: 95, unit: 'batang', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'Sinar Truss Mandiri', unitCost: 112000 },
        { id: 's4', date: '2026-11-04', material: 'Bata Ringan AAC Hebel 10 cm', specification: '60 x 20 x 10 cm · Grade A', quantity: 18, unit: 'm³', status: 'Dalam Proses', visibility: 'Published', supplier: 'Depo Material Kemang', unitCost: 615000 },
        { id: 's5', date: '2026-11-08', material: 'Pipa Air Bersih PPR PN-20', specification: 'Diameter 3/4" & 1/2" + fitting', quantity: 45, unit: 'batang', status: 'Dalam Proses', visibility: 'Published', supplier: 'Mitra Plumbing Jakarta', unitCost: 138000 },
        { id: 's6', date: '2026-11-14', material: 'Kabel NYM 3x2.5 mm² Supreme', specification: 'Roll 50 m · Standar LMK', quantity: 12, unit: 'roll', status: 'Belum Dibeli', visibility: 'Published', supplier: 'Cahaya Elektrik', unitCost: 645000 },
        { id: 's7', date: '2026-11-20', material: 'Homogeneous Tile Travertine 60x120', specification: 'Matte finish · Ruang tamu & teras', quantity: 110, unit: 'm²', status: 'Belum Dibeli', visibility: 'Published', supplier: 'Galleria Stone', unitCost: 385000 }
      ],
      usage: [
        { id: 'u1', date: '2026-10-30', material: 'Semen Portland Tiga Roda', quantity: 62, unit: 'sak', area: 'Plesteran servis & screeding lt. 2', visibility: 'Approved' },
        { id: 'u2', date: '2026-10-26', material: 'Profil Baja Ringan C75.075', quantity: 74, unit: 'batang', area: 'Rangka atap zona belakang', visibility: 'Approved' },
        { id: 'u3', date: '2026-11-02', material: 'Besi Beton Ulir D13 & Ø10', quantity: 40, unit: 'batang', area: 'Kolom praktis & ring balok lt. 2', visibility: 'Draft' }
      ],
      legal: [
        { id: 'l1', name: 'Kontrak Kerja Perencanaan & Pengawasan', version: 'v1.0', date: '2026-02-01', visibility: 'Published' },
        { id: 'l2', name: 'SPK Pekerjaan Struktur', version: 'v1.0', date: '2026-05-15', visibility: 'Published' },
        { id: 'l3', name: 'Addendum Revisi Fasad & Denah Lantai 2', version: 'v1.2', date: '2026-08-10', visibility: 'Published' },
        { id: 'l4', name: 'Berita Acara Serah Terima Tahap 1', version: 'v1.0', date: '2026-09-25', visibility: 'Published' }
      ],
      invoices: [
        {
          id: 'i1',
          number: 'INV-NA-026-001',
          revision: 0,
          amount: 45000000,
          dueDate: '2026-06-20',
          issueDate: '2026-06-05',
          status: 'Paid',
          documentFile: 'INV-NA-026-001-DesainDED.pdf',
          payments: [
            {
              id: 'p1',
              date: '2026-06-14',
              claimed: 45000000,
              approved: 45000000,
              status: 'Approved',
              receipt: 'RCPT-026-001',
              receiptFile: 'Kwitansi-RCPT-026-001.pdf',
              proof: 'Transfer-BCA-DP-DED.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        },
        {
          id: 'i2',
          number: 'INV-NA-026-002',
          revision: 0,
          amount: 60000000,
          dueDate: '2026-08-25',
          issueDate: '2026-08-10',
          status: 'Paid',
          documentFile: 'INV-NA-026-002-StrukturBawah.pdf',
          payments: [
            {
              id: 'p2',
              date: '2026-08-22',
              claimed: 60000000,
              approved: 60000000,
              status: 'Approved',
              receipt: 'RCPT-026-002',
              receiptFile: 'Kwitansi-RCPT-026-002.pdf',
              proof: 'Transfer-Mandiri-Termin2.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        },
        {
          id: 'i3',
          number: 'INV-NA-026-003',
          revision: 0,
          amount: 50000000,
          dueDate: '2026-11-15',
          issueDate: '2026-10-15',
          status: 'Partially Paid',
          documentFile: 'INV-NA-026-003-StrukturLt2.pdf',
          payments: [
            {
              id: 'p3',
              date: '2026-10-20',
              claimed: 30000000,
              approved: 30000000,
              status: 'Approved',
              receipt: 'RCPT-026-003A',
              receiptFile: 'Kwitansi-RCPT-026-003A.pdf',
              proof: 'Bukti-transfer-termin3-tahap1.jpg'
            },
            {
              id: 'p4',
              date: '2026-11-02',
              claimed: 20000000,
              approved: 0,
              status: 'Pending',
              receipt: null,
              proof: 'Bukti-transfer-pelunasan-termin3.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        },
        {
          id: 'i4',
          number: 'INV-NA-026-004',
          revision: 0,
          amount: 35000000,
          dueDate: '2026-12-15',
          issueDate: '2026-11-01',
          status: 'Unpaid',
          documentFile: 'INV-NA-026-004-MEPFinishing.pdf',
          payments: [],
          replacedBy: null,
          reason: ''
        }
      ],
      activity: [
        {
          id: 'a1',
          date: '2026-11-02 14:15',
          actor: 'Fajar Ramadhan',
          action: 'Uploaded payment proof',
          detail: 'Invoice INV-NA-026-003 · Claimed Rp 20.000.000 · File: Bukti-transfer-pelunasan-termin3.jpg',
          category: 'upload',
          visibility: 'Published'
        },
        {
          id: 'a2',
          date: '2026-10-30 16:40',
          actor: 'Admin NA Associates',
          action: 'Daily progress published',
          detail: 'Laporan "Pengecoran Balok & Plat Lantai 2" dipublikasikan ke Portal Klien.',
          visibility: 'Published'
        },
        {
          id: 'a3',
          date: '2026-10-21 11:05',
          actor: 'Admin Studio',
          action: 'Approved client payment proof',
          detail: 'Invoice INV-NA-026-003 · Verified Rp 30.000.000 (Termin 3 Tahap 1)',
          category: 'verification',
          visibility: 'Published'
        },
        {
          id: 'a4',
          date: '2026-10-20 09:30',
          actor: 'Fajar Ramadhan',
          action: 'Uploaded payment proof',
          detail: 'Invoice INV-NA-026-003 · Claimed Rp 30.000.000 · File: Bukti-transfer-termin3-tahap1.jpg',
          category: 'upload',
          visibility: 'Published'
        },
        {
          id: 'a5',
          date: '2026-08-23 15:20',
          actor: 'Admin Studio',
          action: 'Approved client payment proof',
          detail: 'Invoice INV-NA-026-002 · Verified Rp 60.000.000 (Lunas Termin 2)',
          category: 'verification',
          visibility: 'Published'
        },
        {
          id: 'a6',
          date: '2026-08-22 10:12',
          actor: 'Fajar Ramadhan',
          action: 'Uploaded payment proof',
          detail: 'Invoice INV-NA-026-002 · Claimed Rp 60.000.000 · File: Transfer-Mandiri-Termin2.jpg',
          category: 'upload',
          visibility: 'Published'
        }
      ]
    },
    {
      id: 'project-02',
      code: 'NA-031',
      name: 'VILLA SENTUL RETREAT',
      location: 'Sentul Selatan, Bogor',
      category: 'Residential',
      landArea: '680 m²',
      buildingArea: '390 m²',
      year: '2026',
      status: 'Active',
      progress: 88,
      clientId: 'client-01',
      cover: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      startDate: '2026-01-15',
      targetDate: '2026-12-20',
      nextMilestone: 'Interior Millwork & Tropical Landscape',
      nextMilestoneDate: '2026-12-20',
      nextPayment: '2026-11-28',
      milestones: [
        { id: 'mv1', title: 'Site Masterplan & Concept', date: '2026-02-20', status: 'Completed', progress: 100 },
        { id: 'mv2', title: 'Retaining Wall & Substructure', date: '2026-05-05', status: 'Completed', progress: 100 },
        { id: 'mv3', title: 'Main Timber & Steel Roof', date: '2026-08-12', status: 'Completed', progress: 100 },
        { id: 'mv4', title: 'Travertine Cladding & Glazing', date: '2026-10-18', status: 'Completed', progress: 100 },
        { id: 'mv5', title: 'Interior Millwork & Tropical Landscape', date: '2026-12-20', status: 'In Progress', progress: 40 }
      ],
      files: [
        { id: 'fv1', name: 'Poolside Pavilion — Dusk Render.jpg', category: 'Rendering', date: '2026-10-24', type: 'JPG', visibility: 'Published', description: 'Visualisasi paviliun kolam renang menghadap perbukitan Sentul.', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85' },
        { id: 'fv2', name: 'DED Custom Teak Millwork & Pantry.pdf', category: 'DED', date: '2026-10-09', type: 'PDF', visibility: 'Published', description: 'Gambar kerja kabinet kayu jati perhutani dan island marmer.' },
        { id: 'fv3', name: 'Landscape Planting & Lighting Plan.pdf', category: 'Floor Plan', date: '2026-09-21', type: 'PDF', visibility: 'Published', description: 'Rencana tata tanaman tropis dan lampu taman low-voltage.' },
        { id: 'fv4', name: '3D Section Perspective — Pavilion Roof.pdf', category: '3D Model', date: '2026-08-30', type: 'PDF', visibility: 'Published', description: 'Potongan 3D detail tritisan atap ulin dan kisi-kisi kayu.' },
        { id: 'fv5', name: 'Master Villa Floor Plan — Final.pdf', category: 'Floor Plan', date: '2026-04-14', type: 'PDF', visibility: 'Published', description: 'Denah final seluruh massa bangunan dan kolam renang infinity.' }
      ],
      reports: [
        {
          id: 'rv1',
          date: '2026-10-29',
          category: 'Finishing',
          title: 'Pemasangan Kisi Kayu Ulin & Kusen Aluminium',
          fieldNote: 'Fasad timur villa selesai terpasang 85%',
          description: 'Pemasangan kisi-kisi kayu ulin oven-dried dan penyetelan kusen sliding kaca double-glazed pada ruang tamu utama.',
          visibility: 'Published',
          photos: 3,
          photoNames: ['kisi-kayu-ulin.jpg', 'kusen-sliding-teras.jpg', 'sealant-kaca.jpg'],
          workers: [
            { id: 'wv1', name: 'Pak Wawan', attendance: 'Hadir', task: 'Pemasangan & finishing minyak kayu ulin' },
            { id: 'wv2', name: 'Pak Agus', attendance: 'Hadir', task: 'Alignment rel kusen aluminium & sealant weatherproof' }
          ],
          tools: 'Laser alignment, Mesin serut kayu, Vacuum glass lifter',
          internalNotes: 'Finishing lapisan kedua teak oil dijadwalkan minggu depan.'
        },
        {
          id: 'rv2',
          date: '2026-10-16',
          category: 'Finishing',
          title: 'Pemasangan Batu Alam Andesit Kolam Renang',
          fieldNote: 'Dinding overflow & deck kolam selesai nat epoxy',
          description: 'Penyelesaian pemasangan batu andesit bakar pada bibir overflow kolam renang serta pengisian nat anti-jamur.',
          visibility: 'Published',
          photos: 2,
          photoNames: ['andesit-overflow.jpg', 'nat-epoxy-kolam.jpg'],
          workers: [
            { id: 'wv3', name: 'Pak Yanto', attendance: 'Hadir', task: 'Pemasangan batu andesit & nat epoxy' }
          ],
          tools: 'Gerinda potong batu basah, Squeegee epoxy, Waterpass',
          internalNotes: 'Uji rendam kebocoran kolam dinyatakan aman 100%.'
        },
        {
          id: 'rv3',
          date: '2026-11-01',
          category: 'Finishing',
          title: 'Pengukuran Presisi Kabinet Master Wardrobe (Draft)',
          fieldNote: 'Persiapan instalasi unit prefabrikasi',
          description: 'Pengecekan kerataan dinding dan titik stopkontak tersembunyi untuk pemasangan lemari built-in kamar tidur utama.',
          visibility: 'Draft',
          photos: 2,
          photoNames: ['ukur-wardrobe.jpg', 'titik-led-strip.jpg'],
          workers: [
            { id: 'wv4', name: 'Pak Wawan', attendance: 'Hadir', task: 'Pengecekan sudut siku dinding & jalur LED strip' }
          ],
          tools: 'Meteran laser, Penggaris siku baja',
          internalNotes: 'Draft menunggu konfirmasi jadwal pengiriman workshop.'
        }
      ],
      shopping: [
        { id: 'sv1', date: '2026-10-10', material: 'Kayu Ulin Kalimantan 4x12 cm', specification: 'Oven dried · Grade ekspos eksterior', quantity: 85, unit: 'batang', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'Sumber Kayu Nusantara', unitCost: 265000 },
        { id: 'sv2', date: '2026-10-22', material: 'Lampu Sorot Taman IP67 Warm 3000K', specification: 'Die-cast aluminium · 9W', quantity: 24, unit: 'unit', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'Lumen Arsitektur', unitCost: 420000 },
        { id: 'sv3', date: '2026-11-06', material: 'Cat Interior Dulux Pentalite Stone', specification: 'Kemasan pail 20 L · Low VOC', quantity: 8, unit: 'pail', status: 'Dalam Proses', visibility: 'Published', supplier: 'Mitra Warna Sentul', unitCost: 1350000 },
        { id: 'sv4', date: '2026-11-12', material: 'Rumput Gajah Mini & Kamboja Bali', specification: 'Paket lanskap area halaman depan', quantity: 140, unit: 'm²', status: 'Belum Dibeli', visibility: 'Published', supplier: 'Kebun Tropis Bogor', unitCost: 65000 }
      ],
      usage: [
        { id: 'uv1', date: '2026-10-29', material: 'Kayu Ulin Kalimantan 4x12 cm', quantity: 72, unit: 'batang', area: 'Fasad kisi timur & deck paviliun', visibility: 'Approved' },
        { id: 'uv2', date: '2026-10-24', material: 'Lampu Sorot Taman IP67 Warm 3000K', quantity: 14, unit: 'unit', area: 'Jalur batu pijakan taman belakang', visibility: 'Approved' }
      ],
      legal: [
        { id: 'lv1', name: 'Kontrak Desain & Build Villa Sentul', version: 'v1.0', date: '2026-01-15', visibility: 'Published' },
        { id: 'lv2', name: 'Addendum Kolam Renang & Lanskap Tropis', version: 'v1.1', date: '2026-06-12', visibility: 'Published' },
        { id: 'lv3', name: 'Berita Acara Pemeriksaan Tahap Fasad', version: 'v1.0', date: '2026-10-20', visibility: 'Published' }
      ],
      invoices: [
        {
          id: 'iv1',
          number: 'INV-VSR-031-001',
          revision: 0,
          amount: 75000000,
          dueDate: '2026-05-15',
          issueDate: '2026-05-01',
          status: 'Paid',
          documentFile: 'INV-VSR-031-001.pdf',
          payments: [
            {
              id: 'pv1',
              date: '2026-05-11',
              claimed: 75000000,
              approved: 75000000,
              status: 'Approved',
              receipt: 'RCPT-VSR-001',
              receiptFile: 'Kwitansi-RCPT-VSR-001.pdf',
              proof: 'Transfer-VSR-Termin1.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        },
        {
          id: 'iv2',
          number: 'INV-VSR-031-002',
          revision: 0,
          amount: 85000000,
          dueDate: '2026-09-20',
          issueDate: '2026-09-05',
          status: 'Paid',
          documentFile: 'INV-VSR-031-002.pdf',
          payments: [
            {
              id: 'pv2',
              date: '2026-09-18',
              claimed: 85000000,
              approved: 85000000,
              status: 'Approved',
              receipt: 'RCPT-VSR-002',
              receiptFile: 'Kwitansi-RCPT-VSR-002.pdf',
              proof: 'Transfer-VSR-Termin2.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        },
        {
          id: 'iv3',
          number: 'INV-VSR-031-003',
          revision: 0,
          amount: 40000000,
          dueDate: '2026-11-28',
          issueDate: '2026-10-28',
          status: 'Unpaid',
          documentFile: 'INV-VSR-031-003.pdf',
          payments: [],
          replacedBy: null,
          reason: ''
        }
      ],
      activity: [
        {
          id: 'av1',
          date: '2026-09-19 10:15',
          actor: 'Admin Studio',
          action: 'Approved client payment proof',
          detail: 'Invoice INV-VSR-031-002 · Verified Rp 85.000.000 (Termin Fasad & Atap)',
          category: 'verification',
          visibility: 'Published'
        },
        {
          id: 'av2',
          date: '2026-09-18 13:45',
          actor: 'Fajar Ramadhan',
          action: 'Uploaded payment proof',
          detail: 'Invoice INV-VSR-031-002 · Claimed Rp 85.000.000 · File: Transfer-VSR-Termin2.jpg',
          category: 'upload',
          visibility: 'Published'
        },
        {
          id: 'av3',
          date: '2026-05-11 09:20',
          actor: 'Fajar Ramadhan',
          action: 'Uploaded payment proof',
          detail: 'Invoice INV-VSR-031-001 · Claimed Rp 75.000.000 · File: Transfer-VSR-Termin1.jpg',
          category: 'upload',
          visibility: 'Published'
        }
      ]
    },
    {
      id: 'project-03',
      code: 'NA-034',
      name: 'KAVLING KEMANG STUDIO',
      location: 'Kemang Timur, Jakarta Selatan',
      category: 'Commercial',
      landArea: '460 m²',
      buildingArea: '620 m²',
      year: '2026',
      status: 'On Hold',
      holdReason: 'Pembayaran termin INV-KKM-002 telah melewati jatuh tempo H+7.',
      progress: 45,
      clientId: 'client-02',
      cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
      startDate: '2026-04-12',
      targetDate: '2027-05-30',
      nextMilestone: 'Pelunasan Termin Overdue & Rangka Baja',
      nextMilestoneDate: '2026-10-15',
      nextPayment: '2026-10-10',
      milestones: [
        { id: 'mk1', title: 'Perizinan PBG & Zonasi Komersial', date: '2026-05-18', status: 'Completed', progress: 100 },
        { id: 'mk2', title: 'Struktur Baja WF & Lantai Mezzanine', date: '2026-10-15', status: 'In Progress', progress: 80 },
        { id: 'mk3', title: 'Curtain Wall & Akustik Studio', date: '2027-01-25', status: 'Upcoming', progress: 0 },
        { id: 'mk4', title: 'Handover Komersial', date: '2027-05-30', status: 'Upcoming', progress: 0 }
      ],
      files: [
        { id: 'fk1', name: 'Commercial Facade — Kemang Studio Render.jpg', category: 'Rendering', date: '2026-09-14', type: 'JPG', visibility: 'Published', description: 'Visualisasi fasad studio dengan panel aluminium perforated.', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85' },
        { id: 'fk2', name: 'DED Struktur Baja WF & Sambungan Baut.pdf', category: 'DED', date: '2026-08-20', type: 'PDF', visibility: 'Published', description: 'Detail sambungan end-plate kolom WF 250 dan balok mezzanine.' },
        { id: 'fk3', name: 'Floor Plan Studio & Meeting Gallery.pdf', category: 'Floor Plan', date: '2026-06-10', type: 'PDF', visibility: 'Published', description: 'Denah lantai kerja kolaboratif, ruang meeting, dan galeri material.' },
        { id: 'fk4', name: '3D BIM Mezzanine & Skylight Atrium.pdf', category: '3D Model', date: '2026-07-02', type: 'PDF', visibility: 'Published', description: 'Model 3D bukaan skylight tengah dan tangga baja ekspose.' }
      ],
      reports: [
        {
          id: 'rk1',
          date: '2026-10-10',
          category: 'Struktur',
          title: 'Ereksi Kolom & Balok Baja WF Mezzanine',
          fieldNote: 'Pemasangan WF 250 zona A–C terpasang 80%',
          description: 'Ereksi rangka baja profil WF pada zona studio utama menggunakan mobile crane dan pengencangan baut HTB dengan kunci torsi terkalibrasi.',
          visibility: 'Published',
          photos: 3,
          photoNames: ['ereksi-kolom-wf.jpg', 'sambungan-baut-htb.jpg', 'balok-mezzanine.jpg'],
          workers: [
            { id: 'wk1', name: 'Pak Darsono', attendance: 'Hadir', task: 'Operator mobile crane & rigging rangka baja' },
            { id: 'wk2', name: 'Pak Hendri', attendance: 'Hadir', task: 'Pengencangan baut HTB & pengecekan torsi' }
          ],
          tools: 'Mobile crane 25 ton, Torque wrench, Mesin las inverter',
          internalNotes: 'Pekerjaan dijeda sementara hingga termin INV-KKM-002 diselesaikan.'
        },
        {
          id: 'rk2',
          date: '2026-09-24',
          category: 'Pondasi',
          title: 'Pengecoran Pile Cap & Angkur Baut Kolom Baja',
          fieldNote: 'Seluruh baseplate terpasang presisi',
          description: 'Pengecoran pile cap 8 titik utama lengkap dengan angkur L-bolt Ø22 dan grouting mortar non-shrink.',
          visibility: 'Published',
          photos: 2,
          photoNames: ['angkur-baseplate.jpg', 'pilecap-cor.jpg'],
          workers: [
            { id: 'wk3', name: 'Pak Darsono', attendance: 'Hadir', task: 'Setting template angkur & pengecoran pile cap' }
          ],
          tools: 'Theodolite optik, Concrete vibrator, Grout mixer',
          internalNotes: 'Deviasi titik as < 2 mm.'
        },
        {
          id: 'rk3',
          date: '2026-10-12',
          category: 'Struktur',
          title: 'Inspeksi Lasan & Proteksi Cat Anti-Karat Zinc Chromate (Draft)',
          fieldNote: 'Arsip teknis sebelum jeda On Hold',
          description: 'Pengecekan sambungan las penetrasi penuh serta pelapisan primer anti-karat sebelum penghentian sementara.',
          visibility: 'Draft',
          photos: 2,
          photoNames: ['cat-zinc-chromate.jpg', 'cek-las-wf.jpg'],
          workers: [
            { id: 'wk4', name: 'Pak Hendri', attendance: 'Hadir', task: 'Aplikasi cat primer & inspeksi visual las' }
          ],
          tools: 'Airless spray gun, Weld gauge',
          internalNotes: 'Draft disimpan internal selama masa On Hold.'
        }
      ],
      shopping: [
        { id: 'sk1', date: '2026-09-05', material: 'Baja Profil WF 250x125x6x9', specification: 'Gunung Garuda · Panjang 12 m', quantity: 24, unit: 'batang', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'PT Baja Nusantara', unitCost: 3950000 },
        { id: 'sk2', date: '2026-09-18', material: 'Floor Deck Bondek 0.75 mm', specification: 'Galvanis lebar efektif 1 m', quantity: 220, unit: 'm²', status: 'Sudah Dibeli', visibility: 'Published', supplier: 'Sentra Steel Jakarta', unitCost: 155000 },
        { id: 'sk3', date: '2026-10-25', material: 'Cat Epoxy Primer Zinc Chromate', specification: 'Kemasan 20 L · Abu-abu', quantity: 6, unit: 'pail', status: 'Dalam Proses', visibility: 'Published', supplier: 'Propan Raya', unitCost: 1480000 },
        { id: 'sk4', date: '2026-11-10', material: 'Panel Kaca Tempered Curtain Wall 12mm', specification: 'Low-E Solar Control', quantity: 95, unit: 'm²', status: 'Belum Dibeli', visibility: 'Published', supplier: 'Asahimas Glass Partner', unitCost: 1250000 }
      ],
      usage: [
        { id: 'uk1', date: '2026-10-10', material: 'Baja Profil WF 250x125x6x9', quantity: 19, unit: 'batang', area: 'Kolom & balok mezzanine zona A–C', visibility: 'Approved' }
      ],
      legal: [
        { id: 'lk1', name: 'Kontrak Konstruksi Studio Komersial Kemang', version: 'v1.0', date: '2026-04-12', visibility: 'Published' },
        { id: 'lk2', name: 'SPK Struktur Baja & Mezzanine', version: 'v1.0', date: '2026-08-05', visibility: 'Published' }
      ],
      invoices: [
        {
          id: 'ik1',
          number: 'INV-KKM-001',
          revision: 0,
          amount: 55000000,
          dueDate: '2026-06-10',
          issueDate: '2026-05-25',
          status: 'Paid',
          documentFile: 'INV-KKM-001.pdf',
          payments: [
            {
              id: 'pk1',
              date: '2026-06-08',
              claimed: 55000000,
              approved: 55000000,
              status: 'Approved',
              receipt: 'RCPT-KKM-001',
              receiptFile: 'Kwitansi-RCPT-KKM-001.pdf',
              proof: 'Transfer-KKM-Termin1.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        },
        {
          id: 'ik2',
          number: 'INV-KKM-002',
          revision: 0,
          amount: 45000000,
          dueDate: '2026-10-01',
          issueDate: '2026-09-15',
          status: 'Unpaid',
          documentFile: 'INV-KKM-002.pdf',
          payments: [],
          replacedBy: null,
          reason: 'Overdue H+7 auto-hold'
        }
      ],
      activity: [
        {
          id: 'ak1',
          date: '2026-10-09 11:00',
          actor: 'Admin NA Associates',
          action: 'Project placed on hold',
          detail: 'H+7 payment overdue recommendation confirmed by Admin untuk INV-KKM-002.',
          visibility: 'Published'
        },
        {
          id: 'ak2',
          date: '2026-06-09 14:20',
          actor: 'Admin Studio',
          action: 'Approved client payment proof',
          detail: 'Invoice INV-KKM-001 · Verified Rp 55.000.000 (Termin 1)',
          category: 'verification',
          visibility: 'Published'
        },
        {
          id: 'ak3',
          date: '2026-06-08 11:15',
          actor: 'Nadia Kusuma',
          action: 'Uploaded payment proof',
          detail: 'Invoice INV-KKM-001 · Claimed Rp 55.000.000 · File: Transfer-KKM-Termin1.jpg',
          category: 'upload',
          visibility: 'Published'
        }
      ]
    },
    {
      id: 'project-04',
      code: 'NA-019',
      name: 'BINTARO COURTYARD VILLA',
      location: 'Bintaro, Tangerang Selatan',
      category: 'Residential',
      landArea: '520 m²',
      buildingArea: '380 m²',
      year: '2025',
      status: 'Completed',
      progress: 100,
      clientId: 'client-03',
      cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      startDate: '2025-01-15',
      targetDate: '2025-12-15',
      nextMilestone: 'DONE',
      nextMilestoneDate: '2025-12-15',
      nextPayment: null,
      milestones: [
        { id: 'mb1', title: 'Design & Planning', date: '2025-03-01', status: 'Completed', progress: 100 },
        { id: 'mb2', title: 'Structure & MEP', date: '2025-08-10', status: 'Completed', progress: 100 },
        { id: 'mb3', title: 'Interior & Landscape Handover', date: '2025-12-15', status: 'Completed', progress: 100 }
      ],
      files: [
        { id: 'fb1', name: 'Showcase Brochure — Bintaro Villa.pdf', category: 'Presentation', date: '2025-12-20', type: 'PDF', visibility: 'Published', description: 'Dokumentasi lengkap showcase arsitektur.' },
        { id: 'fb2', name: 'Courtyard — Final Photography.jpg', category: 'Rendering', date: '2025-12-18', type: 'JPG', visibility: 'Published', description: 'Foto akhir courtyard.', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85' }
      ],
      reports: [
        {
          id: 'rb1',
          date: '2025-12-14',
          category: 'Finishing',
          title: 'Selesai pembersihan & handover',
          description: 'Inspeksi akhir dan penyerahan kunci kepada klien.',
          visibility: 'Published',
          photos: 2,
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
        {
          id: 'ib1',
          number: 'INV-BIN-001',
          revision: 0,
          amount: 25000000,
          dueDate: '2025-12-01',
          issueDate: '2025-11-15',
          status: 'Paid',
          documentFile: 'INV-BIN-001.pdf',
          payments: [
            {
              id: 'pb1',
              date: '2025-11-28',
              claimed: 25000000,
              approved: 25000000,
              status: 'Approved',
              receipt: 'RCPT-BIN-001',
              receiptFile: 'Kwitansi-RCPT-BIN-001.pdf',
              proof: 'Bukti-lunas.jpg'
            }
          ],
          replacedBy: null,
          reason: ''
        }
      ],
      activity: [
        { id: 'actb1', date: '2025-12-15 14:00', actor: 'Admin NA Associates', action: 'Project completed', detail: 'Bintaro Courtyard Villa selesai dan diserahterimakan.', visibility: 'Published' }
      ]
    }
  ],
  notifications: [
    {
      id: 'n1',
      projectId: 'project-01',
      title: 'Bukti pembayaran diterima',
      body: 'Bukti transfer Rp20.000.000 untuk INV-NA-026-003 (FR HOUSE) sedang menunggu verifikasi Admin.',
      visibility: 'Published',
      date: '2026-11-02',
      read: false
    },
    {
      id: 'n2',
      projectId: 'project-01',
      title: 'Progress proyek diperbarui',
      body: 'Laporan "Pengecoran Balok & Plat Lantai 2" untuk FR HOUSE telah dipublikasikan ke Portal Klien.',
      visibility: 'Published',
      date: '2026-10-30',
      read: false
    },
    {
      id: 'n3',
      projectId: 'project-01',
      title: 'Output & Desain Dipublikasikan',
      body: 'Render "Facade Exterior — Night Lighting Render.jpg" kini tersedia di modul Output & Design.',
      visibility: 'Published',
      date: '2026-10-29',
      read: true
    },
    {
      id: 'n4',
      projectId: 'project-02',
      title: 'Progress proyek diperbarui',
      body: 'Laporan "Pemasangan Kisi Kayu Ulin & Kusen Aluminium" untuk VILLA SENTUL RETREAT telah dipublikasikan.',
      visibility: 'Published',
      date: '2026-10-29',
      read: false
    },
    {
      id: 'n5',
      projectId: 'project-02',
      title: 'Pembayaran Disetujui',
      body: 'Pembayaran Rp85.000.000 untuk INV-VSR-031-002 (VILLA SENTUL RETREAT) telah disetujui dan kwitansi diterbitkan.',
      visibility: 'Published',
      date: '2026-09-19',
      read: true
    },
    {
      id: 'n6',
      projectId: 'project-03',
      title: 'Pemberitahuan Status On Hold',
      body: 'KAVLING KEMANG STUDIO ditahan sementara karena termin INV-KKM-002 melewati batas H+7.',
      visibility: 'Published',
      date: '2026-10-09',
      read: false
    }
  ]
};
