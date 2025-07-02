export interface Exercise {
  id: number;
  name: string;
  type: 'stretch' | 'exercise';
  category: 'quick-energy' | 'strength' | 'full-body' | 'cardio';
  painPoint: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: 'none' | 'desk-chair' | 'floor-space';
  instructions: string[];
  description: string;
  mediaUrl: string;
}

export const exercises: Exercise[] = [
  // Quick Energy Exercises
  {
    id: 1,
    name: "Desk Jumping Jacks",
    type: "exercise",
    category: "quick-energy",
    painPoint: "full-body",
    duration: 30,
    difficulty: "beginner",
    equipment: "none",
    description: "Energizing cardio movement to boost circulation",
    instructions: [
      "Stand behind your chair",
      "Jump feet apart while raising arms overhead",
      "Jump feet together while lowering arms",
      "Keep movements controlled and quiet",
      "Maintain steady breathing rhythm"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
  },
  {
    id: 2,
    name: "Arm Circles",
    type: "exercise",
    category: "quick-energy",
    painPoint: "shoulders",
    duration: 30,
    difficulty: "beginner",
    equipment: "none",
    description: "Simple shoulder mobility to reduce tension",
    instructions: [
      "Stand with arms extended to sides",
      "Make small circles forward for 15 seconds",
      "Reverse direction for remaining time",
      "Keep shoulders relaxed",
      "Gradually increase circle size"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg"
  },
  {
    id: 3,
    name: "Desk Squats",
    type: "exercise",
    category: "quick-energy",
    painPoint: "legs",
    duration: 45,
    difficulty: "beginner",
    equipment: "desk-chair",
    description: "Lower body activation using your chair",
    instructions: [
      "Stand in front of your chair",
      "Lower down as if sitting, but don't touch",
      "Keep weight in heels",
      "Rise back to standing",
      "Repeat for full duration"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498835/pexels-photo-4498835.jpeg"
  },

  // Strength Exercises
  {
    id: 4,
    name: "Wall Push-ups",
    type: "exercise",
    category: "strength",
    painPoint: "upperBack",
    duration: 60,
    difficulty: "beginner",
    equipment: "none",
    description: "Upper body strengthening against the wall",
    instructions: [
      "Stand arm's length from wall",
      "Place palms flat against wall",
      "Lean in and push back",
      "Keep body straight",
      "Control the movement"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498447/pexels-photo-4498447.jpeg"
  },
  {
    id: 5,
    name: "Desk Plank",
    type: "exercise",
    category: "strength",
    painPoint: "lowerBack",
    duration: 30,
    difficulty: "intermediate",
    equipment: "desk-chair",
    description: "Core strengthening using your desk",
    instructions: [
      "Place hands on desk edge",
      "Walk feet back into plank position",
      "Keep body straight from head to heels",
      "Hold position while breathing normally",
      "Engage core muscles"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498159/pexels-photo-4498159.jpeg"
  },
  {
    id: 6,
    name: "Chair Dips",
    type: "exercise",
    category: "strength",
    painPoint: "wrists",
    duration: 45,
    difficulty: "intermediate",
    equipment: "desk-chair",
    description: "Tricep strengthening using your chair",
    instructions: [
      "Sit on edge of sturdy chair",
      "Place hands beside hips",
      "Slide forward and lower body",
      "Push back up using arms",
      "Keep feet planted"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg"
  },

  // Full Body Exercises
  {
    id: 7,
    name: "Office Burpees",
    type: "exercise",
    category: "full-body",
    painPoint: "full-body",
    duration: 60,
    difficulty: "advanced",
    equipment: "floor-space",
    description: "Complete body workout in minimal space",
    instructions: [
      "Start standing behind chair",
      "Squat down and place hands on floor",
      "Jump feet back to plank",
      "Jump feet forward to squat",
      "Stand up and reach overhead"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
  },
  {
    id: 8,
    name: "Mountain Climbers",
    type: "exercise",
    category: "full-body",
    painPoint: "lowerBack",
    duration: 45,
    difficulty: "intermediate",
    equipment: "floor-space",
    description: "Dynamic core and cardio combination",
    instructions: [
      "Start in plank position",
      "Bring right knee to chest",
      "Switch legs quickly",
      "Keep hips level",
      "Maintain steady rhythm"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498447/pexels-photo-4498447.jpeg"
  },
  {
    id: 9,
    name: "Standing March",
    type: "exercise",
    category: "full-body",
    painPoint: "legs",
    duration: 60,
    difficulty: "beginner",
    equipment: "none",
    description: "Low-impact full body activation",
    instructions: [
      "Stand tall with good posture",
      "Lift right knee to hip level",
      "Lower and repeat with left",
      "Swing opposite arm with each step",
      "Keep core engaged"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498835/pexels-photo-4498835.jpeg"
  },

  // Cardio Exercises
  {
    id: 10,
    name: "High Knees",
    type: "exercise",
    category: "cardio",
    painPoint: "legs",
    duration: 30,
    difficulty: "intermediate",
    equipment: "none",
    description: "Heart-pumping leg exercise",
    instructions: [
      "Stand with feet hip-width apart",
      "Lift knees high toward chest",
      "Pump arms naturally",
      "Land softly on balls of feet",
      "Maintain quick tempo"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498835/pexels-photo-4498835.jpeg"
  },
  {
    id: 11,
    name: "Desk Step-ups",
    type: "exercise",
    category: "cardio",
    painPoint: "legs",
    duration: 60,
    difficulty: "intermediate",
    equipment: "desk-chair",
    description: "Cardio boost using sturdy chair",
    instructions: [
      "Use a sturdy, stable chair",
      "Step up with right foot",
      "Bring left foot up",
      "Step down right, then left",
      "Alternate leading leg"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498835/pexels-photo-4498835.jpeg"
  },
  {
    id: 12,
    name: "Shadow Boxing",
    type: "exercise",
    category: "cardio",
    painPoint: "upperBack",
    duration: 45,
    difficulty: "beginner",
    equipment: "none",
    description: "Upper body cardio and stress relief",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Throw controlled punches in air",
      "Alternate left and right",
      "Keep core engaged",
      "Move feet lightly"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg"
  },

  // Stretches for Stretch Library
  {
    id: 13,
    name: "Neck Side Stretch",
    type: "stretch",
    category: "quick-energy",
    painPoint: "neck",
    duration: 30,
    difficulty: "beginner",
    equipment: "none",
    description: "Gentle neck tension relief for stiff muscles",
    instructions: [
      "Sit or stand with spine straight",
      "Gently tilt head to right shoulder",
      "Hold stretch without forcing",
      "Feel gentle pull on left side of neck",
      "Repeat on other side"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
  },
  {
    id: 14,
    name: "Shoulder Blade Squeeze",
    type: "stretch",
    category: "quick-energy",
    painPoint: "shoulders",
    duration: 30,
    difficulty: "beginner",
    equipment: "none",
    description: "Upper back tension release and posture improvement",
    instructions: [
      "Sit tall with arms at sides",
      "Squeeze shoulder blades together",
      "Imagine holding pencil between blades",
      "Hold for 5 seconds",
      "Release slowly"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg"
  },
  {
    id: 15,
    name: "Seated Spinal Twist",
    type: "stretch",
    category: "quick-energy",
    painPoint: "lowerBack",
    duration: 30,
    difficulty: "beginner",
    equipment: "desk-chair",
    description: "Lower back mobility and relief from sitting",
    instructions: [
      "Sit with feet flat on floor",
      "Place right hand on left knee",
      "Twist gently to the left",
      "Keep both hips facing forward",
      "Hold and breathe deeply"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498159/pexels-photo-4498159.jpeg"
  },
  {
    id: 16,
    name: "Upper Back Stretch",
    type: "stretch",
    category: "quick-energy",
    painPoint: "upperBack",
    duration: 45,
    difficulty: "beginner",
    equipment: "none",
    description: "Release tension between shoulder blades",
    instructions: [
      "Clasp hands in front of chest",
      "Round your back and push hands forward",
      "Feel stretch between shoulder blades",
      "Hold and breathe deeply",
      "Return to starting position slowly"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498447/pexels-photo-4498447.jpeg"
  },
  {
    id: 17,
    name: "Hip Flexor Stretch",
    type: "stretch",
    category: "quick-energy",
    painPoint: "hips",
    duration: 45,
    difficulty: "beginner",
    equipment: "none",
    description: "Counter tight hips from prolonged sitting",
    instructions: [
      "Stand and step right foot forward",
      "Lower into lunge position",
      "Feel stretch in left hip flexor",
      "Keep torso upright",
      "Switch sides and repeat"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498835/pexels-photo-4498835.jpeg"
  },
  {
    id: 18,
    name: "Calf Stretch",
    type: "stretch",
    category: "quick-energy",
    painPoint: "legs",
    duration: 30,
    difficulty: "beginner",
    equipment: "none",
    description: "Relieve tight calves and improve circulation",
    instructions: [
      "Stand arm's length from wall",
      "Place hands on wall",
      "Step right foot back",
      "Keep heel down and leg straight",
      "Feel stretch in calf muscle"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
  },
  {
    id: 19,
    name: "Wrist Flexor Stretch",
    type: "stretch",
    category: "quick-energy",
    painPoint: "wrists",
    duration: 30,
    difficulty: "beginner",
    equipment: "none",
    description: "Essential for computer users and typing relief",
    instructions: [
      "Extend right arm forward",
      "Palm facing up",
      "Use left hand to gently pull fingers back",
      "Feel stretch in forearm",
      "Switch arms and repeat"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498144/pexels-photo-4498144.jpeg"
  },
  {
    id: 20,
    name: "Full Body Reach",
    type: "stretch",
    category: "quick-energy",
    painPoint: "full-body",
    duration: 45,
    difficulty: "beginner",
    equipment: "none",
    description: "Complete body stretch to energize and refresh",
    instructions: [
      "Stand with feet hip-width apart",
      "Reach both arms overhead",
      "Stretch up and slightly back",
      "Feel lengthening through entire body",
      "Hold and breathe deeply"
    ],
    mediaUrl: "https://images.pexels.com/photos/4498159/pexels-photo-4498159.jpeg"
  }
];

export const painPoints = [
  { id: 'neck', name: 'Neck', description: 'Neck stiffness and tension' },
  { id: 'shoulders', name: 'Shoulders', description: 'Shoulder tension and knots' },
  { id: 'upperBack', name: 'Upper Back', description: 'Upper back and between shoulder blades' },
  { id: 'lowerBack', name: 'Lower Back', description: 'Lower back pain and stiffness' },
  { id: 'hips', name: 'Hips', description: 'Hip tightness from sitting' },
  { id: 'legs', name: 'Legs', description: 'Leg stiffness and circulation' },
  { id: 'wrists', name: 'Wrists', description: 'Wrist and forearm strain' }
];

export const exerciseCategories = [
  { id: 'quick-energy', name: 'Quick Energy', color: 'bg-green-500', description: 'Fast energy boost' },
  { id: 'strength', name: 'Strength', color: 'bg-blue-500', description: 'Build muscle strength' },
  { id: 'full-body', name: 'Full Body', color: 'bg-purple-500', description: 'Complete workout' },
  { id: 'cardio', name: 'Cardio', color: 'bg-red-500', description: 'Heart-pumping exercises' }
];

export const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-100 text-red-700 border-red-200' }
];

export const equipmentTypes = [
  { id: 'none', name: 'None Required', icon: '✋' },
  { id: 'desk-chair', name: 'Desk/Chair', icon: '🪑' },
  { id: 'floor-space', name: 'Floor Space', icon: '🏢' }
];

export const durationOptions = [
  { id: '2-3', name: '2-3 min', min: 120, max: 180 },
  { id: '3-5', name: '3-5 min', min: 180, max: 300 },
  { id: '5+', name: '5+ min', min: 300, max: 999 }
];