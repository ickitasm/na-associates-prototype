import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Bell, Building2, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Clock3, CreditCard,
  Download, ExternalLink, FileCheck2, FileImage, FileText, FolderOpen, HardHat,
  Home, Image, LayoutDashboard, MapPin, Menu, MoreHorizontal, Package, Plus,
  RotateCcw, Search, Settings, ShieldCheck, ShoppingBag, Upload, User, UserPlus,
  Users, Wallet, X, Eye, Activity, AlertCircle
} from 'lucide-react';
import { Brand, PageIntro, Field, PublicFooter, WhatsAppIcon, EmptyState } from '../components/ui';

function PublicShell({ page, setPage, go, onLogin, changeRole, mobileNav, setMobileNav, heroReady = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => { const fn = () => go('home'); window.addEventListener('na-home', fn); return () => window.removeEventListener('na-home', fn); }, []);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setShowBackToTop(y > 280);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['Projects','projects'],['Services','services'],['About','about'],['Career','career'],['Contact','contact']];
  const openPortal = () => {
    setMobileNav(false);
    onLogin();
  };
  return <>
    <header className={`public-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="public-header-inner">
        <Brand/>
        <nav className={`public-nav ${mobileNav ? 'nav-open' : ''}`}>
          {links.map(([label, key]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => go(key)}>{label}</button>)}
          <button type="button" className="mobile-portal-link" onClick={openPortal}>Manage Project <ArrowUpRight size={15}/></button>
        </nav>
        <div className="header-actions">
          <button type="button" className="text-link portal-link" onClick={openPortal}>Manage Project <ArrowUpRight size={15}/></button>
          <button type="button" className="icon-btn mobile-menu" onClick={() => setMobileNav(v => !v)} aria-label="Open menu">{mobileNav ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
    <main className="public-main">{page === 'home' && <HomePage go={go} onLogin={onLogin} heroReady={heroReady}/>} {page === 'projects' && <ProjectsPage go={go}/>} {page === 'project-detail' && <ProjectDetailPage go={go}/>} {page === 'services' && <ServicesPage go={go}/>} {page === 'about' && <AboutPage go={go}/>} {page === 'career' && <CareerPage/>} {page === 'contact' && <ContactPage/>}</main>
    <PublicFooter go={go}/>
    <button
      type="button"
      className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Kembali ke atas"
    >
      <ArrowUp size={18}/>
    </button>
  </>;
}

function HomePage({ go, heroReady }) {
  return <>
    <section className="hero">
      <div className="hero-image"/>
      <div className="hero-shade"/>
      <div className={`hero-content wrap ${heroReady ? 'hero-animate' : 'hero-pending'}`}>
        <h1>Spaces that<br/><em>feel like home.</em></h1>
        <p>Arsitektur yang dirancang dengan penuh pertimbangan—selaras dengan konteks ruang, kejelasan fungsi, dan cara manusia menjalani keseharian.</p>
        <div className="hero-buttons">
          <button className="btn btn-light" onClick={() => go('projects')}>Explore our work <ArrowUpRight size={16}/></button>
          <button className="btn btn-outline-light" onClick={() => go('contact')}>Start a conversation</button>
        </div>
        <div className="hero-index">01 <span/> 04</div>
      </div>
      <div className="hero-caption">KARYA ARSITEKTUR PILIHAN / 2024—2026</div>
    </section>
    <section className="intro-section wrap">
      <div className="eyebrow">01 / TENTANG STUDIO</div>
      <div className="intro-grid">
        <h2>Merancang dengan<br/><em>penuh makna.</em></h2>
        <div className="intro-text">
          <p className="lead">Kami percaya arsitektur lebih dari sekadar bangunan fisik. Ia adalah respons terhadap tempat, cerminan penghuninya, serta bingkai bagi kehidupan sehari-hari.</p>
          <p>NA Associates adalah biro arsitektur dan desain yang menghadirkan ruang-ruang penuh pertimbangan melalui proses yang kolaboratif dan berakar pada konteks.</p>
          <button className="under-link" onClick={() => go('about')}>Discover our approach <ArrowUpRight size={15}/></button>
        </div>
      </div>
    </section>
    <section className="featured-section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / KARYA PILIHAN</div>
            <h2>Ruang dengan <em>karakter.</em></h2>
          </div>
          <button className="under-link" onClick={() => go('projects')}>View all projects <ArrowUpRight size={15}/></button>
        </div>
        <div className="featured-grid">
          <button className="featured-card featured-large" onClick={() => go('project-detail')}>
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85" alt="FR HOUSE"/>
            <span className="featured-meta"><strong>01 / FR HOUSE</strong><small>RESIDENTIAL · JAKARTA</small></span>
          </button>
          <button className="featured-card" onClick={() => go('project-detail')}>
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85" alt="MS HOUSE"/>
            <span className="featured-meta"><strong>02 / MS HOUSE</strong><small>RESIDENTIAL · BALI</small></span>
          </button>
        </div>
      </div>
    </section>
    <section className="services-strip wrap">
      <div className="eyebrow">03 / LAYANAN KAMI</div>
      <div className="services-strip-grid">
        <h2>Dari sketsa awal<br/>hingga <em>detail akhir.</em></h2>
        <div className="service-mini-list">
          <div><span>01</span> Arsitektur <ArrowUpRight size={15}/></div>
          <div><span>02</span> Desain Interior <ArrowUpRight size={15}/></div>
          <div><span>03</span> Pengembangan Desain <ArrowUpRight size={15}/></div>
          <div><span>04</span> Koordinasi Proyek <ArrowUpRight size={15}/></div>
        </div>
      </div>
    </section>
    <section className="contact-band">
      <div className="wrap contact-band-inner">
        <div>
          <div className="eyebrow light">04 / MARI BERKOLABORASI</div>
          <h2>Punya rencana proyek<br/><em>di pikiran Anda?</em></h2>
        </div>
        <button className="circle-arrow" onClick={() => go('contact')} aria-label="Hubungi NA Associates"><ArrowUpRight size={26}/></button>
      </div>
    </section>
  </>;
}

function ProjectsPage({ go }) {
  const [category, setCategory] = useState('All'); const [status, setStatus] = useState('All'); const [q, setQ] = useState('');
  const projects = [
    { name: 'FR HOUSE', loc: 'Kemang, Jakarta Selatan', cat: 'Residential', status: 'Ongoing', year: '2026', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85' },
    { name: 'MS HOUSE', loc: 'Ubud, Bali', cat: 'Residential', status: 'Ongoing', year: '2026', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85' },
    { name: 'Ruang Karya Office', loc: 'Bandung, Jawa Barat', cat: 'Commercial', status: 'Completed', year: '2025', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85' },
    { name: 'Courtyard House', loc: 'Tangerang, Banten', cat: 'Residential', status: 'Completed', year: '2024', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85' }
  ];
  const visible = projects.filter(p => (category === 'All' || p.cat === category) && (status === 'All' || p.status === status) && `${p.name} ${p.loc}`.toLowerCase().includes(q.toLowerCase()));
  return <>
    <PageIntro eyebrow="PORTOFOLIO / 2024—2026" title="Karya" italic="pilihan." desc="Kumpulan ruang yang dibentuk oleh konteks lokasi, ketajaman fungsi, dan keseharian para penghuninya."/>
    <section className="wrap portfolio-section">
      <div className="portfolio-toolbar">
        <div className="filter-pills">
          {['All','Residential','Commercial'].map(v => <button key={v} className={category === v ? 'selected' : ''} onClick={() => setCategory(v)}>{v}</button>)}
        </div>
        <div className="toolbar-right">
          <select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter status proyek">
            <option>All</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
          <div className="search-field">
            <Search size={15}/>
            <input placeholder="Cari proyek atau lokasi" value={q} onChange={e => setQ(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="portfolio-grid">
        {visible.map((p,i) => (
          <button className="portfolio-card" key={p.name} onClick={() => go('project-detail')}>
            <div className="portfolio-photo"><img src={p.img} alt={p.name}/><span className="photo-number">0{i+1}</span></div>
            <div className="portfolio-card-info"><div><strong>{p.name}</strong><small>{p.loc}</small></div><span className="portfolio-type">{p.cat} / {p.year}</span></div>
          </button>
        ))}
      </div>
      {!visible.length && <EmptyState title="Proyek tidak ditemukan" detail="Coba ubah kata kunci atau filter pencarian."/>}
    </section>
  </>;
}

function ProjectDetailPage({ go }) {
  return <>
    <div className="detail-hero">
      <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90" alt="FR HOUSE"/>
      <div className="detail-hero-overlay">
        <div className="eyebrow light">PROYEK PILIHAN / 2026</div>
        <h1>FR <em>HOUSE.</em></h1>
        <p>Residential · Kemang, Jakarta Selatan</p>
      </div>
    </div>
    <section className="wrap project-detail-content">
      <div className="project-facts">
        <div><small>LOKASI</small><strong>Jakarta Selatan</strong></div>
        <div><small>LUAS TANAH</small><strong>240 m²</strong></div>
        <div><small>LUAS BANGUNAN</small><strong>185 m²</strong></div>
        <div><small>STATUS</small><strong>Ongoing</strong></div>
      </div>
      <div className="project-story">
        <div className="eyebrow">TENTANG PROYEK</div>
        <div>
          <h2>Ritme yang lebih tenang<br/>untuk <em>kehidupan sehari-hari.</em></h2>
          <p>FR HOUSE mengeksplorasi hubungan antara cahaya alami, kejujuran material, dan rutinitas harian sebuah rumah tinggal keluarga. Rancangannya menyeimbangkan keterbukaan dan privasi melalui urutan ruang yang saling terhubung serta bingkai pemandangan yang tertata cermat.</p>
          <button className="under-link" onClick={() => go('contact')}>Discuss a similar project <ArrowUpRight size={15}/></button>
        </div>
      </div>
      <div className="detail-gallery">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" alt="FR HOUSE detail 1"/>
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85" alt="FR HOUSE detail 2"/>
      </div>
      <button className="under-link back-link" onClick={() => go('projects')}><ArrowLeft size={15}/> Back to projects</button>
    </section>
  </>;
}

function ServicesPage({ go }) {
  const items = [
    ['01','Arsitektur','Mulai dari perencanaan tata ruang dan konsep desain hingga penyusunan gambar kerja serta dokumentasi konstruksi terperinci.'],
    ['02','Desain Interior','Merancang ruang interior yang menyatukan materialitas, pencahayaan, fungsi ruang, dan suasana yang nyaman dihuni.'],
    ['03','Pengembangan Desain','Proses kolaboratif yang menerjemahkan gagasan awal menjadi rancangan arsitektur yang matang dan siap diwujudkan.'],
    ['04','Koordinasi Proyek','Pendampingan desain dan dukungan dokumentasi secara berkala sepanjang perjalanan pembangunan proyek Anda.']
  ];
  return <>
    <PageIntro eyebrow="KAPABILITAS KAMI" title="Apa yang kami" italic="kerjakan." desc="Pendekatan arsitektur dan desain yang terukur, dari diskusi pertama hingga penyelesaian detail terkecil."/>
    <section className="wrap service-page-list">
      {items.map(([n,t,d]) => <div className="service-page-row" key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p><ArrowUpRight size={19}/></div>)}
    </section>
    <section className="contact-band">
      <div className="wrap contact-band-inner">
        <h2>Mari wujudkan<br/><em>ruang yang bermakna.</em></h2>
        <button className="circle-arrow" onClick={() => go('contact')} aria-label="Hubungi kami"><ArrowUpRight/></button>
      </div>
    </section>
  </>;
}

function AboutPage({ go }) {
  return <>
    <PageIntro eyebrow="TENTANG NA ASSOCIATES" title="Praktik yang dibangun di atas" italic="pertimbangan." desc="Kami memandang setiap proyek sebagai dialog antara manusia, ruang, dan kemungkinan baru."/>
    <section className="wrap about-layout">
      <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85" alt="Studio NA Associates"/>
      <div>
        <div className="eyebrow">PENDEKATAN KAMI</div>
        <h2>Konteks utama.<br/><em>Selalu.</em></h2>
        <p>Kami adalah biro arsitektur dan desain yang berfokus menciptakan ruang-ruang fungsional, relevan lintas waktu, dan terhubung erat dengan lingkungan sekitarnya.</p>
        <p>Proses kerja kami selalu bersifat kolaboratif: mendengarkan dengan saksama, menguji berbagai gagasan ruang, dan menyempurnakan setiap keputusan desain dengan presisi.</p>
        <button className="under-link" onClick={() => go('contact')}>Get in touch <ArrowUpRight size={15}/></button>
      </div>
    </section>
  </>;
}

function ContactPage() {
  const [sent,setSent] = useState(false);
  return <>
    <PageIntro eyebrow="KONTAK / MULAI DISKUSI" title="Ceritakan tentang" italic="proyek Anda." desc="Memiliki gagasan ruang, lahan yang siap dirancang, atau sekadar ingin berkonsultasi? Kami senang mendengarnya."/>
    <section className="wrap contact-layout">
      <form className="public-form" onSubmit={e => {e.preventDefault();setSent(true);}}>
        <div className="form-grid">
          <Field label="Nama lengkap" required placeholder="Nama Anda"/>
          <Field label="Alamat Email" required type="email" placeholder="nama@email.com"/>
          <Field label="Nomor telepon" placeholder="+62"/>
          <label className="field">
            <span>Jenis proyek</span>
            <select defaultValue="">
              <option value="" disabled>Pilih jenis proyek</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Interior</option>
              <option>Lainnya</option>
            </select>
          </label>
        </div>
        <Field label="Ceritakan singkat tentang proyek Anda" required textarea placeholder="Gambaran singkat lokasi, kebutuhan ruang, atau rencana proyek..."/>
        <button className="btn btn-dark" type="submit">Kirim pesan <ArrowUpRight size={16}/></button>
        <a className="btn btn-whatsapp" href="https://wa.me/62895337060007?text=Halo%20NA%20Associates%2C%20saya%20tertarik%20untuk%20berkonsultasi%20mengenai%20proyek%20arsitektur." target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16}/> Hubungi via WhatsApp</a>
        {sent && <p className="form-success"><CheckCircle2 size={16}/> Pesan berhasil dikirim. Tim NA Associates akan segera menghubungi Anda.</p>}
      </form>
      <aside className="contact-aside">
        <div><small>EMAIL</small><strong>hello@naassociates.com</strong></div>
        <div><small>LOKASI</small><strong>Jakarta, Indonesia</strong></div>
        <div><small>WHATSAPP</small><strong><a className="contact-wa-link" href="https://wa.me/62895337060007" target="_blank" rel="noopener noreferrer">+62 895-3370-60007 (0895337060007)</a></strong></div>
      </aside>
    </section>
  </>;
}

function CareerPage() {
  const [sent,setSent] = useState(false);
  return <>
    <PageIntro eyebrow="KARIER / BERGABUNG BERSAMA KAMI" title="Beri ruang untuk" italic="kemungkinan baru." desc="Kami selalu terbuka bertemu individu yang cermat, kreatif, dan peduli terhadap kualitas lingkungan binaan."/>
    <section className="wrap career-layout">
      <div>
        <div className="eyebrow">DISKUSI TERBUKA</div>
        <h2>Ceritakan potensi<br/><em>yang Anda bawa.</em></h2>
        <p>Bagikan sedikit tentang diri Anda, ketertarikan di bidang arsitektur maupun desain, serta karya yang paling Anda banggakan.</p>
      </div>
      <form className="public-form" onSubmit={e => {e.preventDefault();setSent(true);}}>
        <div className="form-grid">
          <Field label="Nama lengkap" required placeholder="Nama Anda"/>
          <Field label="Email" required type="email" placeholder="nama@email.com"/>
          <label className="field full">
            <span>Posisi yang diminati</span>
            <select>
              <option>Architecture Intern</option>
              <option>Junior Architect</option>
              <option>Interior Designer</option>
              <option>Lainnya</option>
            </select>
          </label>
        </div>
        <Field label="Perkenalan singkat" textarea placeholder="Ceritakan latar belakang dan minat Anda..."/>
        <label className="upload-box"><Upload size={18}/><span><strong>Lampirkan CV / Portofolio</strong><small>PDF, maks. 10 MB</small></span><input type="file" accept=".pdf,.doc,.docx"/></label>
        <button className="btn btn-dark" type="submit">Kirim lamaran <ArrowUpRight size={16}/></button>
        {sent && <p className="form-success"><CheckCircle2 size={16}/> Lamaran berhasil dikirim. Terima kasih atas ketertarikan Anda.</p>}
      </form>
    </section>
  </>;
}
export { PublicShell };
