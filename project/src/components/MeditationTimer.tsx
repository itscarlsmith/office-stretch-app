import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Brain } from 'lucide-react';

interface MeditationTimerProps {
  onComplete: () => void;
  onBack: () => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ onComplete, onBack }) => {
  const [duration, setDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);

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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.round(parseFloat(e.target.value));
    setDuration(value);
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4">
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
            <h1 className="text-3xl font-bold text-slate-800">Meditation Timer</h1>
            <p className="text-slate-600">Find your inner peace and focus</p>
          </div>
        </div>

        {/* Duration Selector with Slider */}
        {!isActive && timeRemaining === duration * 60 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Choose Your Meditation Duration</h3>
            
            {/* Slider Interface */}
            <div className="bg-[#F2F2F7] rounded-xl p-4">
              <div className="text-sm font-medium text-[#8E8E93] mb-3">Select duration (1-10 minutes):</div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={duration}
                onChange={handleSliderChange}
                className="w-full h-2 bg-[#E5E5EA] rounded-lg appearance-none cursor-pointer meditation-slider"
              />
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
          {/* Meditation Icon */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center ${isActive ? 'animate-pulse' : ''}`}>
              <Brain className="w-12 h-12 text-purple-600" />
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
                {isActive ? 'Meditating...' : 'Ready to Begin'}
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
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-300"
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
              {isActive ? 'Pause' : 'Start Meditation'}
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

        {/* Meditation Quote */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">
            "Peace comes from within. Do not seek it without."
          </p>
          <p className="text-purple-100 text-sm">
            {isActive 
              ? "Focus on your breath and let thoughts pass like clouds."
              : "Take a moment to center yourself and find inner calm."
            }
          </p>
        </div>

        {/* Meditation Tips */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Meditation Tips</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Find a comfortable, quiet position</li>
            <li>• Focus on your natural breathing rhythm</li>
            <li>• Let thoughts come and go without judgment</li>
            <li>• Start with shorter sessions and gradually increase</li>
            <li>• Be patient and kind with yourself</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .meditation-slider {
          background: linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((duration - 1) / 9) * 100}%, #E5E5EA ${((duration - 1) / 9) * 100}%, #E5E5EA 100%);
        }
        
        .meditation-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
          transition: all 0.1s ease;
        }
        
        .meditation-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .meditation-slider::-webkit-slider-thumb:active {
          transform: scale(1.2);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
        }
        
        .meditation-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
          transition: all 0.1s ease;
        }
        
        .meditation-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .meditation-slider::-moz-range-thumb:active {
          transform: scale(1.2);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.5);
        }
        
        .meditation-slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
        
        .meditation-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MeditationTimer;