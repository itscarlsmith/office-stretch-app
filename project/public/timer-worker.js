// Web Worker for background timer to prevent browser throttling
let timer = null;
let startTime = null;
let duration = 0;
let isRunning = false;

self.onmessage = function(e) {
  const { action, intervalMs, totalDuration } = e.data;
  
  if (action === 'start') {
    console.log('🔧 Worker: Starting background timer');
    startTime = Date.now();
    duration = totalDuration || 0;
    isRunning = true;
    
    timer = setInterval(() => {
      if (isRunning) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, duration - elapsed);
        
        self.postMessage({ 
          type: 'tick', 
          timeRemaining: remaining,
          elapsed: elapsed
        });
        
        if (remaining <= 0) {
          self.postMessage({ type: 'expired' });
          clearInterval(timer);
          isRunning = false;
        }
      }
    }, intervalMs || 1000);
    
  } else if (action === 'stop') {
    console.log('🔧 Worker: Stopping background timer');
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    isRunning = false;
    
  } else if (action === 'pause') {
    console.log('🔧 Worker: Pausing background timer');
    isRunning = false;
    
  } else if (action === 'resume') {
    console.log('🔧 Worker: Resuming background timer');
    isRunning = true;
    
  } else if (action === 'sync') {
    // Sync with main thread
    if (isRunning && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      
      self.postMessage({ 
        type: 'sync', 
        timeRemaining: remaining,
        elapsed: elapsed,
        isRunning: isRunning
      });
    }
  }
};