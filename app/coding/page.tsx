"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tasksData, Task, SubTask } from '../../data/tasksData';
import { completeSubtask } from "@/utils/taskProgress";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';


const CodingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const subtaskId = searchParams.get('subtaskId');
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [hintStep, setHintStep] = useState(0);
  const [task, setTask] = useState<Task | null>(null);
  const [subtask, setSubtask] = useState<SubTask | null>(null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [analysisErrors, setAnalysisErrors] = useState<string[]>([]);
  const [showLineNumbers] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);


  useEffect(() => {
    if (taskId && subtaskId) {
      const foundTask = tasksData.find(t => t.id === taskId);
      const foundSubtask = foundTask?.subTasks.find((st: { id: string; }) => st.id === subtaskId);

      if (foundTask && foundSubtask) {
        setTask(foundTask);
        setSubtask(foundSubtask);
        setCode(foundSubtask.starterCode);
      }
    }
  }, [taskId, subtaskId]);
  // Highlight code whenever it changes
  useEffect(() => {
    if (highlightRef.current) {
      Prism.highlightElement(highlightRef.current.querySelector('code')!);
    }
  }, [code]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current && highlightRef.current) {
      const scrollTop = e.currentTarget.scrollTop;
      const scrollLeft = e.currentTarget.scrollLeft;
      lineNumbersRef.current.style.transform = `translateY(-${scrollTop}px)`;
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  };

  const [activeTab, setActiveTab] = useState('editor.py');

  /* ===============================
     ANALYSIS + HINT HANDLERS
  ================================ */



  const handleRunAnalysis = () => {
    const errors = analyzeCode(code);
    setAnalysisErrors(errors);
    setCurrentHint(null);
    setHintStep(0);
  };

  const handleGetHint = () => {
    if (analysisErrors.length === 0) return;

    const error = analysisErrors[hintStep];
    if (!error) return;

    if (error === "CRS_MISMATCH") {
      setCurrentHint(
        "⚠️ CRS mismatch detected. Convert both datasets to a projected CRS (e.g. EPSG:32643) before buffering."
      );
    }

    if (error === "SPATIAL_JOIN_PREDICATE_MISSING") {
      setCurrentHint(
        "❗ Spatial join is missing a predicate. Use predicate='intersects' in gpd.sjoin()."
      );
    }

    setHintStep((prev) => prev + 1);
  };



  const analyzeCode = (code: string) => {
    const errors: string[] = [];

    // CRS check
    if (!code.includes("to_crs")) {
      errors.push("CRS_MISMATCH");
    }

    // Spatial join predicate check
    if (code.includes("gpd.sjoin") && !code.includes("predicate=")) {
      errors.push("SPATIAL_JOIN_PREDICATE_MISSING");
    }

    return errors;
  };

  const handleRunCode = () => {
    setConsoleLogs(["⏳ Running analysis..."]);

    const errors = analyzeCode(code);

    if (errors.length > 0) {
      setConsoleLogs([
        "❌ Issues detected during analysis",
        ...errors.map(err =>
          err === "CRS_MISMATCH"
            ? "⚠ CRS mismatch detected"
            : "❗ Spatial join missing predicate"
        ),
      ]);
    } else {
      setConsoleLogs(["✅ Code executed successfully. No issues found."]);
    }

    setAnalysisErrors(errors);
    setHintStep(0);
    setCurrentHint(null);
  };

  const handleSubmit = () => {
    if (!task || !subtask) return;

    if (analysisErrors.length > 0) {
      alert("❌ Fix remaining issues before submitting.");
      return;
    }

    completeSubtask(subtask.id);
    router.push("/dashboard");
  };

  if (!task || !subtask) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0f1e',
        color: 'white'
      }}>
        Loading task...
      </div>
    );
  }



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
            onClick={() => router.push('/dashboard')}
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
              onClick={() => item.href !== '#' && router.push(item.href)}
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
            src="https://api.dicebear.com/7.x/avataaars/Continue1:40 PMsvg?seed=Harshit"
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
            {task.icon} {task.title}
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
                <span>{task.icon}</span>
                <span>{task.title}</span>
                <span style={{ opacity: 0.6 }}>›› {subtask.location.name}</span>
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Step {subtask.stepNumber} of {task.subTasks.length}
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
                  {subtask.title}
                </h1>

                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}>
                  {subtask.description}
                </p>
              </div>

              {/* Map Image */}
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
                  src={subtask.mapImage}
                  alt="Task Map"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Learning Briefing */}
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💡</span> Learning Brief
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.5' }}>
                  {subtask.learningContent.briefing}
                </p>
              </div>

              {/* Key Points */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  🔑 Key Points
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  {subtask.learningContent.keyPoints.map((point: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, idx: React.Key | null | undefined) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                      <span>•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
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
                  {subtask.objectives.map((obj: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, idx: React.Key | null | undefined) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                      <span>◆</span>
                      <span>{obj}</span>
                    </div>
                  ))}
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
                  {subtask.datasets.map((dataset: { icon: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, idx: React.Key | null | undefined) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}>
                      <span style={{ fontSize: '16px' }}>{dataset.icon}</span>
                      <span>{dataset.name}</span>
                    </div>
                  ))}
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
          overflow: 'auto'
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

            <button
              onClick={handleRunCode}
              style={{
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
              }}
            >
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
            <span>✓ Task {subtask.stepNumber} / {task.subTasks.length}</span>
            <span style={{ fontWeight: 600 }}>{subtask.title}</span>
          </div>

          {/* Code Editor - with synchronized scrolling */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            {/* LINE NUMBERS */}
            {showLineNumbers && (
              <div
                ref={lineNumbersRef}
                style={{
                  paddingLeft: "15px",
                  paddingRight: "8px",
                  paddingTop: "12px",
                  textAlign: "right",
                  userSelect: "none",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
                  fontSize: "13px",
                  lineHeight: "1.6",
                  flexShrink: 0,
                  pointerEvents: "none",
                  willChange: "transform",
                  borderRight: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {code.split("\n").map((_, i) => (
                  <div key={i} style={{ height: '20.8px' }}>{i + 1}</div>
                ))}
              </div>
            )}

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {/* SYNTAX HIGHLIGHTED CODE (Behind textarea) */}
              <pre
                ref={highlightRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  margin: 0,
                  padding: "12px",
                  fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
                  fontSize: "13px",
                  lineHeight: "1.6",
                  whiteSpace: "pre",
                  overflow: "hidden",
                  pointerEvents: "none",
                  background: "transparent",
                }}
              >
                <code className="language-python">{code}</code>
              </pre>

              {/* EDITABLE CODE (Transparent text on top) */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  color: "transparent",
                  caretColor: "#e4e4e7",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
                  fontSize: "13px",
                  lineHeight: "1.6",
                  padding: "12px",
                  margin: 0,
                  whiteSpace: "pre",
                  overflowY: "auto",
                  overflowX: "auto",
                  WebkitTextFillColor: "transparent",
                  wordWrap: "normal",
                  overflowWrap: "normal",
                }}
              />
            </div>
          </div>


          {/* Output Console */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '10px 16px',
            minHeight: '120px',
            maxHeight: '240px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span>⚙️ Output Console</span>
              {analysisErrors.length > 0 && (
                <button
                  onClick={handleGetHint}
                  title="Get Hint"
                  style={{
                    background: "rgba(250, 204, 21, 0.15)",
                    border: "1px solid rgba(250, 204, 21, 0.3)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#facc15",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: 600,
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(250, 204, 21, 0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(250, 204, 21, 0.15)";
                  }}
                >
                  💡 Get Hint
                </button>
              )}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#10b981',
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
              className="hide-scrollbar">
              {/* Hint appears first if available */}
              {currentHint && (
                <div style={{
                  padding: "8px 12px",
                  backgroundColor: "rgba(234,179,8,0.12)",
                  borderLeft: "3px solid #facc15",
                  borderRadius: "6px",
                  fontSize: "11px",
                  lineHeight: "1.4",
                  color: "#fde68a",
                  flexShrink: 0
                }}>
                  {currentHint}
                </div>
              )}

              {/* Analyzer output below hint */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {consoleLogs.length === 0 ? (
                  <div>⏳ Waiting for execution...</div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div key={idx}>› {log}</div>
                  ))
                )}
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
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '14px 24px',
                  background: isSubmitting ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                <span>{isSubmitting ? '⏳' : '⚡'}</span>
                {isSubmitting ? 'Submitting...' : 'Submit Task & Continue'}
              </button>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                {isSubmitting ? 'Processing your submission...' : 'Complete this task to unlock the next city'}
              </span>
            </div>
          </div>
        </div>

        <style jsx>{`
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Hide scrollbar in code editor textarea */
  textarea::-webkit-scrollbar {
    display: none;
  }
  textarea {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Hide scrollbar in output console */
  div::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`}</style>
      </div>
    </div>
  );
};
export default CodingPage;