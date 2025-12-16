"use client";
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Dashboard = () => {
  const [hoveredSession, setHoveredSession] = useState<number | null>(null);

  const deviceMarkers = [
    { name: "New York, USA", coordinates: [-74.006, 40.7128] },
    { name: "Paris, France", coordinates: [2.3522, 48.8566] },
    { name: "São Paulo, Brazil", coordinates: [-46.6333, -23.5505] },
    { name: "Sydney, Australia", coordinates: [151.2093, -33.8688] },
  ];

  const sessions = [
    { name: "Harry Newton", location: "Manchester, UK", flag: "🇬🇧", device: "MacBook Pro", time: "2 hours ago" },
    { name: "Cory Felix", location: "Paris, France", flag: "🇫🇷", device: "iPhone 14", time: "5 hours ago" },
    { name: "Jonathan Grey", location: "New York, USA", flag: "🇺🇸", device: "iPad Pro", time: "1 day ago" },
    { name: "Alex Wright", location: "London, UK", flag: "🇬🇧", device: "MacBook Air", time: "2 days ago" },
    { name: "Emma Davis", location: "Sydney, AUS", flag: "🇦🇺", device: "iPhone 13", time: "3 days ago" },
  ];

  return (
    <div style={{
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
        <source src="/Earth.webm" type="video/webm" />
      </video>

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 1
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'transparent',
          padding: '16px 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>C</span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Crextio</h1>
            </div>

            <nav style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
              <a href="#" style={{ color: 'white', fontWeight: 500, textDecoration: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Dashboard</a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>News</a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Pricing</a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Hiring</a>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}>
                Devices
              </button>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }}>More</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }}>Apps</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }}>Camera</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }}>Browsers</button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>🔔</button>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>⚙️</button>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>👤</button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* Center - Large Map with Cards on Top */}
            <div style={{
              position: 'relative',
              height: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column'
            }}>
             

              {/* Top Device Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {/* MacBook Pro Card */}
                <div style={{
                  backgroundColor: 'transparent',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>💻</div>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>•••</button>
                  </div>
                  <h3 style={{ fontWeight: 600, color: 'white', fontSize: '13px', margin: '0 0 4px 0' }}>MacBook Pro</h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>2 Devices</p>
                </div>

                {/* iPhone Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>📱</div>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '14px' }}>•••</button>
                  </div>
                  <h3 style={{ fontWeight: 600, color: 'white', margin: '0 0 4px 0', fontSize: '13px' }}>iPhone 16 Pro</h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>1 Device</p>
                </div>

                {/* iPad Card */}
                <div style={{
                  backgroundColor: 'rgba(147, 51, 234, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '8px',
                  border: '1px solid rgba(147, 51, 234, 0.18)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'rgba(147, 51, 234, 0.45)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>📱</div>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer', fontSize: '14px' }}>•••</button>
                  </div>
                  <h3 style={{ fontWeight: 600, color: 'white', margin: '0 0 4px 0', fontSize: '13px' }}>iPad Pro</h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>1 Device</p>
                </div>

                {/* Directory Card */}
                <div style={{
                  backgroundColor: 'rgba(254, 243, 199, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '8px',
                  border: '1px solid rgba(254, 243, 199, 0.18)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <h3 style={{ fontWeight: 600, color: 'white', margin: '0 0 8px 0', fontSize: '13px' }}>Directory</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button style={{
                      fontSize: '11px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      textAlign: 'left',
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: 'white'
                    }}>One Drive</button>
                    <button style={{
                      fontSize: '11px',
                      backgroundColor: 'rgba(254, 243, 199, 0.18)',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      border: '1px solid rgba(254, 243, 199, 0.25)',
                      textAlign: 'left',
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: 'white'
                    }}>Insights</button>
                  </div>
                </div>
              </div>

              {/* Large Map Only */}
              <div style={{
                flex: 1,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(px)',
                WebkitBackdropFilter: 'blur(0px)',
                border: '1px solid rgba(255, 255, 255, 0)',
                borderRadius: '24px',
                padding: '10px',
                boxShadow: '0 8px 32px rgba(136, 103, 255, 0.14)',
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
                      center: [10, 45]
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="rgba(11, 0, 31, 0.74)"
                            stroke="rgba(169, 255, 195, 1)"
                            strokeWidth={0.5}
                          />
                        ))
                      }
                    </Geographies>
                    {deviceMarkers.map(({ name, coordinates }) => (
                      <Marker key={name} coordinates={coordinates}>
                        <circle r={12} fill="#00ff48ff" opacity="0.3" />
                        <circle r={6} fill="#00ff48ff" stroke="#fff" strokeWidth={2} />
                      </Marker>
                    ))}
                  </ComposableMap>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Security Status */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.15) 0%, rgba(254, 249, 231, 0.1) 50%, rgba(253, 230, 138, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(254, 243, 199, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '24px', marginTop: 0, fontSize: '16px' }}>Security status</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <circle cx="65" cy="65" r="55" stroke="rgba(255,255,255,0.15)" strokeWidth="12" fill="none" />
                      <circle
                        cx="65"
                        cy="65"
                        r="55"
                        stroke="rgba(31, 41, 55, 0.7)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="345"
                        strokeDashoffset="76"
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
                      <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>78%</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>High Risk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session History */}
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '16px', margin: 0 }}>Session History</h3>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>2/8</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {sessions.map((session, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        backgroundColor: hoveredSession === index ? 'rgba(55, 65, 81, 0.4)' : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={() => setHoveredSession(index)}
                      onMouseLeave={() => setHoveredSession(null)}
                    >
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(55, 65, 81, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        {session.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {session.name}
                        </p>
                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {session.device}
                        </p>
                      </div>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{session.flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;