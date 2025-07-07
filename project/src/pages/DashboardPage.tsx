import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import BreakSelector from '../components/BreakSelector';
import BreakSelectorModal from '../components/BreakSelectorModal';
import BodyDiagram from '../components/BodyDiagram';
import ExerciseLibrary from '../components/ExerciseLibrary';
import StretchLibrary from '../components/StretchLibrary';
import GuidedSession from '../components/GuidedSession';
import WalkTimer from '../components/WalkTimer';
import MeditationTimer from '../components/MeditationTimer';
import { Exercise } from '../data/exercises';

export type ViewType = 'dashboard' | 'breakSelector' | 'bodyDiagram' | 'exerciseLibrary' | 'stretchLibrary' | 'guidedSession' | 'walkTimer' | 'meditationTimer';

const DashboardPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [walkDuration, setWalkDuration] = useState(5);
  const [showBreakModal, setShowBreakModal] = useState(false);

  // Check for payment success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      // Show success message and clean URL
      alert('Payment successful! Your subscription is now active.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Store reference to Dashboard's snooze function
  const dashboardSnoozeRef = React.useRef<((minutes: number) => void) | null>(null);

  const navigateToView = (view: ViewType, data?: any) => {
    setCurrentView(view);
    if (view === 'bodyDiagram' && data?.painPoint) {
      setSelectedPainPoints([data.painPoint]);
    }
    if (view === 'exerciseLibrary') {
      // For direct exercise library access, show all exercises or use selected pain points
      if (data?.painPoints) {
        setSelectedPainPoints(data.painPoints);
      } else if (data?.painPoint) {
        setSelectedPainPoints([data.painPoint]);
      } else {
        setSelectedPainPoints(['all']); // Show all exercises when accessed directly
      }
    }
    if (view === 'stretchLibrary' && data?.painPoints) {
      setSelectedPainPoints(data.painPoints);
    }
    if (view === 'guidedSession' && data?.exercises) {
      setSelectedExercises(data.exercises);
    }
    if (view === 'walkTimer' && data?.duration) {
      setWalkDuration(data.duration);
    }
  };

  // Handle timer expiration - show modal automatically
  const handleBreakTriggered = () => {
    setShowBreakModal(true);
  };

  // Handle manual "Take a break now" button
  const handleManualBreak = () => {
    navigateToView('breakSelector');
  };

  const handleBreakModalClose = () => {
    setShowBreakModal(false);
  };

  const handleSnooze = (minutes: number) => {
    // Close the modal first
    setShowBreakModal(false);
    
    // Call the Dashboard's snooze function directly
    if (dashboardSnoozeRef.current) {
      dashboardSnoozeRef.current(minutes);
    }
  };

  const handleStretch = () => {
    setShowBreakModal(false);
    navigateToView('bodyDiagram', { type: 'stretch' });
  };

  const handleExercise = () => {
    setShowBreakModal(false);
    navigateToView('exerciseLibrary');
  };

  const handleWalk = () => {
    setShowBreakModal(false);
    navigateToView('walkTimer');
  };

  const handleBreakComplete = () => {
    // Navigate to dashboard and reset state
    setCurrentView('dashboard');
    setSelectedPainPoints([]);
    setSelectedExercises([]);
    
    // Set flag for auto-restart when dashboard becomes active
    localStorage.setItem('wellness-auto-restart', 'true');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onBreakTriggered={handleBreakTriggered} 
            onManualBreak={handleManualBreak}
            onRegisterSnoozeFunction={(snoozeFunction) => {
              dashboardSnoozeRef.current = snoozeFunction;
            }}
          />
        );
      case 'breakSelector':
        return (
          <BreakSelector
            onSnooze={() => navigateToView('dashboard')}
            onStretch={() => navigateToView('bodyDiagram', { type: 'stretch' })}
            onExercise={() => navigateToView('exerciseLibrary')} // Direct to exercise library
            onWalk={() => navigateToView('walkTimer')}
            onBack={() => navigateToView('dashboard')}
          />
        );
      case 'bodyDiagram':
        return (
          <BodyDiagram
            onPainPointSelect={(painPoints) => navigateToView('stretchLibrary', { painPoints })}
            onBack={() => navigateToView('breakSelector')}
          />
        );
      case 'exerciseLibrary':
        return (
          <ExerciseLibrary
            painPoint={selectedPainPoints.length === 1 ? selectedPainPoints[0] : 'multiple'}
            onStartSession={(exercises) => navigateToView('guidedSession', { exercises })}
            onBack={() => {
              // Navigate back based on how we got here
              if (selectedPainPoints.includes('all')) {
                navigateToView('breakSelector'); // Came directly from break selector
              } else {
                navigateToView('bodyDiagram'); // Came from body diagram
              }
            }}
          />
        );
      case 'stretchLibrary':
        return (
          <StretchLibrary
            selectedPainPoints={selectedPainPoints}
            onStartSession={(stretches) => navigateToView('guidedSession', { exercises: stretches })}
            onBack={() => navigateToView('bodyDiagram')}
          />
        );
      case 'guidedSession':
        return (
          <GuidedSession
            exercises={selectedExercises}
            onComplete={handleBreakComplete} // This will restart the main timer
            onBack={() => {
              // Navigate back based on the type of session
              const hasStretches = selectedExercises.some(ex => ex.type === 'stretch');
              if (hasStretches) {
                navigateToView('stretchLibrary');
              } else {
                navigateToView('exerciseLibrary');
              }
            }}
          />
        );
      case 'walkTimer':
        return (
          <WalkTimer
            duration={walkDuration}
            onComplete={handleBreakComplete} // This will restart the main timer
            onBack={() => navigateToView('breakSelector')}
          />
        );
      case 'meditationTimer':
        return (
          <MeditationTimer
            onComplete={handleBreakComplete} // This will restart the main timer
            onBack={() => navigateToView('breakSelector')}
          />
        );
      default:
        return (
          <Dashboard 
            onBreakTriggered={handleBreakTriggered} 
            onManualBreak={handleManualBreak}
            onRegisterSnoozeFunction={(snoozeFunction) => {
              dashboardSnoozeRef.current = snoozeFunction;
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {renderCurrentView()}
      
      {/* Break Selector Modal - Auto-shows when timer expires */}
      <BreakSelectorModal
        isOpen={showBreakModal}
        onClose={handleBreakModalClose}
        onSnooze={handleSnooze}
        onStretch={handleStretch}
        onExercise={handleExercise}
        onWalk={handleWalk}
      />
    </div>
  );
};

export default DashboardPage;
