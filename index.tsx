
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// #region agent log
// Global error handler
window.addEventListener('error',(e)=>{fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:7',message:'global error caught',data:{message:e.message,filename:e.filename,lineno:e.lineno,colno:e.colno,error:e.error?.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})});
window.addEventListener('unhandledrejection',(e)=>{fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:8',message:'unhandled promise rejection',data:{reason:e.reason?.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{})});
fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:9',message:'index.tsx execution started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:9',message:'root element check',data:{found:!!rootElement,elementId:'root'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
// #endregion

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:12',message:'root element not found - throwing error',data:{error:'Could not find root element to mount to'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  throw new Error("Could not find root element to mount to");
}

// #region agent log
fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:15',message:'creating React root',data:{rootElementExists:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const root = ReactDOM.createRoot(rootElement);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:18',message:'calling root.render',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// #region agent log
fetch('http://127.0.0.1:7242/ingest/4cf3cb96-7efe-45ea-9e52-c83cb01fb542',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:24',message:'root.render completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion