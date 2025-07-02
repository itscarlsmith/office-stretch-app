import React, { useState, useEffect, useRef } from 'react';
import { Clock, Dumbbell, Zap, Footprints, X } from 'lucide-react';

interface BreakSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (minutes: number) => void;
  onStretch: () => void;
  onExercise: () => void;
  onWalk: () => void;
}

const BreakSelectorModal: React.FC<BreakSelectorModalProps> = ({
  isOpen,
  onClose,
  onSnooze,
  onStretch,
  onExercise,
  onWalk,
}) => {
  const [snoozeMinutes, setSnoozeMinutes] = useState(5);
  const [showSnoozeInput, setShowSnoozeInput] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    // Focus first element when modal opens
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSnoozeSubmit = () => {
    console.log(`🔍 Modal: handleSnoozeSubmit called with ${snoozeMinutes} minutes`);
    
    // Call the onSnooze callback which should trigger snoozeTimer in Dashboard
    onSnooze(snoozeMinutes);
    
    // Close the snooze input
    setShowSnoozeInput(false);
    
    console.log(`✅ Modal: onSnooze(${snoozeMinutes}) called, modal should close`);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 id="break-modal-title" className="text-3xl font-bold text-slate-800">Time for a Break!</h1>
            <p className="text-slate-600">Choose your break activity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Break Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Snooze Option */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
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
                  <label htmlFor="snooze-minutes" className="block text-sm font-semibold text-slate-700 mb-2">
                    Snooze for (minutes)
                  </label>
                  <input
                    id="snooze-minutes"
                    type="number"
                    min="1"
                    max="30"
                    value={snoozeMinutes}
                    onChange={(e) => setSnoozeMinutes(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    aria-describedby="snooze-help"
                  />
                  <p id="snooze-help" className="text-xs text-slate-500 mt-1">
                    Choose between 1-30 minutes
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSnoozeSubmit}
                    className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Snooze {snoozeMinutes}m
                  </button>
                  <button
                    onClick={() => setShowSnoozeInput(false)}
                    className="px-4 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                ref={firstFocusableRef}
                onClick={() => {
                  console.log('🔍 Modal: Snooze button clicked, showing input');
                  setShowSnoozeInput(true);
                }}
                className="w-full py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Snooze Break
              </button>
            )}
          </div>

          {/* Stretch Option */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Stretch</h3>
              <p className="text-slate-600">Gentle stretches for relief</p>
            </div>
            <button
              onClick={onStretch}
              className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Start Stretching
            </button>
          </div>

          {/* Exercise Option */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Exercise</h3>
              <p className="text-slate-600">Strengthen and energize</p>
            </div>
            <button
              onClick={onExercise}
              className="w-full py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Exercising
            </button>
          </div>

          {/* Walk Option */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-6 border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Footprints className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Walk</h3>
              <p className="text-slate-600">Get moving and refresh</p>
            </div>
            <button
              onClick={onWalk}
              className="w-full py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Take a Walk
            </button>
          </div>
        </div>

        {/* Maybe Later Option */}
        <div className="text-center mb-6">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm underline focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 rounded"
          >
            Maybe later
          </button>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-medium mb-2">"Movement is medicine"</p>
          <p className="text-blue-100">Your body will thank you for taking this break</p>
        </div>
      </div>
    </div>
  );
};

export default BreakSelectorModal;