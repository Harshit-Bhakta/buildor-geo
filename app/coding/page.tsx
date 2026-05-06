"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tasksData, Task, SubTask } from '../../data/tasksData';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';

const CodingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const subtaskId = searchParams.get('subtaskId');

  // ── original state ──
  const [activeOverlay, setActiveOverlay] = useState<null | "map" | "resources">(null);
  const [task, setTask] = useState<Task | null>(null);
  const [subtask, setSubtask] = useState<SubTask | null>(null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLineNumbers] = useState(true);
  const [remainingHints, setRemainingHints] = useState(10);
  const [activeTab, setActiveTab] = useState('editor.py');

  // ── UI state ──
  const [isSaved, setIsSaved] = useState(true);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isRunning, setIsRunning] = useState(false);

  // ── FIX 2: show "Continue" button instead of auto-redirect ──
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [nextTaskUrl, setNextTaskUrl] = useState('/dashboard');

  // ── RIGHT PANEL: submission data ──
  const [submitScore, setSubmitScore] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [submitLevel, setSubmitLevel] = useState<string | null>(null);
  const [submitAttempts, setSubmitAttempts] = useState<number | null>(null);
  const [submitXP, setSubmitXP] = useState<number | null>(null);
  const [submitHintsUsed, setSubmitHintsUsed] = useState<number | null>(null);
  const [testPassed, setTestPassed] = useState<number | null>(null);
  const [testFailed, setTestFailed] = useState<number | null>(null);
  const [testWarnings, setTestWarnings] = useState<number | null>(null);
  const [testTotal, setTestTotal] = useState<number | null>(null);

  // ── FIX 1: issues only from API, never placeholder on load ──
  // null = not yet run, [] = ran and no errors, [...] = has errors
  const [rightPanelErrors, setRightPanelErrors] = useState<
    Array<{ title: string; tag: string; description: string; line?: number }> | null
  >(null);
  const [hasRun, setHasRun] = useState(false); // true once run or submit clicked

  // ── FIX 3: hints carousel with deduplication ──
  const [allHints, setAllHints] = useState<string[]>([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(1);
  const [isFetchingHint, setIsFetchingHint] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // ── lock body scroll ──
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // ── load task data ──
  useEffect(() => {
    if (taskId && subtaskId) {
      const foundTask = tasksData.find(t => t.id === taskId);
      const foundSubtask = foundTask?.subTasks.find((st: { id: string }) => st.id === subtaskId);
      if (foundTask && foundSubtask) {
        setTask(foundTask);
        setSubtask(foundSubtask);
        setCode(foundSubtask?.starterCode);
      }
    }
  }, [taskId, subtaskId]);

  // ── syntax highlight ──
  useEffect(() => {
    if (highlightRef.current) {
      Prism.highlightElement(highlightRef.current.querySelector('code')!);
    }
  }, [code]);

  // ── synchronized scroll ──
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current && highlightRef.current) {
      lineNumbersRef.current.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 800);
  };

  const handleCursorMove = (
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLTextAreaElement>
  ) => {
    const ta = e.currentTarget;
    const val = ta.value.substring(0, ta.selectionStart);
    const lines = val.split('\n');
    setCursorPos({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  /* ================================================================
     FIX 3: GET HINT
     - Deduplicates: if API returns same hint, retries up to 3 times
     - Only adds to allHints if it's a genuinely new hint
     - Never auto-navigates carousel; new hint always appended & shown
  ================================================================ */
  const handleGetHint = async () => {
    if (remainingHints <= 0 || isFetchingHint) return;
    setIsFetchingHint(true);

    let newHint: string | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const res = await fetch("/api/analyze-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            taskId: subtask?.id,
            // FIX 3: send already seen hints so server can give a different one
            previousHints: allHints,
            hintIndex: allHints.length,
          }),
        });

        if (!res.ok) break;

        const data = await res.json();

        if (data.blocked) {
          setRemainingHints(0);
          break;
        }

        const candidate: string = data.hint ?? '';

        // FIX 3: check if this hint is already in allHints (exact or very similar)
        const isDuplicate = allHints.some(
          h => h.trim().toLowerCase() === candidate.trim().toLowerCase()
        );

        if (!isDuplicate || attempts === maxAttempts - 1) {
          // Accept it (even if duplicate on last try — better than nothing)
          newHint = candidate;
          setRemainingHints(data.remaining ?? Math.max(0, remainingHints - 1));
          // update submitHintsUsed live
          setSubmitHintsUsed(prev => (prev !== null ? prev + 1 : 1));
          break;
        }
        // else: duplicate — retry
        attempts++;
      } catch {
        break;
      }
    }

    if (newHint) {
      setAllHints(prev => {
        const updated = [...prev, newHint!];
        setCurrentHintIndex(updated.length - 1); // always show newest
        return updated;
      });
      setHintLevel(prev => Math.min(prev + 1, 3));
    }

    setIsFetchingHint(false);
  };

  /* ================================================================
     RUN CODE — results go to right panel only
  ================================================================ */
  const handleRunCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    setRightPanelErrors(null); // show spinner while running

    const res = await fetch("/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, taskId: subtask?.id }),
    });

    if (!res.ok) {
      setIsRunning(false);
      setRightPanelErrors([]);
      return;
    }

    const data = await res.json();
    setIsRunning(false);

    if (data.blocked) {
      setRightPanelErrors([]);
      return;
    }

    if (data.errors?.length > 0) {
      const issues = (data.errors as string[]).map((e, i) => ({
        title: extractIssueTitle(e, i),
        tag: extractIssueTag(e),
        description: e,
        line: extractLineNumber(e),
      }));
      setRightPanelErrors(issues);
    } else {
      // FIX 1: empty array = "no issues" — nothing shows
      setRightPanelErrors([]);
    }
  };

  /* ================================================================
     FIX 2: SUBMIT CODE
     - On "completed": show Continue button in right panel, NO auto-redirect
     - User sees score, then clicks button to go to dashboard/next task
  ================================================================ */
  const handleSubmit = async () => {
    if (!task || !subtask) return;
    setIsSubmitting(true);
    setHasRun(true);
    setShowContinueButton(false);

    const res = await fetch("/api/submit-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, taskId: subtask.id, subtaskId: subtask.id }),
    });

    if (!res.ok) {
      setIsSubmitting(false);
      return;
    }

    const data = await res.json();
    setIsSubmitting(false);

    // populate right panel stats
    setSubmitScore(data.score ?? null);
    setSubmitStatus(data.status ?? null);
    setSubmitLevel(data.level ?? null);
    setSubmitAttempts(data.attempts ?? null);
    setSubmitXP(data.xp ?? 10);
    setSubmitHintsUsed(data.hintsUsed ?? (10 - remainingHints));
    setTestPassed(data.passed ?? null);
    setTestFailed(data.failed ?? null);
    setTestWarnings(data.warnings ?? null);
    setTestTotal(data.total ?? null);

    // parse issues
    const rawErrors: any[] = data.issueDetails ?? data.errors ?? [];
    const issues = rawErrors.map((e: any, i: number) => {
      if (typeof e === 'string') {
        return {
          title: extractIssueTitle(e, i),
          tag: extractIssueTag(e),
          description: e,
          line: extractLineNumber(e),
        };
      }
      return {
        title: e.title ?? `Issue ${i + 1}`,
        tag: e.tag ?? 'ERROR',
        description: e.description ?? e.message ?? String(e),
        line: e.line,
      };
    });
    setRightPanelErrors(issues.length > 0 ? issues : []);

    // FIX 2: completed → show button, NOT auto-redirect
    if (data.status === "completed") {
      // figure out next task URL
      if (task && subtask) {
        const currentIdx = task.subTasks.findIndex((st: any) => st.id === subtask.id);
        if (currentIdx >= 0 && currentIdx < task.subTasks.length - 1) {
          const nextSub = task.subTasks[currentIdx + 1];
          setNextTaskUrl(`/coding?taskId=${task.id}&subtaskId=${nextSub.id}`);
        } else {
          setNextTaskUrl('/dashboard');
        }
      }
      setShowContinueButton(true); // show button in right panel
    }
  };

  // ── helpers ──
  const extractIssueTitle = (err: string, i: number): string => {
    const e = err.toLowerCase();
    if (e.includes('clip')) return 'Missing Clip Operation';
    if (e.includes('crs') || e.includes('epsg')) return 'Wrong CRS';
    if (e.includes('store') || e.includes('variable')) return 'Result Not Stored';
    if (e.includes('import')) return 'Missing Import';
    if (e.includes('syntax')) return 'Syntax Error';
    if (e.includes('buffer')) return 'Buffer Error';
    if (e.includes('visuali') || e.includes('plot')) return 'Visualization Error';
    return `Issue ${i + 1}`;
  };

  const extractIssueTag = (err: string): string => {
    const e = err.toLowerCase();
    if (e.includes('clip')) return 'MISSING_CLIP';
    if (e.includes('crs') || e.includes('epsg')) return 'WRONG_CRS';
    if (e.includes('store') || e.includes('variable')) return 'STORE_RESULT';
    if (e.includes('import')) return 'MISSING_IMPORT';
    if (e.includes('syntax')) return 'SYNTAX_ERR';
    if (e.includes('buffer')) return 'BUFFER_ERR';
    if (e.includes('visuali') || e.includes('plot')) return 'NO_VISUALIZATION';
    return 'CODE_ERROR';
  };

  const extractLineNumber = (err: string): number | undefined => {
    const match = err.match(/line\s*(\d+)/i);
    return match ? parseInt(match[1]) : undefined;
  };

  // ── derived values ──
  const hasSubmission = submitStatus !== null;
  const score = submitScore ?? 0;
  const RADIUS = 42;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC - (score / 100) * CIRC;
  const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  const statusLabel = !hasSubmission ? 'Not submitted yet'
    : submitStatus === 'completed' ? '🎉 Task Completed!'
    : submitStatus === 'error' ? '❌ Syntax Error'
    : 'Partial Submission';

  const statusSub = !hasSubmission
    ? 'Submit your code to see your score and issues.'
    : submitStatus === 'completed' ? 'Excellent! You can now continue to the next task.'
    : submitStatus === 'error' ? 'Fix the syntax errors and try again.'
    : "Good effort! You're on the right track. Fix the issues below to score 100.";

  // FIX 1: issueCount and displayIssues only from real API data
  const issueCount = rightPanelErrors?.length ?? 0;
  const displayIssues = rightPanelErrors ?? [];

  // hint carousel
  const shownHint = allHints.length > 0 ? allHints[currentHintIndex] : null;
  const canGoPrev = currentHintIndex > 0;
  const canGoNext = currentHintIndex < allHints.length - 1;

  /* ================================================================
     RENDER
  ================================================================ */
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      margin: 0, padding: 0,
      backgroundImage: 'url("/cards.png")',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: 'white', overflow: 'hidden', zIndex: 9999,
    }}>

      {/* ══════════ HEADER (original, unchanged) ══════════ */}
      <header style={{
        padding: '16px 24px',
        backgroundColor: 'rgba(10, 15, 30, 0.8)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px', boxSizing: 'border-box', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/NavLogo.png" alt="Buildor Geo" style={{ height: '32px', width: 'auto', cursor: 'pointer' }} />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Buildor Geo</span>
        </div>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', flexWrap: 'wrap' }}>
          {[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Learning Path', href: '#' },
            { name: 'Tasks', href: '/coding' },
            { name: 'Datasets', href: '#' },
            { name: 'Portfolio', href: '#' },
            { name: 'Insights', href: '#' },
          ].map(item => (
            <span key={item.name} onClick={() => item.href !== '#' && router.push(item.href)} style={{
              cursor: 'pointer',
              opacity: item.name === 'Tasks' ? 1 : 0.7,
              fontWeight: item.name === 'Tasks' ? 600 : 500,
            }}>{item.name}</span>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harshit" alt="User"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <span style={{ fontSize: '14px' }}>Harshit-Bhakta</span>
        </div>
      </header>

      {/* ══════════ 3-COLUMN LAYOUT ══════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr 320px',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}>

        {/* ════════ LEFT COLUMN ════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          padding: '16px 14px',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden', background: 'transparent',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <button onClick={() => router.push('/dashboard')} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500, padding: 0,
            }}>
              <span style={{ fontSize: '16px' }}>←</span>
              <span>{task?.title || 'Flood Mapping'}</span>
            </button>
            <span style={{
              fontSize: '11px', fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white', padding: '4px 10px', borderRadius: '20px',
              whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
            }}>
              Task {subtask?.stepNumber || 1} of {task?.subTasks?.length || 6}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }} className="hide-scrollbar">
            <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '14px', boxShadow: '0 6px 24px rgba(0,0,0,0.5)' }}>
              <img src={subtask?.mapImage || '/task-map.png'} alt="Task Map"
                style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '175px' }} />
            </div>

            <div style={{
              marginBottom: '14px', padding: '12px 14px',
              background: 'rgba(99,102,241,0.13)', borderRadius: '10px',
              border: '1px solid rgba(99,102,241,0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                <span>💡</span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Learning Brief</span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.78)', margin: 0, lineHeight: 1.65 }}>
                {subtask?.learningContent?.briefing || "Flood mapping is critical for disaster preparedness."}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <span>🔑</span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Key Points</span>
              </div>
              {(subtask?.learningContent?.keyPoints || ['GeoPandas for vector data', 'Rasterio for raster data', 'Matplotlib for visualization'])
                .map((pt: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.72)', marginBottom: '5px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
                    <span>{pt}</span>
                  </div>
                ))}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <span>📋</span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Objectives</span>
              </div>
              {(subtask?.objectives || ['Load flood datasets', 'Visualize flood-prone areas']).map((obj: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.72)', marginBottom: '6px' }}>
                  <span style={{ color: '#6366f1', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>◆</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <span>📁</span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Datasets</span>
              </div>
              {(subtask?.datasets || []).map((ds: { icon: string; name: string }, i: number) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px', fontSize: '12px', marginBottom: '6px',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <span style={{ fontSize: '14px' }}>{ds.icon}</span>
                  <span>{ds.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ CENTER COLUMN ════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          padding: '14px 12px',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Editor Card */}
          <div style={{
            background: 'rgba(6, 9, 22, 0.82)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 60px rgba(0,0,0,0.7), 0 4px 20px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
          }}>
            {/* Tab bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
              gap: '8px', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { id: 'editor.py', icon: '🐍' },
                  { id: 'map-output.png', icon: '🖼️' },
                  { id: 'resources.txt', icon: '📄' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'map-output.png') setActiveOverlay('map');
                    else if (tab.id === 'resources.txt') setActiveOverlay('resources');
                    else setActiveOverlay(null);
                  }} style={{
                    padding: '5px 12px',
                    background: activeTab === tab.id ? 'rgba(99,102,241,0.22)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '7px', color: 'white', fontSize: '12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                  }}>
                    <span>{tab.icon}</span>{tab.id}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <button style={{
                  width: '34px', height: '34px',
                  background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>🪙</button>
                <button style={{
                  width: '34px', height: '34px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
                  color: 'rgba(255,255,255,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>⛶</button>
                <button onClick={handleRunCode} disabled={isRunning} style={{
                  padding: '8px 18px',
                  background: isRunning ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  border: 'none', borderRadius: '8px', color: 'white',
                  fontSize: '13px', fontWeight: 700,
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 3px 14px rgba(99,102,241,0.5)',
                }}>
                  {isRunning ? '⏳' : '▶'} Run Code
                </button>
              </div>
            </div>

            {/* Code editor */}
            <div style={{ display: 'flex', overflow: 'hidden', position: 'relative', height: '320px' }}>
              {showLineNumbers && (
                <div ref={lineNumbersRef} style={{
                  paddingLeft: '14px', paddingRight: '10px', paddingTop: '12px',
                  textAlign: 'right', userSelect: 'none', color: 'rgba(255,255,255,0.22)',
                  fontFamily: '"Fira Code","JetBrains Mono","Cascadia Code",Consolas,Monaco,"Courier New",monospace',
                  fontSize: '13px', lineHeight: '1.6', flexShrink: 0,
                  pointerEvents: 'none', willChange: 'transform',
                  borderRight: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(0,0,0,0.1)',
                }}>
                  {code.split('\n').map((_, i) => (
                    <div key={i} style={{ height: '20.8px' }}>{i + 1}</div>
                  ))}
                </div>
              )}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <pre ref={highlightRef} style={{
                  position: 'absolute', inset: 0, margin: 0, padding: '12px',
                  fontFamily: '"Fira Code","JetBrains Mono","Cascadia Code",Consolas,Monaco,"Courier New",monospace',
                  fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre',
                  overflow: 'hidden', pointerEvents: 'none', background: 'transparent',
                }}>
                  <code className="language-python">{code}</code>
                </pre>
                <textarea ref={textareaRef} value={code}
                  onChange={handleCodeChange}
                  onScroll={handleScroll}
                  onKeyUp={handleCursorMove}
                  onClick={handleCursorMove}
                  spellCheck={false}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    background: 'transparent', color: 'transparent',
                    caretColor: '#e4e4e7', border: 'none', outline: 'none', resize: 'none',
                    fontFamily: '"Fira Code","JetBrains Mono","Cascadia Code",Consolas,Monaco,"Courier New",monospace',
                    fontSize: '13px', lineHeight: '1.6', padding: '12px', margin: 0,
                    whiteSpace: 'pre', overflowY: 'auto', overflowX: 'auto',
                    WebkitTextFillColor: 'transparent', wordWrap: 'normal', overflowWrap: 'normal',
                  }}
                />
              </div>
            </div>

            {/* Status bar */}
            <div style={{
              padding: '5px 16px', borderTop: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: '11px', color: 'rgba(255,255,255,0.4)',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>🐍 Python ·</span>
                <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block',
                  background: isSaved ? '#10b981' : '#f59e0b',
                  boxShadow: isSaved ? '0 0 5px rgba(16,185,129,0.8)' : '0 0 5px rgba(245,158,11,0.8)',
                }} />
                <span>{isSaved ? 'Saved' : 'Saving...'}</span>
              </div>
            </div>

            {/* Get Hint + Submit */}
            <div style={{
              display: 'flex', gap: '10px', padding: '12px 14px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(0,0,0,0.15)', alignItems: 'stretch',
            }}>
              <button onClick={handleGetHint} disabled={remainingHints <= 0 || isFetchingHint} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 18px', flexShrink: 0,
                background: 'rgba(8,11,26,0.95)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '10px', color: 'white',
                fontSize: '13px', fontWeight: 600,
                cursor: (remainingHints <= 0 || isFetchingHint) ? 'not-allowed' : 'pointer',
                opacity: (remainingHints <= 0 || isFetchingHint) ? 0.45 : 1,
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontSize: '15px' }}>{isFetchingHint ? '⏳' : '📍'}</span>
                <span>Get Hint</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  Hints left: {remainingHints}
                </span>
              </button>

              <button onClick={handleSubmit} disabled={isSubmitting} style={{
                flex: 1, padding: '12px 20px',
                background: isSubmitting
                  ? 'rgba(99,102,241,0.4)'
                  : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #818cf8 100%)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '15px', fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 22px rgba(99,102,241,0.55)',
              }}>
                <span style={{ fontSize: '17px' }}>{isSubmitting ? '⏳' : '⚡'}</span>
                {isSubmitting ? 'Submitting...' : 'Submit Task & Continue'}
              </button>
            </div>

            {/* Lock notice */}
            <div style={{
              textAlign: 'center', padding: '7px',
              fontSize: '11px', color: 'rgba(255,255,255,0.32)',
              background: 'rgba(0,0,0,0.12)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', justifyContent: 'center', gap: '5px', alignItems: 'center',
            }}>
              <span>🔒</span> Complete this task to unlock the next city
            </div>
          </div>

          {/* Recent Submissions — separate scrollable card */}
          <div style={{
            background: 'rgba(6,9,22,0.75)',
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 36px rgba(0,0,0,0.45)',
            display: 'flex', flexDirection: 'column',
            flex: 1, minHeight: 0, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Recent Submissions</span>
              <span style={{ fontSize: '12px', color: '#818cf8', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.1fr 0.9fr 0.9fr 0.5fr',
              padding: '6px 16px', fontSize: '11px', color: 'rgba(255,255,255,0.35)',
              borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
            }}>
              {['Time', 'Status', 'Score', 'Hints Used', 'Attempts', ''].map(h => <span key={h}>{h}</span>)}
            </div>
            <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }} className="hide-scrollbar">
              {[
                { time: '2 mins ago', score: '85 / 100', hints: '1', attempts: '3' },
                { time: '10 mins ago', score: '60 / 100', hints: '2', attempts: '2' },
                { time: '25 mins ago', score: '70 / 100', hints: '1', attempts: '1' },
                { time: '1 hr ago', score: '50 / 100', hints: '3', attempts: '4' },
                { time: '2 hrs ago', score: '40 / 100', hints: '2', attempts: '5' },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.1fr 0.9fr 0.9fr 0.5fr',
                  padding: '9px 16px', alignItems: 'center', fontSize: '12px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.52)' }}>{row.time}</span>
                  <span>
                    <span style={{
                      background: 'rgba(245,158,11,0.14)', color: '#f59e0b',
                      border: '1px solid rgba(245,158,11,0.28)',
                      borderRadius: '20px', padding: '2px 9px', fontSize: '10px', fontWeight: 700,
                    }}>Partial</span>
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.82)' }}>{row.score}</span>
                  <span style={{ color: 'rgba(255,255,255,0.52)' }}>{row.hints}</span>
                  <span style={{ color: 'rgba(255,255,255,0.52)' }}>{row.attempts}</span>
                  <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 500 }}>View</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════ RIGHT COLUMN — scrollable ════════ */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          padding: '16px 14px',
          overflowY: 'auto', scrollbarWidth: 'none',
          background: 'transparent',
        }} className="hide-scrollbar">

          <div style={{ fontSize: '14px', fontWeight: 700 }}>Submission Overview</div>

          {/* Score card */}
          <div style={{
            background: 'rgba(6,9,22,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.09)',
            padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0,
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="94" height="94" viewBox="0 0 94 94">
                <circle cx="47" cy="47" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle cx="47" cy="47" r={RADIUS} fill="none"
                  stroke={hasSubmission ? scoreColor : '#10b981'}
                  strokeWidth="8" strokeDasharray={CIRC}
                  strokeDashoffset={hasSubmission ? dashOffset : CIRC * 0.05}
                  strokeLinecap="round" transform="rotate(-90 47 47)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>
                  {hasSubmission ? score : '--'}
                </span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>/100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px', fontWeight: 700, marginBottom: '5px',
                color: submitStatus === 'completed' ? '#10b981'
                     : submitStatus === 'error' ? '#ef4444' : 'white',
              }}>
                {statusLabel}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>
                {statusSub}
              </div>
            </div>
          </div>

          {/* FIX 2: Continue button — only visible after completed */}
          {showContinueButton && (
            <button
              onClick={() => router.push(nextTaskUrl)}
              style={{
                width: '100%', padding: '14px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 20px rgba(16,185,129,0.45)',
                flexShrink: 0,
                animation: 'fadeIn 0.4s ease',
              }}
            >
              <span style={{ fontSize: '18px' }}>🚀</span>
              Continue to Next Task →
            </button>
          )}

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px', flexShrink: 0 }}>
            {[
              { label: 'Level',      value: submitLevel     ?? '--' },
              { label: 'Hints Used', value: submitHintsUsed ?? '--' },
              { label: 'Attempts',   value: submitAttempts  ?? '--' },
              { label: '+XP', value: submitXP !== null ? `+${submitXP}` : '--', green: true },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(6,9,22,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                padding: '10px 4px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '3px', color: (s as any).green ? '#10b981' : 'white' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* FIX 1 + 2: Issues Found — NO placeholders on load, auto-expands */}
          <div style={{
            background: 'rgba(6,9,22,0.65)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>
                Issues Found ({issueCount})
              </span>
              <button style={{
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: '6px', color: '#a5b4fc', fontSize: '11px',
                padding: '3px 10px', cursor: 'pointer', fontWeight: 500,
              }}>See Guide</button>
            </div>

            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* FIX 1: initial state — not yet run */}
              {!hasRun && !isRunning && (
                <div style={{
                  padding: '14px', textAlign: 'center',
                  fontSize: '12px', color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.6,
                }}>
                  Run your code or submit to see issues here.
                </div>
              )}

              {/* Running spinner */}
              {isRunning && (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  ⏳ Analyzing your code...
                </div>
              )}

              {/* FIX 1: ran/submitted but no errors */}
              {hasRun && !isRunning && displayIssues.length === 0 && (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#10b981' }}>
                  ✅ No issues found — great work!
                </div>
              )}

              {/* Real issue cards — all visible, container auto-expands */}
              {displayIssues.map((err, i) => (
                <div key={i} style={{
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.16)',
                  borderRadius: '9px', padding: '10px 12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#ef4444', fontSize: '13px' }}>◎</span>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{err.title}</span>
                    <span style={{
                      background: 'rgba(239,68,68,0.18)', color: '#fca5a5',
                      fontSize: '9px', fontWeight: 700, padding: '2px 6px',
                      borderRadius: '4px', letterSpacing: '0.4px',
                    }}>{err.tag}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '0 0 5px 20px', lineHeight: 1.55 }}>
                    {err.description}
                  </p>
                  {err.line && (
                    <div style={{ textAlign: 'right', fontSize: '10px', color: 'rgba(255,255,255,0.28)' }}>
                      Line {err.line}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FIX 3: Hint carousel — prev/next nav, dots per generated hint */}
          <div style={{
            background: 'rgba(99,102,241,0.08)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            borderRadius: '12px', border: '1px solid rgba(99,102,241,0.18)', padding: '12px 14px', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💡</span>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>
                  {allHints.length > 0
                    ? `Hint (${currentHintIndex + 1} of ${allHints.length})`
                    : 'Hint (Level 1 of 3)'}
                </span>
              </div>
              {/* Show next hint = fetch a NEW hint from API */}
              <button onClick={handleGetHint} disabled={remainingHints <= 0 || isFetchingHint} style={{
                background: 'transparent', border: 'none',
                color: (remainingHints <= 0 || isFetchingHint) ? 'rgba(255,255,255,0.25)' : '#a5b4fc',
                fontSize: '11px',
                cursor: (remainingHints <= 0 || isFetchingHint) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500,
              }}>
                <span>{isFetchingHint ? '⏳' : '👁'}</span>
                {isFetchingHint ? 'Fetching...' : 'Show next hint'}
              </button>
            </div>

            {/* Hint text */}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: '0 0 10px 0', minHeight: '36px' }}>
              {shownHint || 'Click "Get Hint" or "Show next hint" to reveal a hint for this task.'}
            </p>

            {/* FIX 3: carousel nav — arrows + clickable dots */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.36)' }}>
                Hints left: {remainingHints}
              </span>

              {allHints.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Prev */}
                  <button onClick={() => canGoPrev && setCurrentHintIndex(i => i - 1)}
                    disabled={!canGoPrev} style={{
                      background: canGoPrev ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '5px', width: '22px', height: '22px',
                      cursor: canGoPrev ? 'pointer' : 'not-allowed',
                      color: canGoPrev ? '#a5b4fc' : 'rgba(255,255,255,0.2)',
                      fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>‹</button>

                  {/* Dots — one per generated hint */}
                  {allHints.map((_, i) => (
                    <div key={i} onClick={() => setCurrentHintIndex(i)} style={{
                      width: i === currentHintIndex ? '18px' : '8px',
                      height: '8px', borderRadius: '4px', cursor: 'pointer',
                      background: i === currentHintIndex ? '#6366f1' : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.25s',
                    }} />
                  ))}

                  {/* Next */}
                  <button onClick={() => canGoNext && setCurrentHintIndex(i => i + 1)}
                    disabled={!canGoNext} style={{
                      background: canGoNext ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '5px', width: '22px', height: '22px',
                      cursor: canGoNext ? 'pointer' : 'not-allowed',
                      color: canGoNext ? '#a5b4fc' : 'rgba(255,255,255,0.2)',
                      fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>›</button>
                </div>
              )}
            </div>
          </div>

          {/* Test Summary */}
          <div style={{
            background: 'rgba(6,9,22,0.65)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 14px', flexShrink: 0,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>Test Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px', marginBottom: '10px' }}>
              {[
                { label: 'Passed',   value: testPassed   ?? '--', color: '#10b981' },
                { label: 'Failed',   value: testFailed   ?? '--', color: '#ef4444' },
                { label: 'Warnings', value: testWarnings ?? '--', color: '#f59e0b' },
                { label: 'Total',    value: testTotal    ?? '--', color: 'white'   },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '10px 4px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: s.color, marginBottom: '2px' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 10px', background: 'rgba(99,102,241,0.08)',
              borderRadius: '8px', fontSize: '11px', color: '#a5b4fc',
            }}>
              <span>💡</span>
              <span>{submitStatus === 'completed' ? '🎉 Perfect! Task completed!' : "Keep going! You're doing great! 🚀"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ OVERLAYS (original) ══════════ */}
      {activeOverlay && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)',
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
        }} onClick={() => setActiveOverlay(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: activeOverlay === 'map' ? '380px' : '450px', maxHeight: '85vh',
            backgroundImage: 'url("/cards.png")', backgroundSize: 'cover', backgroundPosition: 'center',
            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 30px 90px rgba(0,0,0,0.8)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                {activeOverlay === 'map'
                  ? <><span style={{ fontSize: '16px' }}>🗺️</span> Map Output Preview</>
                  : <><span style={{ fontSize: '16px' }}>📘</span> Helpful Resources</>}
              </h3>
              <button onClick={() => setActiveOverlay(null)} style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                fontSize: '20px', cursor: 'pointer', lineHeight: 1,
              }}>✕</button>
            </div>
            <div style={{ padding: '16px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none' }} className="hide-scrollbar">
              {activeOverlay === 'map' && (
                <>
                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <img src="/task?.png" alt="Expected Output" style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
                    <div style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      background: 'rgba(240,240,240,0.95)', borderRadius: '6px',
                      padding: '8px 10px', fontSize: '9px', color: '#333',
                    }}>
                      {[
                        { color: '#FF8C69', label: 'District Boundary', type: 'line', border: '#D2691E' },
                        { color: '#40E0D0', label: 'River Network', type: 'line', border: '' },
                        { color: 'rgba(173,216,230,0.5)', label: 'Flood Buffer Zone', type: 'rect', border: '#ADD8E6' },
                      ].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          {l.type === 'line'
                            ? <div style={{ width: '14px', height: '2px', background: l.color, border: l.border ? `1px solid ${l.border}` : undefined }} />
                            : <div style={{ width: '14px', height: '14px', background: l.color, border: `1px solid ${l.border}`, borderRadius: '2px' }} />}
                          <span style={{ fontWeight: 600 }}>{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px 0' }}>What to Observe</h4>
                  <ul style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, paddingLeft: '18px', margin: 0, listStyle: 'disc' }}>
                    <li style={{ marginBottom: '6px' }}>The flood buffer zones are shown in light blue along the river network.</li>
                    <li style={{ marginBottom: '6px' }}>The buffer follows the river shapes closely, expanding roughly 500 m outwards.</li>
                    <li style={{ marginBottom: '6px' }}>The result is clipped to the district boundary.</li>
                  </ul>
                </>
              )}
              {activeOverlay === 'resources' && (
                <>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px 0' }}>Concepts You'll Use</h4>
                  {[
                    { title: '• Coordinate Reference System (CRS)', body: 'CRS determines how the 2D map projection relates to real-world coordinates. For distance-based buffers, use a projected CRS (e.g. EPSG:32643).' },
                    { title: '• Buffering', body: 'Buffering creates a zone around a line (e.g. river) at fixed distance. Always check the unit of buffer distance (meters vs degrees).' },
                    { title: '• Clipping', body: 'Clipping restricts data to an area of interest. Here, it limits the flood buffer zones to within the district boundary.' },
                  ].map(c => (
                    <div key={c.title} style={{ marginBottom: '18px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 8px 0' }}>{c.title}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, paddingLeft: '14px', margin: 0 }}>{c.body}</p>
                    </div>
                  ))}
                  <h4 style={{ fontSize: '14px', margin: '20px 0 14px', fontWeight: 700 }}>Common Mistakes</h4>
                  <ul style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, paddingLeft: '18px', margin: 0, listStyle: 'disc' }}>
                    <li style={{ marginBottom: '8px' }}>Using the incorrect CRS like EPSG:4326 will lead to incorrect buffer distances.</li>
                    <li style={{ marginBottom: '8px' }}>1 degree ≠ 1 meter — always use a CRS with meters when buffering.</li>
                    <li style={{ marginBottom: '8px' }}>'clip' restricts to boundary — don't confuse it with 'intersect'.</li>
                  </ul>
                  <h4 style={{ fontSize: '14px', margin: '20px 0 14px', fontWeight: 700 }}>Helpful References</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['View CRS Guide - GeoPandas Documentation', 'Buffering in Python - GeoPandas Buffer'].map(ref => (
                      <div key={ref} style={{
                        padding: '10px 12px', background: 'rgba(99,102,241,0.15)',
                        borderRadius: '6px', border: '1px solid rgba(99,102,241,0.3)',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}>
                        <span>📄</span>
                        <span style={{ fontSize: '11px', fontWeight: 500 }}>{ref}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', gap: '10px' }}>
              {activeOverlay === 'map' && (
                <button style={{
                  flex: 1, padding: '8px 18px', borderRadius: '6px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                }}>View My Output</button>
              )}
              <button onClick={() => setActiveOverlay(null)} style={{
                flex: 1, padding: '8px 18px', borderRadius: '6px',
                background: 'rgba(16,0,67,1)', border: '1px solid rgba(99,102,241,0.5)',
                color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
        textarea { -ms-overflow-style: none; scrollbar-width: none; }
        div::-webkit-scrollbar { width: 0px; height: 0px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CodingPage;