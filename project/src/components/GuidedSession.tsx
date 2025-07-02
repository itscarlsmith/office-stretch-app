import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, CheckCircle } from 'lucide-react';
import { Exercise } from '../data/exercises';

interface GuidedSessionProps {
  exercises: Exercise[];
  onComplete: () => void;
  onBack: () => void;
}

const GuidedSession: React.FC<GuidedSessionProps> = ({
  exercises,
  onComplete,
  onBack,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercises[0]?.duration || 30);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Video ref for controlling playback
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentExercise = exercises[currentExerciseIndex];
  
  // Debug: Log current exercise and media URL
  useEffect(() => {
    if (currentExercise) {
      console.log('🎥 GuidedSession: Current exercise:', {
        name: currentExercise.name,
        mediaUrl: currentExercise.mediaUrl,
        type: currentExercise.type,
        index: currentExerciseIndex
      });
      
      // Reset video states when exercise changes
      setVideoError(null);
      setVideoLoaded(false);
    }
  }, [currentExercise, currentExerciseIndex]);

  // Sync video playback with session timer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoPlayback = async () => {
      try {
        if (isActive && !showCountdown && !isPaused) {
          console.log('▶️ GuidedSession: Starting video playback for:', currentExercise?.name);
          await video.play();
        } else {
          console.log('⏸️ GuidedSession: Pausing video for:', currentExercise?.name);
          video.pause();
        }
      } catch (error) {
        console.warn('⚠️ GuidedSession: Video playback control failed:', error);
        // Don't throw error - video playback issues shouldn't break the session
      }
    };

    handleVideoPlayback();
  }, [isActive, showCountdown, isPaused, currentExercise]);

  // Reset video when exercise changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0; // Reset video to beginning
      console.log('🔄 GuidedSession: Reset video to beginning for:', currentExercise?.name);
    }
  }, [currentExerciseIndex]);
  
  // Calculate total session duration and continuous progress
  const totalSessionDuration = exercises.reduce((sum, exercise) => sum + exercise.duration, 0);
  
  // Calculate elapsed time for continuous progress
  const getElapsedTime = () => {
    // Time from completed exercises
    const completedExercisesTime = exercises
      .slice(0, currentExerciseIndex)
      .reduce((sum, exercise) => sum + exercise.duration, 0);
    
    // Time elapsed in current exercise
    const currentExerciseElapsed = currentExercise ? currentExercise.duration - timeRemaining : 0;
    
    return completedExercisesTime + currentExerciseElapsed;
  };

  // Continuous progress percentage
  const progressPercentage = (getElapsedTime() / totalSessionDuration) * 100;

  useEffect(() => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration);
    }
  }, [currentExercise]);

  // Countdown effect
  useEffect(() => {
    let countdownInterval: number;
    
    if (showCountdown && countdownValue > 0) {
      countdownInterval = window.setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            // Countdown finished, start next exercise
            setShowCountdown(false);
            setIsActive(true);
            setIsPaused(false);
            return 3; // Reset for next time
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [showCountdown, countdownValue]);

  // Main timer effect
  useEffect(() => {
    let interval: number;

    if (isActive && timeRemaining > 0 && !showCountdown) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Exercise completed
            if (currentExerciseIndex < exercises.length - 1) {
              // More exercises remaining - show countdown
              setIsActive(false);
              setCurrentExerciseIndex(prevIndex => prevIndex + 1);
              setShowCountdown(true);
              setCountdownValue(3);
            } else {
              // Last exercise completed - finish session
              handleSessionComplete();
            }
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
  }, [isActive, timeRemaining, currentExerciseIndex, exercises.length, showCountdown]);

  const handleStart = () => {
    console.log('🎬 GuidedSession: Session started by user');
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    console.log('⏸️ GuidedSession: Session paused by user');
    setIsActive(false);
    setIsPaused(true);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsActive(false);
      setIsPaused(false);
      setShowCountdown(false);
    } else {
      handleSessionComplete();
    }
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setShowCountdown(false);
    onComplete(); // This will navigate to dashboard and restart main timer
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Video event handlers
  const handleVideoLoad = () => {
    console.log('✅ GuidedSession: Video loaded successfully for:', currentExercise?.name);
    setVideoLoaded(true);
    setVideoError(null);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    let errorMessage = 'Unknown video error';
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Video decode error';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported or URL invalid';
          break;
        default:
          errorMessage = `Video error code: ${error.code}`;
      }
    }
    
    console.error('❌ GuidedSession: Video error for', currentExercise?.name, {
      errorMessage,
      mediaUrl: currentExercise?.mediaUrl,
      errorCode: error?.code,
      errorDetails: error
    });
    
    setVideoError(errorMessage);
    setVideoLoaded(false);
  };

  const handleVideoLoadStart = () => {
    console.log('🔄 GuidedSession: Video load started for:', currentExercise?.name, 'URL:', currentExercise?.mediaUrl);
  };

  const handleVideoCanPlay = () => {
    console.log('▶️ GuidedSession: Video can play for:', currentExercise?.name);
  };

  // Handle autoplay restrictions gracefully
  const handleVideoPlay = () => {
    console.log('🎵 GuidedSession: Video started playing for:', currentExercise?.name);
  };

  const handleVideoPause = () => {
    console.log('⏸️ GuidedSession: Video paused for:', currentExercise?.name);
  };

  // Check if URL is a video file
  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800">Guided Session</h1>
            <p className="text-slate-600">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </p>
          </div>
        </div>

        {/* Continuous Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Session Progress</span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>{formatTime(getElapsedTime())}</span>
            <span>{formatTime(totalSessionDuration)}</span>
          </div>
        </div>

        {/* Get Ready Countdown Overlay */}
        {showCountdown && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-slate-200 max-w-md mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Get Ready!</h2>
              <p className="text-slate-600 mb-6">Next exercise starting in...</p>
              <div className="text-6xl font-bold text-blue-500 mb-4 animate-pulse">
                {countdownValue}
              </div>
              <p className="text-lg font-semibold text-slate-700">
                {exercises[currentExerciseIndex]?.name}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exercise Display */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
            {/* Exercise Video/Image */}
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative">
              {/* Try to load as video first if URL suggests it's a video */}
              {currentExercise && isVideoUrl(currentExercise.mediaUrl) ? (
                <>
                  <video
                    ref={videoRef}
                    key={currentExercise.id} // Force re-render when exercise changes
                    className="w-full h-full object-cover"
                    controls
                    muted // Required for autoplay in most browsers
                    playsInline // Better mobile support
                    loop // Loop the video during the exercise
                    preload="auto" // Preload video for smoother playback
                    onLoadStart={handleVideoLoadStart}
                    onCanPlay={handleVideoCanPlay}
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    style={{ display: videoError ? 'none' : 'block' }}
                  >
                    <source src={currentExercise.mediaUrl} type="video/mp4" />
                    <source src={currentExercise.mediaUrl} type="video/webm" />
                    <source src={currentExercise.mediaUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Error Fallback */}
                  {videoError && (
                    <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-500">
                      <div className="text-lg mb-2">Video Error</div>
                      <div className="text-sm text-center px-4">{videoError}</div>
                      <div className="text-xs text-slate-400 mt-2">Falling back to image...</div>
                    </div>
                  )}
                </>
              ) : (
                /* Load as image if not a video URL */
                <>
                  <img
                    key={currentExercise?.id}
                    src={currentExercise?.mediaUrl}
                    alt={currentExercise?.name}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log('✅ GuidedSession: Image loaded successfully for:', currentExercise?.name);
                      setVideoLoaded(true);
                      setVideoError(null);
                    }}
                    onError={(e) => {
                      console.error('❌ GuidedSession: Image error for', currentExercise?.name, {
                        mediaUrl: currentExercise?.mediaUrl,
                        error: e
                      });
                      setVideoError('Image failed to load');
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  
                  {/* Image Error Fallback */}
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 text-lg" style={{ display: 'none' }}>
                    <div className="text-center">
                      <div className="mb-2">Media Error</div>
                      <div className="text-sm">Exercise Demo</div>
                      {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Exercise Name */}
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
              {currentExercise?.name}
            </h2>

            {/* Timer Display */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-slate-800 mb-2 font-mono">
                {formatTime(timeRemaining)}
              </div>
              <div className="flex justify-center items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isActive && !showCountdown ? 'bg-green-500 animate-pulse' : 'bg-slate-300'
                }`}></div>
                <span className="text-slate-600">
                  {showCountdown ? 'Get Ready...' : isActive ? 'Active' : isPaused ? 'Paused' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={isActive ? handlePause : handleStart}
                disabled={showCountdown}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                  showCountdown 
                    ? 'bg-slate-400 cursor-not-allowed'
                    : isActive
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {showCountdown ? 'Get Ready...' : isActive ? 'Pause' : 'Start'}
              </button>
              
              <button
                onClick={handleNextExercise}
                disabled={showCountdown}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  showCountdown
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                }`}
              >
                <SkipForward className="w-5 h-5" />
                {currentExerciseIndex < exercises.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Instructions</h3>
              <ul className="space-y-3">
                {currentExercise?.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-slate-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercise Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-800">Exercise Details</h4>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  currentExercise?.type === 'stretch' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {currentExercise?.type}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{currentExercise?.duration}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="font-medium capitalize">{currentExercise?.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus Area:</span>
                  <span className="font-medium capitalize">{currentExercise?.painPoint}</span>
                </div>
              </div>
            </div>

            {/* Next Exercise Preview */}
            {currentExerciseIndex < exercises.length - 1 && !showCountdown && (
              <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-700 mb-2">Up Next</h4>
                <p className="text-slate-600">{exercises[currentExerciseIndex + 1].name}</p>
                <p className="text-sm text-slate-500">{exercises[currentExerciseIndex + 1].duration}s</p>
              </div>
            )}

            {/* Session Summary */}
            {currentExerciseIndex === exercises.length - 1 && !showCountdown && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Final Exercise!</h4>
                <p className="text-green-700">You're almost done with your session!</p>
                <p className="text-sm text-green-600 mt-1">
                  Total session: {formatTime(totalSessionDuration)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white text-center">
          <p className="text-lg font-medium">
            {showCountdown 
              ? "Get ready for the next exercise!" 
              : isActive 
              ? "You're doing great! Keep it up!" 
              : "Take your time and focus on your form"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidedSession;