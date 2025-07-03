import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

export interface TimerSettings {
  intervalMinutes: number;
  activeDays: boolean[];
  startHour: number;
  endHour: number;
  notificationsEnabled: boolean;
}

const defaultSettings: TimerSettings = {
  intervalMinutes: 45,
  activeDays: [true, true, true, true, true, false, false], // Mon-Fri
  startHour: 9,
  endHour: 17,
  notificationsEnabled: true,
};

export function useTimer(onBreakTriggered: () => void) {
  const { user } = useAuth(); // Get current user for usage tracking
  
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('wellness-timer-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.intervalMinutes * 60);
  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null);
  const [isSnoozing, setIsSnoozing] = useState(false);
  const [snoozeStartTime, setSnoozeStartTime] = useState<Date | null>(null);
  const [snoozeDuration, setSnoozeDuration] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [userPlan, setUserPlan] = useState<string>('free');
  const [weeklyUsage, setWeeklyUsage] = useState<number>(0);
  const [canUseToday, setCanUseToday] = useState<boolean>(true);
  
  // Store the paused time value to resume from
  const pausedTimeRef = useRef<number | null>(null);
  
  // Add flag to prevent double triggers
  const lastNotificationTimeRef = useRef<number>(0);

  // Usage tracking functions
  const trackDailyUsage = useCallback(async (action: 'timer_started' | 'break_now') => {
    if (!user) return;

    try {
      console.log(`📊 Tracking daily usage: ${action} for user ${user.email}`);
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
      
      // Check if already used today
      const { data: existingUsage } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (!existingUsage) {
        // First usage today - log it
        const { error } = await supabase
          .from('daily_usage')
          .insert({
            user_id: user.id,
            date: today,
            action: action
          });

        if (error) {
          console.error('❌ Error tracking usage:', error);
        } else {
          console.log('✅ Daily usage tracked successfully');
          // Refresh usage data
          await checkUsageLimits();
        }
      } else {
        console.log('ℹ️ Already used app today, not logging again');
      }
    } catch (error) {
      console.error('❌ Error in trackDailyUsage:', error);
    }
  }, [user]);

  const checkUsageLimits = useCallback(async () => {
    if (!user) return;

    try {
      console.log('🔍 Checking usage limits...');
      
      // Get user's subscription plan
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      const currentPlan = profile?.subscription_plan || 'free';
      setUserPlan(currentPlan);

      // Get plan limits
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('days_per_week')
        .eq('id', currentPlan)
        .single();

      const daysAllowed = planData?.days_per_week || 2; // Default to 2 for free

      // Get current week usage
      const weekStart = getWeekStart();
      const { data: usageData } = await supabase
        .from('daily_usage')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0])
        .lt('date', getWeekEnd().toISOString().split('T')[0]);

      const daysUsed = new Set(usageData?.map(u => u.date) || []).size;
      setWeeklyUsage(daysUsed);

      // Check if already used today
      const today = new Date().toISOString().split('T')[0];
      const alreadyUsedToday = usageData?.some(u => u.date === today) || false;

      // Can use if: already used today OR haven't hit weekly limit
      const canUse = alreadyUsedToday || daysUsed < daysAllowed;
      setCanUseToday(canUse);

      console.log(`📊 Usage check: Plan=${currentPlan}, Used=${daysUsed}/${daysAllowed}, CanUse=${canUse}, UsedToday=${alreadyUsedToday}`);
      
    } catch (error) {
      console.error('❌ Error checking usage limits:', error);
    }
  }, [user]);

  // Helper functions for week calculation
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday as week start
    return new Date(now.setUTCDate(diff));
  };

  const getWeekEnd = () => {
    const weekStart = getWeekStart();
    return new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  };

  // Check usage limits when user changes or component mounts
  useEffect(() => {
    if (user) {
      checkUsageLimits();
    }
  }, [user, checkUsageLimits]);

  // Enhanced notification permission management
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      try {
        let permission = Notification.permission;
        
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }
        
        setNotificationPermission(permission);
        
        if (permission === 'denied') {
          console.warn('⚠️ Notifications blocked - user needs to enable in browser settings');
        } else if (permission === 'granted') {
          console.log('✅ Notification permission granted');
        }
        
        return permission;
      } catch (error) {
        console.error('❌ Error requesting notification permission:', error);
        return 'denied';
      }
    }
    return 'denied';
  }, []);

  // Request notification permission when notifications are enabled
  useEffect(() => {
    if (settings.notificationsEnabled) {
      requestNotificationPermission();
    }
  }, [settings.notificationsEnabled, requestNotificationPermission]);

  // Save timer state to localStorage for recovery
  const saveTimerState = useCallback((currentTime: number) => {
    const timerState = {
      timeRemaining: currentTime,
      isActive,
      isSnoozing,
      snoozeDuration,
      snoozeStartTime: snoozeStartTime?.getTime() || null,
      lastUpdate: Date.now(),
      intervalMinutes: settings.intervalMinutes
    };
    localStorage.setItem('wellness-timer-state', JSON.stringify(timerState));
  }, [isActive, isSnoozing, snoozeDuration, snoozeStartTime, settings.intervalMinutes]);

  // Recover timer state on mount
  useEffect(() => {
    const recoverTimerState = () => {
      try {
        const savedState = localStorage.getItem('wellness-timer-state');
        if (savedState) {
          const state = JSON.parse(savedState);
          const elapsed = (Date.now() - state.lastUpdate) / 1000;
          const adjustedTime = Math.max(0, state.timeRemaining - elapsed);
          
          if (state.isActive && adjustedTime > 0) {
            console.log('🔄 Recovering timer state:', { adjustedTime, elapsed });
            setTimeRemaining(Math.floor(adjustedTime));
            setIsActive(true);
            setIsSnoozing(state.isSnoozing);
            setSnoozeDuration(state.snoozeDuration);
            if (state.snoozeStartTime) {
              setSnoozeStartTime(new Date(state.snoozeStartTime));
            }
          } else if (state.isActive && adjustedTime <= 0) {
            // Timer should have expired while away
            console.log('⏰ Timer expired while away, checking if should trigger break');
            
            // Add safety check - only trigger if it's been more than 5 seconds since last update
            const timeSinceLastUpdate = (Date.now() - state.lastUpdate) / 1000;
            
            if (timeSinceLastUpdate > 5) {
              console.log('⏰ Timer expired while away, triggering break');
              localStorage.removeItem('wellness-timer-state');
              triggerBreakNotification();
            } else {
              // Too recent, just clear the state
              console.log('⚠️ Timer expiration too recent, skipping duplicate trigger');
              localStorage.removeItem('wellness-timer-state');
            }
          }
        }
      } catch (error) {
        console.error('❌ Error recovering timer state:', error);
        localStorage.removeItem('wellness-timer-state');
      }
    };

    recoverTimerState();
  }, []);

  // Page Visibility API integration
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isActive) {
        // Tab became visible - sync time if needed
        console.log('👁️ Tab visible - checking timer sync');
        // Could add time sync logic here if needed
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wellness-timer-settings', JSON.stringify(settings));
    
    // Only reset timer if not active, not paused, and not snoozing
    if (!isActive && pausedTimeRef.current === null && !isSnoozing) {
      setTimeRemaining(settings.intervalMinutes * 60);
    }
  }, [settings]); // Removed isActive and isSnoozing from dependencies to prevent interference

  const isWithinSchedule = useCallback(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    
    // Convert Sunday (0) to index 6, Monday (1) to index 0, etc.
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1;
    
    return settings.activeDays[dayIndex] && 
           currentHour >= settings.startHour && 
           currentHour < settings.endHour;
  }, [settings]);

  const calculateNextBreakTime = useCallback(() => {
    if (!isActive) return null;
    
    const now = new Date();
    const nextBreak = new Date(now.getTime() + timeRemaining * 1000);
    return nextBreak;
  }, [isActive, timeRemaining]);

  // Enhanced notification system with duplicate prevention
  const triggerBreakNotification = useCallback(async () => {
    const now = Date.now();
    
    // Prevent duplicate notifications within 3 seconds
    if (now - lastNotificationTimeRef.current < 3000) {
      console.log('⚠️ Preventing duplicate notification (too recent)');
      return;
    }
    
    lastNotificationTimeRef.current = now;
    console.log('🔔 Triggering break notification');
    
    // Always show break modal first (most important)
    onBreakTriggered();
    
    // Then try to send browser notification
    if ('Notification' in window && settings.notificationsEnabled) {
      try {
        let permission = Notification.permission;
        
        if (permission === 'default') {
          permission = await Notification.requestPermission();
          setNotificationPermission(permission);
        }
        
        if (permission === 'granted') {
          // Create notification with better options
          const notification = new Notification('⏰ Time for a Break!', {
            body: 'Your break reminder is ready. Choose your activity!',
            icon: '/favicon.ico',
            tag: 'wellness-break-' + Date.now(), // Unique tag to prevent blocking
            requireInteraction: true,
            silent: false,
          });

          notification.onclick = () => {
            console.log('🔔 Notification clicked - focusing window');
            window.focus();
            notification.close();
          };

          // Auto-close after 30 seconds
          setTimeout(() => {
            try {
              notification.close();
            } catch (e) {
              // Notification might already be closed
            }
          }, 30000);
          
          console.log('✅ Notification sent successfully');
          
        } else {
          console.warn('⚠️ Notification permission:', permission);
        }
        
      } catch (error) {
        console.error('❌ Notification error:', error);
      }
    }
    
  }, [settings.notificationsEnabled, onBreakTriggered]);

  // Enhanced regular timer with better reliability
  useEffect(() => {
    let interval: number;

    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Save state every 10 seconds for recovery
          if (newTime % 10 === 0) {
            saveTimerState(newTime);
          }
          
          if (newTime <= 0) {
            // Timer expired - clear saved state FIRST to prevent double trigger
            localStorage.removeItem('wellness-timer-state');
            
            console.log('⏰ Timer expired - triggering notification');
            
            // Always trigger break notification regardless of schedule
            // (let user decide if they want break or not)
            triggerBreakNotification();
            
            // Reset timer state
            pausedTimeRef.current = null;
            setIsActive(false);
            
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining, triggerBreakNotification, saveTimerState]);

  // Update next break time
  useEffect(() => {
    setNextBreakTime(calculateNextBreakTime());
  }, [calculateNextBreakTime]);

  const startTimer = async () => {
    // Check usage limits before starting timer
    if (!canUseToday) {
      alert(`You've reached your weekly limit for the ${userPlan} plan. Upgrade to continue using the app!`);
      return;
    }

    let duration: number;
    
    // If we have a paused time, resume from there
    if (pausedTimeRef.current !== null) {
      duration = pausedTimeRef.current;
      setTimeRemaining(pausedTimeRef.current);
      pausedTimeRef.current = null;
    } else {
      // Starting fresh - use full interval time and track usage
      duration = settings.intervalMinutes * 60;
      setTimeRemaining(duration);
      
      // Track usage when starting a new timer session
      await trackDailyUsage('timer_started');
    }
    
    setIsActive(true);
  };

  const pauseTimer = () => {
    // Don't allow pausing during snooze
    if (isSnoozing) {
      return;
    }
    
    // Store current time when pausing
    pausedTimeRef.current = timeRemaining;
    setIsActive(false);
  };

  const resetTimer = () => {
    // Don't allow reset during snooze
    if (isSnoozing) {
      return;
    }
    
    setIsActive(false);
    setTimeRemaining(settings.intervalMinutes * 60);
    setIsSnoozing(false);
    setSnoozeStartTime(null);
    setSnoozeDuration(0);
    // Clear any stored paused time
    pausedTimeRef.current = null;
    
    // Clear saved state
    localStorage.removeItem('wellness-timer-state');
  };

  const snoozeTimer = (minutes: number) => {
    console.log(`🔍 useTimer: snoozeTimer called with ${minutes} minutes`);
    
    // Clear any existing state first
    setIsSnoozing(false);
    setSnoozeStartTime(null);
    setSnoozeDuration(0);
    pausedTimeRef.current = null;
    
    // Use setTimeout to ensure state updates are batched properly
    setTimeout(() => {
      const snoozeDurationSeconds = minutes * 60;
      
      // Set snooze state FIRST to prevent other effects from interfering
      setIsSnoozing(true);
      setSnoozeDuration(snoozeDurationSeconds);
      setSnoozeStartTime(new Date());
      
      // Then set timer state
      setTimeRemaining(snoozeDurationSeconds);
      setIsActive(true);
      
      console.log(`✅ useTimer: Snooze timer set: ${snoozeDurationSeconds} seconds, isActive: true, isSnoozing: true`);
    }, 50);
  };

  const cancelSnooze = () => {
    console.log('🔍 cancelSnooze: Starting cancel snooze process');
    
    // Clear snooze state
    setIsSnoozing(false);
    setSnoozeStartTime(null);
    setSnoozeDuration(0);
    setIsActive(false);
    pausedTimeRef.current = null;
    
    // Clear saved state
    localStorage.removeItem('wellness-timer-state');
    
    console.log('✅ cancelSnooze: Snooze state cleared, triggering break modal');
    
    // CRITICAL: Trigger break selector modal immediately
    onBreakTriggered();
    
    console.log('✅ cancelSnooze: onBreakTriggered() called');
  };

  // Modified manual break function with usage tracking
  const triggerManualBreak = async () => {
    // Check usage limits before allowing manual break
    if (!canUseToday) {
      alert(`You've reached your weekly limit for the ${userPlan} plan. Upgrade to continue using the app!`);
      return false;
    }

    // Track usage for manual break
    await trackDailyUsage('break_now');
    
    // Trigger the break
    onBreakTriggered();
    return true;
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate snooze progress percentage
  const getSnoozeProgress = () => {
    if (!isSnoozing || !snoozeStartTime || snoozeDuration === 0) return 0;
    const elapsed = snoozeDuration - timeRemaining;
    return Math.min(100, Math.max(0, (elapsed / snoozeDuration) * 100));
  };

  return {
    settings,
    isActive,
    timeRemaining,
    nextBreakTime,
    isWithinSchedule: isWithinSchedule(),
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
    snoozeTimer,
    cancelSnooze,
    triggerManualBreak,
    updateSettings,
    getSnoozeProgress,
    requestNotificationPermission,
    checkUsageLimits,
  };
}
