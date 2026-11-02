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
  const [role, setRole] = useState('client');

  const handleLogin = (e) => {
    e?.preventDefault();
    if (role === 'client') {
      setDb(old => ({ ...old, currentClientId: 'client-01' }));
      changeRole('client');
      close();
      enterClient();
      notify('Masuk sebagai Client: Aditya Pratama');
    } else {
      changeRole('admin');
      close();
      enterAdmin();
      notify('Masuk sebagai Admin: NA Associates');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '6px' }}>
      <div className="field">
        <span>Role</span>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="button" className="btn-google-login" onClick={handleLogin}>
        <GoogleIcon size={19} />
        <span>Login with Google as <strong>{role === 'client' ? 'Client' : 'Admin'}</strong></span>
      </button>

      <div className="modal-actions" style={{ justifyContent: 'flex-end', paddingTop: '4px' }}>
        <button type="button" className="btn btn-outline" onClick={close}>
          Cancel
        </button>
      </div>
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

function PaymentProofViewer({ payment, invoice, project, onPreviewFull, notify }) {
  const [activeTab, setActiveTab] = useState(payment?.proofUrl ? 'image' : 'slip');
  const fileName = payment?.proof || 'Bukti-transfer.jpg';
  const hasImage = !!payment?.proofUrl;

  return (
    <div className="proof-viewer-wrapper">
      <div className="proof-viewer-header">
        <div className="proof-viewer-title">
          <FileImage size={16} />
          <strong>Bukti Transfer Pembayaran Klien</strong>
        </div>
        <div className="proof-viewer-tabs">
          {hasImage && (
            <button
              type="button"
              className={`proof-tab-btn ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              Foto Asli
            </button>
          )}
          <button
            type="button"
            className={`proof-tab-btn ${activeTab === 'slip' ? 'active' : ''}`}
            onClick={() => setActiveTab('slip')}
          >
            Rincian Struk Transfer
          </button>
        </div>
      </div>

      {activeTab === 'image' && hasImage ? (
        <div className="proof-image-container">
          <div className="proof-image-frame" onClick={() => onPreviewFull?.(payment.proofUrl, fileName)}>
            <img src={payment.proofUrl} alt="Bukti Transfer Klien" className="proof-full-preview-img" />
            <div className="proof-image-overlay">
              <Eye size={16} />
              <span>Klik untuk perbesar</span>
            </div>
          </div>
          <div className="proof-file-caption">
            <span>Nama file: <strong>{fileName}</strong></span>
            <button
              type="button"
              className="btn btn-small btn-outline"
              onClick={() => onPreviewFull?.(payment.proofUrl, fileName)}
            >
              <Eye size={13} /> Perbesar
            </button>
          </div>
        </div>
      ) : (
        <div className="digital-transfer-slip">
          <div className="slip-top-band">
            <div className="slip-bank-name">
              <span className="slip-bank-icon">BCA</span>
              <div>
                <strong>m-BCA Transfer Berhasil</strong>
                <small>Bukti Transaksi Elektronik</small>
              </div>
            </div>
            <span className="slip-badge-success">BERHASIL</span>
          </div>

          <div className="slip-amount-box">
            <small>JUMLAH TRANSFER KLIEN</small>
            <h3>{money(payment?.claimed || 0)}</h3>
          </div>

          <div className="slip-details-grid">
            <div className="slip-item">
              <small>TANGGAL & WAKTU</small>
              <strong>{dateFmt(payment?.date || '2026-11-02')} · 10:45 WIB</strong>
            </div>
            <div className="slip-item">
              <small>NOMOR REFERENSI</small>
              <strong>TRX-{payment?.id?.slice(-8)?.toUpperCase() || '8492019'}</strong>
            </div>
            <div className="slip-item">
              <small>PENGIRIM</small>
              <strong>ADITYA PRATAMA</strong>
              <span>BCA · 5420-••••-8219</span>
            </div>
            <div className="slip-item">
              <small>REKENING TUJUAN</small>
              <strong>PT NA ASSOCIATES ARSITEKTUR</strong>
              <span>BCA · 8820-192-881</span>
            </div>
            <div className="slip-item full-width">
              <small>BERITA TRANSFER</small>
              <strong>{invoice?.number || 'INVOICE'} · Termin Pekerjaan Studio</strong>
            </div>
          </div>

          <div className="slip-footer-meta">
            <span className="slip-note">
              <FileImage size={13} /> File lampiran: <strong>{fileName}</strong>
            </span>
            {hasImage ? (
              <button
                type="button"
                className="btn btn-small btn-outline"
                onClick={() => setActiveTab('image')}
              >
                Lihat Foto Asli
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-small btn-outline"
                onClick={() => notify?.(`Membuka berkas ${fileName}...`)}
              >
                <Download size={13} /> Unduh Berkas
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ModalHost({ modal, close, db, setDb, selectedProject, updateProject, addActivity, notify, changeRole, enterClient, enterAdmin }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [proofLightbox, setProofLightbox] = useState(null);
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
    'upload-receipt': 'Upload Kwitansi Resmi Studio',
    'revise-invoice': 'Revise invoice',
    'new-invoice': 'Create invoice',
    'upload-invoice-doc': 'Upload Dokumen Invoice Studio',
    'new-report': 'New daily project log',
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
    info: modal.title || 'Information'
  };

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
  if (modal.type === 'invite-client') body = <form onSubmit={submit(() => { if (!form.name || !form.email) throw new Error('Name dan email wajib diisi.'); const id = uid('client'); const assigned = Array.isArray(form.projects) ? form.projects : (form.projectId ? [form.projectId] : []); const c = { id, name: form.name, email: form.email, phone: form.phone || '', projects: assigned, status: 'Invited' }; setDb(old => ({ ...old, clients: [c, ...old.clients.map(existing => ({ ...existing, projects: existing.projects.filter(pid => !assigned.includes(pid)) }))], projects: old.projects.map(p => assigned.includes(p.id) ? { ...p, clientId: id } : p) })); finish('Undangan klien berhasil dibuat.'); })}><div className="form-grid">{input('Client name', 'name', 'Full name', 'text', true)}{input('Google email', 'email', 'name@email.com', 'email', true)}{input('Phone number', 'phone', '+62 ...')}</div><div className="field"><span>Assign project(s)</span><div className="check-list">{db.projects.map(p => <label key={p.id} className="check-item"><input type="checkbox" checked={(form.projects || []).includes(p.id)} onChange={e => set('projects', e.target.checked ? [...(form.projects || []), p.id] : (form.projects || []).filter(x => x !== p.id))} /><div className="check-label-content"><strong className="check-project-name">{p.name}</strong><span className="check-project-code">{p.code}</span></div></label>)}</div></div><div className="modal-footnote">Client will access the project using their invited Google email.</div>{footer('Create invitation')}</form>;
  if (modal.type === 'payment-upload') body = <form onSubmit={submit(() => {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) throw new Error('Masukkan nominal pembayaran yang valid.');
    const invoice = project.invoices.find(i => i.id === form.invoiceId);
    if (!invoice) throw new Error('Pilih invoice.');
    const pay = {
      id: uid('payment'),
      date: form.date || '2026-11-02',
      claimed: amount,
      approved: 0,
      status: 'Pending',
      proof: form.proofName || 'Bukti-transfer.jpg',
      proofUrl: form.proofUrl || null,
      receipt: null
    };
    updateProject(project.id, p => ({
      ...p,
      invoices: p.invoices.map(i => i.id === invoice.id ? {
        ...i,
        status: 'Pending Verification',
        payments: [...i.payments, pay]
      } : i)
    }));
    addActivity(project.id, 'Payment proof uploaded', `Bukti pembayaran ${money(amount)} untuk ${invoice.number} menunggu verifikasi.`, db.clients.find(c => c.id === project.clientId)?.name || 'Client');
    finish('Bukti pembayaran berhasil diunggah.');
  })}>
    <div className="modal-highlight"><Wallet size={18} /><div><strong>Upload payment proof</strong><small>{project.name} · {project.code}</small></div></div>
    {select('Invoice', 'invoiceId', project.invoices.filter(i => i.status !== 'Cancelled').map(i => [i.id, `${i.number} · ${money(i.amount)}`]))}
    {input('Payment date', 'date', '', 'date')}
    {input('Claimed payment amount (Rp)', 'amount', 'e.g. 4000000', 'number', true)}
    <label className="upload-box">
      <Upload size={18} />
      <span>
        <strong>Pilih Berkas Bukti Transfer (JPG, PNG, PDF)</strong>
        <small>{form.proofName ? `Terpilih: ${form.proofName}` : 'Format JPG, PNG, atau PDF bukti transfer m-Banking / ATM'}</small>
      </span>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            set('proofName', file.name);
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                set('proofUrl', ev.target.result);
              };
              reader.readAsDataURL(file);
            } else {
              set('proofUrl', null);
            }
          }
        }}
      />
    </label>
    {form.proofUrl ? (
      <div className="proof-upload-preview">
        <img src={form.proofUrl} alt="Preview Bukti" className="proof-preview-thumb" />
        <div>
          <strong>{form.proofName}</strong>
          <small>Pratinjau foto bukti transfer siap dikirim</small>
        </div>
      </div>
    ) : (form.proofName && (
      <small className="selected-file">Selected: {form.proofName}</small>
    ))}
    <div className="modal-footnote">Bukti pembayaran akan diverifikasi oleh tim administrasi studio.</div>
    {footer('Submit proof')}
  </form>;
  if (modal.type === 'verify-payment') {
    const previousPaid = modal.invoice.payments.filter(x => x.status === 'Approved').reduce((s, x) => s + x.approved, 0);
    const remainingBefore = Math.max(0, modal.invoice.amount - previousPaid);
    const excess = Math.max(0, Number(form.approved ?? modal.payment.claimed) - remainingBefore);
    const defaultReceiptRef = modal.payment.receipt || `RCPT-${project.code}-${String(modal.invoice.payments.indexOf(modal.payment) + 1).padStart(3, '0')}`;

    body = <form onSubmit={submit(() => {
      const approved = Number(form.approved ?? modal.payment.claimed);
      if (!Number.isFinite(approved) || approved <= 0) throw new Error('Nominal persetujuan harus lebih dari nol.');
      const reason = form.reason || '';
      if (approved !== modal.payment.claimed && !reason.trim()) throw new Error('Alasan wajib diisi jika nominal berbeda.');
      if (excess > 0 && !form.overpaymentDecision) throw new Error('Pilih penanganan nominal lebih bayar.');

      const receiptRef = form.receiptRef?.trim() || defaultReceiptRef;
      const receiptFile = form.receiptFile?.trim() || (modal.payment.receiptFile || `Kwitansi-${receiptRef}.pdf`);

      updateProject(project.id, p => {
        const invoices = p.invoices.map(i => {
          if (i.id !== modal.invoice.id) return i;
          const payments = i.payments.map(x => x.id === modal.payment.id ? {
            ...x,
            approved,
            status: 'Approved',
            verifiedAt: nowLabel(),
            verifiedBy: 'Admin NA',
            reason,
            overpaymentAmount: Math.max(0, approved - remainingBefore),
            overpaymentDecision: excess > 0 ? form.overpaymentDecision : null,
            receipt: receiptRef,
            receiptFile: receiptFile
          } : x);
          const paid = payments.filter(x => x.status === 'Approved').reduce((s, x) => s + x.approved, 0);
          const pending = payments.some(x => x.status === 'Pending');
          return {
            ...i,
            payments,
            status: paid >= i.amount ? 'Paid' : pending ? 'Pending Verification' : paid > 0 ? 'Partially Paid' : 'Unpaid'
          };
        });
        const stillDue = invoices.some(i => i.status !== 'Cancelled' && i.amount > i.payments.filter(x => x.status === 'Approved').reduce((s, x) => s + x.approved, 0));
        return { ...p, invoices, status: p.status === 'On Hold' && !stillDue ? 'Ready to Resume' : p.status };
      });
      addActivity(project.id, 'Payment verified', `${modal.invoice.number}: ${money(approved)} disetujui. Kwitansi: ${receiptFile}. ${reason}${excess > 0 ? ` Overpayment ${money(excess)}: ${form.overpaymentDecision}.` : ''}`);
      finish('Pembayaran disetujui dan kwitansi resmi diterbitkan.');
    })}>
      <div className="payment-verify-summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <small>{modal.invoice.number}</small>
            <strong>{money(modal.payment.claimed)}</strong>
          </div>
          <span className="status-tag tag-pending-verification">MENUNGGU VERIFIKASI</span>
        </div>
        <span>Claimed by client · {dateFmt(modal.payment.date)}</span>
      </div>

      {/* TAMPILAN BUKTI TRANSFER PEMBAYARAN KLIEN */}
      <PaymentProofViewer
        payment={modal.payment}
        invoice={modal.invoice}
        project={project}
        onPreviewFull={(url, name) => setProofLightbox({ url, name })}
        notify={notify}
      />

      {input('Approved amount (Rp)', 'approved', String(modal.payment.claimed), 'number', true)}
      {excess > 0 && (
        <>
          <div className="overpayment-callout">
            <AlertCircle size={15} />
            <span>Approved amount exceeds the remaining invoice balance by <strong>{money(excess)}</strong>.</span>
          </div>
          {select('Overpayment handling', 'overpaymentDecision', [['', 'Select decision'], ['Credit next invoice', 'Credit to next invoice'], ['Refund', 'Refund to client']])}
        </>
      )}
      {textarea('Reason (required if amount differs)', 'reason', 'Explain the adjustment, if any.')}

      {/* BAGIAN UPLOAD KWITANSI RESMI STUDIO */}
      <div className="receipt-upload-box">
        <div className="receipt-upload-head">
          <FileCheck2 size={16} />
          <div>
            <strong>Kwitansi Pembayaran Resmi Studio (Receipt)</strong>
            <small>Terbitkan nomor kwitansi & lampirkan berkas PDF kwitansi resmi studio</small>
          </div>
        </div>
        {input('Nomor Referensi Kwitansi', 'receiptRef', defaultReceiptRef)}
        <label className="upload-box">
          <Upload size={18} />
          <span>
            <strong>Upload Berkas Kwitansi Studio (PDF / Gambar)</strong>
            <small>{form.receiptFile ? `Terpilih: ${form.receiptFile}` : 'Pilih file PDF kwitansi resmi bertanda tangan / cap studio'}</small>
          </span>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                set('receiptFile', file.name);
              }
            }}
          />
        </label>
        {form.receiptFile && (
          <div className="selected-file-pill">
            <FileCheck2 size={14} />
            <span>Berkas kwitansi terpilih: <strong>{form.receiptFile}</strong></span>
          </div>
        )}
      </div>

      <div className="modal-footnote">Kwitansi resmi dan receipt reference akan otomatis diterbitkan dan dapat diunduh oleh klien di portal.</div>
      {footer('Approve & Terbitkan Kwitansi')}
    </form>;
  }
  if (modal.type === 'reject-payment') body = <form onSubmit={submit(() => {
    if (!form.reason?.trim()) throw new Error('Alasan penolakan wajib diisi.');
    updateProject(project.id, p => ({
      ...p,
      invoices: p.invoices.map(i => i.id === modal.invoice.id ? {
        ...i,
        payments: i.payments.map(x => x.id === modal.payment.id ? {
          ...x,
          status: 'Rejected',
          reason: form.reason
        } : x),
        status: i.payments.some(x => x.id !== modal.payment.id && x.status === 'Pending') ? 'Pending Verification' : i.payments.some(x => x.status === 'Approved') ? 'Partially Paid' : 'Unpaid'
      } : i)
    }));
    addActivity(project.id, 'Payment rejected', `${modal.invoice.number}: ${form.reason}`);
    finish('Bukti pembayaran ditolak. Bukti lama tetap tersimpan.');
  })}>
    <div className="payment-verify-summary">
      <small>{modal.invoice.number}</small>
      <strong>{money(modal.payment.claimed)}</strong>
      <span>{modal.payment.proof || 'Payment proof'}</span>
    </div>

    {/* TAMPILAN BUKTI TRANSFER KLIEN YANG AKAN DITOLAK */}
    <PaymentProofViewer
      payment={modal.payment}
      invoice={modal.invoice}
      project={project}
      onPreviewFull={(url, name) => setProofLightbox({ url, name })}
      notify={notify}
    />

    {textarea('Rejection reason', 'reason', 'Describe why the proof cannot be accepted.')}
    {footer('Reject proof')}
  </form>;
  if (modal.type === 'upload-receipt') {
    const pay = modal.payment;
    const inv = modal.invoice;
    body = <form onSubmit={submit(() => {
      const fileName = form.receiptFile || form.customName || `Kwitansi-${pay.receipt || 'RCPT'}.pdf`;
      if (!fileName.trim()) throw new Error('Pilih file kwitansi atau tentukan nama berkas.');
      updateProject(project.id, p => ({
        ...p,
        invoices: p.invoices.map(i => i.id === inv.id ? {
          ...i,
          payments: i.payments.map(x => x.id === pay.id ? {
            ...x,
            receiptFile: fileName.trim(),
            receipt: form.receiptRef || x.receipt || `RCPT-${project.code}-001`
          } : x)
        } : i)
      }));
      addActivity(project.id, 'Receipt uploaded', `Kwitansi resmi untuk ${inv.number} (${fileName.trim()}) diunggah.`);
      finish('Kwitansi resmi studio berhasil diunggah.');
    })}>
      <div className="modal-highlight">
        <FileCheck2 size={18} />
        <div>
          <strong>Upload Kwitansi Resmi Studio</strong>
          <small>{inv.number} · Pembayaran {money(pay.approved || pay.claimed)} ({project.name})</small>
        </div>
      </div>

      {pay.receiptFile && (
        <div className="current-doc-banner">
          <FileCheck2 size={16} />
          <div>
            <span>Berkas kwitansi saat ini:</span>
            <strong>{pay.receiptFile} ({pay.receipt})</strong>
          </div>
        </div>
      )}

      {input('Nomor Referensi Kwitansi', 'receiptRef', pay.receipt || `RCPT-${project.code}-001`)}

      <label className="upload-box">
        <Upload size={18} />
        <span>
          <strong>Pilih Berkas Kwitansi (PDF / Gambar)</strong>
          <small>{form.receiptFile ? `Terpilih: ${form.receiptFile}` : 'Pilih file PDF kwitansi dengan tanda tangan/cap resmi studio'}</small>
        </span>
        <input type="file" accept=".pdf,image/*" onChange={e => set('receiptFile', e.target.files?.[0]?.name || '')} />
      </label>

      {form.receiptFile && (
        <div className="selected-file-pill">
          <FileCheck2 size={14} />
          <span>Berkas kwitansi terpilih: <strong>{form.receiptFile}</strong></span>
        </div>
      )}

      {input('Atau sesuaikan nama file kwitansi', 'customName', pay.receiptFile || `Kwitansi-${pay.receipt || 'RCPT'}.pdf`)}

      <div className="modal-footnote">
        Berkas kwitansi resmi yang diunggah akan langsung tampil di Client Portal pada modul Billing & Payments sehingga klien dapat mengunduhnya.
      </div>

      {footer('Simpan & Terbitkan Kwitansi')}
    </form>;
  }
  if (modal.type === 'new-invoice') body = <form onSubmit={submit(() => {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) throw new Error('Nominal invoice harus lebih dari nol.');
    const num = `INV-${project.code}-${String(project.invoices.length + 1).padStart(3, '0')}`;
    const docFile = form.documentFile ? form.documentFile.trim() : null;
    const inv = {
      id: uid('invoice'),
      number: num,
      revision: 0,
      amount,
      dueDate: form.dueDate || '2026-12-10',
      issueDate: '2026-11-02',
      status: 'Unpaid',
      documentFile: docFile,
      payments: [],
      replacedBy: null,
      reason: ''
    };
    updateProject(project.id, p => ({ ...p, invoices: [inv, ...p.invoices] }));
    addActivity(project.id, 'Invoice issued', `${num} diterbitkan sebesar ${money(amount)}${docFile ? ` dengan lampiran ${docFile}` : ''}.`);
    finish('Invoice berhasil dibuat.');
  })}>
    <div className="modal-highlight"><FileText size={18} /><div><strong>New invoice</strong><small>{project.name}</small></div></div>
    {input('Invoice amount (Rp)', 'amount', 'e.g. 10000000', 'number', true)}
    {input('Due date', 'dueDate', '', 'date')}
    {textarea('Description / billing note', 'description', 'Optional billing details.')}
    <label className="upload-box">
      <Upload size={18} />
      <span>
        <strong>Upload Dokumen Invoice Studio (PDF / Gambar)</strong>
        <small>{form.documentFile ? `Terpilih: ${form.documentFile}` : 'Pilih file PDF invoice resmi atau foto scan dari studio'}</small>
      </span>
      <input type="file" accept=".pdf,image/*" onChange={e => set('documentFile', e.target.files?.[0]?.name || '')} />
    </label>
    {form.documentFile && <small className="selected-file">File invoice terpilih: {form.documentFile}</small>}
    <div className="modal-footnote">Dokumen invoice buatan studio yang diunggah akan langsung dapat dilihat dan diunduh oleh klien di portal.</div>
    {footer('Create invoice')}
  </form>;
  if (modal.type === 'revise-invoice') body = <form onSubmit={submit(() => {
    if (!form.reason?.trim()) throw new Error('Revision reason wajib diisi.');
    const amount = Number(form.amount || modal.invoice.amount);
    const newId = uid('invoice');
    const docFile = form.documentFile ? form.documentFile.trim() : (modal.invoice.documentFile ? `${modal.invoice.documentFile.replace('.pdf', '')}-R${modal.invoice.revision + 1}.pdf` : null);
    const newInv = {
      ...modal.invoice,
      id: newId,
      number: `${modal.invoice.number}-R${modal.invoice.revision + 1}`,
      revision: modal.invoice.revision + 1,
      amount,
      dueDate: form.dueDate || modal.invoice.dueDate,
      issueDate: '2026-11-02',
      status: 'Unpaid',
      documentFile: docFile,
      payments: modal.invoice.payments.filter(p => p.status === 'Approved').map((p, i) => ({ ...p, id: uid('payment'), receipt: `RCPT-RELINK-${i + 1}` })),
      replacedBy: null,
      reason: form.reason,
      revisionOf: modal.invoice.id
    };
    const paid = newInv.payments.reduce((s, p) => s + p.approved, 0);
    newInv.status = paid >= amount ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Unpaid';
    updateProject(project.id, p => ({ ...p, invoices: p.invoices.map(i => i.id === modal.invoice.id ? { ...i, status: 'Cancelled', replacedBy: newId, reason: form.reason } : i).concat(newInv) }));
    addActivity(project.id, 'Invoice revised', `${modal.invoice.number} diganti dengan ${newInv.number}. Reason: ${form.reason}`);
    finish('Invoice direvisi. Histori invoice lama tetap dipertahankan.');
  })}>
    <div className="payment-verify-summary">
      <small>REPLACING {modal.invoice.number}</small>
      <strong>{money(modal.invoice.amount)}</strong>
      <span>Original due date · {dateFmt(modal.invoice.dueDate)}</span>
    </div>
    {input('Revised amount (Rp)', 'amount', String(modal.invoice.amount), 'number', true)}
    {input('New due date (leave unchanged if same)', 'dueDate', '', 'date')}
    {textarea('Mandatory revision reason', 'reason', 'Explain why this invoice needs revision.')}
    <label className="upload-box">
      <Upload size={18} />
      <span>
        <strong>Upload Dokumen Invoice Revisi (PDF / Gambar)</strong>
        <small>{form.documentFile ? `Terpilih: ${form.documentFile}` : (modal.invoice.documentFile ? `File sebelumnya: ${modal.invoice.documentFile}` : 'Pilih file PDF invoice revisi resmi (opsional)')}</small>
      </span>
      <input type="file" accept=".pdf,image/*" onChange={e => set('documentFile', e.target.files?.[0]?.name || '')} />
    </label>
    {form.documentFile && <small className="selected-file">File invoice revisi: {form.documentFile}</small>}
    <div className="modal-footnote">The old invoice will be archived as Cancelled / Replaced. Approved payments are carried forward without double counting.</div>
    {footer('Create revised invoice')}
  </form>;
  if (modal.type === 'upload-invoice-doc') {
    const inv = modal.invoice;
    body = <form onSubmit={submit(() => {
      const chosenName = form.documentFile || form.customName || (inv.documentFile ? inv.documentFile : `${inv.number}-Official.pdf`);
      if (!chosenName.trim()) throw new Error('Pilih file dokumen invoice atau cantumkan nama dokumen.');
      updateProject(project.id, p => ({
        ...p,
        invoices: p.invoices.map(i => i.id === inv.id ? { ...i, documentFile: chosenName.trim() } : i)
      }));
      addActivity(project.id, 'Invoice document uploaded', `Dokumen invoice resmi diunggah untuk ${inv.number} (${chosenName.trim()}).`);
      finish(`Dokumen invoice studio untuk ${inv.number} berhasil diunggah. Klien dapat langsung melihatnya di portal.`);
    })}>
      <div className="modal-highlight">
        <FileText size={18} />
        <div>
          <strong>Upload Dokumen Invoice Studio</strong>
          <small>{inv.number} · {money(inv.amount)} ({project.name})</small>
        </div>
      </div>

      {inv.documentFile && (
        <div className="current-doc-banner">
          <FileCheck2 size={16} />
          <div>
            <span>Dokumen invoice saat ini:</span>
            <strong>{inv.documentFile}</strong>
          </div>
        </div>
      )}

      <label className="upload-box">
        <Upload size={18} />
        <span>
          <strong>Pilih File Dokumen Invoice (PDF / Gambar)</strong>
          <small>{form.documentFile ? `File terpilih: ${form.documentFile}` : 'Pilih file invoice format PDF atau scan/foto buatan studio'}</small>
        </span>
        <input type="file" accept=".pdf,image/*" onChange={e => set('documentFile', e.target.files?.[0]?.name || '')} />
      </label>

      {form.documentFile && (
        <div className="selected-file-pill">
          <FileText size={14} />
          <span>File terpilih: <strong>{form.documentFile}</strong></span>
        </div>
      )}

      {input('Atau sesuaikan nama file invoice', 'customName', inv.documentFile || `${inv.number}-Official.pdf`)}

      <div className="modal-footnote">
        Dokumen invoice yang diunggah akan langsung tampil di Client Portal pada modul Billing & Payments sehingga klien dapat membuka dan mengunduhnya.
      </div>

      {footer('Simpan & Publikasikan ke Klien')}
    </form>;
  }

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

  if (modal.type === 'new-document') body = <form onSubmit={submit(() => { const d = { id: uid('file'), name: form.name || 'Project document.pdf', category: form.category || 'Drawing', date: form.date || '2026-11-02', type: form.type || 'PDF', visibility: form.visibility || 'Internal Only', description: form.description || '' }; updateProject(project.id, p => ({ ...p, files: [d, ...p.files] })); addActivity(project.id, 'Document uploaded', `${d.name} (${d.visibility}).`); finish('Dokumen berhasil ditambahkan.'); })}>{input('Document name', 'name', 'e.g. Floor Plan — Rev 02.pdf', 'text', true)}<div className="form-grid">{select('Category', 'category', [['Presentation', 'Presentation'], ['Rendering', 'Rendering'], ['Drawing', 'Drawing'], ['Report', 'Report'], ['Other', 'Other']])}{select('File type', 'type', [['PDF', 'PDF'], ['JPG', 'JPG'], ['PNG', 'PNG'], ['XLSX', 'XLSX']])}{input('Upload date', 'date', '', 'date')}{select('Visibility', 'visibility', [['Internal Only', 'Internal Only'], ['Published', 'Published to Client']])}</div>{textarea('Description', 'description', 'Short description of this file.')}<label className="upload-box"><Upload size={18} /><span><strong>Choose file</strong><small>PDF, image, or spreadsheet</small></span><input type="file" onChange={e => set('name', e.target.files?.[0]?.name || form.name)} /></label>{footer('Add document')}</form>;
  if (modal.type === 'new-legal') body = <form onSubmit={submit(() => { const d = { id: uid('legal'), name: form.name, version: form.version || 'v1.0', date: form.date || '2026-11-02', visibility: form.visibility || 'Internal Only' }; updateProject(project.id, p => ({ ...p, legal: [d, ...p.legal] })); addActivity(project.id, 'Legal document added', d.name); finish('Legal document berhasil ditambahkan.'); })}>{input('Document name', 'name', 'e.g. Addendum 02', 'text', true)}<div className="form-grid">{input('Version', 'version', 'v1.0')}{input('Document date', 'date', '', 'date')}{select('Visibility', 'visibility', [['Internal Only', 'Internal Only'], ['Published', 'Published to Client']])}</div>{footer('Add legal document')}</form>;
  if (modal.type === 'new-material') body = <form onSubmit={submit(() => { const s = { id: uid('material'), date: form.date || '2026-11-02', material: form.material, specification: form.specification || '', quantity: Number(form.quantity || 0), unit: form.unit || 'unit', status: 'Belum Dibeli', visibility: 'Draft', supplier: form.supplier || '', unitCost: Number(form.unitCost || 0) }; updateProject(project.id, p => ({ ...p, shopping: [s, ...p.shopping] })); addActivity(project.id, 'Shopping item added', `${s.material} ditambahkan sebagai Draft.`); finish('Material requirement berhasil ditambahkan.'); })}>{input('Material name', 'material', 'e.g. Besi beton Ø10', 'text', true)}{input('Specification', 'specification', 'Grade, size, brand, etc.')}<div className="form-grid">{input('Date needed', 'date', '', 'date')}{input('Quantity', 'quantity', 'e.g. 120', 'number')}{input('Unit', 'unit', 'e.g. batang')}{input('Internal unit cost (Rp)', 'unitCost', 'Optional', 'number')}</div>{input('Supplier (internal)', 'supplier', 'Supplier name')}<div className="modal-footnote">New shopping items are saved as Draft. Publish them from Shopping & Materials to show them to the Client.</div>{footer('Add material')}</form>;
  if (modal.type === 'new-usage') body = <form onSubmit={submit(() => { const u = { id: uid('usage'), date: form.date || '2026-11-02', material: form.material, quantity: Number(form.quantity || 0), unit: form.unit || 'unit', area: form.area || '' }; updateProject(project.id, p => ({ ...p, usage: [u, ...p.usage] })); addActivity(project.id, 'Material usage recorded', `${u.material}: ${u.quantity} ${u.unit}.`); finish('Material usage berhasil dicatat.'); })}>{input('Material', 'material', 'Material name', 'text', true)}<div className="form-grid">{input('Date', 'date', '', 'date')}{input('Quantity', 'quantity', 'Amount', 'number')}{input('Unit', 'unit', 'e.g. batang')}{input('Work area', 'area', 'e.g. Lantai 2')}</div>{footer('Record usage')}</form>;
  if (modal.type === 'invoice-detail' || modal.type === 'invoice-detail-admin') {
    const inv = modal.invoice;
    const paid = inv.payments.filter(p => p.status === 'Approved').reduce((s, p) => s + p.approved, 0);
    body = (
      <div>
        <div className="invoice-detail-summary">
          <small>{inv.number}</small>
          <h2>{money(inv.amount)}</h2>
          <StatusTag value={inv.status} />
          <p>Issue date {dateFmt(inv.issueDate)} · Due {dateFmt(inv.dueDate)}</p>
          <ProgressBar value={inv.amount ? paid / inv.amount * 100 : 0} />
          <div className="detail-amounts">
            <span>Verified paid <strong>{money(paid)}</strong></span>
            <span>Remaining <strong>{money(Math.max(0, inv.amount - paid))}</strong></span>
          </div>
        </div>

        <div className="invoice-studio-doc-card">
          <div className="doc-card-left">
            <div className="doc-badge-icon">
              <FileText size={22} />
            </div>
            <div className="doc-card-text">
              <div className="doc-eyebrow">DOKUMEN INVOICE RESMI STUDIO</div>
              <strong>{inv.documentFile || `${inv.number}-Official.pdf`}</strong>
              <small>
                {inv.documentFile
                  ? 'File invoice resmi telah diunggah oleh studio NA Associates.'
                  : 'Belum ada file dokumen resmi yang diunggah untuk invoice ini.'}
              </small>
            </div>
          </div>
          <div className="doc-card-actions">
            {inv.documentFile ? (
              <>
                <button
                  type="button"
                  className="btn btn-small btn-outline"
                  onClick={() => {
                    close();
                    setModal({
                      type: 'file-preview',
                      file: {
                        name: inv.documentFile,
                        type: inv.documentFile.endsWith('.pdf') ? 'PDF' : 'JPG',
                        description: `Dokumen invoice resmi ${inv.number} sebesar ${money(inv.amount)} diterbitkan oleh studio NA Associates.`
                      }
                    });
                  }}
                >
                  <Eye size={13} /> Lihat File
                </button>
                <button
                  type="button"
                  className="btn btn-small btn-dark"
                  onClick={() => notify(`Mengunduh ${inv.documentFile}...`)}
                >
                  <Download size={13} /> Unduh
                </button>
              </>
            ) : (
              modal.type === 'invoice-detail-admin' && (
                <button
                  type="button"
                  className="btn btn-small btn-dark"
                  onClick={() => {
                    close();
                    setModal({ type: 'upload-invoice-doc', project: modal.project, invoice: inv });
                  }}
                >
                  <Upload size={13} /> Upload File
                </button>
              )
            )}
            {modal.type === 'invoice-detail-admin' && inv.documentFile && (
              <button
                type="button"
                className="btn btn-small btn-outline"
                title="Ganti dokumen invoice studio"
                onClick={() => {
                  close();
                  setModal({ type: 'upload-invoice-doc', project: modal.project, invoice: inv });
                }}
              >
                <Upload size={13} /> Ganti File
              </button>
            )}
          </div>
        </div>

        <h4 className="modal-subtitle">Payment history</h4>
        {inv.payments.map(p => (
          <div className="payment-history-row" key={p.id}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <strong>{money(p.approved || p.claimed)}</strong>
                <small>{dateFmt(p.date)} · claimed {money(p.claimed)}</small>
              </div>
              {p.reason && <small style={{ display: 'block', color: 'var(--muted)' }}>Reason: {p.reason}</small>}
              {p.overpaymentAmount > 0 && <small style={{ display: 'block', color: '#b26500' }}>Overpayment {money(p.overpaymentAmount)} · {p.overpaymentDecision}</small>}

              {/* LAMPIRAN BUKTI BAYAR & KWITANSI */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                {p.proof && (
                  <button
                    type="button"
                    className="payment-proof-link"
                    onClick={() => setProofLightbox({ url: p.proofUrl, name: p.proof, payment: p, invoice: inv })}
                    title="Buka bukti pembayaran transfer klien"
                  >
                    <FileImage size={12} />
                    <span>Bukti: <strong>{p.proof}</strong></span>
                    <Eye size={11} />
                  </button>
                )}

                {p.receiptFile ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      type="button"
                      className="payment-receipt-link"
                      onClick={() => {
                        close();
                        setModal({
                          type: 'file-preview',
                          file: {
                            name: p.receiptFile,
                            type: p.receiptFile.endsWith('.pdf') ? 'PDF' : 'JPG',
                            description: `Kwitansi Resmi Studio No. ${p.receipt || '—'} untuk pembayaran ${inv.number} (${money(p.approved || p.claimed)}).`
                          }
                        });
                      }}
                      title="Lihat berkas kwitansi resmi studio"
                    >
                      <FileCheck2 size={12} />
                      <span>Kwitansi: <strong>{p.receiptFile}</strong></span>
                      <Eye size={11} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-outline"
                      style={{ padding: '3px 8px', fontSize: '10px', height: '24px' }}
                      onClick={() => notify(`Mengunduh berkas ${p.receiptFile}...`)}
                      title="Unduh file kwitansi"
                    >
                      <Download size={11} /> Unduh
                    </button>
                    {modal.type === 'invoice-detail-admin' && (
                      <button
                        type="button"
                        className="btn btn-small btn-outline"
                        style={{ padding: '3px 8px', fontSize: '10px', height: '24px' }}
                        onClick={() => {
                          close();
                          setModal({ type: 'upload-receipt', project: modal.project, invoice: inv, payment: p });
                        }}
                        title="Ganti berkas kwitansi studio"
                      >
                        <Upload size={11} /> Ganti
                      </button>
                    )}
                  </div>
                ) : (
                  modal.type === 'invoice-detail-admin' && p.status === 'Approved' && (
                    <button
                      type="button"
                      className="btn btn-small btn-outline"
                      style={{ padding: '3px 9px', fontSize: '10px', height: '24px' }}
                      onClick={() => {
                        close();
                        setModal({ type: 'upload-receipt', project: modal.project, invoice: inv, payment: p });
                      }}
                      title="Upload berkas kwitansi resmi studio untuk pembayaran ini"
                    >
                      <Upload size={11} /> Upload Kwitansi Studio
                    </button>
                  )
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <StatusTag value={p.status} />
              {p.receipt && <small className="receipt-ref" style={{ display: 'block', marginTop: '4px' }}>{p.receipt}</small>}
            </div>
          </div>
        ))}
        {!inv.payments.length && <EmptyState title="No payments yet" detail="Payment records will appear here." />}
        {modal.type === 'invoice-detail-admin' && inv.status !== 'Paid' && inv.status !== 'Cancelled' && (
          <button className="btn btn-outline modal-wide-btn" onClick={() => notify(`Mengunduh invoice statement ${inv.number}...`)}>
            Download invoice statement
          </button>
        )}
        <div className="modal-actions"><button className="btn btn-dark" onClick={close}>Close</button></div>
      </div>
    );
  }
  if (modal.type === 'file-preview') body = <div className="file-preview-modal"><div className="preview-art"><FileText size={44} /><span>DOCUMENT PREVIEW</span></div><h3>{modal.file?.name}</h3><p>{modal.file?.description || 'Dokumen proyek tersimpan dalam format resmi studio.'}</p><div className="file-preview-meta"><span>File type <strong>{modal.file?.type || 'PDF'}</strong></span><span>Access <strong>Studio preview</strong></span></div><div className="modal-actions"><button className="btn btn-outline" onClick={close}>Close</button><button className="btn btn-dark" onClick={() => notify('Mengunduh dokumen proyek...')}> <Download size={15} /> Download</button></div></div>;
  if (modal.type === 'file-list') body = <div className="document-list">{(project.files || []).filter(f => f.visibility === 'Published').map(f => <div className="document-row" key={f.id}><span className="document-icon"><FileText /></span><div><strong>{f.name}</strong><small>{f.category} · {dateFmt(f.date)}</small></div><StatusTag value={f.visibility} /></div>)}</div>;
  if (modal.type === 'client-notifications') body = <div className="notification-modal-list">{db.notifications.map(n => <div className="notification-row" key={n.id}><span className="notification-icon"><Bell size={17} /></span><div><strong>{n.title}</strong><p>{n.body}</p><small>{dateFmt(n.date)}</small></div></div>)}</div>;
  if (modal.type === 'info') body = <div><p className="modal-lead preserve-lines">{modal.body}</p><div className="modal-actions"><button className="btn btn-dark" onClick={close}>Close</button></div></div>;

  const isWide = modal.type === 'new-report' || modal.type === 'report-detail';

  return (
    <>
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

      {proofLightbox && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 120 }}
          onMouseDown={e => { if (e.target === e.currentTarget) setProofLightbox(null); }}
        >
          <section className="modal-card" style={{ maxWidth: '640px' }}>
            <header className="modal-header">
              <div>
                <div className="eyebrow">BUKTI PEMBAYARAN KLIEN</div>
                <h2>{proofLightbox.name || 'Bukti Transfer Pembayaran'}</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setProofLightbox(null)}>
                <X size={19} />
              </button>
            </header>
            <div className="modal-body" style={{ textAlign: 'center', padding: '16px 24px' }}>
              {proofLightbox.url ? (
                <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)', background: '#111' }}>
                  <img
                    src={proofLightbox.url}
                    alt="Bukti Transfer Penuh"
                    style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', margin: '0 auto', display: 'block' }}
                  />
                </div>
              ) : (
                <div className="digital-transfer-slip" style={{ textAlign: 'left', margin: '0 auto' }}>
                  <div className="slip-top-band">
                    <div className="slip-bank-name">
                      <span className="slip-bank-icon">BCA</span>
                      <div>
                        <strong>m-BCA Transfer Berhasil</strong>
                        <small>Bukti Transaksi Elektronik</small>
                      </div>
                    </div>
                    <span className="slip-badge-success">BERHASIL / SETTLED</span>
                  </div>
                  <div className="slip-amount-box">
                    <small>JUMLAH DITRANSFER</small>
                    <h3>{proofLightbox.payment ? money(proofLightbox.payment.claimed) : 'Rp 1.000.000'}</h3>
                  </div>
                  <div className="slip-details-grid">
                    <div className="slip-item">
                      <small>PENERIMA</small>
                      <strong>PT NA ASSOCIATES ARSITEKTUR</strong>
                    </div>
                    <div className="slip-item">
                      <small>REKENING TUJUAN</small>
                      <strong>BCA · 8820-192-881</strong>
                    </div>
                    <div className="slip-item">
                      <small>PENGIRIM</small>
                      <strong>ADITYA PRATAMA</strong>
                    </div>
                    <div className="slip-item">
                      <small>TANGGAL & WAKTU</small>
                      <strong>{proofLightbox.payment ? dateFmt(proofLightbox.payment.date) : '2 Nov 2026'} · 10:45 WIB</strong>
                    </div>
                    <div className="slip-item">
                      <small>NOMOR REFERENSI</small>
                      <strong>TRX-{proofLightbox.payment?.id?.slice(-8)?.toUpperCase() || '8492019'}</strong>
                    </div>
                    <div className="slip-item">
                      <small>NAMA BERKAS BUKTI</small>
                      <strong>{proofLightbox.name || 'Bukti-transfer-klien.jpg'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions" style={{ justifyContent: 'space-between', padding: '0 25px 22px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  notify(`Mengunduh berkas ${proofLightbox.name || 'bukti-bayar'}...`);
                }}
              >
                <Download size={13} /> Unduh Bukti
              </button>
              <button type="button" className="btn btn-dark" onClick={() => setProofLightbox(null)}>
                Tutup
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export { ModalHost };
