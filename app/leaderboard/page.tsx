"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";

// ─────────────────────────────────────────────
// Ribbon SVG badge
// ─────────────────────────────────────────────
const RibbonBadge = ({ rank, size = 42 }: { rank: number; size?: number }) => {
  const colors: Record<number, { top: string; bottom: string }> = {
    1: { top: '#fcd34d', bottom: '#b45309' },
    2: { top: '#cbd5e1', bottom: '#475569' },
    3: { top: '#d97706', bottom: '#92400e' },
  };
  const c = colors[rank];
  const cx = size / 2;
  const r = size * 0.42;
  return (
    <svg width={size} height={size * 1.3} viewBox={`0 0 ${size} ${size * 1.3}`} fill="none">
      <defs>
        <linearGradient id={`rg-${rank}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="100%" stopColor={c.bottom} />
        </linearGradient>
        <filter id={`gs-${rank}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>
      <path
        d={`M${cx - r * 0.75} ${r * 1.6} L${cx - r * 1.05} ${size * 1.26} L${cx - r * 0.28} ${size * 1.02} L${cx} ${size * 0.9}`}
        fill={c.bottom} opacity="0.92"
      />
      <path
        d={`M${cx + r * 0.75} ${r * 1.6} L${cx + r * 1.05} ${size * 1.26} L${cx + r * 0.28} ${size * 1.02} L${cx} ${size * 0.9}`}
        fill={c.bottom} opacity="0.92"
      />
      <circle cx={cx} cy={cx} r={r} fill={`url(#rg-${rank})`} filter={`url(#gs-${rank})`} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" />
      <text
        x={cx} y={cx + size * 0.09}
        textAnchor="middle" fill="white"
        fontSize={size * 0.35} fontWeight="800"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
      >{rank}</text>
    </svg>
  );
};

// ─────────────────────────────────────────────
// Table Row
// ─────────────────────────────────────────────
const TableRow = ({
  user, index, total,
}: {
  user: {
    rank: number; username: string; avatar: string; title: string;
    level: number; tasksCompleted: number; accuracy: number;
    score: number; trend: string; trendValue: number; isCurrentUser?: boolean;
  };
  index: number; total: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const circumference = 2 * Math.PI * 14;
  const strokeDash = (user.accuracy / 100) * circumference;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 1fr 110px 160px 140px 120px 90px',
        padding: user.isCurrentUser ? '13px 18px' : '13px 28px',
        alignItems: 'center',
        backgroundColor: user.isCurrentUser
          ? 'rgba(109,40,217,0.20)'
          : hovered ? 'rgba(139,92,246,0.07)'
            : index % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent',
        borderBottom: index < total - 1 ? '1px solid rgba(255,255,255,0.045)' : 'none',
        border: user.isCurrentUser ? '1px solid rgba(139,92,246,0.38)' : undefined,
        borderRadius: user.isCurrentUser ? '10px' : undefined,
        margin: user.isCurrentUser ? '4px 8px' : undefined,
        transition: 'background-color 0.2s',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 700, color: user.isCurrentUser ? '#a78bfa' : 'rgba(255,255,255,0.85)' }}>
        {user.rank}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          border: user.isCurrentUser ? '2px solid rgba(139,92,246,0.7)' : '2px solid rgba(255,255,255,0.10)',
          background: '#111',
        }}>
          <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', margin: 0 }}>{user.username}</p>
          <p style={{ fontSize: '11px', color: user.isCurrentUser ? '#a78bfa' : 'rgba(255,255,255,0.38)', margin: 0, fontWeight: 500 }}>
            {user.title}
          </p>
        </div>
      </div>
      <div style={{
        display: 'inline-flex', padding: '4px 12px',
        backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: '20px',
        fontSize: '11.5px', fontWeight: 700, color: '#a78bfa',
        border: '1px solid rgba(139,92,246,0.28)', width: 'fit-content',
      }}>
        Lv. {user.level}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{user.tasksCompleted}</span>
        <span style={{ fontSize: '14px' }}>📚</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', width: '32px', height: '32px', flexShrink: 0 }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.07)" strokeWidth="3" fill="none" />
            <circle cx="16" cy="16" r="14" stroke="#7c3aed" strokeWidth="3" fill="none"
              strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{user.accuracy}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#a78bfa' }}>{user.score.toLocaleString()}</span>
        <span style={{ fontSize: '12px' }}>💎</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, fontSize: '13px',
        color: user.trend === 'up' ? '#10b981' : user.trend === 'down' ? '#ef4444' : 'rgba(255,255,255,0.35)',
      }}>
        {user.trend === 'up' && <><span>↑</span><span>{user.trendValue}</span></>}
        {user.trend === 'down' && <><span>↓</span><span>{user.trendValue}</span></>}
        {user.trend === 'neutral' && <span style={{ fontSize: '16px', fontWeight: 400 }}>—</span>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const LeaderboardPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all-time');

  const fetchLeaderboard = async () => {
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*");

  if (!submissions) return;

  let filtered = submissions;

  const now = new Date();

  // 🔥 FILTER LOGIC
  if (activeFilter === "this-week") {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    filtered = submissions.filter(s =>
      new Date(s.created_at) >= weekAgo
    );
  }

  if (activeFilter === "this-month") {
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    filtered = submissions.filter(s =>
      new Date(s.created_at) >= monthAgo
    );
  }

  // 🔥 GROUP USERS
  const userMap: any = {};

  filtered.forEach((s: any) => {
    const email = s.user_email;

    if (!userMap[email]) {
      userMap[email] = {
        username: email.split("@")[0],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        title: "Learner",
        totalScore: 0,
        totalSubmissions: 0,
        completed: 0,
      };
    }

    userMap[email].totalScore += s.score || 0;
    userMap[email].totalSubmissions += 1;

    if (s.score === 100) {
      userMap[email].completed += 1;
    }
  });

  let users = Object.values(userMap);

  users = users.map((u: any) => {
    const accuracy =
      u.totalSubmissions > 0
        ? Math.round((u.completed / u.totalSubmissions) * 100)
        : 0;

    return {
      username: u.username,
      avatar: u.avatar,
      title: u.title,
      level: Math.floor(u.completed / 3),
      tasksCompleted: u.completed,
      accuracy,
      score: u.totalScore,
      trend: "neutral",
      trendValue: 0,
      isCurrentUser:
        session?.user?.email &&
        session.user.email.split("@")[0] === u.username,
    };
  });

  // 🔥 SORT + RANK
  users.sort((a: any, b: any) => b.score - a.score);

  users = users.map((u: any, i: number) => ({
    ...u,
    rank: i + 1,
  }));

  setLeaderboardData(users);
};


  // Same as Dashboard — lock body scroll, video fills viewport
 useEffect(() => {
  fetchLeaderboard();
}, [activeFilter]);

useEffect(() => {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };
}, []);



return (
  <>
    <style>{`
        html, body { overflow: hidden !important; }

        @keyframes lb-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes lb-glow-gold {
          0%,100% { box-shadow: 0 0 22px rgba(251,191,36,0.20), 0 14px 40px rgba(0,0,0,0.50); }
          50%      { box-shadow: 0 0 40px rgba(251,191,36,0.44), 0 14px 40px rgba(0,0,0,0.50); }
        }
        .lb-float       { animation: lb-float 3.4s ease-in-out infinite; }
        .lb-gold-glow   { animation: lb-glow-gold 2.8s ease-in-out infinite; }
        .lb-nav:hover   { opacity: 1 !important; }
        .lb-icon:hover  { background: rgba(255,255,255,0.14) !important; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.32); border-radius: 4px; }
      `}</style>

    {/* ── Root: fixed full viewport ─────────────────────────────────────── */}
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ── Video background — identical to Dashboard ─────────────────── */}
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

      {/* ── Subtle dark overlay — lighter so video shows through ──────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(4,3,22,0.38) 0%, rgba(4,3,22,0.18) 40%, rgba(4,3,22,0.52) 100%)',
      }} />

      {/* ── Scrollable content layer ──────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        overflowY: 'auto', overflowX: 'hidden',
      }}>

        {/* ══════════════════════════════════════════════════════════════
              HEADER — pixel-identical to Dashboard
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              onClick={() => router.push('/dashboard')}>
              <img src="/NavLogo.png" alt="Buildor Geo"
                style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'white', letterSpacing: '0.2px' }}>
                Buildor Geo
              </span>
            </div>

            {/* Nav — same links + same style as Dashboard */}
            <nav style={{
              display: 'flex', gap: '28px',
              fontSize: '14px', fontWeight: 500,
              alignItems: 'center', color: 'white',
            }}>
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Learning Path', href: '#' },
                { name: 'Tasks', href: '/coding' },
                { name: 'Datasets', href: '#' },
                { name: 'Portfolio', href: '#' },
                { name: 'Leaderboard', href: '/leaderboard' },
                { name: 'Courses', href: '/courses' },
              ].map((item) => (
                <span
                  key={item.name}
                  className="lb-nav"
                  onClick={() => item.href !== '#' && router.push(item.href)}
                  style={{
                    cursor: 'pointer',
                    opacity: item.name === 'Leaderboard' ? 1 : 0.75,
                    fontWeight: item.name === 'Leaderboard' ? 600 : 500,
                    borderBottom: item.name === 'Leaderboard' ? '2px solid #8b5cf6' : '2px solid transparent',
                    paddingBottom: '3px',
                    transition: 'opacity 0.15s',
                  }}
                >
                  {item.name}
                </span>
              ))}
            </nav>

            {/* Icon buttons — 36px identical to Dashboard, 👤 → /profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {[
                { icon: '💬', route: null },
                { icon: '🔔', route: null },
                { icon: '⚙️', route: null },
                { icon: '👤', route: '/profile' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="lb-icon"
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
              MAIN — edge-to-edge, same padding/maxWidth as Dashboard
          ══════════════════════════════════════════════════════════════ */}
        <main style={{
          padding: '28px 32px 60px',
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>

          {/* Title */}
          <div style={{ marginBottom: '14px' }}>
            <h1 style={{
              fontSize: '42px', fontWeight: 800, margin: '0 0 4px', lineHeight: 1.05,
              background: 'linear-gradient(90deg, #67e8f9 0%, #818cf8 30%, #a78bfa 58%, #f472b6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              color: 'transparent', display: 'inline-block',
            }}>
              Leaderboard
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.48)', margin: 0 }}>
              Top performers in geospatial learning
            </p>
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '7px', marginBottom: '32px' }}>
            {[
              { id: 'all-time', label: 'All Time', icon: '📊' },
              { id: 'this-month', label: 'This Month', icon: '📅' },
              { id: 'this-week', label: 'This Week', icon: '📆' },
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
                  padding: '6px 16px',
                  backgroundColor: active ? 'rgba(139,92,246,0.26)' : 'rgba(255,255,255,0.07)',
                  border: active ? '1px solid rgba(139,92,246,0.52)' : '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '18px',
                  color: active ? 'white' : 'rgba(255,255,255,0.55)',
                  fontSize: '11.5px', fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  transition: 'all 0.18s',
                  backdropFilter: 'blur(8px)',
                }}>
                  <span style={{ fontSize: '10px' }}>{f.icon}</span>{f.label}
                </button>
              );
            })}
          </div>

          {/* ══ TOP 3 PODIUM ══ */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '12px',
            marginBottom: '36px',
          }}>
            {leaderboardData.slice(0, 3).map((p) => {
              const isFirst = p.rank === 1;
              const cardW = isFirst ? 220 : 190;
              const avatarSize = isFirst ? 82 : 66;
              const ribbonSize = isFirst ? 46 : 38;
              const ribbonOverhang = ribbonSize * 0.52;

              return (
                <div key={p.rank} style={{ position: 'relative', zIndex: isFirst ? 2 : 1 }}>

                  {/* Ribbon — centered, overlapping top edge */}
                  <div style={{
                    position: 'absolute',
                    top: -ribbonOverhang,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}>
                    <RibbonBadge rank={p.rank} size={ribbonSize} />
                  </div>

                  {/* Card — now transparent with backdrop blur */}
                  <div
                    className={isFirst ? 'lb-gold-glow' : ''}
                    style={{
                      width: `${cardW}px`,
                      paddingTop: `${ribbonOverhang + 10}px`,
                      paddingBottom: isFirst ? '20px' : '16px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      background: p.cardBg,
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      borderRadius: '14px',
                      border: p.cardBorder,
                      transform: isFirst ? 'translateY(-14px)' : 'translateY(0)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: isFirst
                        ? '0 0 22px rgba(251,191,36,0.18), 0 14px 40px rgba(0,0,0,0.40)'
                        : '0 6px 28px rgba(0,0,0,0.35)',
                    }}
                  >
                    {/* Avatar */}
                    <div className="lb-float" style={{
                      width: `${avatarSize}px`,
                      height: `${avatarSize}px`,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '10px',
                      flexShrink: 0,
                      border: `2.5px solid ${p.avatarBorder}`,
                      boxShadow: `${p.avatarGlow}, 0 5px 18px rgba(0,0,0,0.4)`,
                      background: '#111',
                    }}>
                      <img src={p.avatar} alt={p.username}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <h3 style={{
                      fontSize: isFirst ? '15px' : '13.5px', fontWeight: 700,
                      color: 'white', margin: '0 0 3px', textAlign: 'center',
                    }}>{p.username}</h3>

                    <p style={{
                      fontSize: '11px', color: p.titleColor, margin: '0 0 12px',
                      fontWeight: 600, letterSpacing: '0.3px',
                    }}>{p.title}</p>

                    <p style={{
                      fontSize: '9px', color: 'rgba(255,255,255,0.30)', margin: '0 0 3px',
                      textTransform: 'uppercase', letterSpacing: '1.4px', fontWeight: 700,
                    }}>Score</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{
                        fontSize: isFirst ? '24px' : '20px', fontWeight: 800,
                        color: p.scoreColor, letterSpacing: '-0.5px',
                      }}>{p.score.toLocaleString()}</span>
                      <span style={{ fontSize: '15px' }}>{isFirst ? '🏆' : '💎'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══ TABLE — also transparent ══ */}
          <div style={{
            backgroundColor: 'rgba(5,3,20,0.45)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.09)',
            overflow: 'hidden',
            boxShadow: '0 8px 44px rgba(0,0,0,0.35)',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '72px 1fr 110px 160px 140px 120px 90px',
              padding: '14px 28px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '10.5px', fontWeight: 700,
              color: 'rgba(255,255,255,0.30)',
              textTransform: 'uppercase', letterSpacing: '0.9px',
            }}>
              <div>Rank</div>
              <div>User</div>
              <div>Level</div>
              <div>Tasks Completed</div>
              <div>Accuracy</div>
              <div>Score</div>
              <div>Trend</div>
            </div>

            {leaderboardData.length === 0 ? (
              <p style={{ padding: 20, color: "white" }}>No data yet</p>
            ) : (
              leaderboardData.map((user, i) => (
                <TableRow key={user.rank} user={user} index={i} total={leaderboardData.length} />
              )))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '28px', textAlign: 'center',
            fontSize: '12.5px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic',
          }}>
            Keep learning, keep exploring. The map is yours! 🚀
          </div>
        </main>
      </div>{/* end scrollable layer */}
    </div>{/* end root */}
  </>
);
};

export default LeaderboardPage;