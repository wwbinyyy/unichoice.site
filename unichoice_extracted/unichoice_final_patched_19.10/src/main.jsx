import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={err:null}; }
  static getDerivedStateFromError(err){ return {err}; }
  componentDidCatch(err, info){ console.error('App crashed:', err, info); }
  render(){
    if (this.state.err){
      return (
        <div style={{padding:16,fontFamily:'ui-sans-serif, system-ui'}}>
          <h1 style={{fontSize:20,marginBottom:8}}>Runtime error</h1>
          <pre style={{whiteSpace:'pre-wrap',background:'#111',color:'#fff',padding:12,borderRadius:8}}>
{String(this.state.err.stack||this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
