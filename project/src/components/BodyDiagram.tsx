import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { painPoints } from '../data/exercises';

interface BodyDiagramProps {
  onPainPointSelect: (painPoints: string[]) => void;
  onBack: () => void;
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({ onPainPointSelect, onBack }) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);

  // Pain point coordinates with precise anatomical positioning
  const painPointData = [
    { id: 'neck', x: 100, y: 50, label: 'Neck', showLabel: true },
    { id: 'shoulders', x: 72, y: 88, label: 'Shoulders', showLabel: false },
    { id: 'shoulders', x: 128, y: 88, label: 'Shoulders', showLabel: true },
    { id: 'upperBack', x: 100, y: 125, label: 'Upper Back', showLabel: true },
    { id: 'lowerBack', x: 100, y: 185, label: 'Lower Back', showLabel: true },
    { id: 'wrists', x: 55, y: 140, label: 'Wrists', showLabel: false },
    { id: 'wrists', x: 145, y: 140, label: 'Wrists', showLabel: true },
    { id: 'hips', x: 85, y: 225, label: 'Hips', showLabel: false },
    { id: 'hips', x: 115, y: 225, label: 'Hips', showLabel: true },
    { id: 'legs', x: 82, y: 290, label: 'Legs', showLabel: false },
    { id: 'legs', x: 118, y: 290, label: 'Legs', showLabel: true }
  ];

  const handlePainPointToggle = (painPointId: string) => {
    setSelectedPoints(prev => {
      if (prev.includes(painPointId)) {
        // Remove if already selected
        return prev.filter(id => id !== painPointId);
      } else {
        // Add if not selected
        return [...prev, painPointId];
      }
    });
  };

  const handlePainPointHover = (painPointId: string | null) => {
    setHoveredPoint(painPointId);
  };

  const handleContinue = () => {
    if (selectedPoints.length > 0) {
      onPainPointSelect(selectedPoints);
    }
  };

  // Get centered position for symmetrical labels
  const getCenteredLabelPosition = (painPointId: string) => {
    const points = painPointData.filter(p => p.id === painPointId);
    if (points.length === 2) {
      const leftPoint = points[0].x < points[1].x ? points[0] : points[1];
      const rightPoint = points[0].x > points[1].x ? points[0] : points[1];
      return {
        x: (leftPoint.x + rightPoint.x) / 2,
        y: leftPoint.y
      };
    }
    return { x: points[0].x, y: points[0].y };
  };

  const isSelected = (painPointId: string) => selectedPoints.includes(painPointId);
  const isHighlighted = (painPointId: string) => hoveredPoint === painPointId || isSelected(painPointId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Select Your Focus Areas</h1>
            <p className="text-slate-600">Choose one or more areas to target in your stretching session</p>
          </div>
        </div>

        {/* Selection Counter */}
        {selectedPoints.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{selectedPoints.length}</span>
                </div>
                <span className="text-slate-700 font-medium">
                  {selectedPoints.length} area{selectedPoints.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Professional 3D-Style Body Diagram */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Body Map</h3>
            
            {/* Enhanced 3D Human Silhouette */}
            <div className="relative mx-auto max-w-sm">
              <svg
                viewBox="0 0 200 400"
                className="w-full h-auto drop-shadow-lg"
                style={{ maxHeight: '650px' }}
              >
                {/* Background shadow for 3D effect */}
                <defs>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="50%" stopColor="#F1F5F9" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </linearGradient>
                  <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="dropShadow">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#64748B" floodOpacity="0.2"/>
                  </filter>
                </defs>

                {/* Body Shadow (3D depth effect) */}
                <g transform="translate(3, 3)" opacity="0.3">
                  {/* Head Shadow */}
                  <ellipse cx="100" cy="35" rx="24" ry="30" fill="#94A3B8" />
                  
                  {/* Neck Shadow */}
                  <path d="M 83 60 Q 100 68 117 60 L 117 75 Q 100 82 83 75 Z" fill="#94A3B8" />
                  
                  {/* Torso Shadow */}
                  <path d="M 83 75 Q 70 78 65 85 L 60 130 Q 58 170 65 210 L 75 235 Q 85 240 100 240 Q 115 240 125 235 L 135 210 Q 142 170 140 130 L 135 85 Q 130 78 117 75 Z" fill="#94A3B8" />
                  
                  {/* Arms Shadow */}
                  <ellipse cx="55" cy="110" rx="8" ry="35" fill="#94A3B8" />
                  <ellipse cx="145" cy="110" rx="8" ry="35" fill="#94A3B8" />
                  
                  {/* Legs Shadow */}
                  <ellipse cx="82" cy="290" rx="12" ry="65" fill="#94A3B8" />
                  <ellipse cx="118" cy="290" rx="12" ry="65" fill="#94A3B8" />
                </g>

                {/* Main Body Structure with 3D gradient */}
                <g filter="url(#dropShadow)">
                  {/* Head with refined proportions */}
                  <ellipse cx="100" cy="35" rx="22" ry="28" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  
                  {/* Neck with anatomical accuracy */}
                  <path d="M 85 58 Q 100 65 115 58 L 115 72 Q 100 78 85 72 Z" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  
                  {/* Enhanced Torso with realistic proportions */}
                  <path d="M 85 72 Q 72 75 68 82 L 62 125 Q 60 165 67 205 L 77 230 Q 87 235 100 235 Q 113 235 123 230 L 133 205 Q 140 165 138 125 L 132 82 Q 128 75 115 72 Z" 
                        fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  
                  {/* Arms with proper anatomy */}
                  <ellipse cx="55" cy="108" rx="7" ry="32" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  <ellipse cx="145" cy="108" rx="7" ry="32" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  
                  {/* Legs with realistic shape */}
                  <ellipse cx="82" cy="285" rx="11" ry="60" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  <ellipse cx="118" cy="285" rx="11" ry="60" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  
                  {/* Feet */}
                  <ellipse cx="82" cy="350" rx="10" ry="5" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                  <ellipse cx="118" cy="350" rx="10" ry="5" fill="url(#bodyGradient)" stroke="#64748B" strokeWidth="1.5" />
                </g>

                {/* Anatomical reference lines */}
                <g stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.6">
                  {/* Spinal column */}
                  <path d="M 100 75 L 100 230" />
                  {/* Shoulder line */}
                  <path d="M 68 88 L 132 88" />
                  {/* Hip line */}
                  <path d="M 77 225 L 123 225" />
                </g>

                {/* Professional Pain Point Markers with Selection State */}
                {painPointData.map((point, index) => {
                  const isPointSelected = isSelected(point.id);
                  const isPointHighlighted = isHighlighted(point.id);
                  const uniqueKey = `${point.id}-${index}`;
                  
                  return (
                    <g key={uniqueKey}>
                      {/* Outer marker with selection and hover states */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="8"
                        fill={isPointSelected ? "#3B82F6" : "#DC2626"}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="cursor-pointer"
                        style={{
                          transformOrigin: `${point.x}px ${point.y}px`,
                          transform: isPointHighlighted ? 'scale(1.2)' : 'scale(1)',
                          transition: 'transform 0.3s ease-in-out, fill 0.3s ease-in-out',
                          filter: isPointHighlighted 
                            ? `drop-shadow(0 4px 12px ${isPointSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(220, 38, 38, 0.5)'})` 
                            : `drop-shadow(0 2px 6px ${isPointSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(220, 38, 38, 0.3)'})`
                        }}
                        onClick={() => handlePainPointToggle(point.id)}
                        onMouseEnter={() => handlePainPointHover(point.id)}
                        onMouseLeave={() => handlePainPointHover(null)}
                      />
                      
                      {/* Inner marker dot - changes based on selection */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="3"
                        fill="#FFFFFF"
                        className="pointer-events-none"
                        style={{
                          transformOrigin: `${point.x}px ${point.y}px`,
                          transform: isPointHighlighted ? 'scale(1.2)' : 'scale(1)',
                          transition: 'transform 0.3s ease-in-out'
                        }}
                      />

                      {/* Selection checkmark for selected points */}
                      {isPointSelected && (
                        <g className="pointer-events-none">
                          <path
                            d={`M ${point.x - 2} ${point.y} L ${point.x} ${point.y + 2} L ${point.x + 3} ${point.y - 3}`}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transformOrigin: `${point.x}px ${point.y}px`,
                              transform: isPointHighlighted ? 'scale(1.2)' : 'scale(1)',
                              transition: 'transform 0.3s ease-in-out'
                            }}
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Centered tooltips for symmetrical pain points */}
                {hoveredPoint && (
                  <g className="pointer-events-none">
                    {(() => {
                      const labelPos = getCenteredLabelPosition(hoveredPoint);
                      const labelText = painPointData.find(p => p.id === hoveredPoint)?.label || '';
                      const isPointSelected = isSelected(hoveredPoint);
                      
                      return (
                        <>
                          <rect
                            x={labelPos.x - 35}
                            y={labelPos.y - 40}
                            width="70"
                            height="24"
                            rx="12"
                            fill={isPointSelected ? "#3B82F6" : "#1F2937"}
                            opacity="0.95"
                            filter="url(#dropShadow)"
                          />
                          <text
                            x={labelPos.x}
                            y={labelPos.y - 25}
                            textAnchor="middle"
                            className="text-xs fill-white font-medium"
                            fontSize="11"
                          >
                            {labelText}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>
            </div>

            <div className="text-center mt-6 space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="font-medium">Selected</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Click markers to select multiple areas for your stretching session
              </p>
            </div>
          </div>

          {/* Enhanced Pain Points List with Selection States */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Target Areas</h3>
            
            {painPoints.map((point, index) => {
              const colors = [
                'border-blue-200 hover:bg-blue-50 hover:border-blue-300',
                'border-green-200 hover:bg-green-50 hover:border-green-300',
                'border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300',
                'border-orange-200 hover:bg-orange-50 hover:border-orange-300',
                'border-purple-200 hover:bg-purple-50 hover:border-purple-300',
                'border-pink-200 hover:bg-pink-50 hover:border-pink-300',
                'border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
              ];
              
              const isPointSelected = isSelected(point.id);
              const isPointHighlighted = isHighlighted(point.id);
              
              return (
                <div
                  key={point.id}
                  onClick={() => handlePainPointToggle(point.id)}
                  onMouseEnter={() => handlePainPointHover(point.id)}
                  onMouseLeave={() => handlePainPointHover(null)}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isPointSelected
                      ? 'border-blue-400 bg-blue-50 shadow-lg scale-[1.02] ring-2 ring-blue-200' 
                      : isPointHighlighted
                      ? 'border-red-400 bg-red-50 shadow-lg scale-[1.02] ring-2 ring-red-200'
                      : colors[index]
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all duration-200 ${
                      isPointSelected 
                        ? 'bg-blue-600 scale-110' 
                        : isPointHighlighted 
                        ? 'bg-red-600 scale-110' 
                        : 'bg-red-500'
                    }`}>
                      {isPointSelected && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800">{point.name}</h4>
                  </div>
                  <p className="text-slate-600 text-sm ml-8 leading-relaxed">{point.description}</p>
                  {isPointHighlighted && (
                    <div className="mt-3 ml-8">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isPointSelected 
                          ? 'text-blue-600 bg-blue-100' 
                          : 'text-red-600 bg-red-100'
                      }`}>
                        {isPointSelected ? 'Selected' : 'Click to select'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleContinue}
            disabled={selectedPoints.length === 0}
            className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
              selectedPoints.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:shadow-xl hover:scale-105'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {selectedPoints.length > 0 
              ? `Continue with Selected Areas (${selectedPoints.length})`
              : 'Select at least one area to continue'
            }
          </button>
        </div>

        {/* Professional Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">Multi-Area Stretching Session</h4>
            <p className="text-blue-100 leading-relaxed">
              Select multiple areas to create a comprehensive stretching routine. 
              You can target related muscle groups for maximum relief and effectiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyDiagram;