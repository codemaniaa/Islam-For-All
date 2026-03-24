import React, { useState } from "react";

import Navbar from "./components/Navbar"; 
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


export default function Home() {
  const [page, setPage]   = useState("home");
  const [themeKey, setThemeKey] = useState("emerald");
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = THEMES[themeKey];

  // const pages = {
  //   home:     <HomePage    setPage={setPage} theme={theme}/>,
  //   quran:    <QuranPage   theme={theme}/>,
  //   hadith:   <HadithPage  theme={theme}/>,
  //   prophets: <ProphetsPage theme={theme}/>,
  //   history:  <HistoryPage theme={theme}/>,
  //   courses:  <CoursesPage theme={theme}/>,
  //   prayer:   <PrayerPage  theme={theme}/>,
  //   scholar:  <AIScholarPage theme={theme}/>,
  //   library:  <LibraryPage theme={theme}/>,
  // };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text,
                  fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative" }}>
       
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar page={page} setPage={setPage} theme={theme}
                themeKey={themeKey} setThemeKey={setThemeKey}
                menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
         
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