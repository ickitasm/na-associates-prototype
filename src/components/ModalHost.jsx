import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bell, Building2, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Clock3, CreditCard,
  Download, ExternalLink, FileCheck2, FileImage, FileText, FolderOpen, HardHat,
  Home, Image, LayoutDashboard, MapPin, Menu, MoreHorizontal, Package, Plus,
  RotateCcw, Search, Settings, ShieldCheck, ShoppingBag, Upload, User, UserPlus,
  Users, Wallet, X, Eye, Activity, AlertCircle, Trash2, Camera, Wrench
} from 'lucide-react';
import { StatusTag, EmptyState, GoogleIcon, ProgressBar } from './ui';
import { money, dateFmt, nowLabel, uid } from '../lib/utils';

function LoginModalView({ db, setDb, close, notify, changeRole, enterClient, enterAdmin }) {
  const [mode, setMode] = useState('client');
  const [username, setUsername] = useState('aditya');
  const [adminEmail, setAdminEmail] = useState('owner@example.com');
  const [error, setError] = useState('');

  const handleClientLogin = (e) => {
    e.preventDefault();
    setError('');
    const cleanUser = username.trim().toLowerCase();
    const found = (db.clients || []).find(c => (c.username || '').toLowerCase() === cleanUser || c.name.toLowerCase().includes(cleanUser));
    if (!found) {
      setError('Username klien tidak ditemukan. Pastikan akun klien telah dibuat oleh admin.');
      return;
    }
    setDb(old => ({ ...old, currentClientId: found.id }));
    changeRole('client');
    close();
    enterClient();
    notify(`Masuk sebagai Client: ${found.name} (${found.username || cleanUser})`);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = adminEmail.trim().toLowerCase();
    const whitelisted = (db.allowedAdminEmails || ['owner@example.com', 'admin@na-associates.id', 'mike777rafael@gmail.com']).map(e => e.toLowerCase());
    if (!whitelisted.includes(cleanEmail)) {
      setError('Email Google ini belum didaftarkan sebagai Admin. Hubungi Primary Admin untuk mendaftarkan email Anda di Settings.');
      return;
    }
    changeRole('admin');
    close();
    enterAdmin();
    notify(`Masuk sebagai Admin: ${cleanEmail}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '6px' }}>
      <div className="login-tab-switcher" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: '#f0f1eb', padding: '4px', borderRadius: '4px' }}>
        <button
          type="button"
          className={`btn btn-small ${mode === 'client' ? 'btn-dark' : 'btn-outline'}`}
          onClick={() => { setMode('client'); setError(''); }}
        >
          Client (Username)
        </button>
        <button
          type="button"
          className={`btn btn-small ${mode === 'admin' ? 'btn-dark' : 'btn-outline'}`}
          onClick={() => { setMode('admin'); setError(''); }}
        >
          Admin (Google Whitelist)
        </button>
      </div>

      {mode === 'client' ? (
        <form onSubmit={handleClientLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="field">
            <span>Username Klien (Dibuat oleh Admin) <b>*</b></span>
            <input
              type="text"
              placeholder="e.g. aditya"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="modal-footnote">
            Klien masuk menggunakan username yang didaftarkan oleh admin studio (tanpa password/Google).
          </div>
          {error && <div className="form-error"><AlertCircle size={15}/>{error}</div>}
          <div className="modal-actions" style={{ justifyContent: 'space-between', paddingTop: '6px' }}>
            <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
            <button type="submit" className="btn btn-dark">Masuk ke Portal Klien <ArrowRight size={15}/></button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="field">
            <span>Email Google Terdaftar <b>*</b></span>
            <input
              type="email"
              placeholder="e.g. owner@example.com"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-google-login" style={{ marginTop: '4px' }}>
            <GoogleIcon size={19} />
            <span>Login with Google (Verify Whitelist)</span>
          </button>
          <div className="modal-footnote">
            Database memverifikasi email Anda terhadap daftar whitelisted admin di panel Settings.
          </div>
          {error && <div className="form-error"><AlertCircle size={15}/>{error}</div>}
          <div className="modal-actions" style={{ justifyContent: 'flex-end', paddingTop: '6px' }}>
            <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

function NewReportModalView({ project, close, updateProject, addActivity, finish }) {
  const [date, setDate] = useState('2026-11-02');
  const [category, setCategory] = useState('Struktur');
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(String(project.progress || 62));
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Published');
  const [tools, setTools] = useState('Molen beton 1 unit, Vibrator cor, Scaffolding 16 set, Bar bender');
  const [internalNotes, setInternalNotes] = useState('');
  const [photosCount, setPhotosCount] = useState(3);
  const [photoNames, setPhotoNames] = useState(['balok-lantai2-01.jpg', 'tulangan-cor-02.jpg', 'bekisting-03.jpg']);
  const [error, setError] = useState('');

  const [workers, setWorkers] = useState([
    { id: 'w1', name: 'Pak Joko', attendance: 'Hadir', task: 'Pembesian & perakitan tulangan balok' },
    { id: 'w2', name: 'Pak Slamet', attendance: 'Hadir', task: 'Pemasangan bekisting kayu & perancah cor' },
    { id: 'w3', name: 'Pak Asep', attendance: 'Hadir', task: 'Pengecoran & operator mesin molen' },
    { id: 'w4', name: 'Pak Budi', attendance: 'Hadir', task: 'Penyusunan semen & angkut material pasir' }
  ]);

  const addWorker = () => {
    const nextNum = workers.length + 1;
    setWorkers(prev => [
      ...prev,
      { id: uid('worker'), name: `Pekerja #${nextNum}`, attendance: 'Hadir', task: 'Pekerjaan struktur / finishing lapangan' }
    ]);
  };

  const updateWorker = (id, field, value) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const removeWorker = (id) => {
    if (workers.length <= 1) {
      setError('Minimal harus ada 1 data tenaga kerja lapangan.');
      return;
    }
    setError('');
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotosCount(files.length);
      setPhotoNames(files.map(f => f.name));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Judul pembaruan proyek wajib diisi.');
      return;
    }
    if (!description.trim()) {
      setError('Deskripsi pekerjaan lapangan wajib diisi.');
      return;
    }

    const reportProg = Math.min(100, Math.max(0, Number(progress) || project.progress));
    const is100 = reportProg >= 100;

    const newReport = {
      id: uid('report'),
      date: date || '2026-11-02',
      category: category || 'Struktur',
      title: title.trim(),
      description: description.trim(),
      progress: reportProg,
      visibility,
      photos: photosCount || 1,
      photoNames: photoNames.length > 0 ? photoNames : ['dokumentasi-lapangan.jpg'],
      workers: workers.filter(w => w.name.trim()),
      tools: tools.trim(),
      internalNotes: internalNotes.trim()
    };

    updateProject(project.id, p => {
      const targetProg = Math.max(p.progress, reportProg);
      const updatedMilestones = (p.milestones || []).map(m => {
        if (is100) return { ...m, status: 'Completed', progress: 100 };
        if (m.status === 'In Progress') return { ...m, progress: targetProg };
        return m;
      });

      return {
        ...p,
        reports: [newReport, ...(p.reports || [])],
        progress: targetProg,
        status: is100 ? 'Completed' : p.status,
        nextMilestone: is100 ? 'Handover selesai' : p.nextMilestone,
        milestones: updatedMilestones
      };
    });

    addActivity(
      project.id,
      'Daily log created',
      `${newReport.title} disimpan sebagai ${newReport.visibility}. Tercatat ${newReport.workers.length} pekerja lapangan.${reportProg >= 100 ? ' Proyek & seluruh milestone diselesaikan (100%).' : ''}`
    );

    finish(`Daily project log berhasil disimpan (${newReport.visibility}).`);
  };

  const hadirCount = workers.filter(w => w.attendance === 'Hadir').length;
  const tidakHadirCount = workers.length - hadirCount;

  return (
    <form onSubmit={handleSubmit} className="new-report-form">
      {/* BAGIAN 1: Konteks Pembaruan Harian */}
      <div className="report-form-section">
        <div className="section-title-bar">
          <span className="section-badge">1</span>
          <div>
            <h4>Konteks Pembaruan Harian & Progres Fisik</h4>
            <p>Informasi utama aktivitas pengerjaan fisik di lokasi proyek yang disajikan kepada klien jika dipublikasikan.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Tanggal Laporan *</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </label>
          <label className="field">
            <span>Kategori Pekerjaan</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Struktur">Struktur (Pembesian / Cor / Balok)</option>
              <option value="Masonry">Masonry (Bata Ringan / Plester / Aci)</option>
              <option value="Finishing">Finishing & Pengecatan</option>
              <option value="MEP">MEP (Plumbing & Kelistrikan)</option>
              <option value="Pondasi">Pondasi & Galian Tanah</option>
              <option value="General">General / Persiapan Lapangan</option>
            </select>
          </label>
          <label className="field">
            <span>Judul Pembaruan *</span>
            <input
              type="text"
              placeholder="e.g. Pekerjaan balok lantai dua & persiapan cor"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Progres Proyek Lapangan (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>Deskripsi Pekerjaan Fisik Lapangan *</span>
          <textarea
            rows="3"
            placeholder="Jelaskan secara ringkas dan runtut cakupan pekerjaan fisik yang diselesaikan hari ini..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Visibilitas Publikasi</span>
          <select value={visibility} onChange={e => setVisibility(e.target.value)}>
            <option value="Published">Published — Tampilkan di Portal Klien (Client Viewable)</option>
            <option value="Draft">Draft — Hanya Simpan Internal Studio (Admin Only)</option>
          </select>
        </label>
      </div>

      {/* BAGIAN 2: Tenaga Kerja Lapangan (Tukang / Kuli) */}
      <div className="report-form-section">
        <div className="section-title-bar">
          <span className="section-badge">2</span>
          <div>
            <h4>Daftar Tenaga Kerja Lapangan (Tukang & Kuli)</h4>
            <p>Pembaruan presensi nama pekerja lapangan, status kehadiran, dan jenis pekerjaan dalam format spreadsheet terpadu.</p>
          </div>
        </div>

        <div className="excel-table-container">
          <div className="excel-table-header">
            <div className="excel-col-num">#</div>
            <div className="excel-col-name">Nama Pekerja / Kuli</div>
            <div className="excel-col-status">Status Kehadiran</div>
            <div className="excel-col-task">Jenis Pekerjaan / Tugas Lapangan</div>
            <div className="excel-col-action">Aksi</div>
          </div>
          <div className="excel-table-body">
            {workers.map((w, idx) => (
              <div className="excel-table-row" key={w.id || idx}>
                <div className="excel-cell excel-cell-num">{idx + 1}</div>
                <div className="excel-cell excel-cell-name">
                  <input
                    type="text"
                    className="excel-input"
                    placeholder="Nama pekerja / tukang..."
                    value={w.name}
                    onChange={e => updateWorker(w.id, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="excel-cell excel-cell-status">
                  <select
                    className={`excel-select ${w.attendance === 'Hadir' ? 'status-hadir' : w.attendance === 'Alpa' ? 'status-alpa' : 'status-izin'}`}
                    value={w.attendance}
                    onChange={e => updateWorker(w.id, 'attendance', e.target.value)}
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpa">Alpa</option>
                  </select>
                </div>
                <div className="excel-cell excel-cell-task">
                  <input
                    type="text"
                    className="excel-input"
                    placeholder="Tugas pengerjaan fisik..."
                    value={w.task}
                    onChange={e => updateWorker(w.id, 'task', e.target.value)}
                  />
                </div>
                <div className="excel-cell excel-cell-action">
                  <button
                    type="button"
                    className="excel-btn-delete"
                    title="Hapus baris"
                    onClick={() => removeWorker(w.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="excel-table-footer">
            <button type="button" className="btn btn-small btn-outline btn-add-row" onClick={addWorker}>
              <Plus size={14} /> Tambah Pekerja / Kuli
            </button>
            <div className="excel-summary-pills">
              <span className="summary-pill total">Total: {workers.length} Pekerja</span>
              <span className="summary-pill hadir">{hadirCount} Hadir</span>
              {tidakHadirCount > 0 && <span className="summary-pill non-hadir">{tidakHadirCount} Izin / Sakit</span>}
            </div>
          </div>
        </div>

        <div className="client-impact-notice">
          <ShieldCheck size={18} />
          <div>
            <strong>Pertimbangan Dampak Klien:</strong>
            <p>
              Data absensi nama personal kuli dan status sakit/izin disimpan sebagai arsip operasional internal studio (Admin Only).
              Di portal klien, data ini dirangkum menjadi total personil aktif dan bidang keahlian agar tampilan tetap profesional, rapi, dan tidak memicu kekhawatiran mikro klien.
            </p>
          </div>
        </div>
      </div>

      {/* BAGIAN 3: Alat / Perlengkapan, Catatan Tambahan & Foto */}
      <div className="report-form-section">
        <div className="section-title-bar">
          <span className="section-badge">3</span>
          <div>
            <h4>Alat / Perlengkapan, Catatan Tambahan & Foto Lapangan</h4>
            <p>Logistik alat operasional, catatan pengawas lapangan, serta lampiran dokumentasi foto fisik.</p>
          </div>
        </div>

        <label className="field">
          <span>Alat / Perlengkapan yang Digunakan</span>
          <input
            type="text"
            placeholder="e.g. Molen beton 1 unit, Vibrator cor, Scaffolding 16 set, Bar bender"
            value={tools}
            onChange={e => setTools(e.target.value)}
          />
        </label>

        <label className="field">
          <span>
            Catatan Tambahan / Internal Mandor{' '}
            <small style={{ fontWeight: 400, color: '#889083' }}>(Admin Only — Tidak Ditampilkan ke Klien)</small>
          </span>
          <textarea
            rows="2"
            placeholder="Catatan pengawas lapangan: kendala cuaca, kedatangan armada material cor, keselamatan kerja K3..."
            value={internalNotes}
            onChange={e => setInternalNotes(e.target.value)}
          />
        </label>

        <label className="upload-box">
          <Upload size={18} />
          <span>
            <strong>Upload Foto Dokumentasi Lapangan</strong>
            <small>
              {photoNames.length > 0
                ? `${photoNames.length} foto terpilih (${photoNames.slice(0, 3).join(', ')}${photoNames.length > 3 ? '...' : ''})`
                : 'Pilih file JPG, PNG dari kamera atau galeri'}
            </small>
          </span>
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
        </label>
      </div>

      {error && (
        <div className="form-error">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={close}>
          Cancel
        </button>
        <button className="btn btn-dark" type="submit">
          Simpan Daily Log <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}

function EditReportModalView({ report, project, close, updateProject, addActivity, finish }) {
  const [date, setDate] = useState(report.date || '2026-11-02');
  const [category, setCategory] = useState(report.category || 'Struktur');
  const [title, setTitle] = useState(report.title || '');
  const [progress, setProgress] = useState(String(report.progress || 0));
  const [description, setDescription] = useState(report.description || '');
  const [tools, setTools] = useState(report.tools || '');
  const [internalNotes, setInternalNotes] = useState(report.internalNotes || '');
  const [workers, setWorkers] = useState(report.workers || []);
  const [error, setError] = useState('');

  const addWorker = () => {
    setWorkers(prev => [...prev, { id: uid('worker'), name: `Pekerja #${prev.length + 1}`, attendance: 'Hadir', task: 'Pekerjaan struktur' }]);
  };
  const updateWorker = (id, field, val) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, [field]: val } : w));
  };
  const removeWorker = (id) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul pembaruan wajib diisi.');
      return;
    }
    const prog = Math.min(100, Math.max(0, Number(progress) || report.progress));
    updateProject(project.id, p => ({
      ...p,
      reports: (p.reports || []).map(r => r.id === report.id ? {
        ...r,
        date,
        category,
        title: title.trim(),
        description: description.trim(),
        progress: prog,
        tools: tools.trim(),
        internalNotes: internalNotes.trim(),
        workers
      } : r)
    }));
    addActivity(project.id, 'Daily log edited', `Draft daily log "${title.trim()}" diperbarui.`);
    finish('Daily log draft berhasil diperbarui.');
  };

  return (
    <form onSubmit={handleSubmit} className="new-report-form">
      <div className="report-form-section">
        <div className="form-grid">
          <label className="field"><span>Tanggal Laporan *</span><input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
          <label className="field"><span>Kategori</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="Struktur">Struktur</option><option value="Masonry">Masonry</option><option value="Finishing">Finishing</option><option value="MEP">MEP</option><option value="Pondasi">Pondasi</option><option value="General">General</option></select></label>
          <label className="field"><span>Judul Pembaruan *</span><input type="text" value={title} onChange={e => setTitle(e.target.value)} required /></label>
          <label className="field"><span>Progres (%)</span><input type="number" min="0" max="100" value={progress} onChange={e => setProgress(e.target.value)} /></label>
        </div>
        <label className="field"><span>Deskripsi Pekerjaan *</span><textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} required /></label>
      </div>
      <div className="report-form-section">
        <h4>Tenaga Kerja Lapangan</h4>
        <div className="excel-table-container">
          <div className="excel-table-header">
            <div className="excel-col-num">#</div>
            <div className="excel-col-name">Nama Pekerja</div>
            <div className="excel-col-status">Kehadiran</div>
            <div className="excel-col-task">Tugas</div>
            <div className="excel-col-action">Aksi</div>
          </div>
          <div className="excel-table-body">
            {workers.map((w, idx) => (
              <div className="excel-table-row" key={w.id || idx}>
                <div className="excel-cell excel-cell-num">{idx + 1}</div>
                <div className="excel-cell excel-cell-name"><input type="text" className="excel-input" value={w.name} onChange={e => updateWorker(w.id, 'name', e.target.value)} required /></div>
                <div className="excel-cell excel-cell-status">
                  <select className={`excel-select ${w.attendance === 'Hadir' ? 'status-hadir' : 'status-izin'}`} value={w.attendance} onChange={e => updateWorker(w.id, 'attendance', e.target.value)}>
                    <option value="Hadir">Hadir</option><option value="Izin">Izin</option><option value="Sakit">Sakit</option><option value="Alpa">Alpa</option>
                  </select>
                </div>
                <div className="excel-cell excel-cell-task"><input type="text" className="excel-input" value={w.task} onChange={e => updateWorker(w.id, 'task', e.target.value)} /></div>
                <div className="excel-cell excel-cell-action"><button type="button" className="excel-btn-delete" onClick={() => removeWorker(w.id)}><Trash2 size={14}/></button></div>
              </div>
            ))}
          </div>
          <div className="excel-table-footer">
            <button type="button" className="btn btn-small btn-outline" onClick={addWorker}><Plus size={14}/> Tambah Pekerja</button>
          </div>
        </div>
      </div>
      <div className="report-form-section">
        <label className="field"><span>Alat / Perlengkapan</span><input type="text" value={tools} onChange={e => setTools(e.target.value)} /></label>
        <label className="field"><span>Catatan Internal</span><textarea rows="2" value={internalNotes} onChange={e => setInternalNotes(e.target.value)} /></label>
      </div>
      {error && <div className="form-error"><AlertCircle size={15}/>{error}</div>}
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
        <button className="btn btn-dark" type="submit">Simpan Perubahan <ArrowRight size={15}/></button>
      </div>
    </form>
  );
}

function ReportDetailModalView({ report, project, isClient, close, updateProject, addActivity, notify }) {
  const workers = report.workers || [];
  const hadirCount = workers.filter(w => w.attendance === 'Hadir').length;
  const photoNames = report.photoNames || [];

  const toggleVisibility = () => {
    const nextVis = report.visibility === 'Published' ? 'Draft' : 'Published';
    updateProject(project.id, p => ({
      ...p,
      reports: (p.reports || []).map(r => r.id === report.id ? { ...r, visibility: nextVis } : r)
    }));
    addActivity(project.id, 'Report visibility changed', `${report.title} diubah menjadi ${nextVis}.`);
    notify(`Visibilitas laporan diubah menjadi ${nextVis}.`);
    close();
  };

  return (
    <div className="report-detail-modal">
      <div className="report-detail-top">
        <div className="report-detail-meta">
          <span className="report-detail-date">{dateFmt(report.date)}</span>
          <span className="report-detail-category">{report.category}</span>
          <StatusTag value={report.visibility} />
        </div>
        <h3>{report.title}</h3>
        <p className="report-detail-desc">{report.description}</p>
        <div className="report-detail-prog">
          <span>Progres Proyek Tercatat</span>
          <strong>{report.progress}%</strong>
        </div>
      </div>

      {/* Foto Dokumentasi Lapangan */}
      <div className="report-detail-block">
        <div className="report-detail-block-head">
          <Camera size={16} />
          <strong>Dokumentasi Foto Lapangan ({report.photos || photoNames.length || 1} Foto)</strong>
        </div>
        <div className="report-photos-grid">
          {(photoNames.length > 0 ? photoNames : ['Foto-lapangan-1.jpg', 'Foto-lapangan-2.jpg']).map((name, idx) => (
            <div className="report-photo-card" key={idx}>
              <div className="photo-placeholder-art">
                <FileImage size={24} />
                <span>DOKUMENTASI #{idx + 1}</span>
              </div>
              <small>{name}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Tenaga Kerja Lapangan */}
      {isClient ? (
        // TAMPILAN CLIENT (Rapi, aman, profesional, tanpa absensi personal kuli)
        <div className="report-detail-block">
          <div className="report-detail-block-head">
            <Users size={16} />
            <strong>Alokasi Tenaga Kerja & Perlengkapan Lapangan</strong>
          </div>
          <div className="client-workforce-summary">
            <div className="client-workforce-stat">
              <span>Personil Lapangan Bertugas</span>
              <strong>{hadirCount > 0 ? `${hadirCount} Personil Aktif` : `${workers.length} Pekerja`}</strong>
            </div>
            <div className="client-workforce-stat">
              <span>Bidang Pengerjaan Utama</span>
              <p>{workers.map(w => w.task).filter(Boolean).slice(0, 3).join(' · ') || 'Pekerjaan konstruksi & struktur'}</p>
            </div>
          </div>
          {report.tools && (
            <div className="client-tools-info">
              <Wrench size={15} />
              <span><strong>Peralatan Operasional di Lokasi:</strong> {report.tools}</span>
            </div>
          )}
        </div>
      ) : (
        // TAMPILAN ADMIN (Full Excel Table, Tools & Internal Notes)
        <>
          <div className="report-detail-block">
            <div className="report-detail-block-head">
              <Users size={16} />
              <strong>Presensi Tenaga Kerja Lapangan ({workers.length} Pekerja)</strong>
            </div>
            {workers.length > 0 ? (
              <div className="excel-table-container read-only">
                <div className="excel-table-header">
                  <div className="excel-col-num">#</div>
                  <div className="excel-col-name">Nama Pekerja / Kuli</div>
                  <div className="excel-col-status">Status Kehadiran</div>
                  <div className="excel-col-task">Jenis Pekerjaan</div>
                </div>
                <div className="excel-table-body">
                  {workers.map((w, idx) => (
                    <div className="excel-table-row" key={w.id || idx}>
                      <div className="excel-cell excel-cell-num">{idx + 1}</div>
                      <div className="excel-cell excel-cell-name"><strong>{w.name}</strong></div>
                      <div className="excel-cell excel-cell-status">
                        <span className={`status-pill ${w.attendance === 'Hadir' ? 'complete' : ''}`}>{w.attendance}</span>
                      </div>
                      <div className="excel-cell excel-cell-task">{w.task || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="muted" style={{ padding: '8px 0' }}>Tidak ada data pekerja terlampir.</p>
            )}
          </div>

          <div className="report-detail-block">
            <div className="report-detail-block-head">
              <Wrench size={16} />
              <strong>Alat & Perlengkapan Operasional</strong>
            </div>
            <p className="report-tools-text">{report.tools || 'Tidak ada alat berat/khusus dicatat.'}</p>
          </div>

          {report.internalNotes && (
            <div className="report-detail-block internal-notes-block">
              <div className="report-detail-block-head">
                <ShieldCheck size={16} />
                <strong>Catatan Internal Mandor / Pengawas (Admin Only)</strong>
              </div>
              <p>{report.internalNotes}</p>
            </div>
          )}
        </>
      )}

      <div className="modal-actions" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
        {!isClient ? (
          <button type="button" className="btn btn-outline" onClick={toggleVisibility}>
            {report.visibility === 'Published' ? 'Ubah ke Draft' : 'Publish ke Klien'}
          </button>
        ) : <div />}
        <button className="btn btn-dark" onClick={close}>
          Tutup
        </button>
      </div>
    </div>
  );
}

function ModalHost({ modal, close, db, setDb, selectedProject, updateProject, addActivity, notify, changeRole, enterClient, enterAdmin }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const set = (k, v) => setForm(old => ({ ...old, [k]: v }));
  const project = modal.project || selectedProject;

  const input = (label, key, placeholder = '', type = 'text', required = false) => (
    <label className="field">
      <span>{label}{required && <b> *</b>}</span>
      <input type={type} placeholder={placeholder} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} required={required} />
    </label>
  );

  const select = (label, key, options) => (
    <label className="field">
      <span>{label}</span>
      <select value={form[key] ?? options[0][0]} onChange={e => set(key, e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );

  const textarea = (label, key, placeholder = '') => (
    <label className="field">
      <span>{label}</span>
      <textarea rows="3" placeholder={placeholder} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} />
    </label>
  );

  const submit = (fn) => e => {
    e.preventDefault();
    setError('');
    try {
      fn();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const finish = (msg) => {
    close();
    notify(msg);
  };

  const titleMap = {
    login: 'Manage Your Project',
    'invite-admin': 'Invite an Admin',
    'create-project': 'Create a new project',
    'invite-client': 'Invite a client',
    'payment-upload': 'Upload payment proof',
    'verify-payment': 'Verify payment',
    'reject-payment': 'Reject payment proof',
    'revise-invoice': 'Revise invoice',
    'new-invoice': 'Create invoice',
    'new-report': 'New daily project log',
    'edit-report': 'Edit Draft daily log',
    'report-detail': modal.report?.title || 'Daily project log detail',
    'new-document': 'Upload project file',
    'new-legal': 'Add legal document',
    'new-material': 'Add material requirement',
    'new-usage': 'Record material usage',
    'invoice-detail': 'Invoice details',
    'invoice-detail-admin': 'Invoice details',
    'file-preview': 'File preview',
    'file-list': 'Project files',
    'client-notifications': 'Notifications',
    'rollback-reason': 'Roll Back Month (Mundur Bulan)',
    'new-milestone': 'Add Milestone',
    'edit-milestone': 'Edit Milestone',
    info: modal.title || 'Information'
  };

  if (modal.type === 'rollback-reason') {
    const targetProject = modal.project || (db?.projects || []).find(p => p.id === modal.projectId) || selectedProject;
    if (!targetProject) return null;
    body = <form onSubmit={submit(() => {
    const reason = form.reason?.trim() || 'Evaluasi mutu lapangan';
    updateProject(targetProject.id, x => {
      const currentProg = x.progress || 0;
      const prevProg = Math.max(0, currentProg - 15);
      const history = x.rollbackHistory || [];
      const newHistory = [...history, { date: new Date().toISOString(), reason, progressFrom: currentProg, progressTo: prevProg }];
      const totalM = (targetProject.milestones || []).length || 1;
      const step = 100 / totalM;
      const milestones = (targetProject.milestones || []).map((m, idx) => {
        const threshold = (idx + 1) * step;
        if (prevProg >= threshold) return { ...m, status: 'Completed', progress: 100 };
        if (prevProg >= idx * step && prevProg < threshold) return { ...m, status: 'In Progress', progress: Math.round((prevProg - idx * step) / step * 100) };
        return { ...m, status: 'Upcoming', progress: 0 };
      });
      return {
        ...x,
        progress: prevProg,
        status: 'On Hold',
        nextMilestone: 'Evaluasi ulang & perbaikan mutu lapangan',
        rollbackHistory: newHistory,
        milestones
      };
    });
    addActivity(targetProject.id, 'Project month rolled back (Mundur Bulan)', `Admin melakukan roll back bulan aktif. Alasan: ${reason}`);
    finish('Project berhasil di-rollback (Mundur Bulan).');
  })}>{textarea('Alasan Roll Back / Mundur Bulan *', 'reason', 'Mis. Progres lapangan belum memenuhi standar kualitas...')}{footer('Konfirmasi Roll Back')}</form>;
  }

  const title = modal.title || titleMap[modal.type] || 'Details';
  const footer = (label = 'Save changes', disabled = false) => (
    <div className="modal-actions">
      <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
      <button className="btn btn-dark" type="submit" disabled={disabled}>{label} <ArrowRight size={15} /></button>
    </div>
  );

  let body = null;
  if (modal.type === 'login') body = <LoginModalView db={db} setDb={setDb} close={close} notify={notify} changeRole={changeRole} enterClient={enterClient} enterAdmin={enterAdmin} />;
  if (modal.type === 'create-project') body = <form onSubmit={submit(() => { const id = uid('project'); const p = { id, code: form.code || `NA-${String(db.projects.length + 32).padStart(3, '0')}`, name: form.name, location: form.location, category: form.category || 'Residential', landArea: form.landArea || '—', buildingArea: form.buildingArea || '—', year: '2026', status: 'Active', progress: 0, clientId: form.clientId || null, cover: form.cover || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', startDate: form.startDate || '2026-11-02', targetDate: form.targetDate || '2027-11-02', nextMilestone: 'Project briefing', nextMilestoneDate: form.targetDate || '2026-11-20', nextPayment: null, milestones: [], files: [], reports: [], shopping: [], usage: [], legal: [], invoices: [], activity: [{ id: uid('act'), date: nowLabel(), actor: 'Admin NA Associates', action: 'Project created', detail: `${form.name} dibuat.` }] }; setDb(old => ({ ...old, projects: [p, ...old.projects], clients: old.clients.map(c => c.id === form.clientId ? { ...c, projects: [...c.projects, id] } : c) })); finish('Project berhasil dibuat.'); })}><div className="form-grid">{input('Project name', 'name', 'e.g. Rumah Sore', 'text', true)}{input('Project code', 'code', 'e.g. NA-032')}{input('Location', 'location', 'City / area', 'text', true)}{select('Category', 'category', [['Residential', 'Residential'], ['Commercial', 'Commercial'], ['Common / Other', 'Common / Other']])}{input('Land area', 'landArea', 'e.g. 240 m²')}{input('Building area', 'buildingArea', 'e.g. 185 m²')}{select('Assign client', 'clientId', [['', 'Unassigned'], ...db.clients.map(c => [c.id, c.name])])}{input('Target completion', 'targetDate', '', 'date')}{input('Cover image URL', 'cover', 'https://...')}</div>{footer('Create project')}</form>;
  if (modal.type === 'invite-admin') body = <form onSubmit={submit(() => { if (!form.name || !form.email) throw new Error('Name dan email wajib diisi.'); const admin = { id: uid('admin'), name: form.name, email: form.email, isPrimary: false, status: 'Invited' }; setDb(old => ({ ...old, admins: [...(old.admins || []), admin] })); finish('Undangan Admin berhasil dibuat.'); })}><div className="form-grid">{input('Admin name', 'name', 'Full name', 'text', true)}{input('Admin email', 'email', 'name@studio.com', 'email', true)}</div><div className="modal-footnote">Only the Primary Admin can create Admin invitations. All Admins share operational rights; only the Primary Admin can add other Admins.</div>{footer('Create Admin invitation')}</form>;
  if (modal.type === 'invite-client') body = <form onSubmit={submit(() => {
    if (!form.name || !form.username) throw new Error('Nama dan Username klien wajib diisi.');
    const id = uid('client');
    const assigned = Array.isArray(form.projects) ? form.projects : (form.projectId ? [form.projectId] : []);
    const c = {
      id,
      username: form.username.trim().toLowerCase(),
      name: form.name,
      email: form.email || '',
      phone: form.phone || '',
      date: form.date || '2026-11-02',
      projects: assigned,
      status: 'Active'
    };
    setDb(old => ({
      ...old,
      clients: [c, ...(old.clients || [])],
      projects: old.projects.map(p => assigned.includes(p.id) ? { ...p, clientId: id } : p)
    }));
    finish(`Akun klien "${c.name}" (Username: ${c.username}) berhasil dibuat.`);
  })}><div className="form-grid">
    {input('Username Klien (untuk login) *', 'username', 'e.g. aditya', 'text', true)}
    {input('Nama Lengkap Klien *', 'name', 'Full name', 'text', true)}
    {input('Tanggal Pendaftaran', 'date', '', 'date')}
    {input('Nomor Telepon / WhatsApp', 'phone', '+62 812 ...')}
    {input('Email Klien', 'email', 'name@email.com', 'email')}
  </div>
  <div className="field"><span>Assign Project(s)</span><div className="check-list">{db.projects.map(p => <label key={p.id} className="check-item"><input type="checkbox" checked={(form.projects || []).includes(p.id)} onChange={e => set('projects', e.target.checked ? [...(form.projects || []), p.id] : (form.projects || []).filter(x => x !== p.id))} /><div className="check-label-content"><strong className="check-project-name">{p.name}</strong><span className="check-project-code">{p.code}</span></div></label>)}</div></div>
  <div className="modal-footnote">Klien masuk menggunakan Username unik yang Anda daftarkan di atas (tanpa Google/password).</div>
  {footer('Buat Akun Klien')}</form>;
  if (modal.type === 'payment-upload') body = <form onSubmit={submit(() => { const amount = Number(form.amount); if (!amount || amount <= 0) throw new Error('Masukkan nominal pembayaran yang valid.'); const invoice = project.invoices.find(i => i.id === form.invoiceId); if (!invoice) throw new Error('Pilih invoice.'); const pay = { id: uid('payment'), date: form.date || '2026-11-02', claimed: amount, approved: 0, status: 'Pending', proof: form.proofName || 'payment-proof.jpg', receipt: null }; updateProject(project.id, p => ({ ...p, invoices: p.invoices.map(i => i.id === invoice.id ? { ...i, status: 'Pending Verification', payments: [...i.payments, pay] } : i) })); addActivity(project.id, 'Payment proof uploaded', `Bukti pembayaran ${money(amount)} untuk ${invoice.number} menunggu verifikasi.`, db.clients.find(c => c.id === project.clientId)?.name || 'Client'); finish('Bukti pembayaran berhasil diunggah.'); })}><div className="modal-highlight"><Wallet size={18} /><div><strong>Upload payment proof</strong><small>{project.name} · {project.code}</small></div></div>{select('Invoice', 'invoiceId', project.invoices.filter(i => i.status !== 'Cancelled').map(i => [i.id, `${i.number} · ${money(i.amount)}`]))}{input('Payment date', 'date', '', 'date')}{input('Claimed payment amount (Rp)', 'amount', 'e.g. 4000000', 'number', true)}<label className="upload-box"><Upload size={18} /><span><strong>Choose payment proof</strong><small>JPG, PNG, or PDF format</small></span><input type="file" accept="image/*,.pdf" onChange={e => set('proofName', e.target.files?.[0]?.name || '')} /></label>{form.proofName && <small className="selected-file">Selected: {form.proofName}</small>}<div className="modal-footnote">Bukti pembayaran akan diverifikasi oleh tim administrasi studio.</div>{footer('Submit proof')}</form>;
  if (modal.type === 'verify-payment') { const previousPaid = modal.invoice.payments.filter(x => x.status === 'Approved').reduce((s, x) => s + x.approved, 0); const remainingBefore = Math.max(0, modal.invoice.amount - previousPaid); const excess = Math.max(0, Number(form.approved ?? modal.payment.claimed) - remainingBefore); body = <form onSubmit={submit(() => { const approved = Number(form.approved ?? modal.payment.claimed); if (!Number.isFinite(approved) || approved <= 0) throw new Error('Nominal persetujuan harus lebih dari nol.'); const reason = form.reason || ''; if (approved !== modal.payment.claimed && !reason.trim()) throw new Error('Alasan wajib diisi jika nominal berbeda.'); if (excess > 0 && !form.overpaymentDecision) throw new Error('Pilih penanganan nominal lebih bayar.'); updateProject(project.id, p => { const invoices = p.invoices.map(i => { if (i.id !== modal.invoice.id) return i; const payments = i.payments.map(x => x.id === modal.payment.id ? { ...x, approved, status: 'Approved', verifiedAt: nowLabel(), verifiedBy: 'Admin NA', reason, overpaymentAmount: Math.max(0, approved - remainingBefore), overpaymentDecision: excess > 0 ? form.overpaymentDecision : null, receipt: `RCPT-${project.code}-${i.payments.indexOf(x) + 1}` } : x); const paid = payments.filter(x => x.status === 'Approved').reduce((s, x) => s + x.approved, 0); const pending = payments.some(x => x.status === 'Pending'); return { ...i, payments, status: paid >= i.amount ? 'Paid' : pending ? 'Pending Verification' : paid > 0 ? 'Partially Paid' : 'Unpaid' }; }); const stillDue = invoices.some(i => i.status !== 'Cancelled' && i.amount > i.payments.filter(x => x.status === 'Approved').reduce((s, x) => s + x.approved, 0)); return { ...p, invoices, status: p.status === 'On Hold' && !stillDue ? 'Ready to Resume' : p.status }; }); addActivity(project.id, 'Payment verified', `${modal.invoice.number}: ${money(approved)} disetujui. ${reason}${excess > 0 ? ` Overpayment ${money(excess)}: ${form.overpaymentDecision}.` : ''}`); finish('Pembayaran disetujui dan receipt diterbitkan.'); })}><div className="payment-verify-summary"><small>{modal.invoice.number}</small><strong>{money(modal.payment.claimed)}</strong><span>Claimed by client · {dateFmt(modal.payment.date)}</span></div>{input('Approved amount (Rp)', 'approved', String(modal.payment.claimed), 'number', true)}{excess > 0 && <><div className="overpayment-callout"><AlertCircle size={15} /><span>Approved amount exceeds the remaining invoice balance by <strong>{money(excess)}</strong>.</span></div>{select('Overpayment handling', 'overpaymentDecision', [['', 'Select decision'], ['Credit next invoice', 'Credit to next invoice'], ['Refund', 'Refund to client']])}</>}{textarea('Reason (required if amount differs)', 'reason', 'Explain the adjustment, if any.')}<div className="modal-footnote">Receipt reference resmi akan diterbitkan setelah pembayaran diverifikasi.</div>{footer('Approve payment')}</form>; }
  if (modal.type === 'reject-payment') body = <form onSubmit={submit(() => { if (!form.reason?.trim()) throw new Error('Alasan penolakan wajib diisi.'); updateProject(project.id, p => ({ ...p, invoices: p.invoices.map(i => i.id === modal.invoice.id ? { ...i, payments: i.payments.map(x => x.id === modal.payment.id ? { ...x, status: 'Rejected', reason: form.reason } : x), status: i.payments.some(x => x.id !== modal.payment.id && x.status === 'Pending') ? 'Pending Verification' : i.payments.some(x => x.status === 'Approved') ? 'Partially Paid' : 'Unpaid' } : i) })); addActivity(project.id, 'Payment rejected', `${modal.invoice.number}: ${form.reason}`); finish('Bukti pembayaran ditolak. Bukti lama tetap tersimpan.'); })}><div className="payment-verify-summary"><small>{modal.invoice.number}</small><strong>{money(modal.payment.claimed)}</strong><span>{modal.payment.proof || 'Payment proof'}</span></div>{textarea('Rejection reason', 'reason', 'Describe why the proof cannot be accepted.')}{footer('Reject proof')}</form>;
  if (modal.type === 'new-invoice') body = <form onSubmit={submit(() => { const amount = Number(form.amount); if (!amount || amount <= 0) throw new Error('Nominal invoice harus lebih dari nol.'); const num = `INV-${project.code}-${String(project.invoices.length + 1).padStart(3, '0')}`; const inv = { id: uid('invoice'), number: num, revision: 0, amount, dueDate: form.dueDate || '2026-12-10', issueDate: '2026-11-02', status: 'Unpaid', payments: [], replacedBy: null, reason: '' }; updateProject(project.id, p => ({ ...p, invoices: [inv, ...p.invoices] })); addActivity(project.id, 'Invoice issued', `${num} diterbitkan sebesar ${money(amount)}.`); finish('Invoice berhasil dibuat.'); })}><div className="modal-highlight"><FileText size={18} /><div><strong>New invoice</strong><small>{project.name}</small></div></div>{input('Invoice amount (Rp)', 'amount', 'e.g. 10000000', 'number', true)}{input('Due date', 'dueDate', '', 'date')}{textarea('Description / billing note', 'description', 'Optional billing details.')}{footer('Create invoice')}</form>;
  if (modal.type === 'revise-invoice') body = <form onSubmit={submit(() => { if (!form.reason?.trim()) throw new Error('Revision reason wajib diisi.'); const amount = Number(form.amount || modal.invoice.amount); const newId = uid('invoice'); const newInv = { ...modal.invoice, id: newId, number: `${modal.invoice.number}-R${modal.invoice.revision + 1}`, revision: modal.invoice.revision + 1, amount, dueDate: form.dueDate || modal.invoice.dueDate, issueDate: '2026-11-02', status: 'Unpaid', payments: modal.invoice.payments.filter(p => p.status === 'Approved').map((p, i) => ({ ...p, id: uid('payment'), receipt: `RCPT-RELINK-${i + 1}` })), replacedBy: null, reason: form.reason, revisionOf: modal.invoice.id }; const paid = newInv.payments.reduce((s, p) => s + p.approved, 0); newInv.status = paid >= amount ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Unpaid'; updateProject(project.id, p => ({ ...p, invoices: p.invoices.map(i => i.id === modal.invoice.id ? { ...i, status: 'Cancelled', replacedBy: newId, reason: form.reason } : i).concat(newInv) })); addActivity(project.id, 'Invoice revised', `${modal.invoice.number} diganti dengan ${newInv.number}. Reason: ${form.reason}`); finish('Invoice direvisi. Histori invoice lama tetap dipertahankan.'); })}><div className="payment-verify-summary"><small>REPLACING {modal.invoice.number}</small><strong>{money(modal.invoice.amount)}</strong><span>Original due date · {dateFmt(modal.invoice.dueDate)}</span></div>{input('Revised amount (Rp)', 'amount', String(modal.invoice.amount), 'number', true)}{input('New due date (leave unchanged if same)', 'dueDate', '', 'date')}{textarea('Mandatory revision reason', 'reason', 'Explain why this invoice needs revision.')}<div className="modal-footnote">The old invoice will be archived as Cancelled / Replaced. Approved payments are carried forward without double counting.</div>{footer('Create revised invoice')}</form>;

  // MODAL NEW DAILY PROJECT LOG (3 SECTIONS WITH EXCEL WORKERS TABLE)
  if (modal.type === 'new-report') {
    body = (
      <NewReportModalView
        project={project}
        close={close}
        updateProject={updateProject}
        addActivity={addActivity}
        finish={finish}
      />
    );
  }

  if (modal.type === 'edit-report') {
    body = (
      <EditReportModalView
        report={modal.report}
        project={project}
        close={close}
        updateProject={updateProject}
        addActivity={addActivity}
        finish={finish}
      />
    );
  }

  // MODAL DAILY PROJECT LOG DETAIL (FOR CLIENT AND ADMIN)
  if (modal.type === 'report-detail') {
    body = (
      <ReportDetailModalView
        report={modal.report}
        project={project}
        isClient={!!modal.isClient}
        close={close}
        updateProject={updateProject}
        addActivity={addActivity}
        notify={notify}
      />
    );
  }

  if (modal.type === 'new-document') body = <form onSubmit={submit(() => {
    const d = {
      id: uid('file'),
      name: form.name || 'Project document.pdf',
      category: form.category || 'Drawing',
      date: form.date || '2026-11-02',
      type: form.type || 'PDF',
      visibility: form.visibility || 'Internal Only',
      description: form.description || '',
      url: form.fileUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
    };
    updateProject(project.id, p => ({ ...p, files: [d, ...p.files] }));
    addActivity(project.id, 'Document uploaded', `${d.name} (${d.visibility}) uploaded to direct studio storage.`);
    finish('Dokumen & file output berhasil diunggah.');
  })}>{input('Document / file name', 'name', 'e.g. Floor Plan — Rev 02.pdf', 'text', true)}
  <div className="form-grid">
    {select('Category', 'category', [['Presentation', 'Presentation'], ['Rendering', 'Rendering'], ['Drawing', 'Drawing'], ['Report', 'Report'], ['Other', 'Other']])}
    {select('File type', 'type', [['PDF', 'PDF'], ['JPG', 'JPG'], ['PNG', 'PNG'], ['WEBP', 'WebP'], ['XLSX', 'XLSX']])}
    {input('Upload date', 'date', '', 'date')}
    {select('Visibility', 'visibility', [['Internal Only', 'Internal Only'], ['Published', 'Published to Client']])}
  </div>
  {textarea('Description', 'description', 'Short description of this file output or design render.')}
  <label className="upload-box"><Upload size={18} /><span><strong>Upload Direct File (Supabase Storage Ready)</strong><small>PDF, high-res render (JPG, PNG, WebP), or drawing</small></span><input type="file" onChange={e => { const fileObj = e.target.files?.[0]; if (fileObj) { set('name', fileObj.name); set('fileUrl', URL.createObjectURL(fileObj)); } }} /></label>{footer('Upload document')}</form>;
  if (modal.type === 'new-legal') body = <form onSubmit={submit(() => { const d = { id: uid('legal'), name: form.name, version: form.version || 'v1.0', date: form.date || '2026-11-02', visibility: form.visibility || 'Internal Only' }; updateProject(project.id, p => ({ ...p, legal: [d, ...p.legal] })); addActivity(project.id, 'Legal document added', d.name); finish('Legal document berhasil ditambahkan.'); })}>{input('Document name', 'name', 'e.g. Addendum 02', 'text', true)}<div className="form-grid">{input('Version', 'version', 'v1.0')}{input('Document date', 'date', '', 'date')}{select('Visibility', 'visibility', [['Internal Only', 'Internal Only'], ['Published', 'Published to Client']])}</div>{footer('Add legal document')}</form>;
  if (modal.type === 'new-material') body = <form onSubmit={submit(() => { const s = { id: uid('material'), date: form.date || '2026-11-02', material: form.material, specification: form.specification || '', quantity: Number(form.quantity || 0), unit: form.unit || 'unit', status: 'Belum Dibeli', visibility: 'Draft', supplier: form.supplier || '', unitCost: Number(form.unitCost || 0) }; updateProject(project.id, p => ({ ...p, shopping: [s, ...p.shopping] })); addActivity(project.id, 'Shopping item added', `${s.material} ditambahkan sebagai Draft.`); finish('Material requirement berhasil ditambahkan.'); })}>{input('Material name', 'material', 'e.g. Besi beton Ø10', 'text', true)}{input('Specification', 'specification', 'Grade, size, brand, etc.')}<div className="form-grid">{input('Date needed', 'date', '', 'date')}{input('Quantity', 'quantity', 'e.g. 120', 'number')}{input('Unit', 'unit', 'e.g. batang')}{input('Internal unit cost (Rp)', 'unitCost', 'Optional', 'number')}</div>{input('Supplier (internal)', 'supplier', 'Supplier name')}<div className="modal-footnote">New shopping items are saved as Draft. Publish them from Shopping & Materials to show them to the Client.</div>{footer('Add material')}</form>;
  if (modal.type === 'new-usage') body = <form onSubmit={submit(() => { const u = { id: uid('usage'), date: form.date || '2026-11-02', material: form.material, quantity: Number(form.quantity || 0), unit: form.unit || 'unit', area: form.area || '' }; updateProject(project.id, p => ({ ...p, usage: [u, ...p.usage] })); addActivity(project.id, 'Material usage recorded', `${u.material}: ${u.quantity} ${u.unit}.`); finish('Material usage berhasil dicatat.'); })}>{input('Material', 'material', 'Material name', 'text', true)}<div className="form-grid">{input('Date', 'date', '', 'date')}{input('Quantity', 'quantity', 'Amount', 'number')}{input('Unit', 'unit', 'e.g. batang')}{input('Work area', 'area', 'e.g. Lantai 2')}</div>{footer('Record usage')}</form>;
  if (modal.type === 'invoice-detail' || modal.type === 'invoice-detail-admin') { const inv = modal.invoice; const paid = inv.payments.filter(p => p.status === 'Approved').reduce((s, p) => s + p.approved, 0); body = <div><div className="invoice-detail-summary"><small>{inv.number}</small><h2>{money(inv.amount)}</h2><StatusTag value={inv.status} /><p>Issue date {dateFmt(inv.issueDate)} · Due {dateFmt(inv.dueDate)}</p><ProgressBar value={inv.amount ? paid / inv.amount * 100 : 0} /><div className="detail-amounts"><span>Verified paid <strong>{money(paid)}</strong></span><span>Remaining <strong>{money(Math.max(0, inv.amount - paid))}</strong></span></div></div><h4 className="modal-subtitle">Payment history</h4>{inv.payments.map(p => <div className="payment-history-row" key={p.id}><div><strong>{money(p.approved || p.claimed)}</strong><small>{dateFmt(p.date)} · claimed {money(p.claimed)}</small>{p.reason && <small>Reason: {p.reason}</small>}{p.overpaymentAmount > 0 && <small>Overpayment {money(p.overpaymentAmount)} · {p.overpaymentDecision}</small>}</div><div><StatusTag value={p.status} />{p.receipt && <small className="receipt-ref">{p.receipt}</small>}</div></div>)}{!inv.payments.length && <EmptyState title="No payments yet" detail="Payment records will appear here." />}{modal.type === 'invoice-detail-admin' && inv.status !== 'Paid' && inv.status !== 'Cancelled' && <button className="btn btn-outline modal-wide-btn" onClick={() => setTimeout(() => { }, 1)}>Download invoice statement</button>}<div className="modal-actions"><button className="btn btn-dark" onClick={close}>Close</button></div></div>; }
  if (modal.type === 'new-milestone') body = <form onSubmit={submit(() => {
    const title = form.title?.trim();
    if (!title) throw new Error('Judul milestone wajib diisi.');
    const m = {
      id: uid('milestone'),
      title,
      date: form.date || '2026-11-20',
      status: form.status || 'Upcoming',
      progress: Number(form.progress || 0)
    };
    updateProject(project.id, p => ({ ...p, milestones: [...(p.milestones || []), m] }));
    addActivity(project.id, 'Milestone added', `Milestone baru "${m.title}" ditambahkan.`);
    finish('Milestone berhasil ditambahkan.');
  })}>{input('Milestone Title', 'title', 'e.g. Struktur lantai 2', 'text', true)}<label className="field"><span>Target Date</span><input type="date" value={form.date ?? '2026-11-20'} onChange={e => set('date', e.target.value)} /></label><label className="field"><span>Status</span><select value={form.status ?? 'Upcoming'} onChange={e => set('status', e.target.value)}><option value="Upcoming">Upcoming</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></label>{input('Progress (%)', 'progress', '0-100', 'number')}{footer('Add milestone')}</form>;

  if (modal.type === 'edit-milestone') {
    const mId = modal.milestoneId;
    const existing = (project.milestones || []).find(m => m.id === mId) || {};
    body = <form onSubmit={submit(() => {
      const title = form.title?.trim() || existing.title;
      updateProject(project.id, p => ({
        ...p,
        milestones: (p.milestones || []).map(m => m.id === mId ? { ...m, title, date: form.date || m.date, status: form.status || m.status, progress: Number(form.progress ?? m.progress) } : m)
      }));
      addActivity(project.id, 'Milestone updated', `Milestone "${title}" diperbarui.`);
      finish('Milestone berhasil diperbarui.');
    })}>{input('Milestone Title', 'title', existing.title || '', 'text', true)}<label className="field"><span>Target Date</span><input type="date" value={form.date ?? existing.date ?? ''} onChange={e => set('date', e.target.value)} /></label><label className="field"><span>Status</span><select value={form.status ?? existing.status ?? 'Upcoming'} onChange={e => set('status', e.target.value)}><option value="Upcoming">Upcoming</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></label>{input('Progress (%)', 'progress', String(existing.progress ?? 0), 'number')}{footer('Save milestone')}</form>;
  }

  if (modal.type === 'photo-lightbox') {
    body = (
      <div style={{ textAlign: 'center', padding: '10px' }}>
        <div style={{ background: '#111', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '500px', marginBottom: '14px' }}>
          <img src={modal.url || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85'} alt={modal.caption || 'Field photo'} style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain' }} />
        </div>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>{modal.caption || 'Dokumentasi lapangan proyek'}</p>
        <button className="btn btn-dark" onClick={close}>Tutup Lightbox</button>
      </div>
    );
  }

  if (modal.type === 'file-preview') {
    const f = modal.file;
    const isImage = f?.type === 'JPG' || f?.type === 'PNG' || f?.type === 'WEBP' || f?.category === 'Rendering';
    body = (
      <div className="file-preview-modal">
        {isImage ? (
          <div style={{ margin: '0 0 16px', background: '#e9ece5', borderRadius: '4px', overflow: 'hidden', maxHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={f?.url || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'} alt={f?.name} style={{ width: '100%', maxHeight: '380px', objectFit: 'cover' }} />
          </div>
        ) : (
          <div className="preview-art" style={{ background: '#f0f2ec', padding: '24px', textAlign: 'center', borderRadius: '4px', marginBottom: '16px' }}>
            <FileText size={48} color="#6b7562" />
            <span style={{ display: 'block', marginTop: '8px', fontWeight: 600 }}>OFFICIAL STUDIO DOCUMENT ({f?.type || 'PDF'})</span>
          </div>
        )}
        <h3>{f?.name}</h3>
        <p>{f?.description || 'Dokumen dan output desain resmi tersimpan di server studio.'}</p>
        <div className="file-preview-meta">
          <span>File type <strong>{f?.type || 'PDF'}</strong></span>
          <span>Category <strong>{f?.category || 'Drawing'}</strong></span>
          <span>Date <strong>{dateFmt(f?.date)}</strong></span>
        </div>
        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button className="btn btn-outline" onClick={close}>Close</button>
          <button className="btn btn-dark" onClick={() => notify('Mengunduh dokumen proyek...')}>
            <Download size={15} /> Download File
          </button>
        </div>
      </div>
    );
  }
  if (modal.type === 'file-list') body = <div className="document-list">{(project.files || []).filter(f => f.visibility === 'Published').map(f => <div className="document-row" key={f.id}><span className="document-icon"><FileText /></span><div><strong>{f.name}</strong><small>{f.category} · {dateFmt(f.date)}</small></div><StatusTag value={f.visibility} /></div>)}</div>;
  if (modal.type === 'client-notifications') body = <div className="notification-modal-list">{db.notifications.map(n => <div className="notification-row" key={n.id}><span className="notification-icon"><Bell size={17} /></span><div><strong>{n.title}</strong><p>{n.body}</p><small>{dateFmt(n.date)}</small></div></div>)}</div>;
  if (modal.type === 'info') body = <div><p className="modal-lead preserve-lines">{modal.body}</p><div className="modal-actions"><button className="btn btn-dark" onClick={close}>Close</button></div></div>;

  const isWide = modal.type === 'new-report' || modal.type === 'report-detail';

  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
      <section className={`modal-card ${isWide ? 'modal-card-wide' : ''}`}>
        <header className="modal-header">
          <div>
            <div className="eyebrow">NA ASSOCIATES / PROJECT SPACE</div>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={close}>
            <X size={19} />
          </button>
        </header>
        <div className="modal-body">
          {body}
          {error && <div className="form-error"><AlertCircle size={15} />{error}</div>}
        </div>
      </section>
    </div>
  );
}

export { ModalHost };
