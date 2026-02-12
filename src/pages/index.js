import { useState, useRef, useEffect } from 'react';

const WELCOME_CODE = `// Welcome to Ryze AI UI Generator!
// Describe a UI in the chat to get started.
// Example: "Create a dashboard with stats cards and a data table"

function GeneratedUI() {
  return (
    <div className="rz-p-6" style={{textAlign:'center',paddingTop:'60px'}}>
      <div style={{fontSize:'48px',marginBottom:'16px'}}>⚡</div>
      <h2 style={{fontFamily:'sans-serif',color:'#6366f1',fontSize:'24px',marginBottom:'8px'}}>
        Ready to Generate
      </h2>
      <p style={{fontFamily:'sans-serif',color:'#94a3b8',fontSize:'14px'}}>
        Type your UI description in the chat on the left
      </p>
    </div>
  );
}`;

// Icons as SVG components (no external deps)
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const getPreviewHTML = (code) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; }
    .rz-btn { display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:500;transition:all 0.15s;font-family:inherit; }
    .rz-btn-primary { background:#6366f1;color:white; } .rz-btn-primary:hover { background:#4f46e5; }
    .rz-btn-secondary { background:#f1f5f9;color:#475569;border:1px solid #e2e8f0; } .rz-btn-secondary:hover { background:#e2e8f0; }
    .rz-btn-danger { background:#ef4444;color:white; } .rz-btn-danger:hover { background:#dc2626; }
    .rz-btn-ghost { background:transparent;color:#6366f1;border:1px solid #6366f1; } .rz-btn-ghost:hover { background:#eef2ff; }
    .rz-btn-sm { padding:5px 10px;font-size:12px; } .rz-btn-lg { padding:12px 24px;font-size:16px; }
    .rz-card { background:white;border-radius:12px;border:1px solid #e2e8f0;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.05); }
    .rz-card-header { margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #f1f5f9; }
    .rz-card-title { font-size:16px;font-weight:600;color:#0f172a; }
    .rz-card-subtitle { font-size:13px;color:#64748b;margin-top:2px; }
    .rz-input { width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;font-family:inherit; }
    .rz-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
    .rz-label { display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:4px; }
    .rz-form-group { margin-bottom:16px; }
    .rz-table { width:100%;border-collapse:collapse; }
    .rz-table th { text-align:left;padding:10px 12px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;background:#f8fafc;border-bottom:1px solid #e2e8f0; }
    .rz-table td { padding:10px 12px;font-size:14px;color:#1e293b;border-bottom:1px solid #f1f5f9; }
    .rz-table tr:hover td { background:#f8fafc; }
    .rz-badge { display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500; }
    .rz-badge-green { background:#dcfce7;color:#166534; } .rz-badge-red { background:#fee2e2;color:#991b1b; }
    .rz-badge-blue { background:#dbeafe;color:#1d4ed8; } .rz-badge-yellow { background:#fef9c3;color:#854d0e; }
    .rz-badge-gray { background:#f1f5f9;color:#475569; }
    .rz-navbar { background:white;border-bottom:1px solid #e2e8f0;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px; }
    .rz-navbar-brand { font-size:18px;font-weight:700;color:#0f172a; }
    .rz-navbar-links { display:flex;gap:24px;list-style:none; }
    .rz-navbar-link { font-size:14px;color:#64748b;text-decoration:none;cursor:pointer; }
    .rz-navbar-link:hover,.rz-navbar-link.active { color:#6366f1; }
    .rz-sidebar { width:240px;background:white;border-right:1px solid #e2e8f0;padding:16px;min-height:100vh; }
    .rz-sidebar-item { display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:14px;color:#374151; }
    .rz-sidebar-item:hover,.rz-sidebar-item.active { background:#eef2ff;color:#6366f1; }
    .rz-modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000; }
    .rz-modal { background:white;border-radius:16px;padding:24px;min-width:400px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.3); }
    .rz-modal-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:16px; }
    .rz-modal-title { font-size:18px;font-weight:600; }
    .rz-stat { background:white;border-radius:12px;border:1px solid #e2e8f0;padding:20px; }
    .rz-stat-label { font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px; }
    .rz-stat-value { font-size:28px;font-weight:700;color:#0f172a; }
    .rz-stat-change { font-size:12px;margin-top:4px; }
    .rz-stat-up { color:#16a34a; } .rz-stat-down { color:#dc2626; }
    .rz-avatar { border-radius:50%;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;font-weight:600;color:white; }
    .rz-avatar-sm { width:32px;height:32px;font-size:12px; }
    .rz-avatar-md { width:40px;height:40px;font-size:14px; }
    .rz-avatar-lg { width:56px;height:56px;font-size:18px; }
    .rz-alert { padding:12px 16px;border-radius:8px;font-size:14px;margin-bottom:12px; }
    .rz-alert-info { background:#dbeafe;color:#1e40af;border-left:4px solid #3b82f6; }
    .rz-alert-success { background:#dcfce7;color:#166534;border-left:4px solid #22c55e; }
    .rz-alert-warning { background:#fef9c3;color:#854d0e;border-left:4px solid #eab308; }
    .rz-alert-error { background:#fee2e2;color:#991b1b;border-left:4px solid #ef4444; }
    .rz-progress { background:#f1f5f9;border-radius:99px;height:8px;overflow:hidden; }
    .rz-progress-bar { height:100%;background:#6366f1;border-radius:99px; }
    .rz-chart-bar { display:flex;align-items:flex-end;gap:8px;height:160px;padding-top:10px; }
    .rz-bar { flex:1;background:#6366f1;border-radius:4px 4px 0 0;min-height:4px; }
    .rz-bar:hover { background:#4f46e5; }
    .rz-chart-labels { display:flex;gap:8px;margin-top:8px; }
    .rz-chart-label { flex:1;text-align:center;font-size:11px;color:#94a3b8; }
    .rz-divider { border:none;border-top:1px solid #e2e8f0;margin:16px 0; }
    .rz-text-muted { color:#64748b; } .rz-text-sm { font-size:13px; }
    .rz-flex { display:flex; } .rz-flex-col { display:flex;flex-direction:column; }
    .rz-gap-2 { gap:8px; } .rz-gap-4 { gap:16px; }
    .rz-items-center { align-items:center; } .rz-justify-between { justify-content:space-between; }
    .rz-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
    .rz-grid-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px; }
    .rz-grid-4 { display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px; }
    .rz-p-4 { padding:16px; } .rz-p-6 { padding:24px; }
    .rz-mb-4 { margin-bottom:16px; } .rz-mb-6 { margin-bottom:24px; }
    .rz-full { width:100%; } .rz-rounded { border-radius:8px; }
    .rz-shadow { box-shadow:0 2px 8px rgba(0,0,0,0.08); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(GeneratedUI));
    } catch(e) {
      document.getElementById('root').innerHTML = '<div style="padding:20px;color:#ef4444;font-family:monospace;font-size:13px"><strong>Render Error:</strong><br/>' + e.message + '</div>';
    }
  </script>
</body>
</html>`;

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI UI Generator. Describe any UI — like \"a dashboard with user stats and a data table\" — and I'll build it instantly using a deterministic component library.",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [versions, setVersions] = useState([{ code: WELCOME_CODE, label: 'Start', explanation: '' }]);
  const [activeVersion, setActiveVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState(WELCOME_CODE);
  const [previewKey, setPreviewKey] = useState(0);
  const chatEndRef = useRef(null);

  const currentCode = versions[activeVersion]?.code || WELCOME_CODE;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setEditableCode(versions[activeVersion]?.code || WELCOME_CODE);
    setPreviewKey(k => k + 1);
  }, [activeVersion]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMsgs = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    setMessages(m => [...m, { role: 'assistant', content: '', loading: true }]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: trimmed, currentCode: editableCode, history: newMsgs })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const newVer = { code: data.code, label: `v${versions.length}`, explanation: data.explanation, plan: data.plan };
      const newVersions = [...versions, newVer];
      setVersions(newVersions);
      setActiveVersion(newVersions.length - 1);
      setEditableCode(data.code);
      setPreviewKey(k => k + 1);
      setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: data.explanation, plan: data.plan }]);
    } catch (err) {
      setMessages(m => [...m.slice(0, -1), { role: 'assistant', content: `⚠️ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchVersion = (i) => {
    setActiveVersion(i);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* LEFT - Chat */}
      <div style={{ width: '320px', minWidth: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6ee7b7, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZapIcon />
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.3px' }}>Ryze AI</h1>
            <p style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UI Generator</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #1e293b, #1a1a2e)'
                : 'linear-gradient(135deg, #0f2027, #0d1b2a)',
              border: msg.role === 'user' ? '1px solid var(--border)' : '1px solid #1e3a4a',
              borderLeft: msg.role === 'assistant' ? '3px solid var(--accent)' : undefined,
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
              padding: '10px 14px',
              animation: 'fadeIn 0.3s ease forwards'
            }}>
              {msg.loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '12px' }}>
                  <span className="spinner" /> Generating UI...
                </div>
              ) : (
                <div>
                  {msg.plan && (
                    <div style={{ background: 'rgba(110,231,183,0.05)', border: '1px solid rgba(110,231,183,0.15)', borderRadius: '6px', padding: '8px', marginBottom: '8px', fontSize: '11px', color: 'var(--muted)' }}>
                      <div style={{ color: 'var(--accent)', marginBottom: '3px', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 Plan</div>
                      {msg.plan}
                    </div>
                  )}
                  <p style={{ fontSize: '12.5px', lineHeight: '1.5', color: 'var(--text)' }}>{msg.content}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe a UI... (Enter to send)"
              rows={2}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '12.5px', lineHeight: '1.4', fontFamily: 'DM Mono, monospace', resize: 'none' }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              style={{ background: input.trim() && !loading ? 'var(--accent)' : '#1e293b', color: 'black', border: 'none', borderRadius: '7px', width: '30px', height: '30px', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {loading ? <span className="spinner" style={{ width: '12px', height: '12px', borderTopColor: 'var(--muted)' }} /> : <SendIcon />}
            </button>
          </div>
          <p style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '5px', textAlign: 'center' }}>Shift+Enter for new line</p>
        </div>
      </div>

      {/* RIGHT - Preview/Code */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ height: '48px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--surface)', gap: '12px' }}>
          <div style={{ display: 'flex' }}>
            {['preview', 'code'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', height: '48px',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
                color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent'
              }}>
                {tab === 'preview' ? <EyeIcon /> : <CodeIcon />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <ClockIcon />
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
              {versions.map((v, i) => (
                <button key={i} onClick={() => switchVersion(i)} style={{
                  background: activeVersion === i ? 'rgba(110,231,183,0.1)' : 'var(--surface2)',
                  border: `1px solid ${activeVersion === i ? 'var(--accent)' : 'var(--border)'}`,
                  color: activeVersion === i ? 'var(--accent)' : 'var(--muted)',
                  borderRadius: '20px', padding: '3px 10px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap'
                }}>
                  {v.label}
                </button>
              ))}
            </div>
            <button onClick={() => setPreviewKey(k => k + 1)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <PlayIcon /> Run
            </button>
            {activeTab === 'code' && (
              <button onClick={copyCode} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', color: copied ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTab === 'preview' ? (
            <iframe key={previewKey} srcDoc={getPreviewHTML(editableCode)} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts" title="Preview" />
          ) : (
            <textarea value={editableCode} onChange={e => setEditableCode(e.target.value)}
              style={{ width: '100%', height: '100%', background: '#0d1117', color: '#e6edf3', border: 'none', outline: 'none', padding: '20px', fontSize: '13px', lineHeight: '1.6', fontFamily: 'DM Mono, monospace', resize: 'none' }}
            />
          )}
        </div>

        {/* Explainer bar */}
        {versions[activeVersion]?.explanation && activeVersion > 0 && (
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'rgba(110,231,183,0.03)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <ChevronRightIcon style={{ color: 'var(--accent)', marginTop: '1px', flexShrink: 0 }} />
            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.4' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>AI Explainer: </span>
              {versions[activeVersion].explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
