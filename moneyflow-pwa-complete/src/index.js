import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('💰 MoneyFlow Pro: SW registered');
      })
      .catch((registrationError) => {
        console.log('💰 MoneyFlow Pro: SW registration failed');
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install banner after 5 seconds
  setTimeout(() => {
    if (deferredPrompt) {
      const installBanner = document.createElement('div');
      installBanner.innerHTML = `
        <div style="position: fixed; bottom: 100px; left: 20px; right: 20px; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 16px; border-radius: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 8px 30px rgba(37, 99, 235, 0.3); z-index: 1000; animation: slideUp 0.5s ease-out;">
          <div>
            <div style="font-weight: bold; margin-bottom: 4px;">📱 Install MoneyFlow Pro</div>
            <div style="font-size: 14px; opacity: 0.9;">Add to your home screen for quick access</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="installPWA()" style="background: white; color: #2563eb; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">Install</button>
            <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: none; font-size: 18px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
          </div>
        </div>
      `;
      document.body.appendChild(installBanner);
    }
  }, 5000);
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      deferredPrompt = null;
      const banner = document.querySelector('[onclick="installPWA()"]').closest('div[style*="position: fixed"]');
      if (banner) banner.remove();
    });
  }
}

// Make function global
window.installPWA = installPWA;