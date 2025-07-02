import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, X, Edit3, AlertCircle, Bell, BellOff } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';

interface DashboardProps {
  onBreakTriggered: () => void;
  onManualBreak?: () => void;
  onRegisterSnoozeFunction?: (snoozeFunction: (minutes: number) => void) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBreakTriggered, onManualBreak, onRegisterSnoozeFunction }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNotificationHelp, setShowNotificationHelp] = useState(false);
  
  const {
    settings,
    isActive,
    timeRemaining,
    nextBreakTime,
    isWithinSchedule,
    isSnoozing,
    snoozeStartTime,
    snoozeDuration,
    notificationPermission,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    handleSessionComplete,
    getSnoozeProgress,
    cancelSnooze,
    snoozeTimer,
    requestNotificationPermission,
  } = useTimer(onBreakTriggered);

  // Register snooze function with parent component
  useEffect(() => {
    if (onRegisterSnoozeFunction) {
      onRegisterSnoozeFunction(snoozeTimer);
    }
  }, [onRegisterSnoozeFunction, snoozeTimer]);

  // Auto-restart timer when dashboard mounts (after session completion)
  useEffect(() => {
    // Check if we should auto-restart (this happens after session completion)
    const shouldAutoRestart = localStorage.getItem('wellness-auto-restart');
    if (shouldAutoRestart === 'true') {
      localStorage.removeItem('wellness-auto-restart');
      // Start the timer automatically
      setTimeout(() => {
        startTimer();
      }, 100); // Small delay to ensure component is fully mounted
    }
  }, [startTimer]);

  // Show notification help if permission is denied
  useEffect(() => {
    if (settings.notificationsEnabled && notificationPermission === 'denied') {
      setShowNotificationHelp(true);
    } else {
      setShowNotificationHelp(false);
    }
  }, [settings.notificationsEnabled, notificationPermission]);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate progress based on timer type
  const getProgress = () => {
    if (isSnoozing) {
      return getSnoozeProgress();
    }
    return ((settings.intervalMinutes * 60 - timeRemaining) / (settings.intervalMinutes * 60)) * 100;
  };

  const progress = getProgress();

  const handleDayToggle = (index: number) => {
    const newActiveDays = [...settings.activeDays];
    newActiveDays[index] = !newActiveDays[index];
    updateSettings({ activeDays: newActiveDays });
  };

  const getActiveDaysString = () => {
    const activeDayNames = dayNames.filter((_, i) => settings.activeDays[i]);
    if (activeDayNames.length === 5 && settings.activeDays.slice(0, 5).every(day => day)) {
      return 'Mon-Fri';
    }
    return activeDayNames.join(', ');
  };

  const handleSliderChange = (value: number) => {
    updateSettings({ intervalMinutes: value });
  };

  // Quick select options for common intervals
  const quickSelectOptions = [15, 30, 45, 60, 90, 120];

  // Handle manual break with auto-restart setup
  const handleManualBreakTriggered = () => {
    // Don't allow manual break during snooze
    if (isSnoozing) return;
    
    // Set flag for auto-restart when returning to dashboard
    localStorage.setItem('wellness-auto-restart', 'true');
    if (onManualBreak) {
      onManualBreak();
    } else {
      onBreakTriggered();
    }
  };

  // Get timer status text
  const getTimerStatusText = () => {
    if (isSnoozing) {
      return isActive ? 'Snoozing...' : 'Snooze Paused';
    }
    return isActive ? 'Running' : 'Paused';
  };

  // Get timer status color
  const getTimerStatusColor = () => {
    if (isSnoozing) {
      return isActive ? 'text-amber-600' : 'text-amber-400';
    }
    return isActive ? 'text-[#007AFF]' : 'text-[#8E8E93]';
  };

  // Get progress ring color
  const getProgressRingColor = () => {
    if (isSnoozing) {
      return isActive ? "#FF9500" : "#8E8E93";
    }
    return isActive ? "#007AFF" : "#8E8E93";
  };

  // Handle cancel snooze
  const handleCancelSnooze = () => {
    cancelSnooze();
  };

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      // Enabling notifications - request permission
      const permission = await requestNotificationPermission();
      if (permission === 'granted') {
        updateSettings({ notificationsEnabled: true });
      }
    } else {
      // Disabling notifications
      updateSettings({ notificationsEnabled: false });
    }
  };

  // Get notification status
  const getNotificationStatus = () => {
    if (!settings.notificationsEnabled) return 'disabled';
    if (notificationPermission === 'granted') return 'enabled';
    if (notificationPermission === 'denied') return 'blocked';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-center relative">
          {/* Centered Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#007AFF] to-[#5856D6] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">OS</span>
            </div>
            <h1 className="text-lg font-semibold text-black">Office Stretch</h1>
          </div>
          
          {/* Settings Icon - Positioned closer to center */}
          <div className="absolute right-6 flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowSettings(true)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={isSnoozing}
                className={`w-8 h-8 bg-[#8E8E93]/10 rounded-full flex items-center justify-center transition-colors ${
                  isSnoozing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#8E8E93]/20'
                }`}
              >
                <Settings className="w-4 h-4 text-[#8E8E93]" />
              </button>
              
              {/* Tooltip */}
              {showTooltip && !isSnoozing && (
                <div className="absolute top-full mt-2 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                  Timer Settings
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-black/80 rotate-45"></div>
                </div>
              )}
            </div>
            <span className="text-sm text-[#8E8E93] font-medium">Timer Settings</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Notification Help Banner */}
        {showNotificationHelp && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BellOff className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Notifications Blocked</h3>
                <p className="text-red-700 mb-4">
                  To receive break reminders when this tab is in the background, please enable notifications in your browser settings.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={requestNotificationPermission}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => updateSettings({ notificationsEnabled: false })}
                    className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-xl hover:bg-red-200 transition-colors"
                  >
                    Disable Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Snooze Alert Banner */}
        {isSnoozing && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">Snooze Active</h3>
                  <p className="text-amber-700">
                    Break reminder snoozed for {Math.ceil(snoozeDuration / 60)} minutes
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelSnooze}
                className="px-4 py-2 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Cancel Snooze
              </button>
            </div>
            
            {/* Snooze Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-amber-700 mb-2">
                <span>Snooze Progress</span>
                <span>{Math.round(getSnoozeProgress())}%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getSnoozeProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Timer */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-8">
            {/* Progress Ring */}
            <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 200 200">
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#E5E5EA"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={getProgressRingColor()}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out"
              />
            </svg>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-black mb-1 font-mono tracking-tight">
                {formatTime(timeRemaining)}
              </div>
              <div className={`text-sm font-medium ${getTimerStatusColor()}`}>
                {getTimerStatusText()}
              </div>
              {isSnoozing && (
                <div className="text-xs text-amber-500 mt-1">
                  Snooze Break
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={isActive ? pauseTimer : startTimer}
              disabled={isSnoozing}
              className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-white shadow-lg transition-all duration-200 ${
                isSnoozing
                  ? 'bg-[#8E8E93] cursor-not-allowed opacity-50'
                  : isActive
                  ? 'bg-[#FF9500] hover:bg-[#FF9500]/90 hover:scale-105 active:scale-95'
                  : 'bg-[#007AFF] hover:bg-[#007AFF]/90 hover:scale-105 active:scale-95'
              }`}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            
            <button
              onClick={resetTimer}
              disabled={isSnoozing}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSnoozing
                  ? 'bg-[#8E8E93]/10 cursor-not-allowed opacity-50'
                  : 'bg-[#8E8E93]/10 hover:bg-[#8E8E93]/20 hover:scale-105 active:scale-95'
              }`}
            >
              <RotateCcw className="w-5 h-5 text-[#8E8E93]" />
            </button>
          </div>
        </div>

        {/* Streamlined Schedule Card - Only Schedule and Interval */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 mb-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#34C759]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#34C759] text-xs">📅</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">Schedule</div>
                  <div className="text-xs text-[#8E8E93]">
                    {getActiveDaysString()} {settings.startHour}:00-{settings.endHour}:00
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                disabled={isSnoozing}
                className={`w-6 h-6 bg-[#8E8E93]/10 rounded-full flex items-center justify-center transition-colors ${
                  isSnoozing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#8E8E93]/20'
                }`}
              >
                <Edit3 className="w-3 h-3 text-[#8E8E93]" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#007AFF]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#007AFF] text-xs">⏱️</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-black">
                    {isSnoozing ? 'Snooze Timer' : 'Interval'}
                  </div>
                  <div className="text-xs text-[#8E8E93]">
                    {isSnoozing 
                      ? `${Math.ceil(timeRemaining / 60)}min snooze`
                      : `Every ${settings.intervalMinutes}min`
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getNotificationStatus() === 'enabled' 
                    ? 'bg-[#34C759]/10' 
                    : getNotificationStatus() === 'blocked'
                    ? 'bg-red-100'
                    : 'bg-[#8E8E93]/10'
                }`}>
                  {getNotificationStatus() === 'enabled' ? (
                    <Bell className="w-4 h-4 text-[#34C759]" />
                  ) : (
                    <BellOff className="w-4 h-4 text-[#8E8E93]" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-black">Notifications</div>
                  <div className="text-xs text-[#8E8E93]">
                    {getNotificationStatus() === 'enabled' && 'Active'}
                    {getNotificationStatus() === 'disabled' && 'Disabled'}
                    {getNotificationStatus() === 'blocked' && 'Blocked'}
                    {getNotificationStatus() === 'pending' && 'Permission needed'}
                  </div>
                </div>
              </div>
              {getNotificationStatus() === 'blocked' && (
                <button
                  onClick={() => setShowNotificationHelp(true)}
                  className="text-xs text-red-600 hover:text-red-700 underline"
                >
                  Fix
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Take a Break Now Button */}
        <div className="text-center">
          <button
            onClick={handleManualBreakTriggered}
            disabled={isSnoozing}
            className={`px-8 py-3 border border-[#E5E5EA] rounded-2xl font-medium transition-all duration-200 shadow-sm ${
              isSnoozing
                ? 'bg-[#F2F2F7] text-[#8E8E93] cursor-not-allowed opacity-50'
                : 'bg-white text-[#007AFF] hover:bg-[#F2F2F7] hover:scale-105 active:scale-95'
            }`}
          >
            {isSnoozing ? 'Break Snoozed' : 'Take a Break Now'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && !isSnoozing && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E5E5EA]">
                <h2 className="text-xl font-semibold text-black">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-full bg-[#8E8E93]/10 flex items-center justify-center hover:bg-[#8E8E93]/20 transition-colors"
                >
                  <X className="w-5 h-5 text-[#8E8E93]" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Break Interval */}
                <div>
                  <label className="block text-base font-medium text-black mb-4">
                    Break Interval
                  </label>
                  
                  {/* Slider */}
                  <div className="bg-[#F2F2F7] rounded-xl p-4 mb-4">
                    <div className="text-sm font-medium text-[#8E8E93] mb-3">Adjust with slider:</div>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      step="1"
                      value={settings.intervalMinutes}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E5E5EA] rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-[#8E8E93] mt-2">
                      <span>1 min</span>
                      <span className="font-medium text-[#007AFF]">{settings.intervalMinutes} min</span>
                      <span>120 min</span>
                    </div>
                  </div>

                  {/* Quick Select Options */}
                  <div>
                    <div className="text-sm font-medium text-[#8E8E93] mb-2">Quick Select:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {quickSelectOptions.map((minutes) => (
                        <button
                          key={minutes}
                          onClick={() => handleSliderChange(minutes)}
                          className={`h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
                            settings.intervalMinutes === minutes
                              ? 'bg-[#007AFF] text-white shadow-sm'
                              : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'
                          }`}
                        >
                          {minutes}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-base font-medium text-black mb-3">
                    Active Days
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, index) => (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(index)}
                        className={`h-12 rounded-xl font-medium text-sm transition-all duration-200 ${
                          settings.activeDays[index]
                            ? 'bg-[#007AFF] text-white shadow-sm'
                            : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-black mb-3">
                      Start Time
                    </label>
                    <select
                      value={settings.startHour}
                      onChange={(e) => updateSettings({ startHour: parseInt(e.target.value) })}
                      className="w-full h-12 px-4 bg-[#F2F2F7] border-0 rounded-xl text-black focus:ring-2 focus:ring-[#007AFF] focus:bg-white transition-all"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-black mb-3">
                      End Time
                    </label>
                    <select
                      value={settings.endHour}
                      onChange={(e) => updateSettings({ endHour: parseInt(e.target.value) })}
                      className="w-full h-12 px-4 bg-[#F2F2F7] border-0 rounded-xl text-black focus:ring-2 focus:ring-[#007AFF] focus:bg-white transition-all"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Enhanced Notifications */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-base font-medium text-black">Notifications</div>
                      <div className="text-sm text-[#8E8E93] mt-1">Get reminded when it's time for a break</div>
                    </div>
                    <button
                      onClick={handleNotificationToggle}
                      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                        settings.notificationsEnabled && notificationPermission === 'granted' 
                          ? 'bg-[#34C759]' 
                          : 'bg-[#E5E5EA]'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          settings.notificationsEnabled && notificationPermission === 'granted'
                            ? 'translate-x-5' 
                            : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Notification Status */}
                  <div className={`text-sm p-3 rounded-lg ${
                    getNotificationStatus() === 'enabled' 
                      ? 'bg-green-50 text-green-700'
                      : getNotificationStatus() === 'blocked'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {getNotificationStatus() === 'enabled' && (
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <span>Notifications are working! You'll get break reminders even when this tab is in the background.</span>
                      </div>
                    )}
                    {getNotificationStatus() === 'disabled' && (
                      <div className="flex items-center gap-2">
                        <BellOff className="w-4 h-4" />
                        <span>Notifications are disabled. Enable them to get break reminders.</span>
                      </div>
                    )}
                    {getNotificationStatus() === 'blocked' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BellOff className="w-4 h-4" />
                          <span>Notifications are blocked by your browser.</span>
                        </div>
                        <button
                          onClick={requestNotificationPermission}
                          className="text-sm underline hover:no-underline"
                        >
                          Click here to enable notifications
                        </button>
                      </div>
                    )}
                    {getNotificationStatus() === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <span>Click the toggle to enable notifications.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#E5E5EA]">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full h-12 bg-[#007AFF] text-white font-semibold rounded-xl hover:bg-[#007AFF]/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #007AFF;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #007AFF;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;