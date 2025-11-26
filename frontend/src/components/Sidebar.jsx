
import React from 'react'
export default function Sidebar({ setPage }) {
  return (
    <aside className="w-64 h-full glass p-6 neon-border" style={{minHeight:'100vh'}}>
      <div className="text-4xl font-extrabold neon-text-cyan mb-8 tracking-widest">SIGHTZEN</div>

      <nav className="flex flex-col gap-4 text-lg">
        <button onClick={()=>setPage('dashboard')}
          className="p-3 rounded bg-transparent hover:bg-[rgba(255,255,255,0.02)] text-white transition-all">
          <span className="neon-text-lime">•</span> Dashboard
        </button>

        <button onClick={()=>setPage('ai')}
          className="p-3 rounded bg-transparent hover:bg-[rgba(255,255,255,0.02)] text-white transition-all">
          <span className="neon-text-magenta">•</span> AI Assistant
        </button>
      </nav>

      <div className="mt-8 text-xs text-gray-400">Demo • v2 — Neon Black</div>
    </aside>
  )
}
