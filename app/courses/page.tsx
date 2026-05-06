"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ─── SVG card illustrations ─────────────────────────────────────────── */

const GisLayersImg = () => (
  <svg viewBox="0 0 320 160" style={{width:'100%',height:'100%',display:'block'}}>
    <defs>
      <linearGradient id="gl-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#071c14"/>
        <stop offset="100%" stopColor="#051510"/>
      </linearGradient>
      <filter id="gl-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    </defs>
    <rect width="320" height="160" fill="url(#gl-bg)"/>
    {[[30,20],[80,15],[140,25],[200,12],[260,22],[290,40],[310,10],[50,50],[100,60],[170,45],[240,55],[300,65],[20,80],[70,90],[130,75],[200,85],[270,78],[15,110],[90,120],[160,108],[230,115],[290,105],[40,135],[110,140],[180,130],[250,142],[310,128]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i%4===0?1.2:0.6} fill="white" opacity={0.10+0.22*(i%3)/2}/>
    ))}
    <ellipse cx="170" cy="160" rx="140" ry="50" fill="#00e676" opacity="0.06"/>
    <polygon points="55,128 170,108 285,128 285,143 170,123 55,143"
      fill="#00c853" fillOpacity="0.10" stroke="#00e676" strokeWidth="1" strokeOpacity="0.42"/>
    <polygon points="70,108 170,88 270,108 270,123 170,103 70,123"
      fill="#00c853" fillOpacity="0.17" stroke="#00e676" strokeWidth="1.2" strokeOpacity="0.62"/>
    <polygon points="85,88 170,68 255,88 255,103 170,83 85,103"
      fill="#00c853" fillOpacity="0.26" stroke="#00e676" strokeWidth="1.6" strokeOpacity="0.9"/>
    <line x1="85" y1="88" x2="255" y2="88" stroke="#00e676" strokeWidth="0.7" opacity="0.52"/>
    <line x1="118" y1="78" x2="118" y2="103" stroke="#00e676" strokeWidth="0.55" opacity="0.35"/>
    <line x1="170" y1="68" x2="170" y2="83" stroke="#00e676" strokeWidth="0.55" opacity="0.35"/>
    <line x1="222" y1="78" x2="222" y2="103" stroke="#00e676" strokeWidth="0.55" opacity="0.35"/>
    <circle cx="170" cy="62" r="7" fill="#00e676" opacity="0.88" filter="url(#gl-glow)"/>
    <circle cx="170" cy="62" r="3.5" fill="white" opacity="0.95"/>
    <line x1="170" y1="69" x2="170" y2="80" stroke="#00e676" strokeWidth="1.8" opacity="0.78"/>
    <circle cx="118" cy="80" r="3" fill="#00e676" opacity="0.72"/>
    <circle cx="222" cy="80" r="2.5" fill="#69f0ae" opacity="0.58"/>
  </svg>
);

const SpatialImg = () => {
  const nodes = [[160,42],[230,72],[245,118],[200,152],[120,152],[75,118],[90,72]];
  const c = [160, 97];
  return (
    <svg viewBox="0 0 320 160" style={{width:'100%',height:'100%',display:'block'}}>
      <defs>
        <linearGradient id="sp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d0828"/>
          <stop offset="100%" stopColor="#0a0620"/>
        </linearGradient>
        <filter id="sp-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
      </defs>
      <rect width="320" height="160" fill="url(#sp-bg)"/>
      {[[25,15],[70,10],[130,20],[190,8],[250,18],[295,30],[40,45],[100,55],[175,40],[240,50],[300,58],[15,75],[60,88],[140,72],[205,82],[270,75],[20,105],[85,118],[160,102],[230,112],[288,100],[45,138],[115,145],[185,132],[255,140],[305,130]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%5===0?1.1:0.55} fill="white" opacity={0.08+0.20*(i%4)/3}/>
      ))}
      <polygon points={nodes.map(n=>n.join(',')).join(' ')}
        fill="#7c3aed" fillOpacity="0.07" stroke="#9333ea" strokeWidth="1.4" strokeOpacity="0.62"/>
      {nodes.map(([x,y],i)=>(
        <line key={i} x1={c[0]} y1={c[1]} x2={x} y2={y} stroke="#9333ea" strokeWidth="0.9" opacity="0.38"/>
      ))}
      <polygon points={nodes.map(([x,y])=>[c[0]+(x-c[0])*0.5, c[1]+(y-c[1])*0.5].join(',')).join(' ')}
        fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.48"/>
      {nodes.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i===0?5:3.5} fill="#9333ea" opacity={i===0?0.95:0.68} filter="url(#sp-glow)"/>
      ))}
      <circle cx={c[0]} cy={c[1]} r="6" fill="#b060ff" opacity="0.88" filter="url(#sp-glow)"/>
      <circle cx={c[0]} cy={c[1]} r="3" fill="white" opacity="0.95"/>
    </svg>
  );
};

const RiverImg = () => (
  <svg viewBox="0 0 320 160" style={{width:'100%',height:'100%',display:'block'}}>
    <defs>
      <linearGradient id="rv-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#020e18"/>
        <stop offset="100%" stopColor="#03111e"/>
      </linearGradient>
      <filter id="rv-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    </defs>
    <rect width="320" height="160" fill="url(#rv-bg)"/>
    {[[28,12],[75,8],[140,18],[200,6],[260,16],[298,28],[35,42],[95,50],[165,38],[228,48],[290,42],[18,70],[65,82],[135,68],[205,78],[272,70],[22,100],[80,112],[150,98],[218,108],[285,100],[40,130],[105,138],[175,125],[245,135],[298,128]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i%5===0?1.1:0.55} fill="white" opacity={0.06+0.18*(i%4)/3}/>
    ))}
    {[64,128,192,256].map((x,i)=><line key={i} x1={x} y1="0" x2={x} y2="160" stroke="white" strokeWidth="0.3" opacity="0.05"/>)}
    {[40,80,120].map((y,i)=><line key={i} x1="0" y1={y} x2="320" y2={y} stroke="white" strokeWidth="0.3" opacity="0.05"/>)}
    <path d="M 30,30 C 60,50 40,90 70,110 S 120,145 160,138 S 220,120 260,140 S 300,152 315,148"
      fill="none" stroke="#06b6d4" strokeWidth="10" strokeOpacity="0.10"/>
    <path d="M 30,30 C 60,50 40,90 70,110 S 120,145 160,138 S 220,120 260,140 S 300,152 315,148"
      fill="none" stroke="#06b6d4" strokeWidth="2.8" strokeOpacity="0.75" filter="url(#rv-glow)"/>
    <path d="M 160,138 C 170,100 190,70 200,50 S 220,25 240,20"
      fill="none" stroke="#06b6d4" strokeWidth="1.6" strokeOpacity="0.48"/>
    {[[70,110],[160,138],[260,140]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="4.5" fill="#06b6d4" opacity="0.82" filter="url(#rv-glow)"/>
    ))}
    <circle cx="240" cy="20" r="3" fill="#67e8f9" opacity="0.68"/>
  </svg>
);

const SatelliteImg = () => (
  <svg viewBox="0 0 320 160" style={{width:'100%',height:'100%',display:'block'}}>
    <defs>
      <linearGradient id="sat-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0e0520"/>
        <stop offset="100%" stopColor="#0a0318"/>
      </linearGradient>
      <radialGradient id="sat-globe" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.45"/>
        <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.28"/>
        <stop offset="100%" stopColor="#1e0550" stopOpacity="0.08"/>
      </radialGradient>
      <filter id="sat-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    </defs>
    <rect width="320" height="160" fill="url(#sat-bg)"/>
    {[[22,10],[68,6],[135,15],[195,5],[258,14],[296,25],[38,40],[92,48],[162,35],[225,45],[288,38],[16,68],[62,80],[132,65],[202,75],[268,68],[25,98],[78,110],[148,95],[215,105],[280,98],[42,128],[108,136],[178,122],[245,132],[295,125]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i%6===0?1.3:0.6} fill="white" opacity={0.08+0.28*(i%4)/3}/>
    ))}
    <circle cx="160" cy="85" r="64" fill="url(#sat-globe)"/>
    <circle cx="160" cy="85" r="64" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.32"/>
    <ellipse cx="160" cy="85" rx="64" ry="24" fill="none" stroke="#8b5cf6" strokeWidth="0.7" opacity="0.25"/>
    <ellipse cx="160" cy="85" rx="64" ry="48" fill="none" stroke="#8b5cf6" strokeWidth="0.7" opacity="0.18"/>
    <line x1="160" y1="21" x2="160" y2="149" stroke="#8b5cf6" strokeWidth="0.7" opacity="0.20"/>
    <line x1="96" y1="85" x2="224" y2="85" stroke="#8b5cf6" strokeWidth="0.7" opacity="0.20"/>
    <circle cx="160" cy="85" r="68" fill="none" stroke="#60a5fa" strokeWidth="3" opacity="0.09"/>
    <ellipse cx="160" cy="85" rx="96" ry="38" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.20" strokeDasharray="5 5"/>
    <g transform="translate(245,32) rotate(-40)">
      <rect x="-5" y="-9" width="10" height="18" rx="2" fill="#a78bfa" opacity="0.88"/>
      <rect x="-18" y="-3.5" width="13" height="7" rx="1.5" fill="#8b5cf6" opacity="0.72"/>
      <rect x="5"  y="-3.5" width="13" height="7" rx="1.5" fill="#8b5cf6" opacity="0.72"/>
      <circle cx="0" cy="0" r="2.5" fill="white" opacity="0.88"/>
    </g>
  </svg>
);

/* ─── Main Page ───────────────────────────────────────────────────────── */
const CoursesPage = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All Courses');

  // Lock body scroll — identical to profile page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Same nav links as profile page
  const navLinks = [
    { name: 'Dashboard',     href: '/dashboard' },
    { name: 'Learning Path', href: '#' },
    { name: 'Tasks',         href: '/coding' },
    { name: 'Datasets',      href: '#' },
    { name: 'Portfolio',     href: '#' },
    { name: 'Leaderboard',   href: '/leaderboard' },
    { name: 'Courses',       href: '/courses' },
  ];

  const filters = [
    { label:'All Courses', icon:true },
    { label:'Beginner',     dot:'#22c55e' },
    { label:'Intermediate', dot:'#3b82f6' },
    { label:'Advanced',     dot:'#a855f7' },
    { label:'Expert',       dot:'#ef4444' },
  ];

  const courses = [
    {
      level:'Beginner', levelColor:'#22c55e', levelBg:'rgba(34,197,94,0.20)',
      title:'Introduction to GIS',
      desc:'Learn the basics of GIS, spatial data types, coordinate systems and how GIS is used in the real world.',
      modules:8, duration:'6h 30m', difficulty:'Beginner',
      enrolled:'+1.2K enrolled', btn:'Start Course', btnFilled:false, progress:null,
      Img:GisLayersImg, cardBg:'#071c14',
    },
    {
      level:'Intermediate', levelColor:'#22d3ee', levelBg:'rgba(34,211,238,0.18)',
      title:'Spatial Analysis Basics',
      desc:'Understand spatial operations, buffer analysis, overlay, clipping and other core spatial analysis techniques.',
      modules:10, duration:'9h 45m', difficulty:'Intermediate',
      enrolled:'+980 enrolled', btn:'Continue', btnFilled:true, progress:64,
      Img:SpatialImg, cardBg:'#0d0828',
    },
    {
      level:'Advanced', levelColor:'#a855f7', levelBg:'rgba(168,85,247,0.18)',
      title:'Advanced Geoprocessing',
      desc:'Dive deep into geoprocessing tools, model builder, spatial statistics and automation in GIS.',
      modules:12, duration:'12h 20m', difficulty:'Advanced',
      enrolled:'+760 enrolled', btn:'Start Course', btnFilled:false, progress:null,
      Img:RiverImg, cardBg:'#020e18',
    },
    {
      level:'Expert', levelColor:'#f97316', levelBg:'rgba(249,115,22,0.18)',
      title:'Remote Sensing Mastery',
      desc:'Master remote sensing concepts, image processing, classification and change detection techniques.',
      modules:14, duration:'14h 10m', difficulty:'Expert',
      enrolled:'+540 enrolled', btn:'Start Course', btnFilled:false, progress:null,
      Img:SatelliteImg, cardBg:'#0e0520',
    },
  ];

  const whyItems = [
    { icon:'</>',  bg:'rgba(99,102,241,0.18)',  color:'#818cf8', title:'Hands-on Coding',     desc:'Practice real geospatial problems with code' },
    { icon:'🏆',   bg:'rgba(251,191,36,0.14)',   color:'#fbbf24', title:'Real-world Projects', desc:'Work on industry relevant geospatial projects' },
    { icon:'🗄️',   bg:'rgba(59,130,246,0.16)',   color:'#60a5fa', title:'Curated Datasets',    desc:'Access high-quality real-world datasets' },
    { icon:'📊',   bg:'rgba(249,115,22,0.15)',   color:'#fb923c', title:'Track Progress',      desc:'Monitor your growth and earn achievements' },
    { icon:'👥',   bg:'rgba(236,72,153,0.15)',   color:'#f472b6', title:'Community Support',   desc:'Learn together and grow with the community' },
  ];

  const avatars = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/55.jpg',
  ];

  // Card style matching profile page transparency
  const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: 'rgba(10,8,34,0.45)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '14px',
    ...extra,
  });

  return (
    <>
      <style>{`
        html, body { overflow: hidden !important; }
        .cnav:hover  { opacity: 1 !important; }
        .cbtn:hover  { filter: brightness(1.14); }
        .cicon:hover { background: rgba(255,255,255,0.14) !important; }
        .c-filter { display:flex; align-items:center; gap:7px; padding:8px 16px; border-radius:22px; font-size:13px; font-weight:500; color:white; cursor:pointer; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); transition:all .15s; outline:none; }
        .c-filter.on { background:rgba(109,40,217,0.22); border-color:rgba(139,92,246,0.65); font-weight:600; }
        .c-filter:hover { opacity:.88; }
        .c-card { overflow:hidden; cursor:pointer; transition:transform .2s, border-color .2s; }
        .c-card:hover { transform:translateY(-3px); border-color:rgba(139,92,246,0.38) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.32); border-radius: 4px; }
      `}</style>

      {/* ── Root: fixed, full viewport — identical to profile page ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>

        {/* ── Video background — identical to profile page ── */}
        <video
          autoPlay loop muted playsInline
          style={{
            position: 'fixed',
            top: '50%', left: '50%',
            minWidth: '100%', minHeight: '100%',
            width: 'auto', height: 'auto',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* ── Subtle dark overlay — identical to profile page ── */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(4,3,22,0.38) 0%, rgba(4,3,22,0.18) 40%, rgba(4,3,22,0.52) 100%)',
        }} />

        {/* ── Scrollable content layer ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', height: '100%',
          overflowY: 'auto', overflowX: 'hidden',
          color: 'white',
        }}>

          {/* ══════════════════════════════════════════════════════════════
              HEADER — exact copy from profile page
          ══════════════════════════════════════════════════════════════ */}
          <header style={{
            position: 'sticky', top: 0, zIndex: 1000,
            padding: '18px 32px',
            backgroundColor: 'rgba(10,15,30,0.60)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 6px 20px rgba(2,3,87,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              maxWidth: '1600px', margin: '0 auto',
            }}>

              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/NavLogo.png" alt="Buildor Geo"
                  style={{ height: '40px', width: 'auto', objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => router.push('/dashboard')}
                />
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'white', letterSpacing: '0.2px' }}>
                  Buildor Geo
                </span>
              </div>

              {/* Nav */}
              <nav style={{
                display: 'flex', gap: '28px',
                fontSize: '14px', fontWeight: 500,
                alignItems: 'center', color: 'white',
              }}>
                {navLinks.map((item) => (
                  <span
                    key={item.name}
                    className="cnav"
                    onClick={() => item.href !== '#' && router.push(item.href)}
                    style={{
                      cursor: 'pointer',
                      opacity: item.name === 'Courses' ? 1 : 0.75,
                      fontWeight: item.name === 'Courses' ? 600 : 500,
                      transition: 'opacity 0.15s',
                      borderBottom: item.name === 'Courses' ? '2px solid #8b5cf6' : '2px solid transparent',
                      paddingBottom: '2px',
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </nav>

              {/* Icon buttons — identical to profile page */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {[
                  { icon: '💬', route: null },
                  { icon: '🔔', route: null },
                  { icon: '⚙️', route: null },
                  { icon: '👤', route: '/profile' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="cicon"
                    onClick={() => item.route && router.push(item.route)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px',
                      background: item.route
                        ? 'rgba(139,92,246,0.25)'
                        : 'rgba(255,255,255,0.08)',
                      boxShadow: item.route
                        ? 'inset 0 0 0 1.5px rgba(139,92,246,0.55)'
                        : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                      cursor: item.route ? 'pointer' : 'default',
                      transition: 'background 0.18s',
                    }}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* ══════════════════════════════════════════════════════════════
              MAIN
          ══════════════════════════════════════════════════════════════ */}
          <main style={{
            padding: '32px 32px 56px',
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}>

            {/* ── HERO SECTION ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 390px',
              gap: '28px',
              alignItems: 'start',
              marginBottom: '32px',
            }}>
              {/* Left */}
              <div>
                <h1 style={{
                  fontSize: '52px', fontWeight: 700, lineHeight: 1.06,
                  color: 'white', marginBottom: '13px',
                }}>Courses</h1>
                <p style={{
                  fontSize: '15px', color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.68, marginBottom: '30px',
                }}>
                  Learn geospatial concepts with structured paths and<br/>
                  hands-on coding challenges.
                </p>
                {/* Search + Level filter */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(10,8,34,0.45)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '10px', padding: '11px 16px', width: '330px',
                  }}>
                    <span style={{ fontSize: '14px', opacity: 0.38 }}>🔍</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.26)' }}>Search courses...</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(10,8,34,0.45)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '10px', padding: '11px 16px',
                    cursor: 'pointer', minWidth: '136px',
                  }}>
                    <span style={{ fontSize: '12px', opacity: 0.42 }}>☰</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.58)', flex: 1 }}>All Levels</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.30)' }}>▾</span>
                  </div>
                </div>
              </div>

              {/* Right – Overview card */}
              <div style={{
                ...card({ padding: '22px 24px' }),
                marginTop: '4px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    width: '33px', height: '33px', borderRadius: '9px', flexShrink: 0,
                    background: 'rgba(124,58,237,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                  }}>🎓</div>
                  <span style={{ fontSize: '14.5px', fontWeight: 700 }}>Your Learning Overview</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '16px', textAlign: 'center' }}>
                  {[['4','Enrolled'],['2','In Progress'],['12','Completed'],['86%','Avg. Score']].map(([v,l],i)=>(
                    <div key={i}>
                      <p style={{ fontSize: '23px', fontWeight: 800, color: 'white', margin: '0 0 3px', lineHeight: 1 }}>{v}</p>
                      <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.36)', margin: 0, fontWeight: 500 }}>{l}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '8px', height: '5px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ height: '100%', width: '76%', background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: '8px' }}/>
                </div>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.36)', textAlign: 'center', margin: 0 }}>
                  Keep learning, explore the world! 🌐
                </p>
              </div>
            </div>

            {/* ── FILTERS ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button
                  key={f.label}
                  className={`c-filter${activeFilter === f.label ? ' on' : ''}`}
                  onClick={() => setActiveFilter(f.label)}
                >
                  {f.icon
                    ? <span style={{ fontSize: '13px', opacity: 0.72 }}>⊞</span>
                    : <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: (f as any).dot, display: 'inline-block', flexShrink: 0 }}/>
                  }
                  {f.label}
                </button>
              ))}
            </div>

            {/* ── COURSE CARDS ── */}
            <div style={{ position: 'relative', marginBottom: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {courses.map((c, i) => {
                  const { Img } = c;
                  return (
                    <div
                      key={i}
                      className="c-card"
                      style={{
                        ...card(),
                        // Override card bg slightly for the illustration area
                      }}
                    >
                      {/* Illustration */}
                      <div style={{ position: 'relative', height: '160px', overflow: 'hidden', background: c.cardBg }}>
                        <Img/>
                        <div style={{
                          position: 'absolute', top: '11px', left: '12px',
                          padding: '4px 11px', borderRadius: '20px',
                          background: c.levelBg, border: `1px solid ${c.levelColor}35`,
                          fontSize: '11px', fontWeight: 700, color: c.levelColor,
                          backdropFilter: 'blur(6px)',
                        }}>{c.level}</div>
                        <div style={{
                          position: 'absolute', top: '9px', right: '11px',
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(0,0,0,0.42)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', cursor: 'pointer',
                        }}>🔖</div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '14px 16px 16px' }}>
                        <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'white', marginBottom: '7px', lineHeight: 1.3 }}>{c.title}</h3>
                        <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.40)', lineHeight: 1.58, marginBottom: '12px', minHeight: '52px' }}>{c.desc}</p>

                        {/* Meta */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          {[
                            { ic: '⊞', v: `${c.modules} Modules` },
                            { ic: '⏱', v: c.duration },
                            { ic: '📊', v: c.difficulty },
                          ].map((m, mi) => (
                            <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '10.5px', opacity: 0.40 }}>{m.ic}</span>
                              <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.34)', fontWeight: 500 }}>{m.v}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '11px' }}/>

                        {/* Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ display: 'flex' }}>
                              {avatars.map((url, ai) => (
                                <img key={ai} src={url} alt="" style={{
                                  width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover',
                                  border: '1.5px solid rgba(10,8,34,0.8)', marginLeft: ai === 0 ? 0 : '-7px',
                                }}/>
                              ))}
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.36)', fontWeight: 500 }}>{c.enrolled}</span>
                          </div>
                          <button
                            className="cbtn"
                            style={{
                              padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
                              border: c.btnFilled ? 'none' : '1px solid rgba(255,255,255,0.20)',
                              background: c.btnFilled ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'transparent',
                              color: 'white', fontSize: '12px', fontWeight: 600,
                              boxShadow: c.btnFilled ? '0 4px 14px rgba(124,58,237,0.36)' : 'none',
                              transition: 'filter 0.18s',
                            }}
                          >{c.btn}</button>
                        </div>

                        {/* Progress bar */}
                        {c.progress !== null && (
                          <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.34)' }}>Progress</span>
                              <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.34)', fontWeight: 600 }}>{c.progress}%</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '5px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${c.progress}%`, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: '6px' }}/>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Arrow */}
              <div style={{
                position: 'absolute', right: '-20px', top: '38%', transform: 'translateY(-50%)',
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(109,40,217,0.78)', border: '1px solid rgba(139,92,246,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', color: 'white', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(124,58,237,0.42)', zIndex: 10,
              }}>›</div>
            </div>

            {/* ── WHY LEARN ── */}
            <div style={{
              ...card({ padding: '24px 28px' }),
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#a78bfa' }}>
                Why Learn with Builder Geo?
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px' }}>
                {whyItems.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                      background: w.bg, border: `1px solid ${w.color}26`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: w.icon === '</>' ? '12px' : '18px', color: w.color, fontWeight: 700,
                    }}>{w.icon}</div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{w.title}</p>
                      <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.36)', margin: 0, lineHeight: 1.5 }}>{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>{/* end scrollable layer */}
      </div>{/* end root */}
    </>
  );
};

export default CoursesPage;