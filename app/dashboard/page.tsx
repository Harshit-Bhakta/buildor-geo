"use client";
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { motion } from "framer-motion";
import { cardFadeUp, cardSlideFromLeft, pageFade, staggerContainer } from "../animations/dashboardAnimation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";




const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const sessionRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  borderRadius: '12px',
  backgroundColor: 'rgba(55, 65, 81, 0.35)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  margin: 0,
};

const metaStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(255,255,255,0.55)',
  margin: 0,
};

// Card Component Styles
const cardBaseStyle: React.CSSProperties = {
  backgroundImage: 'url("/cards.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '16px',
  padding: '20px',
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
};

// GitHub Identity Card
const GitHubIdentityCard = ({ githubData }: { githubData: any }) => {
  const username = githubData?.user?.login || "Loading...";
  const totalRepos = githubData?.repos?.length || 0;
  const gisReposCount = githubData?.gisRepos?.length || 0;
  const avatarUrl = githubData?.user?.avatar_url;

  return (
    <div style={{ ...cardBaseStyle, backgroundColor: 'rgba(17, 24, 39, 0.95)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>GitHub Identity</h3>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '18px' }}>•••</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="GitHub Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        )}
        <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{username}</h4>
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        marginBottom: '16px',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <span style={{ color: '#10b981' }}>✓</span>
        <span style={{ color: '#10b981', fontWeight: 500 }}>Connected via GitHub</span>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>{totalRepos}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Public Repos</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>{gisReposCount}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Geospatial Projects Detected</div>
        </div>
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: '8px'
      }}>
        <span>✓</span>
        <span>Verified Account</span>
      </div>
    </div>
  );
};

// Active Learning Track Card
const ActiveLearningTrackCard = () => {
  return (
    <div style={{ ...cardBaseStyle, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '12px' }}>📊</span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Active Learning Track</h3>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '18px' }}>•••</button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
          Coordinate Reference Systems
        </div>

        {/* Progress Circle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="264"
                strokeDashoffset="100.32"
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>62%</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '6px' }}>
          Next Task
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
          Clip Land Use With Lakes
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
          Intersect land use polygons with lake polygons...
        </div>
      </div>
    </div>
  );
};

//Geospatial Card
const GeospatialTasksCard = () => {
  return (
    <div
      style={{
        ...cardBaseStyle,
        backgroundColor: 'rgba(17, 24, 39, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background:
                'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            🌍
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
            Geospatial Tasks
          </h3>
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {/* Illustration */}
      <div
        style={{
          height: '110px',
          borderRadius: '12px',
          background:
            'radial-gradient(circle at top right, rgba(99,102,241,0.35), rgba(0,0,0,0.25))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            filter: 'drop-shadow(0 10px 25px rgba(99,102,241,0.6))',
          }}
        >
          🗺️
        </div>
      </div>

      {/* Tasks Due */}
      <div style={{ marginBottom: '10px' }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          3 Tasks Due
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <div>📊 Analyze Heatmaps</div>
          <div>🧭 Update Boundaries</div>
          <div>🛰️ Process Lidar Data</div>
        </div>
      </div>
    </div>
  );
};


// Dataset Library Card
const DatasetLibraryCard = () => {
  return (
    <div style={{ ...cardBaseStyle, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '12px' }}>📁</span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Dataset Library</h3>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '18px' }}>•••</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            📚
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>12</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Built-in Datasets</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            📤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>5</div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Uploaded Datasets</div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
          Recent -
        </div>
        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflow: 'hidden',

            /* 🌄 Background image */
            backgroundImage: 'url("/image.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',

            /* overlay to keep text readable */
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            backgroundBlendMode: 'overlay',
          }}
        >


          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '2px' }}>
              Flood Mapping
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
              Kerala Rivers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skill Validation Score Card
const SkillValidationScoreCard = () => {
  return (
    <div style={{ ...cardBaseStyle, backgroundColor: 'rgba(139, 92, 246, 0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '12px' }}>🎯</span>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Skill Validation Score</h3>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '18px' }}>•••</button>
      </div>

      {/* Circular Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
            <circle
              cx="70"
              cy="70"
              r="60"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray="377"
              strokeDashoffset="83"
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '40px', fontWeight: 'bold', color: 'white' }}>78%</span>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>High Risk</span>
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        Moderate Guidance Needed
      </div>
    </div>
  );
};

const SessionHistoryCard = () => {
  return (
    <div
      style={{
        ...cardBaseStyle,
        backgroundColor: 'rgba(17, 24, 39, 0.65)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
            Session History
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
            }}
          >
            Recent activity
          </p>
        </div>

        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
          Last 3
        </span>
      </div>

      {/* Sessions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Completed */}
        <div style={sessionRowStyle}>
          <span style={{ fontSize: '16px' }}>✅</span>
          <div style={{ flex: 1 }}>
            <p style={titleStyle}>CRS Practice</p>
            <p style={metaStyle}>12 Sep · 18 min</p>
          </div>
        </div>

        {/* In Progress */}
        <div
          style={{
            ...sessionRowStyle,
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
          }}
        >
          <span style={{ fontSize: '16px' }}>⏳</span>
          <div style={{ flex: 1 }}>
            <p style={titleStyle}>Flood Mapping</p>
            <p style={metaStyle}>11 Sep · 24 min</p>
          </div>
          <button
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.25)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Resume
          </button>
        </div>

        {/* Failed */}
        <div style={{ ...sessionRowStyle, opacity: 0.7 }}>
          <span style={{ fontSize: '16px' }}>❌</span>
          <div style={{ flex: 1 }}>
            <p style={titleStyle}>Land Use Classification</p>
            <p style={metaStyle}>10 Sep · 15 min</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        Weak area detected: <strong>Coordinate Transformations</strong>
      </div>
    </div>
  );
};


const Dashboard = () => {

  useEffect(() => {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };
}, []);

  const [hoveredSession, setHoveredSession] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [githubData, setGithubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const deviceMarkers: { name: string; coordinates: [number, number] }[] = [
    { name: "Anchorage, Alaska", coordinates: [-149.9003, 61.2181] },
    { name: "New York, USA", coordinates: [-74.006, 40.7128] },
    { name: "São Paulo, Brazil", coordinates: [-46.6333, -23.5505] },
    { name: "Paris, France", coordinates: [2.3522, 48.8566] },
    { name: "Bagdogra, India", coordinates: [88.3117, 26.6812] },
    { name: "Sydney, Australia", coordinates: [151.2093, -33.8688] },
    { name: "Wellington, New Zealand", coordinates: [174.7762, -41.2865] },
  ];

  const [visibleSegments, setVisibleSegments] = useState<number>(0);
  // Authentication check and GitHub data fetch
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard");
    }

    if (session?.accessToken) {
      fetchGitHubData();
    }
  }, [status, session, router]);

  const fetchGitHubData = async () => {
    try {
      setLoading(true);

      const reposResponse = await fetch(
        "https://api.github.com/user/repos?per_page=100",
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const repos = await reposResponse.json();

      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const userData = await userResponse.json();

      // Detect GIS repositories
      const gisRepos = repos.filter((repo: any) => {
        const topics = repo.topics || [];
        const description = (repo.description || "").toLowerCase();
        const name = repo.name.toLowerCase();

        const gisKeywords = [
          'gis', 'geospatial', 'mapping', 'leaflet', 'openlayers',
          'mapbox', 'geopandas', 'shapely', 'postgis', 'gdal',
          'qgis', 'arcgis', 'spatial', 'coordinates', 'geodata'
        ];

        return (
          topics.some((topic: string) => gisKeywords.includes(topic.toLowerCase())) ||
          gisKeywords.some(keyword => description.includes(keyword) || name.includes(keyword))
        );
      });

      setGithubData({
        repos,
        gisRepos,
        user: userData,
      });
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (visibleSegments < deviceMarkers.length - 1) {
      const timer = setTimeout(() => {
        setVisibleSegments(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [visibleSegments]);



  const sessions = [
    { name: "Harry Newton", location: "Manchester, UK", flag: "🇬🇧", device: "MacBook Pro", time: "2 hours ago" },
    { name: "Cory Felix", location: "Paris, France", flag: "🇫🇷", device: "iPhone 14", time: "5 hours ago" },
    { name: "Jonathan Grey", location: "New York, USA", flag: "🇺🇸", device: "iPad Pro", time: "1 day ago" },
    { name: "Alex Wright", location: "London, UK", flag: "🇬🇧", device: "MacBook Air", time: "2 days ago" },
    { name: "Emma Davis", location: "Sydney, AUS", flag: "🇦🇺", device: "iPhone 13", time: "3 days ago" },
  ];

  return (
    <motion.div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      zIndex: 9999
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: -1
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <style jsx global>{`
  @keyframes draw-line {
    from {
      stroke-dashoffset: 1000;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`}</style>


      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 1
      }}>
        {/* Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '18px 32px',

            /* keep whatever background you already have */
            backgroundColor: 'rgba(10, 15, 30, 0.6)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 6px 20px rgba(2, 3, 87, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* 🔹 HEADER INNER CONTAINER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '1600px',
              margin: '0 auto',
            }}
          >

            {/* ================= LEFT : LOGO ================= */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src="/NavLogo.png"
                alt="Buildor Geo Logo"
                style={{
                  height: '40px',
                  width: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer',
                }}
                onClick={() => window.location.href = '/coding'}
              />

              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  letterSpacing: '0.2px',
                  color: 'white',
                }}
              >
                Buildor Geo
              </span>
            </div>

            {/* ================= CENTER : NAV LINKS ================= */}
            <nav
              style={{
                display: 'flex',
                gap: '28px',
                fontSize: '14px',
                fontWeight: 500,
                alignItems: 'center',
                color: 'white',
              }}
            >
              {[
                'Dashboard',
                'Learning Path',
                'Tasks',
                'Datasets',
                'Portfolio',
                'Insights',
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    cursor: 'pointer',
                    opacity: item === 'Dashboard' ? 1 : 0.75,
                    fontWeight: item === 'Dashboard' ? 600 : 500,
                  }}
                >
                  {item}
                </span>
              ))}
            </nav>

            {/* ================= RIGHT : ICON BUTTONS ================= */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {['💬', '🔔', '⚙️', '👤'].map((icon, i) => (
                <div
                  key={i}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>

          </div>
        </header>


        {/* Main Content */}
        <main style={{ padding: '32px 32px 32px 32px', maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* Center - Large Map with Cards on Top */}
            <div style={{
              position: 'relative',
              height: 'calc(120vh)',
              display: 'flex',
              flexDirection: 'column'
            }}>

              {/* NEW TOP CARDS - REPLACED */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <motion.div variants={cardSlideFromLeft}>
                  {loading ? (
                    <div style={{ ...cardBaseStyle, backgroundColor: 'rgba(17, 24, 39, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                      <div style={{ color: 'white', fontSize: '14px' }}>Loading GitHub data...</div>
                    </div>
                  ) : (
                    <GitHubIdentityCard githubData={githubData} />
                  )}
                </motion.div>

                <motion.div variants={cardSlideFromLeft}>
                  <ActiveLearningTrackCard />
                </motion.div>

                <motion.div variants={cardSlideFromLeft}>
                  <DatasetLibraryCard />
                </motion.div>

                <motion.div variants={cardSlideFromLeft}>
                  <GeospatialTasksCard />
                </motion.div>
              </motion.div>



              {/* Large Map Only */}
              <div style={{
                flex: 1,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(px)',
                WebkitBackdropFilter: 'blur(0px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                padding: '10px',
                boxShadow: '0 8px 32px rgba(136, 103, 255, 0.22)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 147,
                      center: [10, 45],
                    }}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="rgba(6, 0, 51, 0.51)"
                            stroke="rgba(169, 255, 195, 1)"
                            strokeWidth={0.5}
                          />
                        ))
                      }
                    </Geographies>
                    {/* Animated connecting lines */}
                    {/* Animated connecting lines */}
                    {deviceMarkers.slice(0, visibleSegments + 1).map((marker, index) => {
                      if (index === 0) return null;
                      const prevMarker = deviceMarkers[index - 1];
                      const isNewest = index === visibleSegments;
                      return (
                        <Line
                          key={`line-${index}`}
                          from={prevMarker.coordinates}
                          to={marker.coordinates}
                          stroke="#00ff48"
                          strokeWidth={2}
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: isNewest ? "1000" : "none",
                            strokeDashoffset: isNewest ? "1000" : "0",
                            animation: isNewest ? "draw-line 5.2s ease-out forwards" : "none",
                          }}
                        />
                      );
                    })}

                    {/* MARKERS */}
                    {deviceMarkers.map((marker, index) => {
                      const isStart = index === 0;
                      const isEnd = index === deviceMarkers.length - 1;

                      return (
                        <Marker key={marker.name} coordinates={marker.coordinates}>
                          {/* Base green marker */}
                          <circle r={12} fill="#00ff48" opacity={0.25} />
                          <circle r={6} fill="#00ff48" stroke="#ffffff" strokeWidth={2} />

                          {/* Floating location icon on START and END */}
                          {(isStart || isEnd) && (
                            <image
                              href="/location.png"
                              x={-18}
                              y={-44}
                              width={36}
                              height={36}
                              preserveAspectRatio="xMidYMid meet"
                            >
                              {/* 🌊 Floating animation */}
                              <animateTransform
                                attributeName="transform"
                                type="translate"
                                from="0 0"
                                to="0 -6"
                                dur="1.6s"
                                repeatCount="indefinite"
                                direction="alternate"
                              />
                            </image>
                          )}
                        </Marker>
                      );
                    })}


                  </ComposableMap>

                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SkillValidationScoreCard />
              <SessionHistoryCard />
            </div>

          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default Dashboard;