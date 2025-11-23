// Polyfill `global` for browser bundles to satisfy some crypto/wasm libs
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
