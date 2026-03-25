import { useState, useEffect, useRef } from "react"; 
import { getSurahs, getAyahs, getBooks, getHadiths } from "./api/quran";

// ─── API CONFIG ───────────────────────────────────────────────
const API_BASE = "127.0.0.1:8000/api";
const apiFetch = (path) => fetch(`${API_BASE}${path}`).then(r => r.json());
import React from "react";


const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  timeline: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9"
  },
  title: {
    margin: "0 0 5px"
  },
  year: {
    fontWeight: "bold",
    color: "#555"
  },
  desc: {
    fontSize: "14px"
  }
};

 
// ─── THEMES ──────────────────────────────────────────────────
const THEMES = {
  emerald: {
    name: "Emerald Night",
    bg: "#020c06", card: "#051a0e", border: "#0d3320",
    accent: "#10b981", accent2: "#34d399", text: "#e2ffe8",
    muted: "#6b9e7a", nav: "#020c06ee",
  },
  gold: {
    name: "Desert Gold",
    bg: "#0d0900", card: "#1a1100", border: "#3d2800",
    accent: "#f59e0b", accent2: "#fbbf24", text: "#fff8e6",
    muted: "#a07840", nav: "#0d0900ee",
  },
  navy: {
    name: "Ocean Blue",
    bg: "#020818", card: "#050f2c", border: "#0f2460",
    accent: "#3b82f6", accent2: "#60a5fa", text: "#e8f0ff",
    muted: "#5a7ab0", nav: "#020818ee",
  },
  obsidian: {
    name: "Midnight Black",
    bg: "#050505", card: "#0f0f0f", border: "#1f1f1f",
    accent: "#a855f7", accent2: "#c084fc", text: "#f0e8ff",
    muted: "#6b5a80", nav: "#050505ee",
  },
  rose: {
    name: "Rose Dawn",
    bg: "#0d0307", card: "#1a0610", border: "#3d1025",
    accent: "#f43f5e", accent2: "#fb7185", text: "#ffe8ed",
    muted: "#9e5060", nav: "#0d0307ee",
  },
  pearl: {
    name: "Pearl White",
    bg: "#f5f0e8", card: "#ffffff", border: "#ddd5c0",
    accent: "#1a6b3c", accent2: "#2d9e5c", text: "#1a1008",
    muted: "#6b5a40", nav: "#f5f0e8ee",
  },
};

// ─── MOCK DATA (replaces API when backend is not running) ───── 

// ─── NAV CONFIG ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",    label: "Home",         icon: "⌂" },
  { id: "quran",   label: "Quran",        icon: "📖" },
  { id: "hadith",  label: "Hadith",       icon: "📜" },
  { id: "prophets",label: "Prophets",     icon: "🌟" },
  { id: "history", label: "History",      icon: "🕌" },
  { id: "courses", label: "Learn Islam",  icon: "🎓" },
  { id: "prayer",  label: "Prayer Times", icon: "🕐" },
  { id: "scholar", label: "AI Scholar",   icon: "🤖" },
  { id: "library", label: "Library",      icon: "📚" },
];

// ─── GEOMETRIC BACKGROUND ────────────────────────────────────
function GeometricBg({ theme }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg width="100%" height="100%" xmlns="www.w3.org/2000/svg" style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon points="40,2 78,20 78,60 40,78 2,60 2,20" fill="none" stroke={theme.accent} strokeWidth="0.8"/>
            <polygon points="40,12 68,26 68,54 40,68 12,54 12,26" fill="none" stroke={theme.accent} strokeWidth="0.5"/>
            <line x1="40" y1="2" x2="40" y2="12" stroke={theme.accent} strokeWidth="0.5"/>
            <line x1="78" y1="20" x2="68" y2="26" stroke={theme.accent} strokeWidth="0.5"/>
            <line x1="78" y1="60" x2="68" y2="54" stroke={theme.accent} strokeWidth="0.5"/>
            <line x1="40" y1="78" x2="40" y2="68" stroke={theme.accent} strokeWidth="0.5"/>
            <line x1="2" y1="60" x2="12" y2="54" stroke={theme.accent} strokeWidth="0.5"/>
            <line x1="2" y1="20" x2="12" y2="26" stroke={theme.accent} strokeWidth="0.5"/>
            <circle cx="40" cy="40" r="6" fill="none" stroke={theme.accent} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)"/>
      </svg>
      <div style={{ position: "absolute", top: "10%", left: "5%", width: "40vw", height: "40vw", borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent}18 0%, transparent 70%)`, filter: "blur(60px)" }}/>
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "30vw", height: "30vw", borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent2}12 0%, transparent 70%)`, filter: "blur(80px)" }}/>
    </div>
  );
}


 // ─────────────────────────────────────────────────────────────
// PASTE THIS FILE INTO YOUR PROJECT
// Requires: NAV_ITEMS array, THEMES object already defined above
// ─────────────────────────────────────────────────────────────

// ─── SHARED CSS ─────────────────────────────────────────────
// Add once at top level (e.g. in App or index.jsx)
const ISLAMIC_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap');

  /* ── Navbar responsive ── */
  .isl-desktop-nav { display: flex !important; }
  @media (max-width: 768px) {
    .isl-desktop-nav { display: none !important; }
  }

  /* ── Page shell: full height, navbar offset ── */
  .isl-shell {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);   /* 64px = navbar */
    margin-top: 64px;
    overflow: hidden;
    box-sizing: border-box;
  }
  .isl-scroll { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }

  /* ── Hadith slider ── */
  .h-track {
    display: flex;
    transition: transform 0.42s cubic-bezier(0.4,0,0.2,1);
    will-change: transform;
    height: 100%;
  }
  .h-slide { min-width: 100%; height: 100%; overflow-y: auto; box-sizing: border-box; padding: 16px; }

  /* ── Hover cards ── */
  .book-card:hover  { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(26,92,58,.14)  !important; border-color: #1a5c3a !important; }
  .surah-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(26,58,107,.14) !important; border-color: #1a3a6b !important; }

  /* ── Animations ── */
  @keyframes isl-in  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes isl-spin{ to{transform:rotate(360deg)} }
  .isl-card-in { animation: isl-in .35s ease; }
  .isl-spinner { width:38px;height:38px;border-radius:50%;border:3px solid #ddd;border-top-color:currentColor;animation:isl-spin .8s linear infinite; }
`;

// ─── NAVBAR ─────────────────────────────────────────────────
function Navbar({ page, setPage, theme, themeKey, setThemeKey, menuOpen, setMenuOpen }) {
  return (
    <>
      <style>{ISLAMIC_CSS}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        background: theme.nav,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 20px",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,.12)",
      }}>

        {/* ── LOGO ── */}
        <div
          onClick={() => setPage("home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}
        >
          <span style={{
            fontSize: "28px", lineHeight: 1,
            background: `linear-gradient(135deg,${theme.accent},${theme.accent}99)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>☪</span>
          <div>
            <div style={{ fontFamily: "'Amiri','Georgia',serif", fontSize: "17px", fontWeight: 700, color: theme.accent, lineHeight: 1 }}>
              ISLAM
            </div>
            <div style={{ fontSize: "8.5px", color: theme.muted, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Al-Maktaba Al-Islamiyya
            </div>
          </div>
        </div>

        {/* ── DESKTOP NAV LINKS — hidden on mobile via CSS ── */}
        <div
          className="isl-desktop-nav"
          style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: "2px", overflow: "hidden" }}
        >
          {NAV_ITEMS.slice(0, 7).map(item => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMenuOpen(false); }}
              style={{
                background: page === item.id ? `${theme.accent}1a` : "transparent",
                border: `1px solid ${page === item.id ? theme.accent + "44" : "transparent"}`,
                color: page === item.id ? theme.accent : theme.muted,
                padding: "6px 11px", borderRadius: "8px", cursor: "pointer",
                fontSize: "12.5px", fontWeight: page === item.id ? 700 : 400,
                transition: "all .2s", whiteSpace: "nowrap", fontFamily: "'Georgia',serif",
              }}
            >
              <span style={{ marginRight: "4px" }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>

        {/* ── RIGHT CONTROLS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {/* Theme dots */}
          <div style={{ display: "flex", gap: "5px" }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <div
                key={key}
                title={t.name}
                onClick={() => setThemeKey(key)}
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: t.accent, cursor: "pointer",
                  border: themeKey === key ? `2px solid ${theme.text}` : "2px solid transparent",
                  transition: "all .2s",
                }}
              />
            ))}
          </div>

          {/* Hamburger — ALWAYS visible (full menu on mobile, overflow items on desktop) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: menuOpen ? `${theme.accent}22` : "transparent",
              border: `1px solid ${theme.border}`,
              color: theme.text,
              width: 38, height: 38, borderRadius: "9px",
              cursor: "pointer", fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ── DROPDOWN MENU (mobile: all items | desktop: full list) ── */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: "64px", left: 0, right: 0, zIndex: 400,
            background: theme.card,
            borderBottom: `1px solid ${theme.border}`,
            padding: "10px 12px",
            display: "flex", flexDirection: "column", gap: "3px",
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
          }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMenuOpen(false); }}
                style={{
                  background: page === item.id ? `${theme.accent}18` : "transparent",
                  border: "none",
                  color: page === item.id ? theme.accent : theme.text,
                  padding: "11px 14px", borderRadius: "8px",
                  cursor: "pointer", fontSize: "14px", textAlign: "left",
                  fontFamily: "'Georgia',serif",
                  fontWeight: page === item.id ? 700 : 400,
                  transition: "background .15s",
                }}
              >
                {item.icon}  {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}


// ─── STATUS GRADING ─────────────────────────────────────────
const STATUS_CFG = {
  sahih:   { label: "Sahih",  bg: "#e6f4ea", color: "#1e7e34", border: "#a8d5b5", dot: "#1e7e34" },
  hasan:   { label: "Hasan",  bg: "#fff8e1", color: "#b8860b", border: "#f0d080", dot: "#d4a017" },
  daif:    { label: "Da'if",  bg: "#fdecea", color: "#c0392b", border: "#f5b7b1", dot: "#c0392b" },
  "da'if": { label: "Da'if",  bg: "#fdecea", color: "#c0392b", border: "#f5b7b1", dot: "#c0392b" },
  default: { label: "",       bg: "#f0f0f0", color: "#666",    border: "#ccc",    dot: "#aaa"    },
};
const getSC = (s = "") => STATUS_CFG[s.toLowerCase()] || STATUS_CFG.default;


// ─── HADITH PAGE ─────────────────────────────────────────────
function HadithPage({ theme }) {
  const [books,        setBooks]        = React.useState([]);
  const [hadiths,      setHadiths]      = React.useState([]);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [search,       setSearch]       = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [page,         setPage]         = React.useState(1);
  const [nextPage,     setNextPage]     = React.useState(null);
  const [prevPage,     setPrevPage]     = React.useState(null);
  const [loading,      setLoading]      = React.useState(false);
  const [idx,          setIdx]          = React.useState(0);
  const trackRef = React.useRef(null);

  const G  = "#1a5c3a";
  const GB = "#f0f7f2";

  // sync slider position
  React.useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${idx * 100}%)`;
    }
  }, [idx]);

  React.useEffect(() => {
    getBooks().then(setBooks).catch(console.error);
  }, []);

  const fetchHadiths = (bookId, pageNum = 1) => {
    setLoading(true);
    setPage(pageNum);
    setHadiths([]);
    setIdx(0);
    getHadiths(bookId, pageNum, search, filterStatus)
      .then(data => {
        const results = data.results ? data.results : data;
        setHadiths(results || []);
        setNextPage(data.next || null);
        setPrevPage(data.previous || null);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const openBook = (id) => {
    setSelectedBook(id);
    setTimeout(() => fetchHadiths(id, 1), 80);
  };

  const canNext = idx < hadiths.length - 1 || !!nextPage;
  const canPrev = idx > 0 || !!prevPage;

  const goNext = () => {
    if (idx < hadiths.length - 1) { setIdx(i => i + 1); }
    else if (nextPage) { fetchHadiths(selectedBook, page + 1); }
  };
  const goPrev = () => {
    if (idx > 0) { setIdx(i => i - 1); }
    else if (prevPage) { fetchHadiths(selectedBook, page - 1); }
  };

  return (
    <div className="isl-shell" style={{ background: theme?.bg || "#f9f6f0", fontFamily: "'Georgia',serif", color: theme?.text || "#1a1a1a" }}>

      {/* ── PAGE SUB-HEADER ── */}
      <div style={{
        background: `linear-gradient(135deg,${G},#0d3d26)`,
        padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, gap: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {selectedBook && (
            <button
              onClick={() => setSelectedBook(null)}
              style={{
                background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)",
                color: "#fff", borderRadius: "8px", padding: "5px 12px",
                cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
              }}
            >← Books</button>
          )}
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Amiri','Georgia',serif" }}>
            {selectedBook ? "📖 Hadith Reader" : "📚 Hadith Collection"}
          </span>
        </div>
        {selectedBook && hadiths.length > 0 && (
          <span style={{
            background: "rgba(255,255,255,.2)", color: "#fff",
            borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700,
          }}>
            {idx + 1} / {hadiths.length}  ·  Page {page}
          </span>
        )}
      </div>

      {/* ── BOOK GRID ── */}
      {!selectedBook && (
        <div className="isl-scroll" style={{ padding: "20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: "14px", maxWidth: "1100px", margin: "0 auto",
          }}>
            {books.map(book => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => openBook(book.id)}
                style={{
                  background: theme?.card || "#fff",
                  border: `1px solid ${theme?.border || "#e0ead8"}`,
                  borderRadius: "14px", padding: "18px 18px 18px 22px",
                  cursor: "pointer", transition: "all .25s",
                  boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* accent strip */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: `linear-gradient(180deg,${G},#4caf50)`, borderRadius: "14px 0 0 14px" }} />
                <div style={{ fontSize: "26px", marginBottom: "6px" }}>📗</div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: G, marginBottom: "4px" }}>{book.name}</div>
                <div style={{ fontSize: "12px", color: theme?.muted || "#888" }}>Tap to explore →</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HADITH READER ── */}
      {selectedBook && (
        <>
          {/* Filter bar */}
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap",
            padding: "10px 16px", flexShrink: 0,
            background: theme?.card || "#fff",
            borderBottom: `1px solid ${theme?.border || "#e8f0e8"}`,
          }}>
            <input
              type="text" placeholder="🔍  Search hadith…"
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchHadiths(selectedBook, 1)}
              style={{
                flex: 1, minWidth: "130px", padding: "9px 13px",
                border: `1.5px solid ${theme?.border || "#c8e0c8"}`,
                borderRadius: "10px", fontSize: "13px",
                background: theme?.bg || "#f7fbf7", color: theme?.text || "#1a1a1a",
                fontFamily: "inherit", outline: "none",
              }}
            />
            <select
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: "9px 12px",
                border: `1.5px solid ${theme?.border || "#c8e0c8"}`,
                borderRadius: "10px", fontSize: "13px",
                background: theme?.bg || "#f7fbf7", color: theme?.text || "#1a1a1a",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <option value="">All Grades</option>
              <option value="Sahih">✅ Sahih</option>
              <option value="Hasan">🟡 Hasan</option>
              <option value="Daif">🔴 Da'if</option>
            </select>
            <button
              onClick={() => fetchHadiths(selectedBook, 1)}
              style={{
                padding: "9px 18px",
                background: `linear-gradient(135deg,${G},#2e8b57)`,
                color: "#fff", border: "none", borderRadius: "10px",
                cursor: "pointer", fontWeight: 700, fontSize: "13px", fontFamily: "inherit",
              }}
            >Search</button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", color: G }}>
              <div className="isl-spinner" style={{ color: G }} />
              <span style={{ fontSize: "14px" }}>Loading Hadiths…</span>
            </div>
          )}

          {/* Empty */}
          {!loading && hadiths.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: theme?.muted || "#888", gap: "8px" }}>
              <span style={{ fontSize: "44px" }}>🔍</span>
              <p style={{ margin: 0 }}>No Hadith Found</p>
            </div>
          )}

          {/* Slider */}
          {!loading && hadiths.length > 0 && (
            <>
              {/* Slider viewport — clips overflow, fills remaining space */}
              <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                <div className="h-track" ref={trackRef}>
                  {hadiths.map((h) => {
                    const sc = getSC(h.status);
                    return (
                      <div key={h.id} className="h-slide">
                        {/* Card */}
                        <div
                          className="isl-card-in"
                          style={{
                            background: theme?.card || "#fff",
                            borderRadius: "18px",
                            boxShadow: "0 4px 24px rgba(0,0,0,.09)",
                            overflow: "hidden",
                            maxWidth: "760px",
                            margin: "0 auto",
                          }}
                        >
                          {/* Top bar */}
                          <div style={{
                            background: `linear-gradient(135deg,${G},#0d3d26)`,
                            padding: "13px 18px",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                          }}>
                            <span style={{ color: "#ffffffcc", fontSize: "13px" }}>
                              📖 {h.book?.name || "Unknown Book"}
                            </span>
                            <span style={{
                              color: "#fff", fontWeight: 800, fontSize: "12px",
                              background: "rgba(255,255,255,.2)", padding: "3px 12px", borderRadius: "20px",
                            }}>
                              #{h.hadith_number}
                            </span>
                          </div>

                          {/* Chapter banner — always render if any chapter data exists */}
                          {h.chapter && (h.chapter.chapter_number || h.chapter.english || h.chapter.urdu) && (
                            <div style={{
                              background: GB, borderLeft: `4px solid ${G}`,
                              padding: "10px 18px", fontSize: "13px",
                              color: "#2e6b47", fontWeight: 600,
                              display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center",
                            }}>
                              <span>📚 Chapter {h.chapter.chapter_number || "—"}</span>
                              {h.chapter.english && <span>— {h.chapter.english}</span>}
                              {h.chapter.urdu && (
                                <span style={{ fontFamily: "'Scheherazade New',serif", direction: "rtl", fontSize: "14px" }}>
                                  ({h.chapter.urdu})
                                </span>
                              )}
                            </div>
                          )}

                          {/* Body */}
                          <div style={{ padding: "18px" }}>
                            {/* Status badge */}
                            {h.status && (
                              <div style={{ marginBottom: "14px" }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: "6px",
                                  background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                                  borderRadius: "20px", padding: "4px 14px",
                                  fontSize: "11px", fontWeight: 800, letterSpacing: ".6px", textTransform: "uppercase",
                                }}>
                                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                                  {sc.label || h.status}
                                </span>
                              </div>
                            )}

                            {/* Arabic */}
                            <div style={{
                              fontSize: "clamp(20px,4vw,26px)", direction: "rtl", lineHeight: 2.2,
                              fontFamily: "'Scheherazade New','Traditional Arabic','Arial Unicode MS',serif",
                              background: "linear-gradient(135deg,#f9f6f0,#fdf8f0)",
                              color: "black",
                              border: "1px solid #e8dfc8", borderRadius: "12px",
                              padding: "16px", marginBottom: "16px", textAlign: "right",
                            }}>
                              {h.text_arabic || "Arabic not available"}
                            </div>

                            <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}44,transparent)`, margin: "14px 0" }} />

                            {/* Urdu */}
                            <div style={{ marginBottom: "14px" }}>
                              <div style={{ fontSize: "10px", color: theme?.muted || "#aaa", textTransform: "uppercase", letterSpacing: "1px", textAlign: "right", marginBottom: "4px" }}>
                                اردو ترجمہ
                              </div>
                              <p style={{
                                fontSize: "clamp(15px,3vw,17px)", direction: "rtl", lineHeight: 2.0, margin: 0,
                                fontFamily: "'Noto Nastaliq Urdu','Jameel Noori Nastaleeq','Arial Unicode MS',serif",
                                textAlign: "right", color: theme?.text || "#2d2d2d",
                              }}>
                                {h.text_urdu || "Urdu not available"}
                              </p>
                            </div>

                            <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${G}44,transparent)`, margin: "14px 0" }} />

                            {/* English */}
                            <div>
                              <div style={{ fontSize: "10px", color: theme?.muted || "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                                English Translation
                              </div>
                              <p style={{
                                fontSize: "clamp(13px,2.5vw,15px)", lineHeight: 1.85, margin: 0,
                                fontFamily: "'Georgia',serif", color: (theme?.text || "#444") + "cc",
                              }}>
                                {h.text_english || "English not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom nav */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 16px", gap: "10px", flexShrink: 0,
                background: theme?.card || "#fff",
                borderTop: `1px solid ${theme?.border || "#e8f0e8"}`,
                boxShadow: "0 -4px 16px rgba(0,0,0,.06)",
              }}>
                <button
                  onClick={goPrev} disabled={!canPrev}
                  style={{
                    padding: "9px 18px", borderRadius: "12px",
                    border: `2px solid ${G}`, background: "#fff", color: G,
                    cursor: canPrev ? "pointer" : "not-allowed",
                    opacity: canPrev ? 1 : 0.32,
                    fontWeight: 700, fontSize: "13px", fontFamily: "inherit", transition: "all .2s",
                  }}
                >← Prev</button>

                {/* Progress dots */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                    {hadiths
                      .slice(Math.max(0, idx - 3), Math.min(hadiths.length, idx + 4))
                      .map((_, di) => {
                        const ri = Math.max(0, idx - 3) + di;
                        return (
                          <div
                            key={ri}
                            onClick={() => setIdx(ri)}
                            style={{
                              width: ri === idx ? 18 : 8, height: 8,
                              borderRadius: "4px", cursor: "pointer",
                              background: ri === idx ? G : (theme?.border || "#c8e0c8"),
                              transition: "all .25s",
                            }}
                          />
                        );
                      })}
                  </div>
                  <span style={{ fontSize: "10px", color: theme?.muted || "#999" }}>
                    {idx + 1} of {hadiths.length} · Page {page}
                  </span>
                </div>

                <button
                  onClick={goNext} disabled={!canNext}
                  style={{
                    padding: "9px 18px", borderRadius: "12px",
                    border: `2px solid ${G}`, background: G, color: "#fff",
                    cursor: canNext ? "pointer" : "not-allowed",
                    opacity: canNext ? 1 : 0.32,
                    fontWeight: 700, fontSize: "13px", fontFamily: "inherit", transition: "all .2s",
                  }}
                >Next →</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}


// ─── QURAN PAGE ──────────────────────────────────────────────
function QuranPage({ theme }) {
  const [surahs,        setSurahs]        = React.useState([]);
  const [ayahs,         setAyahs]         = React.useState([]);
  const [selectedSurah, setSelectedSurah] = React.useState(null);
  const [loading,       setLoading]       = React.useState(false);
  const [surahIdx,      setSurahIdx]      = React.useState(0);

  const B  = "#1a3a6b";
  const BB = "#eef3fc";

  const TYPES = {
    Meccan:  { bg: "#fff8e1", color: "#b8860b", border: "#f0d080" },
    Medinan: { bg: "#e8f5e9", color: "#1e7e34", border: "#a8d5b5" },
  };

  React.useEffect(() => {
    getSurahs().then(setSurahs).catch(console.error);
  }, []);

  const openSurah = (id) => {
    const i = surahs.findIndex(s => s.id === id);
    if (i !== -1) setSurahIdx(i);
    setLoading(true);
    getAyahs(id)
      .then(data => { setAyahs(data); setSelectedSurah(id); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const goNext = () => { if (surahIdx < surahs.length - 1) openSurah(surahs[surahIdx + 1].id); };
  const goPrev = () => { if (surahIdx > 0) openSurah(surahs[surahIdx - 1].id); };

  const curSurah = surahs.find(s => s.id === selectedSurah);

  return (
    <div className="isl-shell" style={{ background: theme?.bg || "#f9f6f0", fontFamily: "'Georgia',serif", color: theme?.text || "#1a1a1a" }}>

      {/* ── PAGE SUB-HEADER ── */}
      <div style={{
        background: `linear-gradient(135deg,${B},#0d2447)`,
        padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {selectedSurah && (
            <button
              onClick={() => setSelectedSurah(null)}
              style={{
                background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)",
                color: "#fff", borderRadius: "8px", padding: "5px 12px",
                cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
              }}
            >☰ All</button>
          )}
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Amiri','Georgia',serif" }}>
            {selectedSurah ? (curSurah?.transliteration || "Surah") : "📖 The Holy Quran"}
          </span>
          {selectedSurah && (
            <span style={{
              background: "rgba(255,255,255,.2)", color: "#fff",
              borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700,
            }}>
              {surahIdx + 1} / {surahs.length}
            </span>
          )}
        </div>

        {/* Surah prev/next in header */}
        {selectedSurah && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={goPrev} disabled={surahIdx === 0}
              style={{
                background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)",
                color: "#fff", borderRadius: "8px", padding: "5px 13px",
                cursor: surahIdx === 0 ? "not-allowed" : "pointer",
                opacity: surahIdx === 0 ? 0.35 : 1, fontSize: "12px", fontFamily: "inherit",
              }}
            >← Prev</button>
            <button
              onClick={goNext} disabled={surahIdx === surahs.length - 1}
              style={{
                background: "rgba(255,255,255,.22)", border: "1px solid rgba(255,255,255,.4)",
                color: "#fff", borderRadius: "8px", padding: "5px 13px",
                cursor: surahIdx === surahs.length - 1 ? "not-allowed" : "pointer",
                opacity: surahIdx === surahs.length - 1 ? 0.35 : 1,
                fontSize: "12px", fontFamily: "inherit", fontWeight: 700,
              }}
            >Next →</button>
          </div>
        )}
      </div>

      {/* ── SURAH GRID ── */}
      {!selectedSurah && (
        <div className="isl-scroll" style={{ padding: "20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
            gap: "12px", maxWidth: "1100px", margin: "0 auto",
          }}>
            {surahs.map(s => {
              const t = TYPES[s.type] || TYPES["Meccan"];
              return (
                <div
                  key={s.id}
                  className="surah-card"
                  onClick={() => openSurah(s.id)}
                  style={{
                    background: theme?.card || "#fff",
                    border: `1px solid ${theme?.border || "#dde8f5"}`,
                    borderRadius: "14px", padding: "16px",
                    cursor: "pointer", transition: "all .25s",
                    boxShadow: "0 2px 8px rgba(0,0,0,.05)",
                    display: "flex", gap: "12px", alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, flexShrink: 0,
                    background: `linear-gradient(135deg,${B},#2557a7)`,
                    color: "#fff", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "13px",
                  }}>{s.id}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "18px", fontWeight: 700, color: B,
                      margin: "0 0 2px", direction: "rtl",
                      fontFamily: "'Scheherazade New','Traditional Arabic',serif",
                    }}>{s.name}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: theme?.text || "#333", marginBottom: "5px" }}>
                      {s.transliteration}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: theme?.muted || "#999" }}>
                        {s.verses?.length || "–"} Ayahs
                      </span>
                      {s.type && (
                        <span style={{
                          fontSize: "10px", fontWeight: 700,
                          background: t.bg, color: t.color, border: `1px solid ${t.border}`,
                          borderRadius: "10px", padding: "2px 8px",
                        }}>{s.type}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AYAH READER ── */}
      {selectedSurah && (
        <div className="isl-scroll">
          {/* Surah header */}
          <div style={{
            background: `linear-gradient(160deg,${B},#0d2447)`,
            color: "#fff", textAlign: "center", padding: "26px 20px 20px",
          }}>
            {selectedSurah !== 1 && selectedSurah !== 9 && (
              <div style={{
                fontSize: "clamp(22px,5vw,30px)",
                fontFamily: "'Scheherazade New','Traditional Arabic',serif",
                marginBottom: "10px", opacity: .9,
              }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </div>
            )}
            <div style={{
              fontSize: "clamp(22px,5vw,30px)", fontWeight: 800,
              fontFamily: "'Scheherazade New',serif", marginBottom: "4px",
            }}>
              {curSurah?.name}
            </div>
            <div style={{ fontSize: "15px", opacity: .78 }}>{curSurah?.transliteration}</div>
            <div style={{ fontSize: "12px", opacity: .6, marginTop: "8px", display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <span>Surah {selectedSurah}</span>
              <span>·</span>
              <span>{ayahs.length} Ayahs</span>
              {curSurah?.type && <><span>·</span><span>{curSurah.type}</span></>}
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: "14px", color: B }}>
              <div className="isl-spinner" style={{ color: B }} />
              <span style={{ fontSize: "14px" }}>Loading Surah…</span>
            </div>
          ) : (
            <div style={{ padding: "16px", maxWidth: "820px", margin: "0 auto", paddingBottom: "90px" }}>
              {ayahs.map((a, i) => (
                <div
                  key={a.id}
                  className="isl-card-in"
                  style={{
                    background: theme?.card || "#fff",
                    borderRadius: "14px", padding: "18px",
                    marginBottom: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,.06)",
                    border: `1px solid ${theme?.border || "#e8eef8"}`,
                  }}
                >
                  {/* Ayah badge */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                    <div style={{
                      width: 34, height: 34,
                      background: `linear-gradient(135deg,${B},#2557a7)`,
                      color: "#fff", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "12px",
                    }}>{i + 1}</div>
                  </div>

                  {/* Arabic */}
                  <p style={{
                    fontSize: "clamp(22px,4.5vw,28px)", direction: "rtl", lineHeight: 2.4, margin: "0 0 12px",
                    fontFamily: "'Scheherazade New','Traditional Arabic','Arial Unicode MS',serif",
                    textAlign: "right",
                    background: "linear-gradient(135deg,#f9f6f0,#fdf8ee)",
                    color: "black",
                    padding: "14px", borderRadius: "10px", border: "1px solid #e8dfc8",
                  }}>{a.text}</p>

                  {/* Divider */}
                  <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B}33,transparent)`, margin: "12px 0" }} />

                  {/* Translation */}
                  <div style={{ fontSize: "10px", color: theme?.muted || "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                    Translation
                  </div>
                  <p style={{
                    fontSize: "clamp(13px,2.5vw,15px)", lineHeight: 1.85, margin: 0,
                    fontFamily: "'Georgia',serif", color: (theme?.text || "#444") + "bb",
                  }}>{a.translation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sticky bottom surah nav */}
          <div style={{
            position: "sticky", bottom: 0,
            background: theme?.card || "#fff",
            borderTop: `1px solid ${theme?.border || "#dde8f5"}`,
            padding: "10px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 -4px 16px rgba(0,0,0,.08)", gap: "10px",
          }}>
            <button
              onClick={goPrev} disabled={surahIdx === 0}
              style={{
                padding: "9px 16px", borderRadius: "10px",
                border: `2px solid ${B}`, background: "#fff", color: B,
                cursor: surahIdx === 0 ? "not-allowed" : "pointer",
                opacity: surahIdx === 0 ? 0.32 : 1,
                fontWeight: 700, fontSize: "12px", fontFamily: "inherit", transition: "all .2s",
              }}
            >← Prev Surah</button>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                display: "inline-block", background: BB, color: B,
                padding: "5px 16px", borderRadius: "20px",
                fontWeight: 700, fontSize: "12px", border: `1px solid ${B}33`,
              }}>
                {surahIdx + 1} / {surahs.length}
              </div>
            </div>

            <button
              onClick={goNext} disabled={surahIdx === surahs.length - 1}
              style={{
                padding: "9px 16px", borderRadius: "10px",
                border: `2px solid ${B}`, background: B, color: "#fff",
                cursor: surahIdx === surahs.length - 1 ? "not-allowed" : "pointer",
                opacity: surahIdx === surahs.length - 1 ? 0.32 : 1,
                fontWeight: 700, fontSize: "12px", fontFamily: "inherit", transition: "all .2s",
              }}
            >Next Surah →</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage, theme }) {
  const features = [
    { icon: "📖", title: "Holy Quran", desc: "114 Surahs with Arabic, translation & tafsir", page: "quran" },
    { icon: "📜", title: "Hadith Library", desc: "Bukhari, Muslim & all major collections", page: "hadith" },
    { icon: "🌟", title: "25 Prophets", desc: "Full biographies from Adam to Muhammad ﷺ", page: "prophets" },
    { icon: "🕌", title: "Islamic History", desc: "1400+ years from revelation to today", page: "history" },
    { icon: "🎓", title: "Learn Islam", desc: "Structured courses for all levels", page: "courses" },
    { icon: "🕐", title: "Prayer Times", desc: "Accurate times for any city worldwide", page: "prayer" },
    { icon: "🤖", title: "AI Scholar", desc: "Powered by Claude — ask anything Islamic", page: "scholar" },
    { icon: "📚", title: "Library", desc: "Classic Islamic books & divine scriptures", page: "library" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "120px 24px 80px", position: "relative" }}>
        <div style={{ fontSize: "70px", marginBottom: "16px", lineHeight: 1 }}>☪</div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px,6vw,56px)", fontWeight: 700,
                      color: theme.text, lineHeight: 1.1, marginBottom: "12px" }}>
          Al-Maktaba Al-Islamiyya Al-Kubra
        </div>
        <div style={{ fontSize: "clamp(14px,2vw,18px)", color: theme.muted, marginBottom: "8px",
                      fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          The World's Most Comprehensive Islamic Encyclopedia
        </div>
        <div style={{ fontSize: "clamp(18px,4vw,28px)", color: theme.accent, marginBottom: "40px",
                      fontFamily: "serif", letterSpacing: "0.05em" }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("quran")}
            style={{ background: theme.accent, color: theme.bg, padding: "14px 32px",
                     borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700,
                     cursor: "pointer", letterSpacing: "0.03em" }}>
            📖 Open Quran
          </button>
          <button onClick={() => setPage("scholar")}
            style={{ background: "transparent", color: theme.accent, padding: "14px 32px",
                     borderRadius: "12px", border: `2px solid ${theme.accent}`, fontSize: "16px",
                     fontWeight: 600, cursor: "pointer" }}>
            🤖 Ask AI Scholar
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px",
                    display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "16px" }}>
        {features.map(f => (
          <div key={f.page} onClick={() => setPage(f.page)}
            style={{
              background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: "16px", padding: "28px 24px", cursor: "pointer",
              transition: "all 0.25s", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${theme.accent}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>{f.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: theme.text, marginBottom: "8px" }}>{f.title}</div>
            <div style={{ fontSize: "13px", color: theme.muted, lineHeight: 1.5 }}>{f.desc}</div>
            <div style={{ position: "absolute", bottom: "16px", right: "20px",
                          color: theme.accent, fontSize: "20px", opacity: 0.5 }}>→</div>
          </div>
        ))}
      </div>

      {/* Quran verse banner */}
      <div style={{ background: `linear-gradient(135deg, ${theme.accent}18, ${theme.accent2}08)`,
                    border: `1px solid ${theme.accent}33`, margin: "0 24px 80px",
                    borderRadius: "20px", padding: "40px", textAlign: "center",
                    maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ fontSize: "clamp(20px,4vw,32px)", color: theme.accent, fontFamily: "serif",
                      lineHeight: 1.8, marginBottom: "16px", direction: "rtl" }}>
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </div>
        <div style={{ fontSize: "16px", color: theme.text, fontStyle: "italic", marginBottom: "8px" }}>
          "Indeed, with hardship will be ease."
        </div>
        <div style={{ fontSize: "13px", color: theme.muted }}>Surah Al-Inshirah (94:6)</div>
      </div>

      {/* Developer credit */}
      <div style={{ textAlign: "center", padding: "40px 24px 80px", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>👨‍💻</div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: theme.text, marginBottom: "6px" }}>Muhammad Ahmad Farid</div>
        <div style={{ fontSize: "13px", color: theme.muted }}>Developer — Built with ❤️ for Islam and all of humanity</div>
      </div>
    </div>
  );
}
 

// ============================================================
// HADITH PAGE — Islam360-inspired UI
// ============================================================



 
// ─── PROPHETS PAGE ────────────────────────────────────────────
function ProphetsPage({ theme }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const filtered = MOCK_PROPHETS.filter(p =>
    p.name_english.toLowerCase().includes(search.toLowerCase()) ||
    p.name_arabic.includes(search)
  );

  if (selected) return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 24px 60px" }}>
      <button onClick={() => setSelected(null)}
        style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.text,
                 padding: "10px 20px", borderRadius: "10px", cursor: "pointer", marginBottom: "28px" }}>
        ← All Prophets
      </button>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "20px", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌟</div>
          <h2 style={{ fontFamily: "serif", fontSize: "clamp(24px,5vw,36px)", color: theme.accent, margin: "0 0 8px" }}>
            {selected.name_english}
          </h2>
          <div style={{ fontSize: "clamp(20px,4vw,28px)", color: theme.text, fontFamily: "serif", marginBottom: "8px" }}>
            {selected.name_arabic}
          </div>
          <div style={{ color: theme.accent, fontSize: "14px", fontStyle: "italic" }}>
            {selected.title} — {selected.title_meaning}
          </div>
        </div>
        {[
          { label: "Era & Location", value: selected.era },
          { label: "Nation Sent To", value: selected.nation },
          { label: "Revealed Book", value: selected.revealed_book },
          { label: "Lifespan", value: selected.lifespan },
          { label: "Quran Mentions", value: `${selected.quran_mentions} times` },
        ].filter(i => i.value).map(item => (
          <div key={item.label} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ minWidth: "160px", color: theme.muted, fontSize: "13px", fontWeight: 600 }}>{item.label}</div>
            <div style={{ color: theme.text, fontSize: "14px" }}>{item.value}</div>
          </div>
        ))}
        {[
          { label: "Biography", text: selected.biography },
          { label: "Miracles", text: selected.miracles },
          { label: "Key Events", text: selected.key_events },
        ].map(s => (
          <div key={s.label} style={{ marginTop: "24px" }}>
            <h3 style={{ color: theme.accent, fontSize: "16px", marginBottom: "12px" }}>{s.label}</h3>
            <p style={{ color: theme.text, lineHeight: "1.8", fontSize: "14px", margin: 0 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "clamp(24px,5vw,42px)", color: theme.accent, textAlign: "center", marginBottom: "8px" }}>🌟 The 25 Prophets of Islam</h1>
      <p style={{ textAlign: "center", color: theme.muted, marginBottom: "32px", fontSize: "14px" }}>From Adam (AS) to Muhammad ﷺ — Complete Biographies</p>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prophets..."
        style={{ width: "100%", maxWidth: "400px", display: "block", margin: "0 auto 32px",
                 background: theme.card, border: `1px solid ${theme.border}`, color: theme.text,
                 padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none" }}/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "16px" }}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => setSelected(p)}
            style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "16px",
                     padding: "28px 20px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${theme.accent}22`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ background: `${theme.accent}22`, color: theme.accent, width: "40px", height: "40px",
                          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px", fontWeight: 700, margin: "0 auto 14px" }}>{p.order}</div>
            <div style={{ fontSize: "22px", color: theme.accent, fontFamily: "serif", marginBottom: "8px" }}>{p.name_arabic}</div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: "18px", marginBottom: "6px" }}>{p.name_english}</div>
            <div style={{ fontSize: "12px", color: theme.accent, fontStyle: "italic", marginBottom: "8px" }}>{p.title}</div>
            <div style={{ fontSize: "12px", color: theme.muted }}>{p.era}</div>
            <div style={{ marginTop: "10px", fontSize: "11px", background: `${theme.accent}22`, color: theme.accent,
                          padding: "3px 10px", borderRadius: "20px", display: "inline-block" }}>
              📖 {p.revealed_book}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────
 const MOCK_HISTORY = [
  {
    id: 1,
    title: "Birth of Prophet Muhammad (PBUH)",
    year: "570 CE",
    description:
      "Prophet Muhammad (PBUH) was born in Mecca. His teachings later formed the foundation of Islam."
  },
  {
    id: 2,
    title: "First Revelation",
    year: "610 CE",
    description:
      "The first revelation of the Quran was received in the Cave of Hira through Angel Jibreel."
  },
  {
    id: 3,
    title: "Hijrah (Migration to Medina)",
    year: "622 CE",
    description:
      "The migration from Mecca to Medina marks the beginning of the Islamic calendar."
  },
  {
    id: 4,
    title: "Battle of Badr",
    year: "624 CE",
    description:
      "A key early battle where Muslims achieved a significant victory against the Quraysh."
  },
  {
    id: 5,
    title: "Conquest of Mecca",
    year: "630 CE",
    description:
      "Prophet Muhammad (PBUH) peacefully conquered Mecca and cleansed the Kaaba of idols."
  },
  {
    id: 6,
    title: "Golden Age of Islam",
    year: "8th–13th Century",
    description:
      "A period of major advancements in science, medicine, mathematics, and philosophy."
  }
];

const HistoryPage = () => {
 const [openEra, setOpenEra] = useState(null);
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "clamp(24px,5vw,42px)", color: theme.accent, textAlign: "center", marginBottom: "8px" }}>🕌 Islamic History</h1>
      <p style={{ textAlign: "center", color: theme.muted, marginBottom: "40px", fontSize: "14px" }}>1,400+ Years of Islamic Civilization</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MOCK_HISTORY.map((era, i) => (
          <div key={i} style={{ background: theme.card, border: `1px solid ${openEra === i ? theme.accent : theme.border}`,
                                borderRadius: "14px", overflow: "hidden", transition: "all 0.2s" }}>
            <div onClick={() => setOpenEra(openEra === i ? null : i)}
              style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, color: theme.text, fontSize: "16px", marginBottom: "4px" }}>{era.era}</div>
                <div style={{ fontSize: "12px", color: theme.accent }}>{era.period}</div>
              </div>
              <div style={{ color: theme.accent, fontSize: "20px", transition: "transform 0.2s",
                            transform: openEra === i ? "rotate(180deg)" : "none" }}>▾</div>
            </div>
            {openEra === i && (
              <div style={{ borderTop: `1px solid ${theme.border}`, padding: "20px 24px" }}>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {era.events.map((ev, j) => (
                    <li key={j} style={{ color: theme.muted, fontSize: "14px", lineHeight: "2", marginBottom: "4px" }}>
                      <span style={{ color: theme.text }}>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


// ─── COURSES PAGE ─────────────────────────────────────────────
function CoursesPage({ theme }) {
  const courses = [
    { icon: "🕌", title: "5 Pillars of Islam", level: "Beginner", lessons: 10, desc: "Master the fundamental obligations: Shahada, Salah, Zakat, Sawm, and Hajj." },
    { icon: "💫", title: "Islamic Faith (Aqeedah)", level: "Beginner", lessons: 8, desc: "6 pillars of Iman: Allah, Angels, Books, Prophets, Day of Judgment, Qadar." },
    { icon: "🤲", title: "How to Pray (Salah)", level: "Beginner", lessons: 12, desc: "Complete guide to Islamic prayer — Wudu, positions, duas, and times." },
    { icon: "📿", title: "Quran Sciences (Tajweed)", level: "Intermediate", lessons: 15, desc: "Learn to recite the Quran beautifully with proper pronunciation rules." },
    { icon: "⚖️", title: "Islamic Jurisprudence (Fiqh)", level: "Intermediate", lessons: 20, desc: "Core Islamic law — Halal, Haram, worship, business, and family rulings." },
    { icon: "🌙", title: "Ramadan & Fasting", level: "Beginner", lessons: 7, desc: "Rules, virtues, and spiritual dimensions of fasting in Ramadan." },
    { icon: "🕋", title: "Hajj & Umrah", level: "Intermediate", lessons: 14, desc: "Step-by-step guide to the pilgrimage — rituals, duas, and preparation." },
    { icon: "👨‍👩‍👧", title: "Islamic Family Values", level: "All Levels", lessons: 9, desc: "Marriage, parenting, rights of spouses, and raising Muslim children." },
    { icon: "✨", title: "Islamic Character (Akhlaq)", level: "All Levels", lessons: 11, desc: "Sunnah habits, good manners, honesty, patience, and gratitude in Islam." },
    { icon: "👸", title: "Women in Islam", level: "All Levels", lessons: 8, desc: "Rights, status, hijab, marriage, and the honored role of Muslim women." },
    { icon: "⚔️", title: "Jihad — True Meaning", level: "Advanced", lessons: 6, desc: "Understand the real concept of Jihad: spiritual, moral, and societal." },
    { icon: "🌍", title: "Islam & Modern World", level: "Advanced", lessons: 10, desc: "How Islam addresses contemporary issues — finance, science, politics." },
  ];

  const levelColors = { "Beginner": "#10b981", "Intermediate": "#f59e0b", "Advanced": "#f43f5e", "All Levels": "#3b82f6" };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "clamp(24px,5vw,42px)", color: theme.accent, textAlign: "center", marginBottom: "8px" }}>🎓 Learn Islam</h1>
      <p style={{ textAlign: "center", color: theme.muted, marginBottom: "40px", fontSize: "14px" }}>Structured Islamic Education — Beginner to Advanced</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
        {courses.map((c, i) => (
          <div key={i}
            style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "16px",
                     padding: "28px 24px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${theme.accent}22`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: "36px", marginBottom: "14px" }}>{c.icon}</div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: "17px", marginBottom: "8px" }}>{c.title}</div>
            <div style={{ fontSize: "13px", color: theme.muted, lineHeight: "1.6", marginBottom: "16px" }}>{c.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", background: `${levelColors[c.level]}22`, color: levelColors[c.level],
                             padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>{c.level}</span>
              <span style={{ fontSize: "12px", color: theme.muted }}>{c.lessons} lessons</span>
            </div>
            <button style={{ width: "100%", marginTop: "16px", background: `${theme.accent}22`, color: theme.accent,
                             border: `1px solid ${theme.accent}44`, padding: "10px", borderRadius: "8px",
                             cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
              Start Course →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRAYER TIMES PAGE ────────────────────────────────────────
function PrayerPage({ theme }) {
  const [city, setCity]         = useState("Mecca");
  const [country, setCountry]   = useState("Saudi Arabia");
  const [times, setTimes]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const MOCK_TIMES = {
    Fajr: "05:12", Sunrise: "06:35", Dhuhr: "12:18",
    Asr: "15:45", Maghrib: "18:22", Isha: "19:52"
  };

  const fetchTimes = () => {
    setLoading(true); setError("");
    fetch(`${API_BASE}/prayer/times/?city=${city}&country=${country}`)
      .then(r => r.json())
      .then(d => { setTimes(d); setLoading(false); })
      .catch(() => { setTimes(MOCK_TIMES); setLoading(false); setError("Showing demo times (connect backend for real times)"); });
  };

  const prayers = times ? [
    { name: "Fajr",    icon: "🌙", time: times.fajr    || times.Fajr },
    { name: "Sunrise", icon: "🌅", time: times.sunrise || times.Sunrise },
    { name: "Dhuhr",   icon: "☀️", time: times.dhuhr   || times.Dhuhr },
    { name: "Asr",     icon: "🌤️", time: times.asr     || times.Asr },
    { name: "Maghrib", icon: "🌇", time: times.maghrib || times.Maghrib },
    { name: "Isha",    icon: "🌃", time: times.isha    || times.Isha },
  ] : [];

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "clamp(24px,5vw,42px)", color: theme.accent, textAlign: "center", marginBottom: "8px" }}>🕐 Prayer Times</h1>
      <p style={{ textAlign: "center", color: theme.muted, marginBottom: "40px", fontSize: "14px" }}>Accurate Salah Times for Any City Worldwide</p>

      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="City"
            style={{ flex: 1, minWidth: "120px", background: theme.bg, border: `1px solid ${theme.border}`,
                     color: theme.text, padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none" }}/>
          <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country"
            style={{ flex: 1, minWidth: "120px", background: theme.bg, border: `1px solid ${theme.border}`,
                     color: theme.text, padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none" }}/>
          <button onClick={fetchTimes}
            style={{ background: theme.accent, color: theme.bg, padding: "12px 24px", borderRadius: "10px",
                     border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}>
            {loading ? "..." : "Get Times"}
          </button>
        </div>
        {error && <div style={{ color: theme.accent, fontSize: "12px", textAlign: "center" }}>{error}</div>}
      </div>

      {prayers.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {prayers.map(p => (
            <div key={p.name} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "12px",
                                       padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{p.icon}</span>
                <span style={{ fontWeight: 600, color: theme.text, fontSize: "16px" }}>{p.name}</span>
              </div>
              <span style={{ color: theme.accent, fontSize: "20px", fontWeight: 700, fontFamily: "monospace" }}>{p.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Adhkar section */}
      <div style={{ marginTop: "40px", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "16px", padding: "28px" }}>
        <h3 style={{ color: theme.accent, fontSize: "18px", marginBottom: "20px", fontFamily: "serif" }}>🤲 Morning Adhkar</h3>
        {[
          { arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ", translation: "I seek refuge with Allah, the All-Hearing, the All-Knowing, from the accursed Shaytan.", reps: "1×" },
          { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا", translation: "O Allah, by Your grace we have reached the morning and by Your grace we have reached the evening.", reps: "1×" },
          { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", translation: "Glory and praise be to Allah.", reps: "100×" },
        ].map((dhikr, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${theme.border}`, paddingBottom: "16px", marginBottom: "16px" }}>
            <div style={{ textAlign: "right", direction: "rtl", fontFamily: "serif", fontSize: "18px", color: theme.text, marginBottom: "8px", lineHeight: "2" }}>{dhikr.arabic}</div>
            <div style={{ fontSize: "13px", color: theme.muted, marginBottom: "6px" }}>{dhikr.translation}</div>
            <span style={{ background: `${theme.accent}22`, color: theme.accent, padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>{dhikr.reps}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI SCHOLAR PAGE ──────────────────────────────────────────
function AIScholarPage({ theme }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Assalamu Alaykum wa Rahmatullahi wa Barakatuh! 🌙\n\nI am Sheikh AI — your Islamic Scholar powered by Claude. I can help you with:\n\n• Quran questions and Tafsir\n• Hadith explanations\n• Fiqh rulings and Islamic Law\n• History of Islam and Prophets\n• Islamic character and daily life\n\nAsk me anything about Islam. Bismillah!" }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId]   = useState(null);
  const bottomRef             = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/ai/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, conversation_id: convId, language: "en" }),
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response || data.error || "Jazakallahu Khayran for your question." }]);
      if (data.conversation_id) setConvId(data.conversation_id);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Wa Alaykum Salam! I'm unable to connect to the backend right now. Please ensure your Django server is running at 127.0.0.1:8000 and your ANTHROPIC_API_KEY is set in .env" }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "What are the 5 pillars of Islam?",
    "Explain Surah Al-Fatiha",
    "What does Islam say about patience?",
    "Tell me about Prophet Ibrahim (AS)",
  ];

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "80px 24px 120px", display: "flex", flexDirection: "column", height: "100vh" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "clamp(20px,4vw,34px)", color: theme.accent, textAlign: "center", marginBottom: "4px" }}>🤖 AI Islamic Scholar</h1>
      <p style={{ textAlign: "center", color: theme.muted, marginBottom: "20px", fontSize: "13px" }}>Powered by Claude AI — Authentic Islamic Knowledge</p>

      {/* Quick suggestions */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setInput(s)}
            style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.muted,
                     padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px",
                     transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.muted; }}>
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px",
                    padding: "20px", background: theme.card, border: `1px solid ${theme.border}`,
                    borderRadius: "16px", marginBottom: "16px", minHeight: "400px", maxHeight: "500px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start",
                                justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${theme.accent}22`,
                            color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "16px", flexShrink: 0 }}>☪</div>
            )}
            <div style={{
              maxWidth: "75%", padding: "14px 18px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? theme.accent : theme.bg,
              color: m.role === "user" ? theme.bg : theme.text,
              fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-wrap",
              border: m.role === "assistant" ? `1px solid ${theme.border}` : "none",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${theme.accent}22`,
                          color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>☪</div>
            <div style={{ padding: "14px 18px", background: theme.bg, border: `1px solid ${theme.border}`,
                          borderRadius: "18px 18px 18px 4px", color: theme.muted, fontSize: "14px" }}>
              Thinking... ✨
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "12px" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask any Islamic question... (Enter to send)"
          style={{ flex: 1, background: theme.card, border: `1px solid ${theme.border}`, color: theme.text,
                   padding: "14px 18px", borderRadius: "12px", fontSize: "14px", outline: "none" }}/>
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ background: theme.accent, color: theme.bg, padding: "14px 24px", borderRadius: "12px",
                   border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 700,
                   opacity: loading || !input.trim() ? 0.5 : 1 }}>
          →
        </button>
      </div>
    </div>
  );
}

// ─── LIBRARY PAGE ─────────────────────────────────────────────
function LibraryPage({ theme }) {
  const books = [
    { title: "Al-Quran Al-Kareem", arabic: "القرآن الكريم", type: "Divine Book", author: "Revealed to Prophet Muhammad ﷺ", category: "Divine Revelation", desc: "The final and complete revelation from Allah — the greatest miracle and living guidance for all humanity." },
    { title: "At-Tawrat (Torah)", arabic: "التوراة", type: "Divine Book", author: "Revealed to Prophet Musa (AS)", category: "Divine Revelation", desc: "The original scripture revealed to Prophet Moses — contains the laws and guidance for the Children of Israel." },
    { title: "Az-Zabur (Psalms)", arabic: "الزبور", type: "Divine Book", author: "Revealed to Prophet Dawud (AS)", category: "Divine Revelation", desc: "The scripture revealed to Prophet David — songs of praise, wisdom, and worship." },
    { title: "Al-Injil (Gospel)", arabic: "الإنجيل", type: "Divine Book", author: "Revealed to Prophet Isa (AS)", category: "Divine Revelation", desc: "The original scripture revealed to Prophet Jesus — guidance and good news for his people." },
    { title: "Ihya Ulum al-Din", arabic: "إحياء علوم الدين", type: "Classic Book", author: "Imam Al-Ghazali (1058–1111 CE)", category: "Spirituality & Fiqh", desc: "Revival of the Religious Sciences — the most comprehensive work on Islamic spirituality, covering worship, conduct, and the path to Allah." },
    { title: "Al-Aqeedah Al-Wasitiyyah", arabic: "العقيدة الواسطية", type: "Classic Book", author: "Ibn Taymiyyah (1263–1328 CE)", category: "Islamic Creed (Aqeedah)", desc: "A concise treatise on Islamic creed — covering the attributes of Allah, belief in the unseen, and the correct methodology." },
    { title: "Zad Al-Maad", arabic: "زاد المعاد", type: "Classic Book", author: "Ibn al-Qayyim (1292–1350 CE)", category: "Seerah & Fiqh", desc: "Provisions of the Afterlife — a comprehensive study of the Prophet's ﷺ guidance in all aspects of life." },
    { title: "Riyadh As-Saliheen", arabic: "رياض الصالحين", type: "Classic Book", author: "Imam An-Nawawi (1233–1277 CE)", category: "Hadith & Conduct", desc: "Gardens of the Righteous — collection of Quranic verses and hadiths covering all aspects of Islamic conduct and character." },
  ];

  const [filter, setFilter] = useState("all");
  const categories = ["all", "Divine Revelation", "Spirituality & Fiqh", "Islamic Creed (Aqeedah)", "Seerah & Fiqh", "Hadith & Conduct"];
  const filtered = books.filter(b => filter === "all" || b.category === filter);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px 60px" }}>
      <h1 style={{ fontFamily: "serif", fontSize: "clamp(24px,5vw,42px)", color: theme.accent, textAlign: "center", marginBottom: "8px" }}>📚 Islamic Library</h1>
      <p style={{ textAlign: "center", color: theme.muted, marginBottom: "32px", fontSize: "14px" }}>Divine Books & Classic Islamic Scholarship</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap", justifyContent: "center" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ background: filter === c ? theme.accent : theme.card, color: filter === c ? theme.bg : theme.muted,
                     border: `1px solid ${filter === c ? theme.accent : theme.border}`, padding: "8px 14px",
                     borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
            {c === "all" ? "All Books" : c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
        {filtered.map((b, i) => (
          <div key={i}
            style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: "16px",
                     padding: "28px 24px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <span style={{ background: b.type === "Divine Book" ? `${theme.accent}33` : `${theme.accent}15`,
                             color: theme.accent, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
                {b.type === "Divine Book" ? "📿 " : "📖 "}{b.type}
              </span>
            </div>
            <div style={{ fontFamily: "serif", fontSize: "22px", color: theme.accent, marginBottom: "8px", direction: "rtl", textAlign: "right" }}>{b.arabic}</div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: "17px", marginBottom: "6px" }}>{b.title}</div>
            <div style={{ fontSize: "12px", color: theme.accent, marginBottom: "10px", fontStyle: "italic" }}>{b.author}</div>
            <div style={{ fontSize: "13px", color: theme.muted, lineHeight: "1.6" }}>{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function Home() {
  const [page, setPage]         = useState("home");
  const [themeKey, setThemeKey] = useState("emerald");
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = THEMES[themeKey];

  const pages = {
    home:     <HomePage    setPage={setPage} theme={theme}/>,
    quran:    <QuranPage   theme={theme}/>,
    hadith:   <HadithPage  theme={theme}/>,
    prophets: <ProphetsPage theme={theme}/>,
    history:  <HistoryPage theme={theme}/>,
    courses:  <CoursesPage theme={theme}/>,
    prayer:   <PrayerPage  theme={theme}/>,
    scholar:  <AIScholarPage theme={theme}/>,
    library:  <LibraryPage theme={theme}/>,
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text,
                  fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative" }}>
      <GeometricBg theme={theme}/>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar page={page} setPage={setPage} theme={theme}
                themeKey={themeKey} setThemeKey={setThemeKey}
                menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
        {pages[page] || pages.home}
      </div>

      {/* Global CSS */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.accent}; }
        input::placeholder { color: ${theme.muted}; }
        button:disabled { cursor: not-allowed; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .desktop-nav { display: none; }
        @media (min-width: 900px) { .desktop-nav { display: flex !important; } }
      `}</style>
    </div>
  );
}