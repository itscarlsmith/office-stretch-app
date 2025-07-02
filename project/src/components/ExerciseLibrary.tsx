import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Clock, Play, Check, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { difficultyLevels, equipmentTypes } from '../data/exercises';

interface Exercise {
  id: number;
  name: string;
  type: 'stretch' | 'exercise';
  category: string;
  painPoint: string;
  duration: number;
  difficulty: string;
  equipment: string;
  instructions: string[];
  description: string;
  mediaUrl: string;
  focusTips?: string[];
}

interface SelectedExercise extends Exercise {
  customDuration: number;
}

interface ExerciseLibraryProps {
  painPoint: string;
  onStartSession: (exercises: Exercise[]) => void;
  onBack: () => void;
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  painPoint,
  onStartSession,
  onBack,
}) => {
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    equipment: 'all',
    type: 'all'
  });

  // Duration options for individual exercises
  const exerciseDurationOptions = [15, 30, 45, 60, 75, 90, 105, 120];

  // Type filter options
  const typeOptions = [
    { id: 'all', name: 'All Types' },
    { id: 'discrete', name: 'Discrete' },
    { id: 'sitting', name: 'Sitting' },
    { id: 'standing', name: 'Standing' },
    { id: 'quick-energy', name: 'Quick Energy' }
  ];

  // Fetch exercises from Supabase EXERCISES table
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🏋️ ExerciseLibrary: Fetching from EXERCISES table...');
        
        const { data, error } = await supabase
          .from('exercises') // ✅ CORRECT: Querying exercises table
          .select('*')
          .order('name');
        
        if (error) {
          console.error('❌ ExerciseLibrary Supabase error:', error);
          throw error;
        }
        
        console.log('🏋️ ExerciseLibrary: Raw data from EXERCISES table:', data);
        console.log('🏋️ ExerciseLibrary: Number of records returned:', data?.length || 0);
        
        // Log each record's type value for debugging
        if (data && data.length > 0) {
          console.log('🏋️ ExerciseLibrary: Type values in EXERCISES database:');
          data.forEach((exercise, index) => {
            console.log(`  Exercise ${index}: "${exercise.name}" - type: "${exercise.type}" (${typeof exercise.type})`);
          });
        }
        
        // Transform the data to match our Exercise interface
        const transformedExercises = (data || []).map(exercise => {
          console.log(`🏋️ ExerciseLibrary: Transforming exercise "${exercise.name}" with type: "${exercise.type}"`);
          
          return {
            id: exercise.id,
            name: exercise.name,
            description: exercise.description || '',
            instructions: Array.isArray(exercise.instructions) ? exercise.instructions : [exercise.instructions],
            painPoint: exercise.pain_point || 'full-body',
            difficulty: exercise.difficulty,
            duration: exercise.duration || 30,
            mediaUrl: exercise.media_url || 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg',
            type: exercise.type, // Use actual database type field
            category: exercise.category || 'quick-energy',
            equipment: exercise.equipment || 'none',
            focusTips: exercise.focus_tips || []
          };
        });

        console.log('🏋️ ExerciseLibrary: Transformed exercises:', transformedExercises);
        console.log('🏋️ ExerciseLibrary: Transformed exercises count:', transformedExercises.length);
        
        // Log the unique type values after transformation
        const uniqueTypes = [...new Set(transformedExercises.map(ex => ex.type))];
        console.log('🏋️ ExerciseLibrary: Unique type values after transformation:', uniqueTypes);
        
        setExercises(transformedExercises);
        
      } catch (err) {
        console.error('❌ ExerciseLibrary: Error fetching exercises:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on current filters
  const filteredExercises = useMemo(() => {
    console.log('🏋️ ExerciseLibrary: Filtering exercises...');
    console.log('🏋️ ExerciseLibrary: Total exercises available:', exercises.length);
    console.log('🏋️ ExerciseLibrary: Active filters:', filters);
    
    let filtered = exercises; // Start with all exercises from EXERCISES table
    console.log('🏋️ ExerciseLibrary: Starting with all exercises:', filtered.length);
    
    // Apply type filter - simple direct comparison
    if (filters.type !== 'all') {
      console.log(`🏋️ ExerciseLibrary: Applying type filter: "${filters.type}"`);
      const beforeCount = filtered.length;
      filtered = filtered.filter(ex => {
        const matches = ex.type === filters.type;
        if (!matches) {
          console.log(`  ❌ Exercise "${ex.name}" type "${ex.type}" doesn't match filter "${filters.type}"`);
        } else {
          console.log(`  ✅ Exercise "${ex.name}" type "${ex.type}" matches filter "${filters.type}"`);
        }
        return matches;
      });
      console.log(`🏋️ ExerciseLibrary: After type filter: ${beforeCount} -> ${filtered.length}`);
    }
    
    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      console.log(`🏋️ ExerciseLibrary: Applying difficulty filter: "${filters.difficulty}"`);
      const beforeCount = filtered.length;
      filtered = filtered.filter(ex => ex.difficulty === filters.difficulty);
      console.log(`🏋️ ExerciseLibrary: After difficulty filter: ${beforeCount} -> ${filtered.length}`);
    }
    
    // Apply equipment filter
    if (filters.equipment !== 'all') {
      console.log(`🏋️ ExerciseLibrary: Applying equipment filter: "${filters.equipment}"`);
      const beforeCount = filtered.length;
      filtered = filtered.filter(ex => ex.equipment === filters.equipment);
      console.log(`🏋️ ExerciseLibrary: After equipment filter: ${beforeCount} -> ${filtered.length}`);
    }
    
    console.log('🏋️ ExerciseLibrary: Final filtered exercises count:', filtered.length);
    console.log('🏋️ ExerciseLibrary: Final filtered exercises:', filtered.map(ex => ({ name: ex.name, type: ex.type })));
    
    return filtered;
  }, [exercises, filters]);

  const handleExerciseToggle = (exercise: Exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(ex => ex.id === exercise.id);
      if (isSelected) {
        return prev.filter(ex => ex.id !== exercise.id);
      } else {
        // Add with default duration
        return [...prev, { ...exercise, customDuration: exercise.duration }];
      }
    });
  };

  const handleDurationChange = (exerciseId: number, newDuration: number) => {
    setSelectedExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, customDuration: newDuration }
          : ex
      )
    );
  };

  const handleStartSession = () => {
    if (selectedExercises.length > 0) {
      // Convert back to regular exercises with updated durations
      const exercisesForSession = selectedExercises.map(ex => ({
        ...ex,
        duration: ex.customDuration
      }));
      onStartSession(exercisesForSession);
    }
  };

  const updateFilter = (filterType: string, value: string) => {
    console.log(`🏋️ ExerciseLibrary: Filter changed: ${filterType} = "${value}"`);
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    const level = difficultyLevels.find(d => d.id === difficulty);
    return level ? level.color : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getEquipmentIcon = (equipment: string) => {
    const eq = equipmentTypes.find(e => e.id === equipment);
    return eq ? eq.icon : '✋';
  };

  const getEquipmentName = (equipment: string) => {
    const eq = equipmentTypes.find(e => e.id === equipment);
    return eq ? eq.name : 'Unknown';
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}min`;
  };

  const totalDuration = selectedExercises.reduce((sum, ex) => sum + ex.customDuration, 0);
  const isSelected = (exerciseId: number) => selectedExercises.some(ex => ex.id === exerciseId);
  const getSelectedExercise = (exerciseId: number) => selectedExercises.find(ex => ex.id === exerciseId);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Exercise Library</h1>
              <p className="text-slate-600">Loading exercises...</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading your personalized exercises...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Exercise Library</h1>
              <p className="text-slate-600">Error loading exercises</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Exercises</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Exercise Library</h1>
            <p className="text-slate-600">Choose exercises for your energizing workout session</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Exercise Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {typeOptions.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                {difficultyLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>

            {/* Equipment Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Equipment</label>
              <select
                value={filters.equipment}
                onChange={(e) => updateFilter('equipment', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Any Equipment</option>
                {equipmentTypes.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Button - Moved to top */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedExercises.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{selectedExercises.length}</span>
                      </div>
                      <span className="text-slate-700 font-medium">
                        {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Total time: <span className="font-semibold text-slate-800">{formatDuration(totalDuration)}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-slate-600">Select exercises to build your workout</span>
                )}
              </div>
              
              <button
                onClick={handleStartSession}
                disabled={selectedExercises.length === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedExercises.length > 0
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5" />
                {selectedExercises.length > 0 
                  ? `Start Workout (${selectedExercises.length} exercises, ${formatDuration(totalDuration)})`
                  : 'Start Workout'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Exercise Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExercises.map((exercise) => {
            const exerciseSelected = isSelected(exercise.id);
            const selectedExercise = getSelectedExercise(exercise.id);
            
            return (
              <div
                key={exercise.id}
                className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:shadow-xl ${
                  exerciseSelected
                    ? 'border-blue-400 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ minWidth: '300px', minHeight: '250px' }}
              >
                {/* Exercise Image - 200px height minimum */}
                <div 
                  className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden relative cursor-pointer"
                  onClick={() => handleExerciseToggle(exercise)}
                >
                  <img
                    src={exercise.mediaUrl}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 text-lg" style={{ display: 'none' }}>
                    Exercise Demo
                  </div>
                  
                  {/* Selection Checkbox - Top Right */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      exerciseSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white/90 border-white/90 hover:bg-blue-50 hover:border-blue-200'
                    }`}>
                      {exerciseSelected && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Selection Highlight Border */}
                  {exerciseSelected && (
                    <div className="absolute inset-0 border-4 border-blue-400 rounded-lg pointer-events-none"></div>
                  )}
                </div>

                {/* Exercise Content */}
                <div className="p-6">
                  {/* Exercise Name - Large, bold typography */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleExerciseToggle(exercise)}
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">{exercise.name}</h3>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {/* Type Badge - Shows actual database type */}
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
                      {exercise.type}
                    </span>
                    {/* Difficulty Badge */}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>

                  {/* Equipment and Duration */}
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getEquipmentIcon(exercise.equipment)}</span>
                      <span className="font-medium">{getEquipmentName(exercise.equipment)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(exercise.duration)}</span>
                    </div>
                  </div>

                  {/* Description - 1 line max */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {exercise.description}
                  </p>

                  {/* Duration Selection - Only show when selected */}
                  {exerciseSelected && selectedExercise && (
                    <div className="border-t border-slate-200 pt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration for this exercise:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {exerciseDurationOptions.map((duration) => (
                          <button
                            key={duration}
                            onClick={() => handleDurationChange(exercise.id, duration)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              selectedExercise.customDuration === duration
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}m${duration % 60 ? ` ${duration % 60}s` : ''}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredExercises.length === 0 && exercises.length > 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No exercises found</h3>
            <p className="text-slate-500">Try adjusting your filters to see more options.</p>
          </div>
        )}

        {/* Help Text */}
        {selectedExercises.length === 0 && filteredExercises.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white text-center">
            <h4 className="text-lg font-semibold mb-2">Ready to Get Moving?</h4>
            <p>Click on exercises to add them to your workout. You can customize the duration for each exercise once selected!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;