"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

// ── Canvas line chart ─────────────────────────────────────────────────────────
const ActivityChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = Array(14).fill(0);
  const labels = ['May 1', 'May 8', 'May 15', 'May 22', 'May 29', 'Jun 5'];

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);


    const padL = 44, padR = 18, padT = 12, padB = 34;
    const cw = w - padL - padR;
    const ch = h - padT - padB;

    [0, 20, 40, 60, 80, 100].forEach((v) => {
      const y = padT + ch - (v / 100) * ch;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + cw, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.font = '11px -apple-system,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(v), padL - 7, y + 4);
    });

    const xStep = cw / (labels.length - 1);
    labels.forEach((l, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.font = '11px -apple-system,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(l, padL + i * xStep, h - 6);
    });

    const pts = data.map((v, i) => ({
      x: padL + (i / (data.length - 1)) * cw,
      y: padT + ch - (v / 100) * ch,
    }));

    const grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
    grad.addColorStop(0, 'rgba(124,58,237,0.42)');
    grad.addColorStop(1, 'rgba(124,58,237,0.0)');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, padT + ch);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, padT + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.8, 0, Math.PI * 2);
      ctx.fillStyle = '#6d28d9';
      ctx.fill();
      ctx.strokeStyle = '#c4b5fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

// ── Main Profile Page ─────────────────────────────────────────────────────────
const ProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  // ── Editable profile data state ──────────────────────────────────────────
  const [profileData, setProfileData] = useState<any>({
    name: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    aboutMe: "",
    interests: "",
    goals: "",
  });


  const fetchProfile = async () => {
    if (!session?.user?.email) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();

    if (data) {
      setProfileData({
        name: data.name || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
        aboutMe: data.about_me || "",
        interests: data.interests || "",
        goals: data.goals || "",
      });
    }

    setLoading(false);
  };

  // ── Edit modal state ─────────────────────────────────────────────────────
  const [editModal, setEditModal] = useState<{
    key: string;
    label: string;
    value: string;
    type: 'text' | 'textarea';
  } | null>(null);

  const openEdit = (
    key: string,
    label: string,
    value: string,
    type: 'text' | 'textarea' = 'text'
  ) => {
    setEditModal({ key, label, value, type });
  };

  const saveEdit = async () => {
    if (!editModal || !session?.user?.email) return;

    const updatedData = {
      ...profileData,
      [editModal.key]: editModal.value,
    };

    setProfileData(updatedData);

    // 🔥 SAVE TO SUPABASE
    await supabase
      .from("users")
      .update({
        [editModal.key === "aboutMe"
          ? "about_me"
          : editModal.key]: editModal.value,
      })
      .eq("email", session.user.email);

    setEditModal(null);
  };

  // Same as Dashboard — lock body scroll, video fills viewport
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchStats();   // ✅ ADD THIS
    }
  }, [session]);
  // ── More transparent cards (reduced alpha from 0.84 → 0.45) ──────────────
  const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: 'rgba(10,8,34,0.45)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '14px',
    ...extra,
  });

  // Same nav items as Dashboard
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Learning Path', href: '#' },
    { name: 'Tasks', href: '/coding' },
    { name: 'Datasets', href: '#' },
    { name: 'Portfolio', href: '#' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Courses', href: '/courses' },
  ];

  const [stats, setStats] = useState({
    skillScore: 0,
    tasksCompleted: 0,
    accuracy: 0,
  });

  const fetchStats = async () => {
    if (!session?.user?.email) return;

    // 🔹 fetch submissions
    const { data: submissions } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_email", session.user.email);

    if (!submissions || submissions.length === 0) {
      setStats({
        skillScore: 0,
        tasksCompleted: 0,
        accuracy: 0,
      });
      setActivity([]);
      return;
    }

    // 🔹 calculate stats
    const total = submissions.length;
    const completed = submissions.filter(s => s.score === 100).length;
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0);

    const accuracy = Math.round((completed / total) * 100);
    const skillScore = Math.round(totalScore / total);

    setStats({
      skillScore,
      tasksCompleted: completed,
      accuracy,
    });

    // 🔹 recent activity (latest 5)
    const recent = submissions.slice(-5).reverse().map((s) => ({
      icon: "🧠",
      bg: "rgba(139,92,246,0.18)",
      title: s.task_id,
      sub: s.status,
      score: `${s.score}%`,
      time: new Date(s.created_at).toLocaleDateString(),
    }));

    setActivity(recent);
  };

  const achievements = [
    { icon: '⭐', bg: 'rgba(139,92,246,0.18)', title: 'First Steps', sub: 'Completed your first task', date: 'May 12, 2024' },
    { icon: '🗂️', bg: 'rgba(34,211,238,0.12)', title: 'Data Explorer', sub: 'Explored 10 Datasets', date: 'May 18, 2024' },
    { icon: '🏆', bg: 'rgba(251,191,36,0.15)', title: 'Task Master', sub: 'Completed 20 Tasks', date: 'May 30, 2024' },
    { icon: '🎯', bg: 'rgba(6,182,212,0.14)', title: 'Accuracy Pro', sub: 'Achieved 85% accuracy', date: 'Jun 2, 2024' },
  ];

  const [activity, setActivity] = useState<any[]>([]);

  // ── Dynamic links array reading from profileData ─────────────────────────
  const links = [
    { icon: '👤', label: 'Name', value: profileData.name, pencil: true, editKey: 'name', editType: 'text' as const },
    { icon: '📝', label: 'Bio', value: profileData.bio, pencil: true, editKey: 'bio', editType: 'textarea' as const },
    { icon: '📍', label: 'Location', value: profileData.location, pencil: true, editKey: 'location', editType: 'text' as const },
    { icon: '🌐', label: 'Website', value: profileData.website, link: true, editKey: 'website', editType: 'text' as const },
    { icon: '🐙', label: 'GitHub', value: profileData.github, editKey: 'github', editType: 'text' as const },
    { icon: '💼', label: 'LinkedIn', value: profileData.linkedin || 'Add your LinkedIn', add: !profileData.linkedin, editKey: 'linkedin', editType: 'text' as const },
    { icon: '🐦', label: 'Twitter / X', value: profileData.twitter || 'Add your Twitter', add: !profileData.twitter, editKey: 'twitter', editType: 'text' as const },
  ];

  const progress = [
  {
    icon: '🔮',
    bg: 'rgba(139,92,246,0.16)',
    label: 'Problems Solved',
    value: `${stats.tasksCompleted}`,
  },
  {
    icon: '📚',
    bg: 'rgba(59,130,246,0.14)',
    label: 'Datasets Explored',
    value: '0',
  },
  {
    icon: '⏱️',
    bg: 'rgba(6,182,212,0.13)',
    label: 'Time Spent',
    value: `${activity.length * 10}m`,
  },
  {
    icon: '🔥',
    bg: 'rgba(251,146,60,0.16)',
    label: 'Streak',
    value: `${stats.tasksCompleted} Days`,
  },
];  

  return (
    <>
      <style>{`
        html, body { overflow: hidden !important; }
        .pnav:hover  { opacity: 1 !important; }
        .prow:hover  { background: rgba(139,92,246,0.09) !important; }
        .pbtn:hover  { filter: brightness(1.14); }
        .picon:hover { background: rgba(255,255,255,0.14) !important; }
        .edit-input:focus { border-color: rgba(139,92,246,0.60) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.32); border-radius: 4px; }
      `}</style>

      {/* ── Root: fixed, full viewport ─────────────────────────────────────── */}
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

        {/* ── Subtle dark overlay ───────────────────────────────────────── */}
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
              HEADER
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
                    className="pnav"
                    onClick={() => item.href !== '#' && router.push(item.href)}
                    style={{
                      cursor: 'pointer',
                      opacity: item.name === 'Dashboard' ? 1 : 0.75,
                      fontWeight: item.name === 'Dashboard' ? 600 : 500,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </nav>

              {/* Icon buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {[
                  { icon: '💬', route: null },
                  { icon: '🔔', route: null },
                  { icon: '⚙️', route: null },
                  { icon: '👤', route: '/profile' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="picon"
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
            padding: '24px 32px 48px',
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr 296px',
              gap: '18px',
              alignItems: 'start',
            }}>

              {/* ════════════════════════════════
                  COL 1 — LEFT SIDEBAR (untouched)
              ════════════════════════════════ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Profile card — untouched */}
                <div style={{
                  ...card({ padding: '24px 20px 20px', border: '1px solid rgba(99,102,241,0.20)' }),
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <div style={{ position: 'relative', marginBottom: '13px' }}>
                    <div style={{
                      width: '96px', height: '96px', borderRadius: '50%', overflow: 'hidden',
                      border: '2.5px solid rgba(124,58,237,0.72)',
                      boxShadow: '0 0 26px rgba(124,58,237,0.30)',
                    }}>
                      <img src={session?.user?.image || "/default-avatar.png"} alt="avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '2px', right: '2px',
                      width: '23px', height: '23px', borderRadius: '50%',
                      background: '#7c3aed', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}>✏️</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'white' }}><h2>
                      {profileData?.name && profileData.name.trim() !== ""
                        ? profileData.name
                        : session?.user?.name || "User"}
                    </h2></span>
                    <span style={{ fontSize: '13px', color: '#60a5fa' }}>✔</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px' }}>💎</span>
                    <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.52)', fontWeight: 500 }}>Geo Explorer</span>
                  </div>
                  <button className="pbtn" style={{
                    width: '100%', padding: '8px 0',
                    background: 'rgba(109,40,217,0.20)',
                    border: '1px solid rgba(139,92,246,0.40)',
                    borderRadius: '22px', color: 'white',
                    fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    transition: 'filter 0.18s',
                  }}>✏️ Edit Profile</button>
                </div>

                {/* Links card — now editable */}
                <div style={{ ...card({ padding: '14px' }) }}>
                  {links.map((l, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '16px 68px 1fr auto',
                      gap: '7px', alignItems: 'flex-start',
                      padding: '8px 2px',
                      borderBottom: i < links.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      <span style={{ fontSize: '11px', marginTop: '1px', opacity: 0.65 }}>{l.icon}</span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>{l.label}</span>
                      <span style={{
                        fontSize: '11px', lineHeight: 1.4, wordBreak: 'break-all',
                        color: (l as any).link ? '#818cf8' : (l as any).add ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.75)',
                        fontWeight: 500,
                      }}>{l.value}</span>
                      {(l as any).pencil && (
                        <span
                          onClick={() => openEdit(l.editKey, l.label, l.value, l.editType)}
                          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}
                        >✏️</span>
                      )}
                      {(l as any).add && (
                        <span
                          onClick={() => openEdit(l.editKey, l.label, '', l.editType)}
                          style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontWeight: 600 }}
                        >Add</span>
                      )}
                      {!(l as any).pencil && !(l as any).add && (
                        <span
                          onClick={() => openEdit(l.editKey, l.label, l.value, l.editType)}
                          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}
                        >✏️</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Joined card */}
                <div style={{ ...card({ padding: '13px 15px' }), display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <div style={{
                    width: '35px', height: '35px', borderRadius: '9px', flexShrink: 0,
                    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
                  }}>📅</div>
                  <div>
                    <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.36)', margin: '0 0 1px', fontWeight: 500 }}>Account Joined</p>
                    <p style={{ fontSize: '13px', color: 'white', margin: 0, fontWeight: 600 }}>{session?.user ? new Date().toDateString() : "—"}</p>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════
                  COL 2 — CENTER
              ════════════════════════════════ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    {
                      icon: '🔷',
                      bg: 'rgba(139,92,246,0.18)',
                      label: 'Skill Score',
                      val: `${stats.skillScore}%`,
                      trend: 'Start learning',
                    },
                    {
                      icon: '📚',
                      bg: 'rgba(59,130,246,0.15)',
                      label: 'Tasks Completed',
                      val: `${stats.tasksCompleted}`,
                      trend: 'No activity yet',
                    },
                    {
                      icon: '📊',
                      bg: 'rgba(16,185,129,0.14)',
                      label: 'Accuracy',
                      val: `${stats.accuracy}%`,
                      trend: 'Start solving tasks',
                    },
                  ].map((s, i) => (
                    <div key={i} style={{ ...card({ padding: '15px 16px' }) }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                          background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
                        }}>{s.icon}</div>
                        <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: '28px', fontWeight: 800, color: 'white', margin: '0 0 3px', lineHeight: 1 }}>{s.val}</p>
                      <p style={{ fontSize: '11px', color: '#10b981', margin: 0, fontWeight: 600 }}>{s.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div style={{ ...card({ padding: '16px 16px 12px' }) }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'white' }}>Learning Activity</span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '8px', padding: '5px 10px',
                    }}>
                      <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.72)' }}>This Month</span>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.38)' }}>▾</span>
                    </div>
                  </div>
                  <div style={{ height: '195px' }}><ActivityChart /></div>
                </div>

                {/* Recent Activity */}
                <div style={{ ...card({ padding: '16px' }) }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'white' }}>Recent Activity</span>
                    <span style={{ fontSize: '11.5px', color: '#8b5cf6', cursor: 'pointer', fontWeight: 600 }}>View All</span>
                  </div>
                  {activity.length === 0 ? (
                    <p style={{ color: "#aaa", fontSize: "12px" }}>
                      No activity yet
                    </p>
                  ) : (
                    activity.map((a, i) => (
                      <div key={i} className="prow" style={{
                        display: 'grid', gridTemplateColumns: '30px 1fr auto auto',
                        gap: '10px', alignItems: 'center',
                        padding: '9px 5px', borderRadius: '8px', cursor: 'pointer',
                        borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        transition: 'background 0.15s',
                      }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                          background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
                        }}>{a.icon}</div>
                        <div>
                          <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'white', margin: 0 }}>{a.title}</p>
                          <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.36)', margin: 0 }}>{a.sub}</p>
                        </div>
                        <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.52)', whiteSpace: 'nowrap' }}>{a.score}</span>
                        <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.32)', whiteSpace: 'nowrap' }}>{a.time}</span>
                      </div>
                    )))}
                </div>

                {/* Detailed Progress */}
                <div style={{ ...card({ padding: '16px' }) }}>
                  <p style={{ fontSize: '14.5px', fontWeight: 700, color: 'white', margin: '0 0 13px' }}>Detailed Progress</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '9px' }}>
                    {progress.map((p, i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '11px', padding: '13px 11px',
                        display: 'flex', flexDirection: 'column', gap: '8px',
                      }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', margin: 0, fontWeight: 500 }}>{p.label}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{p.value}</span>
                          <div style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
                          }}>{p.icon}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════
                  COL 3 — RIGHT SIDEBAR
              ════════════════════════════════ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Current Level */}
                <div style={{ ...card({ padding: '16px 16px 14px' }) }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '13px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                      background: 'rgba(251,146,60,0.18)', border: '1px solid rgba(251,146,60,0.26)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px',
                    }}>⚙️</div>
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', margin: '0 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Current Level</p>
                      <p style={{ fontSize: '22px', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1 }}><p style={{ fontSize: '22px', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1 }}>
                        {stats.tasksCompleted === 0
                          ? "Basic"
                          : stats.tasksCompleted < 5
                            ? "Beginner"
                            : stats.tasksCompleted < 15
                              ? "Intermediate"
                              : "Advanced"}
                      </p></p>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '8px', height: '7px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ height: '100%', width: '69%', background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', borderRadius: '8px' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.36)', margin: 0, textAlign: 'right', fontWeight: 500 }}>1,250 / 1,800 XP</p>
                </div>

                {/* Achievements */}
                <div style={{ ...card({ padding: '15px' }) }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '11px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Achievements</span>
                    <span style={{ fontSize: '11px', color: '#8b5cf6', cursor: 'pointer', fontWeight: 600 }}>View All</span>
                  </div>
                  {achievements.map((a, i) => (
                    <div key={i} className="prow" style={{
                      display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: '9px', alignItems: 'center',
                      padding: '8px 3px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s',
                      borderBottom: i < achievements.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                        background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                      }}>{a.icon}</div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: 'white', margin: 0 }}>{a.title}</p>
                        <p style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.36)', margin: 0 }}>{a.sub}</p>
                      </div>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.26)', whiteSpace: 'nowrap' }}>{a.date}</span>
                    </div>
                  ))}
                </div>

                {/* About Me / Interests / Goals — editable */}
                {[
                  { title: 'About Me', key: 'aboutMe', ph: 'Tell others about yourself, your goals,\ninterests and what you love about geospatial!' },
                  { title: 'Interests', key: 'interests', ph: 'Add your interests (e.g. Remote Sensing,\nGIS, Machine Learning, etc.)' },
                  { title: 'Goals', key: 'goals', ph: 'What are your learning goals?\nShort term or long term.' },
                ].map((s, i) => {
                  const currentVal = profileData[s.key as keyof typeof profileData] as string;
                  return (
                    <div key={i} style={{ ...card({ padding: '15px' }) }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{s.title}</span>
                        <span
                          onClick={() => openEdit(s.key, s.title, currentVal, 'textarea')}
                          style={{ fontSize: '11px', color: '#8b5cf6', cursor: 'pointer', fontWeight: 600 }}
                        >{currentVal ? 'Edit' : 'Add'}</span>
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.065)',
                        borderRadius: '10px', padding: '11px 13px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                      }}>
                        <p style={{
                          fontSize: '11.5px',
                          color: currentVal ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.36)',
                          margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line',
                        }}>
                          {currentVal || s.ph}
                        </p>
                        <span
                          onClick={() => openEdit(s.key, s.title, currentVal, 'textarea')}
                          style={{ fontSize: '18px', color: 'rgba(255,255,255,0.22)', cursor: 'pointer', flexShrink: 0 }}
                        >＋</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </main>
        </div>{/* end scrollable layer */}

        {/* ══════════════════════════════════════════════════════════════
            EDIT MODAL — centered overlay
        ══════════════════════════════════════════════════════════════ */}
        {editModal && (
          <div
            onClick={() => setEditModal(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(0,0,0,0.65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'rgba(16,12,48,0.98)',
                border: '1px solid rgba(139,92,246,0.35)',
                borderRadius: '16px',
                padding: '28px 28px 24px',
                width: '420px',
                maxWidth: '90vw',
                boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
              }}
            >
              {/* Modal header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>
                  Edit {editModal.label}
                </span>
                <div
                  onClick={() => setEditModal(null)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', color: 'rgba(255,255,255,0.55)',
                    transition: 'background 0.15s',
                  }}
                >✕</div>
              </div>

              {/* Input */}
              {editModal.type === 'textarea' ? (
                <textarea
                  autoFocus
                  className="edit-input"
                  value={editModal.value}
                  onChange={e => setEditModal(prev => prev ? { ...prev, value: e.target.value } : null)}
                  placeholder={`Enter ${editModal.label}...`}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(139,92,246,0.28)',
                    borderRadius: '10px', color: 'white',
                    fontSize: '13px', padding: '12px 14px',
                    resize: 'vertical', minHeight: '110px',
                    outline: 'none', fontFamily: 'inherit',
                    lineHeight: 1.6,
                    transition: 'border-color 0.15s',
                  }}
                />
              ) : (
                <input
                  autoFocus
                  type="text"
                  className="edit-input"
                  value={editModal.value}
                  onChange={e => setEditModal(prev => prev ? { ...prev, value: e.target.value } : null)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  placeholder={`Enter ${editModal.label}...`}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(139,92,246,0.28)',
                    borderRadius: '10px', color: 'white',
                    fontSize: '13px', padding: '11px 14px',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                />
              )}

              {/* Helper text */}
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', margin: '8px 0 0', fontWeight: 500 }}>
                {editModal.type === 'text' ? 'Press Enter to save quickly.' : 'Click Save Changes when done.'}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                <button
                  onClick={saveEdit}
                  className="pbtn"
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '22px',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.88), rgba(109,40,217,0.92))',
                    border: '1px solid rgba(139,92,246,0.50)',
                    color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    transition: 'filter 0.18s',
                  }}
                >Save Changes</button>
                <button
                  onClick={() => setEditModal(null)}
                  style={{
                    padding: '10px 22px', borderRadius: '22px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '13px', cursor: 'pointer',
                  }}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>{/* end root */}
    </>
  );
};

export default ProfilePage;