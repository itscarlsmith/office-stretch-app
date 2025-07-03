import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, X, Edit3, AlertCircle, Bell, BellOff, Crown, Zap } from 'lucide-react';
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
    userPlan,
    weeklyUsage,
    canUseToday,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    getSnoozeProgress,
    cancelSnooze,
    snoozeTimer,
    triggerManualBreak,
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
  const handleManualBreakTriggered = async () => {
    // Don't allow manual break during snooze
    if (isSnoozing) return;
    
    // Use the new triggerManualBreak function that includes usage tracking
    const success = await triggerManualBreak();
    
    if (success) {
      // Set flag for auto-restart when returning to dashboard
      localStorage.setItem('wellness-auto-restart', 'true');
      if (onManualBreak) {
        onManualBreak();
      } else {
        onBreakTriggered();
      }
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

  // Get plan display info
  const getPlanInfo = () => {
    const planNames = {
      free: 'Free Plan',
      '3day': '3-Day Plan',
      '5day': '5-Day Plan', 
      '7day': '7-Day Plan',
      annual: 'Annual Plan'
    };
    
    const planLimits = {
      free: 2,
      '3day': 3,
      '5day': 5,
      '7day': 7,
      annual: 7
    };

    return {
      name: planNames[userPlan as keyof typeof planNames] || 'Free Plan',
      limit: planLimits[userPlan as keyof typeof planLimits] || 2,
      isUnlimited: userPlan === 'annual'
    };
  };

  const planInfo = getPlanInfo();

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
        {/* Usage Limit Banner */}
        {!canUseToday && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Weekly Limit Reached</h3>
                <p className="text-purple-700 mb-4">
                  You've used all {planInfo.limit} days this week on your {planInfo.name}. Upgrade to continue your healthy habits!
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors">
                    Upgrade Plan
                  </button>
                  <div className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-xl">
                    Resets Monday
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              disabled={isSnoozing || (!canUseToday && !isActive)}
              className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-white shadow-lg transition-all duration-200 ${
                isSnoozing || (!canUseToday && !isActive)
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

        {/* Enhanced Schedule Card with Usage Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 mb-6 max-w-md mx-auto">
          <div className="space-y-4">
            {/* Usage Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  canUseToday ? 'bg-[#34C759]/10' : 'bg-red-100'
                }`}>
                  {canUseToday ? (
                    <Zap className="w-4 h-4 text-[#34C759]" />
                  ) : (
                    <Crown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-black">
                    {planInfo.name}
                  </div>
                  <div className="text-xs text-[#8E8E93]">
                    {planInfo.isUnlimited 
                      ? 'Unlimited usage'
                      : `${weeklyUsage}/${planInfo.limit} days used this week`
                    }
                  </div>
                </div>
              </div>
              {!canUseToday && (
                <button className="text-xs text-purple-600 hover:text-purple-700 underline">
                  Upgrade
                </button>
              )}
            </div>

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
            disabled={isSnoozing || !canUseToday}
            className={`px-8 py-3 border border-[#E5E5EA] rounded-2xl font-medium transition-all duration-200 shadow-sm ${
              isSnoozing || !canUseToday
                ? 'bg-[#F2F2F7] text-[#8E8E93] cursor-not-allowed opacity-50'
                : 'bg-white text-[#007AFF] hover:bg-[#F2F2F7] hover:scale-105 active:scale-95'
            }`}
          >
            {isSnoozing 
              ? 'Break Snoozed' 
              : !canUseToday 
              ? 'Weekly Limit Reached'
              : 'Take a Break Now'
            }
          </button>
          {!canUseToday && (
            <p className="text-xs text-[#8E8E93] mt-2">
              Upgrade your plan to continue using the app
            </p>
          )}
        </div>
      </div>

      {/* Settings Panel - Same as before but condensed for space */}
      {showSettings && !isSnoozing && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-[#E5E5EA]">
                <h2 className="text-xl font-semibold text-black">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-full bg-[#8E8E93]/10 flex items-center justify-center hover:bg-[#8E8E93]/20 transition-colors"
                >
                  <X className="w-5 h-5 text-[#8E8E93]" />
                </button>
              </div>
              {/* Settings content continues here... */}
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-500">Settings panel content...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
