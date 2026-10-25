/**
 * AgroVision Agricultural Advisory Service
 * 
 * Provides evidence-based agronomic pathology intelligence, microclimate
 * disease-weather correlation, crop care protocols, and safe handling precautions
 * for the 15 crop-pathogen classes supported by the AgroVision EfficientNetV2-B0 model.
 * 
 * References:
 * - Compendium of Tomato Diseases and Pests (APS Press)
 * - Compendium of Potato Diseases (APS Press)
 * - Compendium of Pepper and Eggplant Diseases (APS Press)
 * - University Agricultural Extension Services (UC IPM, Cornell, UF/IFAS)
 */

export const MODEL_CLASSES_PATHOLOGY = {
  // ------------------------------------------------------------
  // PEPPER (Capsicum annuum)
  // ------------------------------------------------------------
  'Pepper__bell___Bacterial_spot': {
    id: 'pepper_bacterial_spot',
    modelClass: 'Pepper__bell___Bacterial_spot',
    displayName: 'Bacterial Spot',
    crop: 'Pepper',
    pathogen: 'Xanthomonas euvesicatoria / X. perforans',
    pathogenType: 'Bacterial Pathogen',
    severity: 'High',
    shortDescription:
      'A destructive bacterial disease producing water-soaked foliar lesions that turn necrotic, causing extensive defoliation, blossom drop, and scabby fruit lesions.',
    symptoms:
      'Small, circular to irregular water-soaked spots on leaves that turn dark brown to black with yellow halos. Spots rarely exceed 3mm. Severe defoliation exposes fruit to sunscald.',
    weatherCriteria: {
      optimalTempMin: 24,
      optimalTempMax: 32,
      criticalHumidity: 80,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Bacteria multiply exponentially in warm, humid weather (24–32°C). Bacteria enter through stomata and wounds created by windblown sand, rain splash, or mechanical trimming.',
    },
    cropCare: [
      {
        title: 'Apply Protective Fixed Copper Bactericide',
        importance: 'High',
        detail:
          'Apply copper hydroxide or basic copper sulfate combined with an approved protectant mancozeb to enhance bactericidal efficacy. Apply when leaves are dry.',
        reason:
          'Copper ions disrupt bacterial cell membrane integrity, preventing new foliar infections.',
        condition: 'Apply at first detection or proactively during warm wet spells.',
      },
      {
        title: 'Eliminate Overhead Irrigation',
        importance: 'High',
        detail:
          'Transition strictly to root-zone drip irrigation. Ensure rows are never irrigated during afternoon hours.',
        reason:
          'Xanthomonas bacteria require free moisture on foliar tissue to swim into stomata and hydathodes.',
        condition: 'Active throughout the crop vegetative and flowering cycle.',
      },
      {
        title: 'Implement 3-Year Crop Rotation',
        importance: 'Medium',
        detail:
          'Rotate out of peppers, tomatoes, and eggplants for at least 2–3 growing seasons with corn, legumes, or cover crops.',
        reason:
          'Bacterial pathogens persist in undecomposed plant residue and solanaceous root zones.',
        condition: 'Post-season field management.',
      },
      {
        title: 'Field Sanitation and Debris Removal',
        importance: 'Medium',
        detail:
          'Rogue out severely infected plants. Bury or deep-plow crop residues immediately after final harvest.',
        reason:
          'Eliminates inoculum reservoirs that would otherwise contaminate subsequent seasonal plantings.',
        condition: 'During active outbreak and post-harvest.',
      },
    ],
    safeHandling: [
      {
        title: 'Thorough Handwashing After Scouting',
        category: 'Personal Hygiene',
        detail:
          'Wash hands with soap and running water for at least 30 seconds immediately after inspecting or working with diseased pepper plants.',
      },
      {
        title: 'Sanitize Harvest Knives and Pruning Shears',
        category: 'Tool Sanitation',
        detail:
          'Dip cutting blades in 70% isopropyl alcohol or a 10% household bleach dilution for 60 seconds between plant beds to stop mechanical transmission.',
      },
      {
        title: 'Avoid Field Entry When Leaves Are Wet',
        category: 'Field Hygiene',
        detail:
          'Do not walk through, prune, or harvest pepper rows while dew or raindrops remain on foliage, as clothing and tools will rapidly drag bacteria down the row.',
      },
      {
        title: 'Applicator Protective Equipment (PPE)',
        category: 'Chemical Safety',
        detail:
          'When applying copper bactericides or any registered crop treatment, wear chemical-resistant nitrile gloves, eye goggles, and long sleeves as mandated by the product label.',
      },
      {
        title: 'Produce Food Safety Inspection',
        category: 'Food Safety',
        detail:
          'Wash all harvested peppers thoroughly under clean potable water. Discard peppers displaying sunken bacterial soft rots or secondary bacterial decay.',
      },
    ],
  },

  'Pepper__bell___healthy': {
    id: 'pepper_healthy',
    modelClass: 'Pepper__bell___healthy',
    displayName: 'Healthy Bell Pepper',
    crop: 'Pepper',
    pathogen: 'None (Healthy Specimen)',
    pathogenType: 'Disease-Free Foliage',
    severity: 'None',
    shortDescription:
      'Vigorous, dark-green bell pepper foliage with balanced turgor, robust chlorophyll synthesis, and absence of necrotic spotting or chlorotic mottling.',
    symptoms:
      'Uniform leaf lamina, intact cuticle, healthy leaf margins, and absence of pustules, spots, or viral curling.',
    weatherCriteria: {
      optimalTempMin: 20,
      optimalTempMax: 28,
      criticalHumidity: 65,
      favoredByRain: false,
      favoredByDry: false,
      windDispersal: false,
      description:
        'Bell peppers perform best in moderate daytime temperatures (20–28°C) and moderate relative humidity (50–70%). Temperatures above 33°C can cause blossom drop.',
    },
    cropCare: [
      {
        title: 'Maintain Consistent Root-Zone Soil Moisture',
        importance: 'Preventive',
        detail:
          'Supply 1.0 to 1.5 inches of water per week using drip tape. Avoid moisture fluctuations that impede calcium translocation.',
        reason:
          'Irregular moisture and calcium deficiency trigger physiological blossom end rot.',
        condition: 'Active flowering and fruit sizing periods.',
      },
      {
        title: 'Balanced Fertilization Program',
        importance: 'Preventive',
        detail:
          'Apply balanced N-P-K fertilizer with adequate potassium and magnesium. Avoid excessive nitrogen late in vegetative growth.',
        reason:
          'Excess nitrogen promotes rank succulent growth that attracts aphids and thrips.',
        condition: 'Throughout crop development.',
      },
      {
        title: 'Weekly Scout Routine for Early Pests',
        importance: 'Preventive',
        detail:
          'Inspect undersides of young leaves for aphids, thrips, and broad mites every 5 to 7 days.',
        reason:
          'Early vector suppression prevents the introduction of viral pathogens.',
        condition: 'Weekly scouting schedule.',
      },
    ],
    safeHandling: [
      {
        title: 'Standard Agricultural Hygiene',
        category: 'General Hygiene',
        detail:
          'Wash hands before and after field operations to maintain clean nursery and planting conditions.',
      },
      {
        title: 'Clean Harvest Crates',
        category: 'Food Safety',
        detail:
          'Store harvest crates off bare soil and sanitize before harvesting mature bell peppers.',
      },
    ],
  },

  // ------------------------------------------------------------
  // POTATO (Solanum tuberosum)
  // ------------------------------------------------------------
  'Potato___Early_blight': {
    id: 'potato_early_blight',
    modelClass: 'Potato___Early_blight',
    displayName: 'Early Blight',
    crop: 'Potato',
    pathogen: 'Alternaria solani',
    pathogenType: 'Fungal Pathogen',
    severity: 'Medium',
    shortDescription:
      'A foliar fungal disease causing characteristic concentric "target-board" necrotic lesions, accelerating foliar senescence and reducing tuber bulking.',
    symptoms:
      'Dark brown to black angular spots with concentric concentric rings, primarily on older lower leaves. Surrounding tissue turns chlorotic yellow.',
    weatherCriteria: {
      optimalTempMin: 24,
      optimalTempMax: 30,
      criticalHumidity: 80,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Alternaria solani requires temperatures between 24–30°C and alternating wet/dry cycles or heavy night dews (>8 hours) for conidia germination and stomatal penetration.',
    },
    cropCare: [
      {
        title: 'Protective Fungicide Spray Program',
        importance: 'High',
        detail:
          'Apply contact protectants such as mancozeb, chlorothalonil, or copper hydroxide at early foliar onset. Alternate modes of action to manage resistance.',
        reason:
          'Prevents secondary conidial germination on upper canopy foliage during warm humid mornings.',
        condition: 'Warm, humid weather with frequent morning dew.',
      },
      {
        title: 'Hill Soil Generously to Protect Tubers',
        importance: 'Medium',
        detail:
          'Maintain broad, high soil hills around the potato root zone throughout mid-season.',
        reason:
          'Prevents fungal spores washed down from diseased foliage by rainfall from reaching and infecting developing tubers.',
        condition: 'Before canopy closes and before heavy seasonal rains.',
      },
      {
        title: 'Maintain Plant Nutrition and Vigor',
        importance: 'Medium',
        detail:
          'Ensure adequate nitrogen and potassium levels according to soil test recommendations.',
        reason:
          'Stressed, nutrient-deficient, or senescing potato plants are significantly more susceptible to Alternaria colonization.',
        condition: 'During tuber initiation and bulking.',
      },
    ],
    safeHandling: [
      {
        title: 'Wash Hands and Clean Footwear',
        category: 'Personal Hygiene',
        detail:
          'Wash hands thoroughly after handling diseased potato foliage. Clean soil and debris from boots when exiting infected fields.',
      },
      {
        title: 'Proper Crop Residue Handling',
        category: 'Field Hygiene',
        detail:
          'Do not leave diseased potato vine clippings near fields or in cold compost piles. Bury deeply or burn where local regulations permit.',
      },
      {
        title: 'Applicator Safety and Re-Entry Intervals',
        category: 'Chemical Safety',
        detail:
          'Strictly adhere to Restricted-Entry Intervals (REI) specified on fungicide packaging (typically 12–24 hours). Wear appropriate chemical-resistant PPE.',
      },
    ],
  },

  'Potato___Late_blight': {
    id: 'potato_late_blight',
    modelClass: 'Potato___Late_blight',
    displayName: 'Late Blight',
    crop: 'Potato',
    pathogen: 'Phytophthora infestans',
    pathogenType: 'Oomycete (Water Mold)',
    severity: 'High',
    shortDescription:
      'A devastating oomycete that can obliterate an entire potato canopy in 7–10 days under cool, moist conditions and cause destructive dry tuber rot in storage.',
    symptoms:
      'Large, irregular water-soaked pale-to-dark green lesions that rapidly turn purplish-brown and papery. White downy sporulation visible on leaf undersides in high humidity. Stems develop dark greasy lesions.',
    weatherCriteria: {
      optimalTempMin: 12,
      optimalTempMax: 22,
      criticalHumidity: 85,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Phytophthora infestans thrives in cool, overcast, saturated conditions (12–22°C with relative humidity > 85% or persistent rain/fog). Sporangia travel miles on humid breezes.',
    },
    cropCare: [
      {
        title: 'Immediate Targeted Oomycete Intervention',
        importance: 'High',
        detail:
          'Apply specialized oomycete fungicides (e.g., cymoxanil, mandipropamid, dimethomorph, or copper octanoate) immediately. Consult regional extension alerts for active local strains.',
        reason:
          'Late blight polycyclic reproduction can destroy 100% of field foliage within days if intervention is delayed.',
        condition: 'Cool, wet, cloudy periods with ambient humidity above 80%.',
      },
      {
        title: 'Rogue Out and Bag Infected Plants Immediately',
        importance: 'High',
        detail:
          'Dig out infected potato plants, seal them in plastic garbage bags on a sunny afternoon, and remove them from the farm site.',
        reason:
          'Removes active sporangial source points that would otherwise produce millions of windborne spores.',
        condition: 'At very first confirmed lesion detection.',
      },
      {
        title: 'Desiccate Vines Before Tuber Harvest',
        importance: 'High',
        detail:
          'Kill vines chemically or mechanically 2 weeks prior to harvest. Never harvest tubers while green foliar blight remains alive.',
        reason:
          'Prevents living foliar sporangia from coming into direct contact with potato tubers during lifting.',
        condition: 'Pre-harvest period.',
      },
    ],
    safeHandling: [
      {
        title: 'Personal Protective Equipment During Sprays',
        category: 'Chemical Safety',
        detail:
          'Wear full-face eye protection, respirator or approved dust mask, nitrile gloves, and chemical apron when preparing and applying blight fungicides.',
      },
      {
        title: 'Do Not Consume Infected or Decayed Tubers',
        category: 'Food Safety',
        detail:
          'Potatoes showing reddish-brown granular dry rot beneath the skin or secondary bacterial soft rot are unfit for human or livestock consumption.',
      },
      {
        title: 'Wash Tools and Sorting Equipment',
        category: 'Equipment Sanitation',
        detail:
          'Thoroughly wash and sanitize potato harvesting bins and sorting tables with 10% quaternary ammonium or bleach solution to prevent storage rot.',
      },
    ],
  },

  'Potato___healthy': {
    id: 'potato_healthy',
    modelClass: 'Potato___healthy',
    displayName: 'Healthy Potato',
    crop: 'Potato',
    pathogen: 'None (Healthy Specimen)',
    pathogenType: 'Disease-Free Foliage',
    severity: 'None',
    shortDescription:
      'Robust, emerald-green potato foliage with thick stems, clean leaf surfaces, and absence of blight lesions or chlorosis.',
    symptoms:
      'Vibrant compound leaves, intact petioles, upright canopy habit, and clean leaf undersides.',
    weatherCriteria: {
      optimalTempMin: 15,
      optimalTempMax: 24,
      criticalHumidity: 70,
      favoredByRain: false,
      favoredByDry: false,
      windDispersal: false,
      description:
        'Potatoes thrive in cool-to-moderate climates (15–24°C) with consistent moisture. Excessive heat above 29°C halts tuber bulking and triggers physiological stress.',
    },
    cropCare: [
      {
        title: 'Maintain Deep Tuber Hilling',
        importance: 'Preventive',
        detail:
          'Ensure at least 4 to 6 inches of soil covers all growing tubers to prevent greening and solanine accumulation.',
        reason:
          'Sunlight exposure triggers chlorophyll and toxic solanine glycoalkaloid synthesis in tubers.',
        condition: 'During vegetative growth up to flowering.',
      },
      {
        title: 'Monitor Irrigation to Avoid Waterlogging',
        importance: 'Preventive',
        detail:
          'Keep soil evenly moist but never saturated. Ensure field furrows drain freely after rainstorms.',
        reason:
          'Waterlogged soil deprives roots of oxygen and predisposes tubers to Pythium leak and soft rot.',
        condition: 'Throughout tuber development.',
      },
    ],
    safeHandling: [
      {
        title: 'Never Consume Green Potatoes',
        category: 'Food Safety',
        detail:
          'Tubers with green skin contain high levels of solanine, which can cause gastrointestinal distress. Always peel deeply or discard green portions.',
      },
      {
        title: 'Routine Farm Tool Cleaning',
        category: 'General Hygiene',
        detail:
          'Clean soil and clay residue from shovels, hoes, and tractors between fields.',
      },
    ],
  },

  // ------------------------------------------------------------
  // TOMATO (Solanum lycopersicum)
  // ------------------------------------------------------------
  'Tomato_Bacterial_spot': {
    id: 'tomato_bacterial_spot',
    modelClass: 'Tomato_Bacterial_spot',
    displayName: 'Bacterial Spot',
    crop: 'Tomato',
    pathogen: 'Xanthomonas perforans / X. vesicatoria',
    pathogenType: 'Bacterial Pathogen',
    severity: 'High',
    shortDescription:
      'Widespread bacterial disease causing dark, greasy foliar specks, severe leaf drop, and raised scabby fruit lesions, severely reducing market yield.',
    symptoms:
      'Numerous small (1–3mm), dark brown to black water-soaked spots on leaves. Leaves turn yellow and drop prematurely. Fruit exhibits small blister-like brown scabs.',
    weatherCriteria: {
      optimalTempMin: 24,
      optimalTempMax: 30,
      criticalHumidity: 80,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Bacterial spot is favored by warm temperatures (24–30°C), heavy rainfall, high humidity, and driving winds that create micro-wounds on leaf surfaces.',
    },
    cropCare: [
      {
        title: 'Apply Fixed Copper + Mancozeb Tank Mix',
        importance: 'High',
        detail:
          'Spray copper hydroxide mixed with mancozeb weekly during wet, warm periods according to local agricultural extension guidelines.',
        reason:
          'Mancozeb enhances copper solubility, providing superior bactericidal control against copper-tolerant Xanthomonas strains.',
        condition: 'Warm, humid, rainy weather.',
      },
      {
        title: 'Prune Lower Canopy to Enhance Airflow',
        importance: 'Medium',
        detail:
          'Prune suckers and foliage within 12 inches of the soil on dry sunny afternoons with clean tools.',
        reason:
          'Improves canopy ventilation, shortening leaf wetness duration after rain or dew.',
        condition: 'Dry, sunny conditions only.',
      },
      {
        title: 'Apply Mulch Underneath Plants',
        importance: 'Medium',
        detail:
          'Install plastic film or straw mulch beneath tomato plants.',
        reason:
          'Physically blocks raindrops from splashing soil-borne bacteria onto lower tomato foliage.',
        condition: 'At transplanting or early growth.',
      },
    ],
    safeHandling: [
      {
        title: 'Wash Hands Thoroughly After Contact',
        category: 'Personal Hygiene',
        detail:
          'Wash hands with soap and water after handling infected tomato foliage before touching healthy plants.',
      },
      {
        title: 'Sanitize Pruning Tools',
        category: 'Tool Sanitation',
        detail:
          'Wipe pruners with 70% alcohol or 10% bleach solution between rows to avoid mechanically spreading bacterial ooze.',
      },
      {
        title: 'Chemical Handler Safety',
        category: 'Chemical Safety',
        detail:
          'Wear eye protection and gloves when mixing copper formulations. Avoid inhaling spray mist.',
      },
    ],
  },

  'Tomato_Early_blight': {
    id: 'tomato_early_blight',
    modelClass: 'Tomato_Early_blight',
    displayName: 'Early Blight',
    crop: 'Tomato',
    pathogen: 'Alternaria solani',
    pathogenType: 'Fungal Pathogen',
    severity: 'Medium',
    shortDescription:
      'Ubiquitous fungal infection causing concentric target-board lesions on older leaves, progressing upward and causing defoliation and collar rot.',
    symptoms:
      'Dark brown to black spots with distinct concentric rings on older leaves. Yellow halos surround the spots. Defoliation exposes developing fruit to sunscald.',
    weatherCriteria: {
      optimalTempMin: 24,
      optimalTempMax: 30,
      criticalHumidity: 80,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Alternaria solani conidia germinate rapidly during warm temperatures (24–30°C) when leaves remain wet from rain, dew, or sprinkler irrigation for more than 8 hours.',
    },
    cropCare: [
      {
        title: 'Preventative Bio-Fungicide or Copper Treatment',
        importance: 'High',
        detail:
          'Apply Bacillus subtilis bio-fungicide, copper octanoate, or chlorothalonil starting at early blossom set.',
        reason:
          'Colonizes leaf surfaces and forms a protective barrier before fungal spores penetrate stomata.',
        condition: 'Humid mornings with heavy dew.',
      },
      {
        title: 'Strip Lower Foliage (Bottom 12 Inches)',
        importance: 'High',
        detail:
          'Remove yellowing and spotted lower leaves as soon as first clusters develop fruit.',
        reason:
          'Removes primary fungal inoculum resting near the moist soil line.',
        condition: 'Dry afternoons.',
      },
      {
        title: 'Use Stake or Trellis Training Systems',
        importance: 'Medium',
        detail:
          'Keep indeterminate tomato vines upright with stakes, cages, or Florida weave trellising.',
        reason:
          'Elevates foliage above ground humidity and maximizes sunlight penetration.',
        condition: 'Throughout vegetative season.',
      },
    ],
    safeHandling: [
      {
        title: 'Wash Hands and Tools',
        category: 'Personal Hygiene',
        detail:
          'Wash hands after pruning blighted leaves. Do not touch eyes or face during field operations.',
      },
      {
        title: 'Safe Plant Disposal',
        category: 'Field Hygiene',
        detail:
          'Bag and dispose of pruned blighted leaves. Do not toss into open domestic compost piles.',
      },
      {
        title: 'Follow Fungicide Pre-Harvest Intervals (PHI)',
        category: 'Chemical Safety',
        detail:
          'Check the product label for the mandatory wait time between spraying and harvesting ripe tomatoes (typically 0–7 days).',
      },
    ],
  },

  'Tomato_Late_blight': {
    id: 'tomato_late_blight',
    modelClass: 'Tomato_Late_blight',
    displayName: 'Late Blight',
    crop: 'Tomato',
    pathogen: 'Phytophthora infestans',
    pathogenType: 'Oomycete (Water Mold)',
    severity: 'High',
    shortDescription:
      'Rapid, highly contagious water mold causing large greasy foliar lesions, stem collapse, white sporulation, and greasy brown rot on green fruit.',
    symptoms:
      'Pale green water-soaked spots expanding into large purplish-brown lesions. In humid weather, white cottony mold appears on undersides. Stems turn dark and collapse.',
    weatherCriteria: {
      optimalTempMin: 12,
      optimalTempMax: 22,
      criticalHumidity: 85,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Late blight explodes during cool, foggy, overcast weather (12–22°C with humidity > 85%). Spores swim in water droplets and are carried miles by wind currents.',
    },
    cropCare: [
      {
        title: 'Emergency Protective Fungicide Application',
        importance: 'High',
        detail:
          'Apply registered late blight protectant or systemic fungicides (e.g., mancozeb, mandipropamid, or fixed copper) immediately upon regional confirmation.',
        reason:
          'Late blight can destroy healthy commercial fields within 5 to 7 days if weather conditions remain cool and wet.',
        condition: 'Cool, wet, cloudy, overcast weather.',
      },
      {
        title: 'Bag and Remove Blighted Plants Promptly',
        importance: 'High',
        detail:
          'Carefully bag severely blighted plants in large plastic sacks in-place before cutting the stem.',
        reason:
          'Prevents shaking millions of microscopic sporangia onto adjacent healthy rows.',
        condition: 'At first detection.',
      },
      {
        title: 'Terminate Sprinkler Irrigation Completely',
        importance: 'High',
        detail:
          'Switch exclusively to subsurface or drip watering. Allow tomato foliage to remain completely dry.',
        reason:
          'Phytophthora zoospores require standing water droplets to swim and germinate.',
        condition: 'Immediate action.',
      },
    ],
    safeHandling: [
      {
        title: 'Personal Safety Equipment (PPE)',
        category: 'Chemical Safety',
        detail:
          'Wear waterproof gloves, goggles, long pants, and a protective respirator when applying late blight treatments.',
      },
      {
        title: 'Do Not Consume Blighted Fruit',
        category: 'Food Safety',
        detail:
          'Tomatoes exhibiting brown greasy late blight rot or internal decay should never be eaten or canned, as the pH is altered and secondary microbes proliferate.',
      },
      {
        title: 'Wash Field Clothes and Boots',
        category: 'Field Hygiene',
        detail:
          'Launder field clothes and disinfect boots before visiting other farms or garden plots to avoid spreading spores.',
      },
    ],
  },

  'Tomato_Leaf_Mold': {
    id: 'tomato_leaf_mold',
    modelClass: 'Tomato_Leaf_Mold',
    displayName: 'Leaf Mold',
    crop: 'Tomato',
    pathogen: 'Passalora fulva (Cladosporium fulvum)',
    pathogenType: 'Fungal Pathogen',
    severity: 'Medium',
    shortDescription:
      'Fungal foliar disease prevalent in high-humidity structures and dense canopies, producing pale yellow spots with velvety olive-brown mold underneath.',
    symptoms:
      'Pale green to light yellow patches on upper leaf surfaces; velvety olive-brown to grayish-purple spore mats directly underneath on lower leaf surfaces. Foliage curls and withers.',
    weatherCriteria: {
      optimalTempMin: 20,
      optimalTempMax: 25,
      criticalHumidity: 85,
      favoredByRain: false,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Passalora fulva thrives in warm, stagnant air (20–25°C) with prolonged relative humidity exceeding 85%. Especially virulent inside greenhouses and high tunnels.',
    },
    cropCare: [
      {
        title: 'Aggressively Increase Ventilation and Air Movement',
        importance: 'High',
        detail:
          'Prune suckers, open side roll-ups on high tunnels, and deploy circulation fans to lower relative humidity below 80%.',
        reason:
          'Conidial germination ceases when relative humidity is maintained below 80%.',
        condition: 'High tunnel, greenhouse, or dense field rows.',
      },
      {
        title: 'Apply Preventative Copper or Bio-Fungicide',
        importance: 'Medium',
        detail:
          'Spray bio-fungicides or copper fungicides ensuring thorough coverage of the undersides of leaves.',
        reason:
          'Passalora sporulates and enters almost exclusively through lower leaf stomata.',
        condition: 'When relative humidity remains consistently above 80%.',
      },
      {
        title: 'Increase In-Row Plant Spacing',
        importance: 'Medium',
        detail:
          'Space plants at least 18–24 inches apart on stakes or trellis lines.',
        reason:
          'Promotes natural cross-breezes that dry interior canopy microclimates.',
        condition: 'Next planting cycle.',
      },
    ],
    safeHandling: [
      {
        title: 'Respiratory Protection in High Tunnels',
        category: 'Personal Safety',
        detail:
          'Persons with mold allergies or asthma should wear an N95 dust mask when pruning or working in tunnels with heavy Passalora sporulation.',
      },
      {
        title: 'Wash Hands After Pruning',
        category: 'Personal Hygiene',
        detail:
          'Clean hands with soap and water after handling velvety moldy foliage.',
      },
    ],
  },

  'Tomato_Septoria_leaf_spot': {
    id: 'tomato_septoria',
    modelClass: 'Tomato_Septoria_leaf_spot',
    displayName: 'Septoria Leaf Spot',
    crop: 'Tomato',
    pathogen: 'Septoria lycopersici',
    pathogenType: 'Fungal Pathogen',
    severity: 'Medium',
    shortDescription:
      'Destructive foliar disease causing thousands of tiny circular spots with dark borders and gray centers, causing progressive bottom-up defoliation.',
    symptoms:
      'Numerous small (2–4mm) circular spots with dark brown margins and sunken gray or tan centers. Tiny black specks (pycnidia) visible inside spot centers with a hand lens.',
    weatherCriteria: {
      optimalTempMin: 20,
      optimalTempMax: 26,
      criticalHumidity: 80,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Favored by wet, warm, humid weather (20–26°C). Spores inside pycnidia ooze out in gelatinous droplets and splash onto higher foliage during rainfall.',
    },
    cropCare: [
      {
        title: 'Prune Lower Diseased Foliage',
        importance: 'High',
        detail:
          'Prune off all affected lower leaves as soon as first spots appear on bottom tiers. Discard away from fields.',
        reason:
          'Halts upward progress of rain-splashed pycnidiospores.',
        condition: 'Dry, sunny conditions.',
      },
      {
        title: 'Apply Protective Contact Fungicides',
        importance: 'Medium',
        detail:
          'Apply chlorothalonil, mancozeb, or copper octanoate at 7-to-10-day intervals during wet periods.',
        reason:
          'Provides a toxic barrier that kills germinating Septoria conidia upon contact.',
        condition: 'Wet, rainy periods.',
      },
      {
        title: 'Lay Clean Straw or Plastic Mulch',
        importance: 'Medium',
        detail:
          'Place mulch 3–4 inches thick around the base of every plant.',
        reason:
          'Eliminates rain splash from soil where overwintered Septoria residues dwell.',
        condition: 'At planting.',
      },
    ],
    safeHandling: [
      {
        title: 'Hand and Tool Hygiene',
        category: 'Personal Hygiene',
        detail:
          'Wash hands and sanitize pruners in alcohol before moving to unaffected fields.',
      },
      {
        title: 'Never Work When Foliage Is Wet',
        category: 'Field Hygiene',
        detail:
          'Wait for dew or rain to evaporate before pruning or harvesting, as Septoria gelatinous spore masses adhere to skin and tools.',
      },
    ],
  },

  'Tomato_Spider_mites_Two_spotted_spider_mite': {
    id: 'tomato_spider_mites',
    modelClass: 'Tomato_Spider_mites_Two_spotted_spider_mite',
    displayName: 'Spider Mites',
    crop: 'Tomato',
    pathogen: 'Tetranychus urticae',
    pathogenType: 'Arachnid Pest (Two-Spotted Spider Mite)',
    severity: 'Medium',
    shortDescription:
      'Tiny sap-feeding arachnids that proliferate in hot, dry weather, causing fine yellow stippling, bronzing, chlorosis, and silky webbing under leaves.',
    symptoms:
      'Minute yellow, white, or bronze speckling (stippling) on upper leaf surfaces. Fine silky webbing on undersides and growing tips. Severe infestations turn foliage brown and brittle.',
    weatherCriteria: {
      optimalTempMin: 27,
      optimalTempMax: 38,
      criticalHumidity: 50,
      favoredByRain: false,
      favoredByDry: true, // IMPORTANT: Mites thrive in hot DRY weather!
      windDispersal: true,
      description:
        'In stark contrast to fungal diseases, spider mites proliferate exponentially during HOT, DRY, DUSTY conditions (>27°C, relative humidity < 50%). Life cycle drops from 20 days to 5 days.',
    },
    cropCare: [
      {
        title: 'Deploy Insecticidal Soap or Horticultural Oil',
        importance: 'High',
        detail:
          'Spray potassium salts of fatty acids (insecticidal soap), neem oil, or horticultural mineral oil with high-pressure nozzles directed at lower leaf undersides.',
        reason:
          'Oils and soaps smother adult mites and dissolve protective web matrix upon direct contact.',
        condition: 'Early morning or late afternoon (avoid spraying in direct sun > 32°C).',
      },
      {
        title: 'Suppress Dust and Border Drought',
        importance: 'Medium',
        detail:
          'Water unpaved farm lanes and border rows to eliminate dusty conditions. Maintain adequate crop hydration.',
        reason:
          'Dusty conditions interfere with natural predatory mites and insects that keep spider mites under biological control.',
        condition: 'Prolonged dry, hot spells.',
      },
      {
        title: 'Introduce Predatory Mites (Phytoseiulus persimilis)',
        importance: 'Medium',
        detail:
          'Release commercial beneficial predatory mites at first signs of foliar stippling.',
        reason:
          'Specialized biological predators consume 20 spider mite eggs or adults per day.',
        condition: 'Protected culture or field plantings at early infestation.',
      },
    ],
    safeHandling: [
      {
        title: 'Eye and Skin Protection During Oil Applications',
        category: 'Personal Safety',
        detail:
          'Wear eye protection, long sleeves, and gloves when spraying horticultural oils or insecticidal soaps to prevent mild skin and ocular irritation.',
      },
      {
        title: 'Wash Produce Before Consumption',
        category: 'Food Safety',
        detail:
          'Rinse harvested tomatoes under running water to remove harmless webbing, dust, or soap residue.',
      },
    ],
  },

  'Tomato__Target_Spot': {
    id: 'tomato_target_spot',
    modelClass: 'Tomato__Target_Spot',
    displayName: 'Target Spot',
    crop: 'Tomato',
    pathogen: 'Corynespora cassiicola',
    pathogenType: 'Fungal Pathogen',
    severity: 'Medium',
    shortDescription:
      'Warm-season fungal pathogen producing brown lesions with faint concentric rings on leaves and sunken target-pattern craters on fruit.',
    symptoms:
      'Circular pinpoint brown spots enlarging into dark lesions with pale tan centers and faint concentric rings. Leaf margins yellow. Fruit exhibits sunken brown craters.',
    weatherCriteria: {
      optimalTempMin: 20,
      optimalTempMax: 28,
      criticalHumidity: 80,
      favoredByRain: true,
      favoredByDry: false,
      windDispersal: true,
      description:
        'Corynespora cassiicola thrives in warm, humid tropical and subtropical weather (20–28°C with relative humidity > 80% and long leaf wetness periods).',
    },
    cropCare: [
      {
        title: 'Apply Protective and Systemic Fungicides',
        importance: 'High',
        detail:
          'Apply strobilurins (azoxystrobin), chlorothalonil, or copper fungicides on a 7-to-14-day schedule during rainy cycles.',
        reason:
          'Inhibits fungal respiration and blocks secondary conidial germination.',
        condition: 'Warm, humid weather with frequent rainfall.',
      },
      {
        title: 'Open Up Lower Canopy and Manage Weeds',
        importance: 'Medium',
        detail:
          'Regularly sucker indeterminate vines and eliminate broadleaf weeds in surrounding rows.',
        reason:
          'Corynespora has a broad host range (including weeds); open canopies dry rapidly after rain.',
        condition: 'Active vegetative growth.',
      },
      {
        title: 'Avoid Continuous Solanaceous Rotations',
        importance: 'Medium',
        detail:
          'Rotate with non-host grass crops (sorghum, corn) for at least 2 seasons.',
        reason:
          'Prevents fungal mycelium accumulation in soil and debris.',
        condition: 'End of seasonal cycle.',
      },
    ],
    safeHandling: [
      {
        title: 'Personal Hygiene After Scouting',
        category: 'Personal Hygiene',
        detail:
          'Wash hands thoroughly with soap after working in infected beds.',
      },
      {
        title: 'Adhere to Fungicide PHI and REI',
        category: 'Chemical Safety',
        detail:
          'Strictly follow product label re-entry intervals and harvest waiting periods for all applied fungicides.',
      },
    ],
  },

  'Tomato__Tomato_YellowLeaf__Curl_Virus': {
    id: 'tomato_tylcv',
    modelClass: 'Tomato__Tomato_YellowLeaf__Curl_Virus',
    displayName: 'Tomato Yellow Leaf Curl Virus',
    crop: 'Tomato',
    pathogen: 'Tomato yellow leaf curl begomovirus (TYLCV)',
    pathogenType: 'Viral Pathogen (Whitefly-Vectored)',
    severity: 'High',
    shortDescription:
      'Devastating whitefly-transmitted begomovirus causing severe upward cupping, interveinal chlorosis, bushiness, and severe yield collapse.',
    symptoms:
      'Distinct upward leaf curling (boat-shaped leaflets), intense interveinal chlorosis (yellowing), marked plant stunting, flower drop, and bushy compact habit.',
    weatherCriteria: {
      optimalTempMin: 26,
      optimalTempMax: 35,
      criticalHumidity: 60,
      favoredByRain: false,
      favoredByDry: true,
      windDispersal: true,
      description:
        'TYLCV is not transmitted by seed or mechanical pruning; it is transmitted exclusively by sweetpotato whiteflies (Bemisia tabaci). Whiteflies multiply in warm, dry weather (26–35°C).',
    },
    cropCare: [
      {
        title: 'Whitefly Vector Management',
        importance: 'High',
        detail:
          'Deploy yellow sticky cards (1 card per 100 sq meters), apply horticultural oil, neem extract, or registered whitefly insecticides.',
        reason:
          'Eliminating the insect vector is the only way to prevent virus transmission; there is no chemical cure for viral infections.',
        condition: 'Warm, dry weather when whiteflies are active.',
      },
      {
        title: 'Rogue Out and Bag Infected Plants Immediately',
        importance: 'High',
        detail:
          'Immediately dig out plants showing upward cupping and yellowing, place into sealed plastic bags, and dispose off-site.',
        reason:
          'Removes the virus reservoir before feeding whiteflies acquire and transmit it to healthy neighbors.',
        condition: 'At first detection.',
      },
      {
        title: 'Install 50-Mesh Insect Exclusion Netting',
        importance: 'Medium',
        detail:
          'Screen nursery beds and greenhouse vents with high-density insect screening (50-mesh / 0.27mm pore size).',
        reason:
          'Physically prevents tiny whiteflies from landing on vulnerable young seedlings.',
        condition: 'Nursery and early vegetative stage.',
      },
    ],
    safeHandling: [
      {
        title: 'Wash Hands After Removing Infected Plants',
        category: 'Personal Hygiene',
        detail:
          'Wash hands with soap and water after handling infected plants. (Note: Plant viruses do NOT infect humans, but hygiene protects other crops).',
      },
      {
        title: 'Pesticide Safety for Vector Sprays',
        category: 'Chemical Safety',
        detail:
          'Follow strict chemical safety protocols if using registered insecticides for whitefly control. Keep treatments away from bee foraging hours.',
      },
    ],
  },

  'Tomato__Tomato_mosaic_virus': {
    id: 'tomato_mosaic_virus',
    modelClass: 'Tomato__Tomato_mosaic_virus',
    displayName: 'Tomato Mosaic Virus',
    crop: 'Tomato',
    pathogen: 'Tomato mosaic tobamovirus (ToMV)',
    pathogenType: 'Viral Pathogen (Mechanically Transmitted)',
    severity: 'High',
    shortDescription:
      'Extremely stable, persistent mechanically transmitted tobamovirus causing leaf mottling, fern-leaf distortion, and internal brown fruit necrosis.',
    symptoms:
      'Mottled light- and dark-green mosaic patterns on foliage. Leaflets may be blistered, distorted, or reduced to narrow "shoestrings". Fruit shows internal browning.',
    weatherCriteria: {
      optimalTempMin: 22,
      optimalTempMax: 32,
      criticalHumidity: 65,
      favoredByRain: false,
      favoredByDry: false,
      windDispersal: false,
      description:
        'ToMV is transmitted purely by physical contact (hands, tools, pruning, brushing). Higher temperatures (24–30°C) accelerate systemic viral symptom expression in plant tissue.',
    },
    cropCare: [
      {
        title: 'Immediate Eradication of Infected Specimens',
        importance: 'High',
        detail:
          'Carefully pull and discard symptomatic plants. Do not drag diseased foliage against adjacent healthy plants.',
        reason:
          'There is no cure for plant viral infections; rogueing prevents contact spread throughout the block.',
        condition: 'Immediate action upon symptom detection.',
      },
      {
        title: 'Disinfect Hands and Tools with Milk or TSP',
        importance: 'High',
        detail:
          'Dip hands and pruners in a 20% non-fat dry milk solution or 10% trisodium phosphate (TSP) solution frequently during pruning.',
        reason:
          'Milk proteins inactivate the tobamovirus coat protein, neutralizing mechanical transmission.',
        condition: 'During all pruning, trellising, and sucker-removal operations.',
      },
      {
        title: 'Strict Tobacco Use Prohibition in Farm Area',
        importance: 'Medium',
        detail:
          'Workers who use tobacco products must wash hands with warm soap and water before entering fields.',
        reason:
          'Tobacco products frequently carry active tobamoviruses that transfer readily to tomato foliage via fingertip contact.',
        condition: 'Permanent farm policy.',
      },
    ],
    safeHandling: [
      {
        title: 'Hand Hygiene and Tobacco Decontamination',
        category: 'Personal Hygiene',
        detail:
          'Wash hands thoroughly with soap before and after handling plants. Workers using cigarettes or chew must thoroughly wash and change gloves.',
      },
      {
        title: 'Sanitize Work Belts and Harvest Baskets',
        category: 'Equipment Sanitation',
        detail:
          'Wash harvest crates and trellis clips with disinfectant solutions before reuse.',
      },
      {
        title: 'Food Safety and Consume Guidance',
        category: 'Food Safety',
        detail:
          'Unblemished fruit from affected plants is safe for human consumption, but avoid saving seed from infected plantings.',
      },
    ],
  },

  'Tomato_healthy': {
    id: 'tomato_healthy',
    modelClass: 'Tomato_healthy',
    displayName: 'Healthy Tomato',
    crop: 'Tomato',
    pathogen: 'None (Healthy Specimen)',
    pathogenType: 'Disease-Free Foliage',
    severity: 'None',
    shortDescription:
      'Healthy, vigorous tomato foliage displaying rich green coloration, intact glandular hairs, turgid stems, and complete absence of foliar pathogens.',
    symptoms:
      'Uniform green leaflets, intact serrated margins, clean petioles, strong terminal shoots, and absence of necrotic specks, mold, or leaf curl.',
    weatherCriteria: {
      optimalTempMin: 20,
      optimalTempMax: 28,
      criticalHumidity: 65,
      favoredByRain: false,
      favoredByDry: false,
      windDispersal: false,
      description:
        'Optimal growing conditions are 21–28°C daytime and 16–20°C nighttime, with 60–70% relative humidity. Extreme heat (>33°C) triggers pollen sterility and blossom drop.',
    },
    cropCare: [
      {
        title: 'Regular Canopy Maintenance and Pruning',
        importance: 'Preventive',
        detail:
          'Prune non-fruiting lower suckers and ground-touching leaves on sunny mornings to maintain air circulation.',
        reason:
          'Proactively prevents bottom-up microclimates that encourage opportunistic fungal germination.',
        condition: 'Weekly during active growth.',
      },
      {
        title: 'Consistent Root-Zone Drip Irrigation',
        importance: 'Preventive',
        detail:
          'Provide 1.5 to 2.0 inches of water per week applied directly to the soil root zone.',
        reason:
          'Fluctuations between drought and water saturation trigger fruit cracking and blossom end rot.',
        condition: 'Active fruiting stages.',
      },
      {
        title: 'Preventive Microclimate Scouting',
        importance: 'Preventive',
        detail:
          'Scout lower leaves after heavy rainfall or high-humidity days for early spots or mold.',
        reason:
          'Catching the first few blighted leaflets allows simple cultural removal before widespread transmission.',
        condition: 'After weather changes.',
      },
    ],
    safeHandling: [
      {
        title: 'Routine Harvest Hygiene',
        category: 'General Hygiene',
        detail:
          'Wash hands before harvesting fruit. Handle tomatoes gently by the calyx to prevent skin bruising.',
      },
      {
        title: 'Sanitize Storage Bins',
        category: 'Food Safety',
        detail:
          'Use clean, ventilated plastic lugs for harvesting. Store picked tomatoes at 13–15°C; do not refrigerate unripe fruit.',
      },
    ],
  },
};

/**
 * Normalizes any model class string, display name, or crop into our canonical pathology record.
 */
export function getPathologyInfo(diseaseNameOrClass, cropName = '') {
  if (!diseaseNameOrClass) return null;

  // 1. Direct model class match
  if (MODEL_CLASSES_PATHOLOGY[diseaseNameOrClass]) {
    return MODEL_CLASSES_PATHOLOGY[diseaseNameOrClass];
  }

  const cleanName = diseaseNameOrClass.toLowerCase().trim();
  const cleanCrop = (cropName || '').toLowerCase().trim();

  // 2. Search by matching display name & crop
  for (const record of Object.values(MODEL_CLASSES_PATHOLOGY)) {
    const recordCrop = record.crop.toLowerCase();
    const recordDisplay = record.displayName.toLowerCase();

    // Exact crop + display match
    if (cleanCrop && recordCrop === cleanCrop) {
      if (cleanName.includes(recordDisplay) || recordDisplay.includes(cleanName)) {
        return record;
      }
    }
  }

  // 3. Fallback: match by display name alone
  for (const record of Object.values(MODEL_CLASSES_PATHOLOGY)) {
    const recordDisplay = record.displayName.toLowerCase();
    if (cleanName === recordDisplay || cleanName.includes(recordDisplay)) {
      return record;
    }
  }

  // 4. Fallback for generic healthy
  if (cleanName.includes('healthy')) {
    if (cleanCrop.includes('potato')) return MODEL_CLASSES_PATHOLOGY['Potato___healthy'];
    if (cleanCrop.includes('pepper')) return MODEL_CLASSES_PATHOLOGY['Pepper__bell___healthy'];
    return MODEL_CLASSES_PATHOLOGY['Tomato_healthy'];
  }

  return null;
}

/**
 * Evaluates the Disease–Weather Risk Correlation based on actual predicted disease
 * and live meteorological conditions.
 */
export function evaluateDiseaseWeatherRisk({
  disease,
  displayDisease,
  crop,
  weather,
  predictionReliable = true,
  warning = null,
}) {
  const pathology = getPathologyInfo(disease || displayDisease, crop);

  const temperature = Number(weather?.temperature ?? 0);
  const humidity = Number(weather?.humidity ?? 0);
  const windSpeed = Number(weather?.windSpeed ?? 0);
  const rainChance = Number(weather?.rainChance ?? 0);
  const precipitation = Number(weather?.precipitation ?? 0);
  const condition = weather?.condition || 'Unknown';
  const location = weather?.location || 'Your farm location';

  const isHealthy =
    disease?.toLowerCase().includes('healthy') ||
    displayDisease?.toLowerCase().includes('healthy') ||
    pathology?.severity === 'None';

  // If specimen is Healthy
  if (isHealthy) {
    const heatStress = temperature >= 33;
    const droughtStress = humidity < 40 && rainChance < 20;
    const extremeRain = precipitation > 10 || rainChance >= 75;

    let category = 'Routine Conditions';
    let assessment = 'Environmental conditions are generally favorable for healthy crop growth.';
    let reasoning = `Ambient temperature of ${temperature}°C and humidity of ${humidity}% in ${location} support stable vegetative development.`;

    if (heatStress) {
      category = 'Conditions to Monitor';
      assessment = 'Elevated temperature stress watch.';
      reasoning = `Current temperature is ${temperature}°C. Temperatures above 32°C can cause pollen sterility and blossom drop in solanaceous crops. Ensure adequate root-zone irrigation.`;
    } else if (droughtStress) {
      category = 'Conditions to Monitor';
      assessment = 'Low relative humidity watch.';
      reasoning = `Relative humidity is low (${humidity}%). Monitor soil moisture to prevent water stress. Watch for early spider mite colonization.`;
    } else if (extremeRain) {
      category = 'Conditions to Monitor';
      assessment = 'High moisture preventative watch.';
      reasoning = `Rain probability is ${rainChance}% with high ambient humidity (${humidity}%). While this leaf is currently healthy, persistent foliar wetness can create opportunities for fungal spores. Maintain preventative scouting.`;
    }

    return {
      category,
      assessment,
      reasoning,
      pathology,
      observations: {
        temperature,
        humidity,
        windSpeed,
        precipitation,
        rainChance,
        condition,
        location,
      },
      favorableForPathogen: false,
      disclaimer:
        'Weather analysis indicates microclimate conditions only and does not replace regular field tissue inspections.',
    };
  }

  // If no specific pathology database rule exists
  if (!pathology || !pathology.weatherCriteria) {
    return {
      category: 'Insufficient Data',
      assessment: 'General observation — disease-specific weather rule not established.',
      reasoning: `Recorded weather in ${location}: ${temperature}°C, ${humidity}% humidity. Continue routine disease monitoring and refer to standard extension guidance.`,
      pathology: null,
      observations: {
        temperature,
        humidity,
        windSpeed,
        precipitation,
        rainChance,
        condition,
        location,
      },
      favorableForPathogen: false,
      disclaimer:
        'Weather observations indicate environmental conditions; laboratory or extension verification is recommended.',
    };
  }

  const crit = pathology.weatherCriteria;

  // Temperature match
  const tempInRange =
    temperature >= crit.optimalTempMin && temperature <= crit.optimalTempMax;
  const tempNearRange =
    temperature >= crit.optimalTempMin - 4 && temperature <= crit.optimalTempMax + 4;

  // Humidity match
  let humidityFavorable = false;
  if (crit.favoredByDry) {
    // Mites / Whiteflies thrive in dry conditions
    humidityFavorable = humidity <= crit.criticalHumidity;
  } else {
    // Fungi / Bacteria thrive in high humidity
    humidityFavorable = humidity >= crit.criticalHumidity;
  }

  const wetCondition = precipitation > 0 || rainChance >= 50;

  // Determine risk category
  let category = 'Conditions to Monitor';
  let assessment = 'Microclimate partially aligns with pathogen development factors.';
  let favorableForPathogen = false;

  if (crit.favoredByDry) {
    // Hot dry pests (e.g. Spider Mites, Whiteflies / TYLCV)
    if (tempInRange && humidityFavorable) {
      category = 'Increased Vigilance Recommended';
      assessment = 'Current hot, dry microclimate strongly favors rapid population expansion.';
      favorableForPathogen = true;
    } else if (tempInRange || humidityFavorable) {
      category = 'Potentially Favorable';
      assessment = 'Current weather partially supports pest multiplication.';
    } else {
      category = 'Conditions to Monitor';
      assessment = 'High humidity or cool temperatures suppress rapid population growth.';
    }
  } else {
    // Fungal / Bacterial / Oomycete pathogens
    if (tempInRange && (humidityFavorable || wetCondition)) {
      category = 'Increased Vigilance Recommended';
      assessment =
        'Ambient temperature and elevated moisture create optimal germination and sporulation conditions.';
      favorableForPathogen = true;
    } else if (tempNearRange && (humidityFavorable || wetCondition)) {
      category = 'Potentially Favorable';
      assessment =
        'Foliar wetness and humidity are favorable for spore germination, though temperatures are slightly outside peak reproduction rates.';
    } else if (humidityFavorable) {
      category = 'Potentially Favorable';
      assessment =
        'High humidity maintains leaf moisture, favoring fungal sporulation if temperatures rise.';
    } else {
      category = 'Conditions to Monitor';
      assessment =
        'Current weather does not indicate an immediate environmental acceleration of disease progression.';
    }
  }

  // Generate detailed agronomic reasoning
  const reasoning = `${pathology.displayName} development criteria: ${crit.optimalTempMin}–${crit.optimalTempMax}°C ${
    crit.favoredByDry ? `and dry conditions (<${crit.criticalHumidity}% humidity)` : `and high relative humidity (≥${crit.criticalHumidity}%)`
  }. Current weather at ${location} is ${temperature}°C with ${humidity}% humidity and ${windSpeed} km/h wind. ${
    favorableForPathogen
      ? `These conditions provide favorable microclimate factors for ${pathology.displayName}. ${
          windSpeed > 12 ? 'Breezy conditions (>12 km/h) may assist physical dispersal of spores/vectors.' : 'Low winds (<10 km/h) offer a potential morning spraying window if approved treatments are chosen.'
        }`
      : `Current conditions fall somewhat outside the pathogen's primary acceleration window, though existing foliar lesions require management.`
  }`;

  return {
    category,
    assessment,
    reasoning,
    pathology,
    observations: {
      temperature,
      humidity,
      windSpeed,
      precipitation,
      rainChance,
      condition,
      location,
    },
    favorableForPathogen,
    disclaimer:
      'Environmental correlation identifies favorable conditions but cannot prove disease presence or guarantee an outbreak without in-field foliar diagnosis.',
  };
}

/**
 * Returns structured Safe Handling and Farm Hygiene Precautions.
 */
export function getSafeHandlingGuidelines(diseaseNameOrClass, cropName = '') {
  const pathology = getPathologyInfo(diseaseNameOrClass, cropName);

  if (pathology?.safeHandling?.length) {
    return pathology.safeHandling;
  }

  // General fallback safety guidelines
  return [
    {
      title: 'Hand Hygiene After Field Contact',
      category: 'Personal Hygiene',
      detail:
        'Always wash hands with soap and water after handling symptomatic leaves or stems to avoid transmitting microbes to uninfected rows.',
    },
    {
      title: 'Tool Disinfection',
      category: 'Tool Sanitation',
      detail:
        'Sanitize pruning blades and harvesting knives with 70% alcohol or 10% bleach dilution between rows.',
    },
    {
      title: 'Protective Equipment (PPE)',
      category: 'Chemical Safety',
      detail:
        'Wear chemical-resistant gloves, goggles, and long sleeves whenever handling approved crop protection sprays or organic dusts.',
    },
    {
      title: 'Wash Produce Before Consumption',
      category: 'Food Safety',
      detail:
        'Thoroughly rinse all harvested vegetables under clean running water prior to preparation or market sale.',
    },
  ];
}

/**
 * Generates an executive Weather-Based Action Summary for the footer of the results page.
 */
export function generateActionSummary({
  disease,
  displayDisease,
  crop,
  confidence,
  weather,
  riskAssessment,
  predictionReliable = true,
  warning = null,
}) {
  const isHealthy =
    disease?.toLowerCase().includes('healthy') ||
    displayDisease?.toLowerCase().includes('healthy');

  const location = weather?.location || 'Selected Farm Location';
  const temp = weather?.temperature != null ? `${weather.temperature}°C` : '--°C';
  const humidity = weather?.humidity != null ? `${weather.humidity}%` : '--%';
  const wind = weather?.windSpeed != null ? `${weather.windSpeed} km/h` : '-- km/h';

  if (isHealthy) {
    return {
      finding: `AI inference classified this ${crop} leaf as Healthy with ${confidence}% confidence.`,
      microclimateImpact: `Current conditions in ${location} (${temp}, ${humidity} humidity) indicate normal growth parameters without acute disease acceleration.`,
      nextStep:
        'Continue regular drip irrigation, balanced nutrition, and scout lower canopy foliage every 5–7 days.',
      verificationNote:
        'Healthy reading indicates absence of visual necrotic patterns; continue routine crop protection practices.',
    };
  }

  const diseaseLabel = displayDisease || disease;
  const isHighRisk = riskAssessment?.category === 'Increased Vigilance Recommended';

  return {
    finding: `AI detected foliar symptoms consistent with ${crop} ${diseaseLabel} at ${confidence}% neural confidence.`,
    microclimateImpact: `Local weather at ${location} (${temp}, ${humidity} RH, wind ${wind}) presents ${
      isHighRisk ? 'elevated environmental favorability for pathogen spread' : 'moderate conditions to monitor'
    }.`,
    nextStep:
      !predictionReliable || warning
        ? 'Result has low confidence or crop mismatch. Contact your local agricultural extension agent before applying chemical sprays.'
        : `Inspect nearby ${crop} rows for matching symptoms. If intervention is required, consult locally approved product labels during the low-wind morning window.`,
    verificationNote:
      !predictionReliable || warning
        ? '⚠️ Model Reliability Warning: Prediction should be verified by a certified agronomist before initiating chemical treatment.'
        : 'AI visual screening provides real-time guidance; consult local extension agents for severe outbreaks.',
  };
}
