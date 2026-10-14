// ============================================================
// AGROVISION – Mock Data
// All mock data is centralized here for easy API replacement.
// Replace these with real API calls when the backend is ready.
// ============================================================

export const MOCK_USER = {
  id: 'usr_001',
  name: 'Joshua Farmer',
  email: 'joshua@agrovision.app',
  location: 'Ogun State, Nigeria',
  avatar: null,
  joinedAt: '2024-01-15',
  preferences: {
    temperatureUnit: 'celsius',
    notifications: true,
    language: 'en',
  },
};

export const MOCK_CROPS = [
  { id: 'tomato', label: 'Tomato' },
  { id: 'potato', label: 'Potato' },
  { id: 'apple', label: 'Apple' },
  { id: 'corn', label: 'Corn' },
  { id: 'grape', label: 'Grape' },
  { id: 'pepper', label: 'Pepper' },
  { id: 'cassava', label: 'Cassava' },
  { id: 'rice', label: 'Rice' },
  { id: 'other', label: 'Other' },
];

export const MOCK_DISEASES = [
  {
    id: 'dis_001',
    name: 'Early Blight',
    crop: 'Tomato',
    shortDescription: 'A fungal disease causing dark lesions on leaves, reducing photosynthesis and yield.',
    severity: 'Medium',
    symptoms: [
      'Dark brown spots with concentric rings on older leaves',
      'Yellow halos around the lesions',
      'Premature leaf drop',
      'Stem lesions near the soil line',
      'Fruit lesions near the stem end',
    ],
    causes: [
      'Alternaria solani fungus',
      'Warm and humid weather conditions',
      'Infected plant debris in soil',
      'Poor air circulation around plants',
    ],
    treatment: [
      'Apply copper-based fungicides or chlorothalonil at early signs',
      'Remove and destroy infected plant material',
      'Ensure adequate plant spacing for airflow',
      'Apply mulch to prevent soil splash',
      'Use resistant tomato varieties in future plantings',
    ],
    prevention: [
      'Rotate crops on a 3–4 year cycle',
      'Use certified disease-free seeds',
      'Water at the base to keep foliage dry',
      'Maintain proper plant nutrition with balanced fertilizers',
      'Scout fields regularly for early signs',
      'Dispose of infected plant debris properly after harvest',
    ],
  },
  {
    id: 'dis_002',
    name: 'Late Blight',
    crop: 'Potato',
    shortDescription: 'A destructive oomycete disease that can devastate potato crops within days.',
    severity: 'High',
    symptoms: [
      'Water-soaked lesions on leaves that turn brown',
      'White mold on underside of leaves in humid conditions',
      'Dark brown patches on stems',
      'Rapidly spreading decay in wet weather',
    ],
    causes: [
      'Phytophthora infestans oomycete',
      'Cool and wet weather (10–24°C)',
      'High relative humidity above 90%',
      'Infected tubers or plant debris',
    ],
    treatment: [
      'Apply mancozeb or metalaxyl fungicides preventatively',
      'Remove and destroy infected plants immediately',
      'Avoid overhead irrigation',
      'Harvest tubers in dry weather',
    ],
    prevention: [
      'Plant certified disease-free seed potatoes',
      'Use resistant varieties',
      'Maintain adequate row spacing',
      'Monitor weather forecasts and apply fungicides proactively',
      'Hill soil around plants to protect tubers',
    ],
  },
  {
    id: 'dis_003',
    name: 'Powdery Mildew',
    crop: 'Grape',
    shortDescription: 'A fungal disease creating white powdery coatings on leaves and fruit.',
    severity: 'Medium',
    symptoms: [
      'White or gray powdery coating on leaves and stems',
      'Distorted or stunted new growth',
      'Yellowing and browning of infected tissue',
      'Premature leaf drop in severe cases',
    ],
    causes: [
      'Erysiphe necator fungus',
      'Dry conditions with moderate temperatures (20–27°C)',
      'High humidity at night',
      'Dense plant canopies with poor airflow',
    ],
    treatment: [
      'Apply sulfur-based fungicides',
      'Use potassium bicarbonate sprays',
      'Apply neem oil in early stages',
      'Remove severely infected shoot tips',
    ],
    prevention: [
      'Prune for good air circulation',
      'Avoid excessive nitrogen fertilization',
      'Plant resistant grape varieties',
      'Maintain consistent watering to reduce stress',
    ],
  },
  {
    id: 'dis_004',
    name: 'Leaf Spot',
    crop: 'Corn',
    shortDescription: 'A fungal disease causing characteristic spots that reduce photosynthetic capacity.',
    severity: 'Low',
    symptoms: [
      'Oval to elongated tan or brown lesions on leaves',
      'Yellow halos around lesions',
      'Lesion centers may dry out and fall out',
      'Reduced plant vigor in severe infections',
    ],
    causes: [
      'Cercospora zeae-maydis fungus',
      'Warm temperatures with high humidity',
      'Extended leaf wetness periods',
      'Infected crop residue',
    ],
    treatment: [
      'Apply foliar fungicides when disease appears',
      'Use strobilurin or triazole fungicides',
      'Remove infected plant material',
    ],
    prevention: [
      'Use resistant hybrid varieties',
      'Practice crop rotation',
      'Reduce plant density for better airflow',
      'Till infected crop residue after harvest',
    ],
  },
  {
    id: 'dis_005',
    name: 'Apple Scab',
    crop: 'Apple',
    shortDescription: 'A common fungal disease causing scabby lesions on apple fruit and leaves.',
    severity: 'High',
    symptoms: [
      'Olive green to brown scabby lesions on fruit',
      'Velvety spots on leaves',
      'Distorted fruit with cracked skin',
      'Premature fruit drop in severe cases',
    ],
    causes: [
      'Venturia inaequalis fungus',
      'Wet spring weather during bloom',
      'Infected fallen leaves from previous season',
    ],
    treatment: [
      'Apply fungicides (captan, myclobutanil) during primary infection period',
      'Remove and destroy fallen leaves',
      'Prune to open canopy for air circulation',
    ],
    prevention: [
      'Plant scab-resistant apple varieties',
      'Apply dormant-season lime sulfur spray',
      'Maintain orchard sanitation',
      'Monitor infection periods using weather models',
    ],
  },
  {
    id: 'dis_006',
    name: 'Bacterial Spot',
    crop: 'Pepper',
    shortDescription: 'A bacterial disease causing water-soaked lesions on leaves, stems, and fruit.',
    severity: 'Medium',
    symptoms: [
      'Water-soaked angular spots on leaves',
      'Spots turning brown with yellow margins',
      'Raised, scabby lesions on fruit',
      'Defoliation in severe cases',
    ],
    causes: [
      'Xanthomonas campestris pv. vesicatoria bacterium',
      'Warm and wet conditions',
      'Mechanical injury creating entry points',
    ],
    treatment: [
      'Apply copper-based bactericides',
      'Avoid overhead irrigation',
      'Remove infected plant debris',
    ],
    prevention: [
      'Use certified disease-free transplants',
      'Practice crop rotation',
      'Sanitize tools and equipment',
    ],
  },
];

export const MOCK_WEATHER = {
  location: 'Abeokuta, Ogun State',
  temperature: 29,
  condition: 'Partly Cloudy',
  humidity: 72,
  rainfall: 5,
  windSpeed: 14,
  uvIndex: 6,
  icon: 'cloud',
  forecast: [
    { day: 'Mon', icon: 'sun', high: 31, low: 23, rainChance: 10 },
    { day: 'Tue', icon: 'cloud', high: 29, low: 22, rainChance: 25 },
    { day: 'Wed', icon: 'cloud-rain', high: 27, low: 21, rainChance: 70 },
    { day: 'Thu', icon: 'cloud-rain', high: 26, low: 20, rainChance: 80 },
    { day: 'Fri', icon: 'cloud', high: 28, low: 22, rainChance: 35 },
    { day: 'Sat', icon: 'sun', high: 32, low: 24, rainChance: 5 },
    { day: 'Sun', icon: 'sun', high: 33, low: 25, rainChance: 8 },
  ],
};

export const MOCK_ADVISORIES = [
  {
    id: 'adv_001',
    type: 'weather',
    title: 'Rain Expected Wednesday',
    message: 'Moderate to heavy rainfall expected mid-week. Reduce irrigation starting Tuesday to prevent waterlogging.',
    priority: 'high',
    icon: 'cloud-rain',
  },
  {
    id: 'adv_002',
    type: 'disease',
    title: 'High Disease Risk Alert',
    message: 'High humidity levels increase fungal disease risk. Inspect crops for early signs of blight and apply preventative fungicide.',
    priority: 'high',
    icon: 'shield-alert',
  },
  {
    id: 'adv_003',
    type: 'care',
    title: 'Optimal Planting Window',
    message: 'Temperatures this week are ideal for transplanting tomato seedlings. Consider early morning planting.',
    priority: 'medium',
    icon: 'sprout',
  },
  {
    id: 'adv_004',
    type: 'irrigation',
    title: 'Irrigation Reduction Advised',
    message: 'With 70% rainfall probability on Wednesday, reduce scheduled irrigation by 40% this week.',
    priority: 'medium',
    icon: 'droplets',
  },
  {
    id: 'adv_005',
    type: 'crop',
    title: 'Harvest Window Approaching',
    message: 'Dry conditions Friday–Sunday are suitable for harvesting mature crops. Plan field activity accordingly.',
    priority: 'low',
    icon: 'wheat',
  },
];

export const MOCK_DETECTION_HISTORY = [
  {
    id: 'det_001',
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 94.6,
    date: '2026-09-20',
    status: 'Diseased',
    image: null,
    diseaseId: 'dis_001',
  },
  {
    id: 'det_002',
    crop: 'Potato',
    disease: 'Healthy',
    confidence: 97.2,
    date: '2026-09-18',
    status: 'Healthy',
    image: null,
    diseaseId: null,
  },
  {
    id: 'det_003',
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 88.3,
    date: '2026-09-15',
    status: 'Diseased',
    image: null,
    diseaseId: 'dis_002',
  },
  {
    id: 'det_004',
    crop: 'Corn',
    disease: 'Leaf Spot',
    confidence: 76.1,
    date: '2026-09-12',
    status: 'Attention Required',
    image: null,
    diseaseId: 'dis_004',
  },
  {
    id: 'det_005',
    crop: 'Grape',
    disease: 'Powdery Mildew',
    confidence: 91.4,
    date: '2026-09-10',
    status: 'Diseased',
    image: null,
    diseaseId: 'dis_003',
  },
  {
    id: 'det_006',
    crop: 'Apple',
    disease: 'Healthy',
    confidence: 99.1,
    date: '2026-09-08',
    status: 'Healthy',
    image: null,
    diseaseId: null,
  },
];

export const MOCK_DASHBOARD_STATS = {
  totalDetections: 24,
  healthyCrops: 9,
  diseasedCrops: 15,
  currentTemperature: 29,
};

export const MOCK_DETECTION_RESULT = {
  id: 'det_new',
  crop: 'Tomato',
  disease: 'Early Blight',
  confidence: 94.6,
  status: 'Diseased',
  diseaseInfo: MOCK_DISEASES[0],
  weather: MOCK_WEATHER,
  weatherAdvisory: 'High humidity conditions may accelerate disease spread. Avoid overhead watering and ensure good canopy airflow.',
  date: new Date().toISOString(),
};
