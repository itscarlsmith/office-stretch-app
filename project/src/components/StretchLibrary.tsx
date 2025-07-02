import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Clock, Play, Check } from 'lucide-react';
import { supabase, transformStretch, DatabaseStretch } from '../lib/supabase';
import { painPoints } from '../data/exercises';

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
  thumbnailUrl?: string; // Add thumbnail URL field
  focusTips?: string[];
}

interface SelectedStretch extends Exercise {
  customDuration: number;
}

interface StretchLibraryProps {
  selectedPainPoints: string[];
  onStartSession: (stretches: Exercise[]) => void;
  onBack: () => void;
}

const StretchLibrary: React.FC<StretchLibraryProps> = ({
  selectedPainPoints,
  onStartSession,
  onBack,
}) => {
  const [selectedStretches, setSelectedStretches] = useState<SelectedStretch[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(selectedPainPoints);
  const [stretches, setStretches] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Duration options for stretches (shorter, simpler options)
  const stretchDurationOptions = [15, 30, 45, 60];

  // Fetch stretches from Supabase STRETCHES table
  useEffect(() => {
    const fetchStretches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🧘 StretchLibrary: Fetching from STRETCHES table...');
        console.log('🧘 StretchLibrary: Active filters:', activeFilters);
        
        // Add detailed logging for exact values
        console.log('🧘 StretchLibrary: Exact values being searched:');
        activeFilters.forEach((point, index) => {
          console.log(`  ${index}: "${point}" (type: ${typeof point}, length: ${point.length})`);
        });

        // Log the exact query being built
        const filterPoints = [...activeFilters, 'full-body'];
        console.log('🧘 StretchLibrary: Complete filter array (including full-body):', filterPoints);
        
        // Build query - include full-body stretches for all queries
        // ✅ UPDATED: Include thumbnail_url in the query
        let query = supabase
          .from('stretches') // ✅ CORRECT: Querying stretches table
          .select('*, thumbnail_url') // ✅ NEW: Include thumbnail_url field
          .order('name');
        
        // If specific pain points are selected, filter by them + full-body
        if (activeFilters.length > 0) {
          const painPointsToQuery = [...activeFilters, 'full-body'];
          console.log('🧘 StretchLibrary: Final query pain_point filter:', painPointsToQuery);
          query = query.in('pain_point', painPointsToQuery);
        }
        
        console.log('🧘 StretchLibrary: About to execute Supabase query...');

        const { data, error } = await query;
        
        if (error) {
          console.error('❌ StretchLibrary Supabase error:', error);
          throw error;
        }
        
        console.log('🧘 StretchLibrary: Raw data from STRETCHES table:', data);
        console.log('🧘 StretchLibrary: Number of records returned:', data?.length || 0);
        
        // Log each record's pain_point value for comparison
        if (data && data.length > 0) {
          console.log('🧘 StretchLibrary: Pain point values in STRETCHES database:');
          data.forEach((stretch, index) => {
            console.log(`  Stretch ${index}: "${stretch.name}" - pain_point: "${stretch.pain_point}" (matches filter: ${filterPoints.includes(stretch.pain_point)})`);
            console.log(`    thumbnail_url: "${stretch.thumbnail_url || 'null'}"`);
            console.log(`    media_url: "${stretch.media_url || 'null'}"`);
          });
        }

        // ✅ UPDATED: Map stretches with thumbnail_url support
        const directStretches = (data || []).map(stretch => {
          console.log(`🧘 StretchLibrary: Processing stretch "${stretch.name}" with thumbnail_url: "${stretch.thumbnail_url}"`);
          
          return {
            id: stretch.id,
            name: stretch.name,
            description: stretch.description || '',
            instructions: Array.isArray(stretch.instructions) ? stretch.instructions : [stretch.instructions],
            painPoint: stretch.pain_point,
            difficulty: stretch.difficulty,
            duration: stretch.duration_min || 30,
            mediaUrl: stretch.media_url || 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg',
            thumbnailUrl: stretch.thumbnail_url || null, // ✅ NEW: Include thumbnail URL
            type: 'stretch' as const,
            category: 'quick-energy' as const,
            equipment: 'none' as const,
            focusTips: stretch.focus_tips || []
          };
        });

        console.log('🧘 StretchLibrary: Transformed stretches:', directStretches);
        console.log('🧘 StretchLibrary: Transformed stretches count:', directStretches.length);
        setStretches(directStretches);
        
      } catch (err) {
        console.error('❌ StretchLibrary: Error fetching stretches:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stretches');
      } finally {
        setLoading(false);
      }
    };

    fetchStretches();
  }, [activeFilters]);

  // Filter stretches based on active filters
  const filteredStretches = useMemo(() => {
    console.log('🧘 StretchLibrary: Filtering stretches...');
    console.log('🧘 StretchLibrary: Total stretches available:', stretches.length);
    console.log('🧘 StretchLibrary: Active filters for client-side filtering:', activeFilters);
    
    if (activeFilters.length === 0) {
      console.log('🧘 StretchLibrary: No filters active, returning all stretches');
      return stretches;
    }
    
    const filtered = stretches.filter(stretch => {
      const matches = activeFilters.some(filter => 
        stretch.painPoint === filter || 
        stretch.painPoint === 'full-body' // Full-body stretches help all areas
      );
      
      if (matches) {
        console.log(`✅ Stretch "${stretch.name}" matches filter (painPoint: "${stretch.painPoint}")`);
      } else {
        console.log(`❌ Stretch "${stretch.name}" doesn't match (painPoint: "${stretch.painPoint}")`);
      }
      
      return matches;
    });
    
    console.log('🧘 StretchLibrary: Filtered stretches count:', filtered.length);
    return filtered;
  }, [stretches, activeFilters]);

  const handleFilterToggle = (painPointId: string) => {
    console.log('🧘 StretchLibrary: Filter toggle clicked:', painPointId);
    setActiveFilters(prev => {
      const newFilters = prev.includes(painPointId)
        ? prev.filter(id => id !== painPointId)
        : [...prev, painPointId];
      
      console.log('🧘 StretchLibrary: New active filters:', newFilters);
      return newFilters;
    });
  };

  const handleStretchToggle = (stretch: Exercise) => {
    setSelectedStretches(prev => {
      const isSelected = prev.some(s => s.id === stretch.id);
      if (isSelected) {
        return prev.filter(s => s.id !== stretch.id);
      } else {
        // Add with default duration
        return [...prev, { ...stretch, customDuration: stretch.duration }];
      }
    });
  };

  const handleDurationChange = (stretchId: number, newDuration: number) => {
    setSelectedStretches(prev => 
      prev.map(stretch => 
        stretch.id === stretchId 
          ? { ...stretch, customDuration: newDuration }
          : stretch
      )
    );
  };

  const handleStartSession = () => {
    if (selectedStretches.length > 0) {
      // Convert back to regular exercises with updated durations
      const stretchesForSession = selectedStretches.map(stretch => ({
        ...stretch,
        duration: stretch.customDuration
      }));
      onStartSession(stretchesForSession);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}min`;
  };

  const totalDuration = selectedStretches.reduce((sum, stretch) => sum + stretch.customDuration, 0);
  const isSelected = (stretchId: number) => selectedStretches.some(s => s.id === stretchId);
  const getSelectedStretch = (stretchId: number) => selectedStretches.find(s => s.id === stretchId);

  // Get pain point name by ID
  const getPainPointName = (id: string) => {
    const point = painPoints.find(p => p.id === id);
    return point ? point.name : id;
  };

  // Get body part tags for a stretch
  const getBodyPartTags = (stretch: Exercise) => {
    const tags = [];
    if (stretch.painPoint === 'full-body') {
      tags.push('Full Body');
    } else {
      tags.push(getPainPointName(stretch.painPoint));
    }
    return tags;
  };

  // ✅ NEW: Get the appropriate image URL for stretch cards
  const getStretchImageUrl = (stretch: Exercise) => {
    // Priority: thumbnail_url > media_url > fallback
    if (stretch.thumbnailUrl) {
      console.log(`🖼️ StretchLibrary: Using thumbnail_url for "${stretch.name}": ${stretch.thumbnailUrl}`);
      return stretch.thumbnailUrl;
    }
    
    console.log(`🖼️ StretchLibrary: No thumbnail_url for "${stretch.name}", using media_url: ${stretch.mediaUrl}`);
    return stretch.mediaUrl;
  };

  // ✅ NEW: Handle image loading errors with proper fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, stretch: Exercise) => {
    const img = e.currentTarget;
    console.error(`❌ StretchLibrary: Image error for "${stretch.name}"`, {
      attemptedUrl: img.src,
      thumbnailUrl: stretch.thumbnailUrl,
      mediaUrl: stretch.mediaUrl
    });
    
    // Try fallback to media_url if thumbnail_url failed
    if (stretch.thumbnailUrl && img.src === stretch.thumbnailUrl && stretch.mediaUrl !== stretch.thumbnailUrl) {
      console.log(`🔄 StretchLibrary: Falling back to media_url for "${stretch.name}"`);
      img.src = stretch.mediaUrl;
      return;
    }
    
    // Show placeholder if all images fail
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Stretch Library</h1>
              <p className="text-slate-600">Loading stretches...</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading your personalized stretches...</p>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Stretch Library</h1>
              <p className="text-slate-600">Error loading stretches</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Stretches</h3>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Stretch Library</h1>
            <p className="text-slate-600">Choose stretches for targeted pain relief and tension release</p>
          </div>
        </div>


        {/* Checkbox Filter System */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Target Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {painPoints.map((point) => {
              const isActive = activeFilters.includes(point.id);
              return (
                <label
                  key={point.id}
                  className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: isActive ? '#3B82F6' : '#E2E8F0',
                    backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF'
                  }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}>
                    {isActive && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleFilterToggle(point.id)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {point.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Button - Top Position */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedStretches.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">{selectedStretches.length}</span>
                      </div>
                      <span className="text-slate-700 font-medium">
                        {selectedStretches.length} stretch{selectedStretches.length !== 1 ? 'es' : ''} selected
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Total time: <span className="font-semibold text-slate-800">{formatDuration(totalDuration)}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-slate-600">Select stretches to build your relief session</span>
                )}
              </div>
              
              <button
                onClick={handleStartSession}
                disabled={selectedStretches.length === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedStretches.length > 0
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5" />
                {selectedStretches.length > 0 
                  ? `Start Stretching (${selectedStretches.length} stretches, ${formatDuration(totalDuration)})`
                  : 'Start Stretching'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {selectedStretches.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-2">Your Stretching Session:</h4>
            <div className="space-y-1">
              {selectedStretches.map((stretch, index) => (
                <div key={stretch.id} className="text-sm text-green-700">
                  {index + 1}. {stretch.name} ({formatDuration(stretch.customDuration)})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stretch Grid - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStretches.map((stretch) => {
            const stretchSelected = isSelected(stretch.id);
            const selectedStretch = getSelectedStretch(stretch.id);
            const bodyPartTags = getBodyPartTags(stretch);
            
            return (
              <div
                key={stretch.id}
                className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:shadow-xl ${
                  stretchSelected
                    ? 'border-green-400 bg-green-50 shadow-lg scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ minWidth: '300px', minHeight: '250px' }}
              >
                {/* ✅ UPDATED: Stretch Image with thumbnail_url support */}
                <div 
                  className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden relative cursor-pointer"
                  onClick={() => handleStretchToggle(stretch)}
                >
                  <img
                    src={getStretchImageUrl(stretch)}
                    alt={stretch.name}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log(`✅ StretchLibrary: Image loaded successfully for "${stretch.name}"`);
                    }}
                    onError={(e) => handleImageError(e, stretch)}
                  />
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 text-lg" style={{ display: 'none' }}>
                    <div className="text-center">
                      <div className="mb-2">🧘‍♀️</div>
                      <div>Stretch Demo</div>
                    </div>
                  </div>
                  
                  {/* Selection Checkbox - Top Right */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      stretchSelected
                        ? 'bg-green-500 border-green-500'
                        : 'bg-white/90 border-white/90 hover:bg-green-50 hover:border-green-200'
                    }`}>
                      {stretchSelected && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Selection Highlight Border */}
                  {stretchSelected && (
                    <div className="absolute inset-0 border-4 border-green-400 rounded-lg pointer-events-none"></div>
                  )}
                </div>

                {/* Stretch Content */}
                <div className="p-6">
                  {/* Stretch Name */}
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleStretchToggle(stretch)}
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">{stretch.name}</h3>
                  </div>

                  {/* Body Part Tags */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {bodyPartTags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                        {tag}
                      </span>
                    ))}
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                      {stretch.difficulty}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Default: {formatDuration(stretch.duration)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {stretch.description}
                  </p>

                  {/* Duration Selection - Only show when selected */}
                  {stretchSelected && selectedStretch && (
                    <div className="border-t border-slate-200 pt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration for this stretch:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {stretchDurationOptions.map((duration) => (
                          <button
                            key={duration}
                            onClick={() => handleDurationChange(stretch.id, duration)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              selectedStretch.customDuration === duration
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {duration}s
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
        {filteredStretches.length === 0 && stretches.length > 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No stretches found</h3>
            <p className="text-slate-500">Try selecting different target areas to see more options.</p>
          </div>
        )}

        {/* Help Text */}
        {selectedStretches.length === 0 && filteredStretches.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white text-center">
            <h4 className="text-lg font-semibold mb-2">Ready to Feel Better?</h4>
            <p>Select stretches to create your personalized relief session. Each stretch can be customized to your preferred duration!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StretchLibrary;