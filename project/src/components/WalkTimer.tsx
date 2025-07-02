import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Footprints } from 'lucide-react';

interface WalkTimerProps {
  duration: number;
  onComplete: () => void;
  onBack: () => void;
}

const WalkTimer: React.FC<WalkTimerProps> = ({ duration: initialDuration, onComplete, onBack }) => {
  const [duration, setDuration] = useState(Math.max(1, Math.min(10, Math.round(initialDuration || 5))));
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [motivationIndex, setMotivationIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const motivationalMessages = [
    "Great job getting up and moving! 🚶‍♂️",
    "Every step counts toward better health! 👟",
    "You're giving your body what it needs! 💪",
    "Movement is the best medicine! 🌟",
    "Your future self will thank you! ✨",
    "Boost that circulation and energy! 🔥",
    "Taking care of yourself like a pro! 🏆",
    "This break will help you focus better! 🧠",
    "You're building healthy habits! 🌱",
    "Keep up the fantastic momentum! 🚀"
  ];

  useEffect(() => {
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: number;

    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            // Set flag for auto-restart when returning to dashboard
            localStorage.setItem('wellness-auto-restart', 'true');
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining, onComplete]);

  // Change motivational message every 30 seconds
  useEffect(() => {
    if (isActive) {
      const messageInterval = setInterval(() => {
        setMotivationIndex(prev => (prev + 1) % motivationalMessages.length);
      }, 30000);

      return () => clearInterval(messageInterval);
    }
  }, [isActive, motivationalMessages.length]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(duration * 60);
    setMotivationIndex(0);
  };

  // Calculate slider value from mouse/touch position
  const calculateSliderValue = (clientX: number) => {
    if (!sliderContainerRef.current) return duration;
    
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = 1 + (percentage * 9); // 1 to 10 range
    return Math.max(1, Math.min(10, Math.round(rawValue)));
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const newValue = calculateSliderValue(e.clientX);
    setDuration(newValue);
    
    const handleMouseMove = (e: MouseEvent) => {
      const newValue = calculateSliderValue(e.clientX);
      setDuration(newValue);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const touch = e.touches[0];
    const newValue = calculateSliderValue(touch.clientX);
    setDuration(newValue);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const newValue = calculateSliderValue(e.touches[0].clientX);
        setDuration(newValue);
      }
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Walk Timer</h1>
            <p className="text-slate-600">Get moving and refresh your mind</p>
          </div>
        </div>

        {/* Duration Selector with Custom Slider */}
        {!isActive && timeRemaining === duration * 60 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Choose Your Walk Duration</h3>
            
            {/* Custom Slider Interface */}
            <div className="bg-[#F2F2F7] rounded-xl p-4">
              <div className="text-sm font-medium text-[#8E8E93] mb-3">Adjust with slider:</div>
              
              {/* Custom Slider Container */}
              <div 
                ref={sliderContainerRef}
                className="relative w-full h-8 cursor-pointer select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* Custom Track Background */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-[#E5E5EA] rounded-lg" />
                
                {/* Custom Track Fill */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-2 bg-[#8B5CF6] rounded-lg transition-all duration-150"
                  style={{ width: `${((duration - 1) / 9) * 100}%` }}
                />
                
                {/* Custom Thumb */}
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-[#8B5CF6] rounded-full shadow-lg transition-all duration-150 ${
                    isDragging ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{ 
                    left: `calc(${((duration - 1) / 9) * 100}% - 10px)`,
                    boxShadow: isDragging 
                      ? '0 4px 16px rgba(139, 92, 246, 0.5)' 
                      : '0 2px 6px rgba(139, 92, 246, 0.3)'
                  }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-[#8E8E93] mt-2">
                <span>1 min</span>
                <span className="font-medium text-purple-600">{duration} min</span>
                <span>10 min</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Timer */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-8">
          {/* Walking Icon */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center ${isActive ? 'animate-bounce' : ''}`}>
              <Footprints className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-slate-800 mb-4 font-mono">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center mb-6">
              <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
              <span className="ml-2 text-slate-600">
                {isActive ? 'Walking Time!' : 'Ready to Walk'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {(isActive || timeRemaining < duration * 60) && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={isActive ? handlePause : handleStart}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? 'Pause' : 'Start Walking'}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">
            {motivationalMessages[motivationIndex]}
          </p>
          <p className="text-purple-100 text-sm">
            {isActive 
              ? "Keep moving! Even a short walk makes a difference."
              : "Ready to give your body and mind a boost?"
            }
          </p>
        </div>

        {/* Walking Tips */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Walking Tips</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Walk at a comfortable pace</li>
            <li>• Take deep breaths and enjoy the movement</li>
            <li>• Use stairs if available for extra benefit</li>
            <li>• Stay hydrated</li>
            <li>• Swing your arms naturally</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WalkTimer;