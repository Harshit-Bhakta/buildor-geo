"use client";
import React, { useState, useEffect } from "react";

const CodingPage = () => {

      useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const [activeTab, setActiveTab] = useState('editor.py');
  const [code] = useState(`import geopandas as gpd
import rasterio
from rasterio.plot import show
import matplotlib.pyplot as plt

# File paths to flood datasets
rivers_fp = 'datasets/r/Kerala_Rivers geojson'
flood_zones_fp = 'datasets/Kerala_Flood_zones.tif'

# Load datasets
rivers = gpd. read_file(rivers_fp)
flood_zones = rasterio.open(flood_zone_fp)

# Plot the datasets
fig, ax = plt.subplots(figsize=('12, 8'))
show('flood_zones, ax=ax, cmap="Blues", alpha= 0.6)
rivers.plot(ax=ax, linewidth=1, color" red')
plt.show()`);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundImage: 'url("/cards.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: 'white',
      overflow: 'hidden',
      zIndex: 9999
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        backgroundColor: 'rgba(10, 15, 30, 0.8)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/NavLogo.png"
            alt="Buildor Geo"
            style={{ height: '32px', width: 'auto', cursor: 'pointer' }}
            onClick={() => window.location.href = '/dashboard'}
          />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Buildor Geo</span>
        </div>

        <nav style={{
          display: 'flex',
          gap: '24px',
          fontSize: '14px',
          flexWrap: 'wrap'
        }}>
          {[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Learning Path', href: '#' },
            { name: 'Tasks', href: '/coding' },
            { name: 'Datasets', href: '#' },
            { name: 'Portfolio', href: '#' },
            { name: 'Insights', href: '#' }
          ].map((item) => (
            <span
              key={item.name}
              onClick={() => item.href !== '#' && (window.location.href = item.href)}
              style={{
                cursor: 'pointer',
                opacity: item.name === 'Tasks' ? 1 : 0.7,
                fontWeight: item.name === 'Tasks' ? 600 : 500,
              }}
            >
              {item.name}
            </span>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harshit"
            alt="User"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          />
          <span style={{ fontSize: '14px' }}>Harshit-Bhakta</span>
        </div>
      </header>

      {/* Main Content - Two Panels in Cards */}
      <div style={{
        display: 'flex',
        gap: '15px',
        padding: '40px',
        height: 'calc(100vh - 80px)',
        overflow: 'hidden'
      }}>
        {/* Left Panel - with title outside card */}
        <div style={{ width: '36%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Title outside card */}
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: '4px'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#6366f1', 
              borderRadius: '50%' 
            }}></span>
            L1.1 Analyze Flood Data
          </div>

          {/* Left Panel Card */}
          <div style={{
            flex: 1,
            backgroundColor: 'transparent',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header with breadcrumb and step */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📊</span>
                <span>Flood Mapping</span>
                <span style={{ opacity: 0.6 }}>›› Kerala Rivers</span>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Step 1 of 5
              </div>
            </div>

            {/* Scrollable content with hidden scrollbar */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '20px 24px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            className="hide-scrollbar">
              {/* Task Header */}
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  lineHeight: '1.2'
                }}>
                  Analyzing Flood Data over Kerala's Rivers
                </h1>

                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}>
                  In this task, you will analyze flood data over the river systems in Kerala, India. 
                  We will start by loading the flood datasets and visualizing the flood-prone areas 
                  on the map to identify regions at risk.
                </p>
              </div>

              {/* Map Image - Smaller and right-aligned */}
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '20px',
                marginLeft: '40px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                width: '85%',
                maxHeight: '220px'
              }}>
                <img
                  src="/image.png"
                  alt="Flood Map"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Objectives */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📋</span> Objectives
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <span>◆</span>
                    <span>Load flood datasets <span style={{ opacity: 0.6 }}>(Kerala_Rivers.geojson, Kerala_Flood_zones.tif)</span></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <span>◆</span>
                    <span>Visualize flood-prone areas <span style={{ opacity: 0.6 }}>on the map for analysis</span></span>
                  </div>
                </div>
              </div>

              {/* Datasets */}
              <div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📁</span> Datasets
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <span style={{ fontSize: '16px' }}>🗺️</span>
                    <span>Kerala_Rivers.geojson</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <span style={{ fontSize: '16px' }}>📊</span>
                    <span>Kerala_Flood_zones.tif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel Card - Code Editor - Wider */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(10, 15, 30, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Editor Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {['editor.py', 'map-output.png', 'resources.txt'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: activeTab === tab ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                    border: activeTab === tab ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{tab === 'editor.py' ? '🐍' : tab === 'map-output.png' ? '🖼️' : '📄'}</span>
                  {tab}
                </button>
              ))}
            </div>

            <button style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>▶</span> Run Code
            </button>
          </div>

          {/* Task Progress */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span>✓ Task 1 / 5</span>
            <span style={{ fontWeight: 600 }}>Analyzing Flood Data</span>
          </div>

          {/* Code Editor - with hidden scrollbar */}
          <div style={{
            flex: 1,
            padding: '16px',
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: '12px',
            lineHeight: '1.6',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="hide-scrollbar">
            <pre style={{ margin: 0 }}>
              <code style={{ color: '#e4e4e7' }}>
                {code.split('\n').map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)', userSelect: 'none', minWidth: '24px', textAlign: 'right' }}>
                      {i + 1}
                    </span>
                    <span>{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* Output Console */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 16px',
            maxHeight: '150px'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '8px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              ⚙️ Output Console
            </div>
            <div style={{ fontSize: '12px', color: '#10b981' }}>
              <div>› Loaded Kerala_Rivers.geojson successfully.</div>
              <div>› Loaded Kerala_Flood_zones.tif successfuly.</div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <button style={{
              width: '100%',
              maxWidth: '500px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
            >
              <span>⚡</span> Submit Task
            </button>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
              Start coding to load the datasets.
            </span>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CodingPage;