import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/globals.css'

// Keep the starter intentionally small so new projects have a clear entry point.
export const Scaffold = () => (
  <main className="min-h-screen text-slate-50">
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-slate-200 shadow-lg shadow-sky-950/30 backdrop-blur">
        React + Vite + Tailwind starter
      </span>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        This is your webapp scaffold.
      </h1>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg">
        Start building in{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">
          src/main.tsx
        </code>{' '}
        and add routes, providers, and integrations as your product takes shape.
      </p>
    </div>
  </main>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Scaffold />
  </React.StrictMode>
) 
