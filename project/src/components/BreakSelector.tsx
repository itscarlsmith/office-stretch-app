import React, { useState } from 'react';
import { Clock, Dumbbell, Zap, Footprints, ArrowLeft } from 'lucide-react';

interface BreakSelectorProps {
  onSnooze: () => void;
  onStretch: () => void;
  onExercise: () => void;
  onWalk: () => void;
  onBack: () => void;
}

const BreakSelector: React.FC<BreakSelectorProps> = ({
  onSnooze,
  onStretch,
  onExercise,
  onWalk,
  onBack,
}) => {
  const [snoozeMinutes, setSnoozeMinutes] = useState(5);
  const [showSnoozeInput, setShowSnoozeInput] = useState(false);

  const handleSnooze = () => {
    // Here you would implement the snooze logic
    onSnooze();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Time for a Break!</h1>
            <p className="text-slate-600">Choose your break activity</p>
          </div>
        </div>

        {/* Break Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Snooze Option */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Snooze</h3>
              <p className="text-slate-600">Take a few more minutes</p>
            </div>

            {showSnoozeInput ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Snooze for (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={snoozeMinutes}
                    onChange={(e) => setSnoozeMinutes(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSnooze}
                    className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                  >
                    Snooze {snoozeMinutes}m
                  </button>
                  <button
                    onClick={() => setShowSnoozeInput(false)}
                    className="px-4 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSnoozeInput(true)}
                className="w-full py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all duration-200 hover:scale-105"
              >
                Snooze Break
              </button>
            )}
          </div>

          {/* Stretch Option */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Stretch</h3>
              <p className="text-slate-600">Gentle stretches for relief</p>
            </div>
            <button
              onClick={onStretch}
              className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105"
            >
              Start Stretching
            </button>
          </div>

          {/* Exercise Option */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Exercise</h3>
              <p className="text-slate-600">Strengthen and energize</p>
            </div>
            <button
              onClick={onExercise}
              className="w-full py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105"
            >
              Start Exercising
            </button>
          </div>

          {/* Walk Option */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Footprints className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Walk</h3>
              <p className="text-slate-600">Get moving and refresh</p>
            </div>
            <button
              onClick={onWalk}
              className="w-full py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-all duration-200 hover:scale-105"
            >
              Take a Walk
            </button>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white">
            <p className="text-lg font-medium mb-2">"Movement is medicine"</p>
            <p className="text-blue-100">Your body will thank you for taking this break</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakSelector;