import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple scaffold message
const Scaffold = () => (
  <div style={{
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }}>
    <h1 style={{ color: '#333', marginBottom: '1rem' }}>
      This is your webapp scaffold! 🎉
    </h1>
    <p style={{ color: '#666' }}>
      Start building your awesome app by editing <code>src/main.tsx</code>.
    </p>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Scaffold />
  </React.StrictMode>
) 