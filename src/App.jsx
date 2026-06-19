export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-emerald-400 tracking-tight">
          ScalpCraft
        </h1>
        <p className="text-slate-400 text-lg">BTC / USDT · Asistente de Scalping</p>
      </div>

      <div className="px-8 py-5 rounded-xl bg-slate-800/60 border border-emerald-500/20">
        <p className="text-emerald-400 font-mono font-semibold text-center">
          ✓ Fase 0 — Setup OK
        </p>
        <p className="text-slate-500 text-sm mt-1 text-center">
          Electron · React · Tailwind · SQLite
        </p>
      </div>
    </div>
  )
}
