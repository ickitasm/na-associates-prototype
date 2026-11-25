import React, { useEffect, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Bell, Building2, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronRight, ClipboardList, Clock3, CreditCard,
  Download, ExternalLink, FileCheck2, FileImage, FileText, FolderOpen, HardHat,
  Home, Image, LayoutDashboard, MapPin, Menu, MoreHorizontal, Package, Plus,
  RotateCcw, Search, Settings, ShieldCheck, ShoppingBag, Upload, User, UserPlus,
  Users, Wallet, X, Eye, Activity, AlertCircle
} from 'lucide-react';
import { Brand, PageIntro, Field, PublicFooter, WhatsAppIcon, EmptyState } from '../components/ui';
import naassHeadImg from '../public/naass_head.jpg';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    src: naassHeadImg,
    alt: 'NA Associates warm timber dining and living interior',
    scaled: true,
  },
  {
    id: 'slide-2',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90',
    alt: 'Contemporary courtyard residential architecture',
    scaled: false,
  },
  {
    id: 'slide-3',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    alt: 'Warm contemporary timber and stone residence',
    scaled: false,
  },
];

const HERO_TRACK_FRAMES = [...HERO_SLIDES, { ...HERO_SLIDES[0], id: 'slide-1-clone' }];

function PublicShell({ page, setPage, go, onLogin, changeRole, mobileNav, setMobileNav, heroReady = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasNextTarget, setHasNextTarget] = useState(true);

  const getHeaderOffset = () => {
    const header = document.querySelector('.public-header');
    return header ? header.getBoundingClientRect().height : 82;
  };

  const getScrollTargets = () => {
    const rawTargets = page === 'project-detail'
      ? [
          ...document.querySelectorAll('.detail-hero, .project-facts, .project-story, .detail-gallery'),
          document.querySelector('footer.public-footer'),
        ]
      : [
          ...document.querySelectorAll('.public-main > section'),
          document.querySelector('footer.public-footer'),
        ];

    const seen = new Set();
    return rawTargets
      .filter((el) => {
        if (!el || seen.has(el) || el.offsetHeight <= 0) return false;
        seen.add(el);
        return true;
      })
      .sort((a, b) => (window.scrollY + a.getBoundingClientRect().top) - (window.scrollY + b.getBoundingClientRect().top));
  };

  const getNextScrollTarget = () => {
    const targets = getScrollTargets();
    if (!targets.length) return null;
    const offset = getHeaderOffset();
    return targets.find((el) => el.getBoundingClientRect().top > offset + 24) || null;
  };

  useEffect(() => { const fn = () => go('home'); window.addEventListener('na-home', fn); return () => window.removeEventListener('na-home', fn); }, []);

  useEffect(() => {
    const updateScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      const atPageBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 24;
      const nextTarget = getNextScrollTarget();
      setIsAtBottom(atPageBottom || !nextTarget);
      setHasNextTarget(Boolean(nextTarget));
    };
    const raf = requestAnimationFrame(updateScroll);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [page]);

  useEffect(() => {
    if (!mobileNav) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileNav(false);
    };
    const onResize = () => {
      if (window.innerWidth > 780) setMobileNav(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileNav, setMobileNav]);

  const handleFloatingScroll = () => {
    const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
    const nextTarget = getNextScrollTarget();

    if (atPageBottom || !nextTarget) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const offset = getHeaderOffset();
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const rawTop = window.scrollY + nextTarget.getBoundingClientRect().top - offset;
    const targetTop = Math.max(0, Math.min(maxScroll, rawTop));
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  const links = [['Projects','projects'],['Services','services'],['About','about'],['Career','career'],['Contact','contact']];
  const openPortal = () => {
    setMobileNav(false);
    onLogin();
  };
  const navigateFromDrawer = (key) => {
    setMobileNav(false);
    go(key);
  };
  return <>
    <header className={`public-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="public-header-inner">
        <Brand/>
        <nav className="public-nav" aria-label="Primary navigation">
          {links.map(([label, key]) => <button key={key} type="button" className={page === key ? 'active' : ''} onClick={() => go(key)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          <button type="button" className="text-link portal-link" onClick={openPortal}>Manage Project <ArrowUpRight size={15}/></button>
          <button
            type="button"
            className="icon-btn mobile-menu"
            onClick={() => setMobileNav(v => !v)}
            aria-label={mobileNav ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNav}
            aria-controls="public-mobile-nav"
          >
            {mobileNav ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>
    </header>
    <div
      className={`public-drawer-backdrop ${mobileNav ? 'is-open' : ''}`}
      onClick={() => setMobileNav(false)}
      aria-hidden="true"
    />
    <nav
      id="public-mobile-nav"
      className={`public-mobile-drawer ${mobileNav ? 'is-open' : ''}`}
      aria-label="Mobile navigation"
      aria-hidden={!mobileNav}
    >
      <div className="public-drawer-head">
        <span className="public-drawer-label">NAVIGATION</span>
        <button
          type="button"
          className="icon-btn public-drawer-close"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation menu"
          tabIndex={mobileNav ? 0 : -1}
        >
          <X size={20}/>
        </button>
      </div>
      <div className="public-drawer-links">
        {links.map(([label, key]) => (
          <button
            key={key}
            type="button"
            className={`public-drawer-item ${page === key ? 'active' : ''}`}
            onClick={() => navigateFromDrawer(key)}
            tabIndex={mobileNav ? 0 : -1}
          >
            <span>{label}</span>
            <ChevronRight size={16}/>
          </button>
        ))}
        <button
          type="button"
          className="public-drawer-item public-drawer-portal"
          onClick={openPortal}
          tabIndex={mobileNav ? 0 : -1}
        >
          <span>Manage Project</span>
          <ArrowUpRight size={16}/>
        </button>
      </div>
    </nav>
    <main className="public-main">{page === 'home' && <HomePage go={go} onLogin={onLogin} heroReady={heroReady}/>} {page === 'projects' && <ProjectsPage go={go}/>} {page === 'project-detail' && <ProjectDetailPage go={go}/>} {page === 'services' && <ServicesPage go={go}/>} {page === 'about' && <AboutPage go={go}/>} {page === 'career' && <CareerPage/>} {page === 'contact' && <ContactPage/>}</main>
    <PublicFooter go={go}/>
    <div className="public-floating-nav" aria-label="Navigasi gulir cepat">
      <button
        type="button"
        className={`floating-nav-btn floating-nav-home ${page !== 'home' ? 'is-visible' : 'is-hidden'}`}
        onClick={() => go('home')}
        aria-label="Kembali ke beranda"
        aria-hidden={page === 'home'}
        tabIndex={page !== 'home' ? 0 : -1}
      >
        <Home size={18}/>
      </button>
      <button
        type="button"
        className="floating-nav-btn floating-nav-scroll is-visible"
        onClick={handleFloatingScroll}
        aria-label={!isAtBottom && hasNextTarget ? 'Gulir ke bagian berikutnya' : 'Kembali ke atas'}
      >
        {!isAtBottom && hasNextTarget ? <ArrowDown size={18}/> : <ArrowUp size={18}/>}
      </button>
    </div>
  </>;
}

function HomePage({ go, heroReady }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [noTransition, setNoTransition] = useState(false);
  const [cycleNonce, setCycleNonce] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNoTransition(false);
      setSlideIdx((prev) => (prev >= 3 ? 3 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [cycleNonce]);

  useEffect(() => {
    if (!noTransition) return undefined;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setNoTransition(false);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [noTransition]);

  useEffect(() => {
    if (slideIdx !== 3) return undefined;
    const fallback = setTimeout(() => {
      setNoTransition(true);
      setSlideIdx(0);
    }, 900);
    return () => clearTimeout(fallback);
  }, [slideIdx]);

  const handleTrackTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (slideIdx === 3) {
      setNoTransition(true);
      setSlideIdx(0);
    }
  };

  const selectSlide = (idx) => {
    setNoTransition(false);
    setSlideIdx(idx);
    setCycleNonce((n) => n + 1);
  };

  const activeDot = slideIdx % HERO_SLIDES.length;

  return <>
    <section className="hero">
      <div className="hero-carousel-viewport" aria-hidden="true">
        <div
          className={`hero-carousel-track is-slide-${slideIdx} ${noTransition ? 'is-instant' : ''}`}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {HERO_TRACK_FRAMES.map((slide) => (
            <div className="hero-carousel-slide" key={slide.id}>
              <img
                src={slide.src}
                alt={slide.alt}
                className={`hero-carousel-img ${slide.scaled ? 'is-scaled' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>
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
      <div className="hero-carousel-dots" role="tablist" aria-label="Pilih slide hero">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={activeDot === idx}
            aria-label={`Slide ${idx + 1}`}
            className={`hero-carousel-dot ${activeDot === idx ? 'is-active' : ''}`}
            onClick={() => selectSlide(idx)}
          />
        ))}
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
    <PageIntro title="Karya" italic="pilihan." desc="Kumpulan ruang yang dibentuk oleh konteks lokasi, ketajaman fungsi, dan keseharian para penghuninya."/>
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
    <section className="contact-band">
      <div className="wrap contact-band-inner">
        <div>
          <div className="eyebrow light">DISKUSI PROYEK</div>
          <h2>Tertarik merancang<br/><em>ruang serupa?</em></h2>
        </div>
        <button type="button" className="circle-arrow" onClick={() => go('contact')} aria-label="Hubungi NA Associates"><ArrowUpRight size={26}/></button>
      </div>
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
    <PageIntro title="Apa yang kami" italic="kerjakan." desc="Pendekatan arsitektur dan desain yang terukur, dari diskusi pertama hingga penyelesaian detail terkecil."/>
    <section className="wrap service-page-list">
      {items.map(([n,t,d]) => <div className="service-page-row" key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p><ArrowUpRight size={19}/></div>)}
    </section>
    <section className="contact-band">
      <div className="wrap contact-band-inner">
        <div>
          <div className="eyebrow light">KONSULTASI LAYANAN</div>
          <h2>Mari wujudkan<br/><em>ruang yang bermakna.</em></h2>
        </div>
        <button type="button" className="circle-arrow" onClick={() => go('contact')} aria-label="Hubungi NA Associates"><ArrowUpRight size={26}/></button>
      </div>
    </section>
  </>;
}

function AboutPage({ go }) {
  return <>
    <PageIntro title="Praktik yang dibangun di atas" italic="pertimbangan." desc="Kami memandang setiap proyek sebagai dialog antara manusia, ruang, dan kemungkinan baru."/>
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
    <section className="contact-band">
      <div className="wrap contact-band-inner">
        <div>
          <div className="eyebrow light">MARI BERKOLABORASI</div>
          <h2>Siap memulai dialog<br/><em>untuk ruang Anda?</em></h2>
        </div>
        <button type="button" className="circle-arrow" onClick={() => go('contact')} aria-label="Hubungi NA Associates"><ArrowUpRight size={26}/></button>
      </div>
    </section>
  </>;
}

function ContactPage() {
  const [sent,setSent] = useState(false);
  return <>
    <PageIntro title="Ceritakan tentang" italic="proyek Anda." desc="Memiliki gagasan ruang, lahan yang siap dirancang, atau sekadar ingin berkonsultasi? Kami senang mendengarnya."/>
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
        <a className="btn btn-whatsapp" href="https://wa.me/6285174279328?text=Halo%20NA%20Associates%2C%20saya%20tertarik%20untuk%20berkonsultasi%20mengenai%20proyek%20arsitektur." target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={16}/> Hubungi via WhatsApp</a>
        {sent && <p className="form-success"><CheckCircle2 size={16}/> Pesan berhasil dikirim. Tim NA Associates akan segera menghubungi Anda.</p>}
      </form>
      <aside className="contact-aside">
        <div><small>EMAIL</small><strong>hello@naassociates.com</strong></div>
        <div><small>LOKASI</small><strong>Jakarta, Indonesia</strong></div>
        <div><small>WHATSAPP</small><strong><a className="contact-wa-link" href="https://wa.me/6285174279328" target="_blank" rel="noopener noreferrer">+62 851-7427-9328 (085174279328)</a></strong></div>
      </aside>
    </section>
  </>;
}

function CareerPage() {
  const [sent,setSent] = useState(false);
  return <>
    <PageIntro title="Beri ruang untuk" italic="kemungkinan baru." desc="Kami selalu terbuka bertemu individu yang cermat, kreatif, dan peduli terhadap kualitas lingkungan binaan."/>
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
