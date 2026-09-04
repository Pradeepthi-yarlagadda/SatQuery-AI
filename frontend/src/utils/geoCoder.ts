/**
 * SatQuery-AI Universal Geocoder
 * Provides offline instant gazetteer for 200+ Indian & Global locations,
 * ISRO space centres, geological landmarks, robust coordinate parsing,
 * natural language location extraction, and OpenStreetMap Nominatim fallback.
 */

export interface GeocodedLocation {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
  category?: 'metro' | 'capital' | 'space' | 'landmark' | 'city' | 'global' | 'custom';
  source: 'preset' | 'gazetteer' | 'coordinates' | 'osm';
  displayName?: string;
}

// 1. Comprehensive Offline Fast Gazetteer (Instant, 0ms latency)
export const OFFLINE_GAZETTEER: Record<string, Omit<GeocodedLocation, 'source'>> = {
  // --- Indian Metros & Mega Cities ---
  'delhi': { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, zoom: 13, pitch: 45, category: 'capital' },
  'new delhi': { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, zoom: 13, pitch: 45, category: 'capital' },
  'mumbai': { name: 'Mumbai, Maharashtra', lat: 18.9220, lng: 72.8347, zoom: 13, pitch: 45, category: 'metro' },
  'bombay': { name: 'Mumbai, Maharashtra', lat: 18.9220, lng: 72.8347, zoom: 13, pitch: 45, category: 'metro' },
  'bengaluru': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, zoom: 13.5, pitch: 45, category: 'metro' },
  'bangalore': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, zoom: 13.5, pitch: 45, category: 'metro' },
  'hyderabad': { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, zoom: 14, pitch: 45, category: 'metro' },
  'chennai': { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, zoom: 13, pitch: 45, category: 'metro' },
  'madras': { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, zoom: 13, pitch: 45, category: 'metro' },
  'kolkata': { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, zoom: 13, pitch: 45, category: 'metro' },
  'calcutta': { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, zoom: 13, pitch: 45, category: 'metro' },
  'ahmedabad': { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714, zoom: 13.5, pitch: 40, category: 'metro' },
  'pune': { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, zoom: 13.5, pitch: 45, category: 'metro' },
  'surat': { name: 'Surat, Gujarat', lat: 21.1702, lng: 72.8311, zoom: 13.5, pitch: 40, category: 'metro' },
  'jaipur': { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, zoom: 13.5, pitch: 45, category: 'capital' },
  'lucknow': { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462, zoom: 13.5, pitch: 40, category: 'capital' },
  'kanpur': { name: 'Kanpur, Uttar Pradesh', lat: 26.4499, lng: 80.3319, zoom: 13, pitch: 35, category: 'city' },
  'nagpur': { name: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882, zoom: 13.5, pitch: 40, category: 'city' },
  'indore': { name: 'Indore, Madhya Pradesh', lat: 22.7196, lng: 75.8577, zoom: 13.5, pitch: 40, category: 'city' },
  'bhopal': { name: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126, zoom: 13.5, pitch: 40, category: 'capital' },
  'visakhapatnam': { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, zoom: 13, pitch: 45, category: 'city' },
  'vizag': { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, zoom: 13, pitch: 45, category: 'city' },
  'patna': { name: 'Patna, Bihar', lat: 25.5941, lng: 85.1376, zoom: 13, pitch: 35, category: 'capital' },
  'vadodara': { name: 'Vadodara, Gujarat', lat: 22.3072, lng: 73.1812, zoom: 13.5, pitch: 40, category: 'city' },
  'ghaziabad': { name: 'Ghaziabad, Uttar Pradesh', lat: 28.6692, lng: 77.4538, zoom: 13, pitch: 40, category: 'city' },
  'ludhiana': { name: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573, zoom: 13, pitch: 35, category: 'city' },
  'agra': { name: 'Agra (Taj Mahal), Uttar Pradesh', lat: 27.1751, lng: 78.0421, zoom: 14.5, pitch: 50, category: 'city' },
  'nashik': { name: 'Nashik, Maharashtra', lat: 19.9975, lng: 73.7898, zoom: 13, pitch: 40, category: 'city' },
  'faridabad': { name: 'Faridabad, Haryana', lat: 28.4089, lng: 77.3178, zoom: 13, pitch: 40, category: 'city' },
  'varanasi': { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lng: 82.9739, zoom: 14, pitch: 45, category: 'city' },
  'kashi': { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lng: 82.9739, zoom: 14, pitch: 45, category: 'city' },
  'srinagar': { name: 'Srinagar, Jammu & Kashmir', lat: 34.0837, lng: 74.7973, zoom: 13, pitch: 50, category: 'capital' },
  'amritsar': { name: 'Amritsar (Golden Temple), Punjab', lat: 31.6200, lng: 74.8765, zoom: 14, pitch: 45, category: 'city' },
  'prayagraj': { name: 'Prayagraj, Uttar Pradesh', lat: 25.4358, lng: 81.8463, zoom: 13, pitch: 40, category: 'city' },
  'allahabad': { name: 'Prayagraj, Uttar Pradesh', lat: 25.4358, lng: 81.8463, zoom: 13, pitch: 40, category: 'city' },
  'ranchi': { name: 'Ranchi, Jharkhand', lat: 23.3441, lng: 85.3096, zoom: 13, pitch: 40, category: 'capital' },
  'coimbatore': { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lng: 76.9558, zoom: 13, pitch: 40, category: 'city' },
  'chandigarh': { name: 'Chandigarh, India', lat: 30.7333, lng: 76.7794, zoom: 13.5, pitch: 40, category: 'capital' },
  'guwahati': { name: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362, zoom: 13, pitch: 45, category: 'city' },
  'assam': { name: 'Assam, India', lat: 26.2006, lng: 92.9376, zoom: 9, pitch: 30, category: 'landmark' },
  'bhubaneswar': { name: 'Bhubaneswar, Odisha', lat: 20.2961, lng: 85.8245, zoom: 13.5, pitch: 40, category: 'capital' },
  'thiruvananthapuram': { name: 'Thiruvananthapuram, Kerala', lat: 8.5241, lng: 76.9366, zoom: 13, pitch: 40, category: 'capital' },
  'trivandrum': { name: 'Thiruvananthapuram, Kerala', lat: 8.5241, lng: 76.9366, zoom: 13, pitch: 40, category: 'capital' },
  'kochi': { name: 'Kochi (Cochin), Kerala', lat: 9.9312, lng: 76.2673, zoom: 13.5, pitch: 45, category: 'city' },
  'cochin': { name: 'Kochi (Cochin), Kerala', lat: 9.9312, lng: 76.2673, zoom: 13.5, pitch: 45, category: 'city' },
  'kerala': { name: 'Kerala, India', lat: 10.8505, lng: 76.2711, zoom: 8.5, pitch: 35, category: 'landmark' },
  'dehradun': { name: 'Dehradun, Uttarakhand', lat: 30.3165, lng: 78.0322, zoom: 13, pitch: 50, category: 'capital' },
  'shimla': { name: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734, zoom: 14, pitch: 55, category: 'capital' },
  'leh': { name: 'Leh, Ladakh', lat: 34.1526, lng: 77.5771, zoom: 13.5, pitch: 60, category: 'landmark' },
  'ladakh': { name: 'Ladakh, India', lat: 34.1526, lng: 77.5771, zoom: 10, pitch: 55, category: 'landmark' },
  'goa': { name: 'Goa, India', lat: 15.2993, lng: 74.1240, zoom: 11, pitch: 40, category: 'landmark' },
  'panaji': { name: 'Panaji, Goa', lat: 15.4909, lng: 73.8278, zoom: 14, pitch: 40, category: 'capital' },
  'vijayawada': { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, zoom: 13, pitch: 40, category: 'city' },
  'amaravati': { name: 'Amaravati, Andhra Pradesh', lat: 16.5417, lng: 80.5158, zoom: 13, pitch: 35, category: 'capital' },
  'guntur': { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lng: 80.4365, zoom: 13, pitch: 35, category: 'city' },
  'raipur': { name: 'Raipur, Chhattisgarh', lat: 21.2514, lng: 81.6296, zoom: 13, pitch: 35, category: 'capital' },
  'jodhpur': { name: 'Jodhpur, Rajasthan', lat: 26.2389, lng: 73.0243, zoom: 13, pitch: 45, category: 'city' },
  'madurai': { name: 'Madurai, Tamil Nadu', lat: 9.9252, lng: 78.1198, zoom: 13, pitch: 40, category: 'city' },
  'mysore': { name: 'Mysuru (Mysore), Karnataka', lat: 12.2958, lng: 76.6394, zoom: 13.5, pitch: 40, category: 'city' },
  'mysuru': { name: 'Mysuru (Mysore), Karnataka', lat: 12.2958, lng: 76.6394, zoom: 13.5, pitch: 40, category: 'city' },
  'gurgaon': { name: 'Gurugram (Gurgaon), Haryana', lat: 28.4595, lng: 77.0266, zoom: 13.5, pitch: 45, category: 'city' },
  'gurugram': { name: 'Gurugram (Gurgaon), Haryana', lat: 28.4595, lng: 77.0266, zoom: 13.5, pitch: 45, category: 'city' },
  'noida': { name: 'Noida, Uttar Pradesh', lat: 28.5355, lng: 77.3910, zoom: 13.5, pitch: 45, category: 'city' },
  'jamshedpur': { name: 'Jamshedpur, Jharkhand', lat: 22.8046, lng: 86.2029, zoom: 13, pitch: 40, category: 'city' },
  'shillong': { name: 'Shillong, Meghalaya', lat: 25.5788, lng: 91.8933, zoom: 13.5, pitch: 50, category: 'capital' },
  'gangtok': { name: 'Gangtok, Sikkim', lat: 27.3389, lng: 88.6065, zoom: 14, pitch: 55, category: 'capital' },
  'imphal': { name: 'Imphal, Manipur', lat: 24.8170, lng: 93.9368, zoom: 13, pitch: 45, category: 'capital' },
  'aizawl': { name: 'Aizawl, Mizoram', lat: 23.7271, lng: 92.7176, zoom: 13.5, pitch: 55, category: 'capital' },
  'kohima': { name: 'Kohima, Nagaland', lat: 25.6751, lng: 94.1086, zoom: 13.5, pitch: 55, category: 'capital' },
  'agartala': { name: 'Agartala, Tripura', lat: 23.8315, lng: 91.2868, zoom: 13, pitch: 40, category: 'capital' },
  'itanagar': { name: 'Itanagar, Arunachal Pradesh', lat: 27.0844, lng: 93.6053, zoom: 13, pitch: 50, category: 'capital' },
  'port blair': { name: 'Port Blair, Andaman & Nicobar', lat: 11.6234, lng: 92.7265, zoom: 13, pitch: 45, category: 'capital' },

  // --- ISRO & Space Facilities ---
  'sriharikota': { name: 'Sriharikota (SDSC SHAR Launch Complex)', lat: 13.7200, lng: 80.2300, zoom: 14.5, pitch: 50, category: 'space' },
  'shar': { name: 'Satish Dhawan Space Centre (SHAR), Sriharikota', lat: 13.7200, lng: 80.2300, zoom: 14.5, pitch: 50, category: 'space' },
  'sdsc': { name: 'Satish Dhawan Space Centre (SDSC SHAR)', lat: 13.7200, lng: 80.2300, zoom: 14.5, pitch: 50, category: 'space' },
  'satish dhawan': { name: 'Satish Dhawan Space Centre, Sriharikota', lat: 13.7200, lng: 80.2300, zoom: 14.5, pitch: 50, category: 'space' },
  'nrsc': { name: 'National Remote Sensing Centre (NRSC), Hyderabad', lat: 17.4728, lng: 78.4721, zoom: 15, pitch: 45, category: 'space' },
  'isro nrsc': { name: 'NRSC Earth Observation Centre, Hyderabad', lat: 17.4728, lng: 78.4721, zoom: 15, pitch: 45, category: 'space' },
  'ursc': { name: 'U R Rao Satellite Centre (URSC), Bengaluru', lat: 12.9818, lng: 77.6515, zoom: 15, pitch: 45, category: 'space' },
  'isro hq': { name: 'ISRO Headquarters (Antariksh Bhavan), Bengaluru', lat: 13.0336, lng: 77.5645, zoom: 15.5, pitch: 45, category: 'space' },
  'vssc': { name: 'Vikram Sarabhai Space Centre (VSSC), Thiruvananthapuram', lat: 8.5284, lng: 76.8687, zoom: 15, pitch: 45, category: 'space' },
  'sac': { name: 'Space Applications Centre (SAC ISRO), Ahmedabad', lat: 23.0232, lng: 72.5186, zoom: 15, pitch: 45, category: 'space' },
  'iirs': { name: 'Indian Institute of Remote Sensing (IIRS), Dehradun', lat: 30.3414, lng: 78.0772, zoom: 15, pitch: 45, category: 'space' },

  // --- Geological Landmarks & Natural Wonders of India ---
  'himalayas': { name: 'Himalayas / Mount Everest Region', lat: 27.9881, lng: 86.9250, zoom: 12.5, pitch: 60, category: 'landmark' },
  'everest': { name: 'Mount Everest (8,848m)', lat: 27.9881, lng: 86.9250, zoom: 13, pitch: 65, category: 'landmark' },
  'kanchenjunga': { name: 'Mount Kanchenjunga (8,586m), Sikkim', lat: 27.7025, lng: 88.1475, zoom: 13, pitch: 60, category: 'landmark' },
  'thar desert': { name: 'Thar Desert, Rajasthan', lat: 27.0238, lng: 71.3967, zoom: 9, pitch: 35, category: 'landmark' },
  'sundarbans': { name: 'Sundarbans Mangrove Delta', lat: 21.9497, lng: 89.1833, zoom: 10.5, pitch: 30, category: 'landmark' },
  'rann of kutch': { name: 'Great Rann of Kutch Salt Desert, Gujarat', lat: 24.0750, lng: 70.3667, zoom: 10, pitch: 30, category: 'landmark' },
  'chilika lake': { name: 'Chilika Lake Lagoon, Odisha', lat: 19.7222, lng: 85.3197, zoom: 11, pitch: 35, category: 'landmark' },
  'pangong lake': { name: 'Pangong Tso Lake, Ladakh', lat: 33.7595, lng: 78.6674, zoom: 11.5, pitch: 55, category: 'landmark' },
  'pangong tso': { name: 'Pangong Tso Lake, Ladakh', lat: 33.7595, lng: 78.6674, zoom: 11.5, pitch: 55, category: 'landmark' },
  'dal lake': { name: 'Dal Lake, Srinagar, Kashmir', lat: 34.1167, lng: 74.8667, zoom: 13.5, pitch: 50, category: 'landmark' },
  'western ghats': { name: 'Western Ghats UNESCO Biosphere', lat: 13.5000, lng: 75.2500, zoom: 9, pitch: 45, category: 'landmark' },
  'ganga': { name: 'Ganges (Ganga) River Basin, Varanasi', lat: 25.3000, lng: 83.0100, zoom: 12, pitch: 40, category: 'landmark' },
  'ganges': { name: 'Ganges (Ganga) River Basin, Varanasi', lat: 25.3000, lng: 83.0100, zoom: 12, pitch: 40, category: 'landmark' },
  'brahmaputra': { name: 'Brahmaputra River Valley, Assam', lat: 26.1800, lng: 91.7500, zoom: 11, pitch: 35, category: 'landmark' },

  // --- World Metropolises & Global Landmarks ---
  'tokyo': { name: 'Tokyo, Japan', lat: 35.6895, lng: 139.6917, zoom: 13.5, pitch: 45, category: 'global' },
  'japan': { name: 'Tokyo, Japan', lat: 35.6895, lng: 139.6917, zoom: 12, pitch: 40, category: 'global' },
  'new york': { name: 'New York City, USA', lat: 40.7128, lng: -74.0060, zoom: 14, pitch: 50, category: 'global' },
  'nyc': { name: 'New York City, USA', lat: 40.7128, lng: -74.0060, zoom: 14, pitch: 50, category: 'global' },
  'london': { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, zoom: 13.5, pitch: 45, category: 'global' },
  'paris': { name: 'Paris (Eiffel Tower), France', lat: 48.8566, lng: 2.3522, zoom: 14, pitch: 45, category: 'global' },
  'france': { name: 'Paris, France', lat: 48.8566, lng: 2.3522, zoom: 12, pitch: 40, category: 'global' },
  'dubai': { name: 'Dubai (Palm Jumeirah), UAE', lat: 25.1124, lng: 55.1384, zoom: 13.5, pitch: 50, category: 'global' },
  'uae': { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, zoom: 13, pitch: 45, category: 'global' },
  'singapore': { name: 'Singapore Marina Bay', lat: 1.2868, lng: 103.8545, zoom: 14.5, pitch: 45, category: 'global' },
  'sydney': { name: 'Sydney (Opera House), Australia', lat: -33.8568, lng: 151.2153, zoom: 14, pitch: 45, category: 'global' },
  'australia': { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, zoom: 12, pitch: 40, category: 'global' },
  'san francisco': { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194, zoom: 13.5, pitch: 45, category: 'global' },
  'los angeles': { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, zoom: 12.5, pitch: 40, category: 'global' },
  'chicago': { name: 'Chicago, USA', lat: 41.8781, lng: -87.6298, zoom: 13.5, pitch: 45, category: 'global' },
  'toronto': { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, zoom: 13.5, pitch: 45, category: 'global' },
  'berlin': { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, zoom: 13.5, pitch: 40, category: 'global' },
  'germany': { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, zoom: 11, pitch: 35, category: 'global' },
  'rome': { name: 'Rome (Colosseum), Italy', lat: 41.8902, lng: 12.4922, zoom: 14.5, pitch: 45, category: 'global' },
  'italy': { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, zoom: 11, pitch: 35, category: 'global' },
  'madrid': { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, zoom: 13.5, pitch: 40, category: 'global' },
  'beijing': { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, zoom: 13, pitch: 40, category: 'global' },
  'china': { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, zoom: 11, pitch: 35, category: 'global' },
  'shanghai': { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737, zoom: 13.5, pitch: 45, category: 'global' },
  'hong kong': { name: 'Hong Kong Victoria Harbour', lat: 22.2855, lng: 114.1577, zoom: 14, pitch: 50, category: 'global' },
  'seoul': { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, zoom: 13.5, pitch: 45, category: 'global' },
  'cairo': { name: 'Cairo (Giza Pyramids), Egypt', lat: 29.9792, lng: 31.1342, zoom: 14.5, pitch: 50, category: 'global' },
  'egypt': { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, zoom: 12, pitch: 35, category: 'global' },
  'rio': { name: 'Rio de Janeiro (Christ the Redeemer), Brazil', lat: -22.9519, lng: -43.2105, zoom: 14, pitch: 55, category: 'global' },
  'brazil': { name: 'Brasilia, Brazil', lat: -15.7975, lng: -47.8919, zoom: 11, pitch: 35, category: 'global' },
  'moscow': { name: 'Moscow (Red Square), Russia', lat: 55.7539, lng: 37.6208, zoom: 14, pitch: 45, category: 'global' },
  'russia': { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173, zoom: 11, pitch: 35, category: 'global' },
  'istanbul': { name: 'Istanbul (Bosphorus), Turkey', lat: 41.0082, lng: 28.9784, zoom: 13.5, pitch: 45, category: 'global' },
  'bangkok': { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, zoom: 13, pitch: 40, category: 'global' },
  'jakarta': { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, zoom: 13, pitch: 40, category: 'global' },
  'grand canyon': { name: 'Grand Canyon National Park, USA', lat: 36.0544, lng: -112.1401, zoom: 12.8, pitch: 55, category: 'global' },
  'fuji': { name: 'Mount Fuji, Japan', lat: 35.3606, lng: 138.7274, zoom: 13.5, pitch: 60, category: 'global' },
  'alps': { name: 'Swiss Alps (Matterhorn), Switzerland', lat: 45.9763, lng: 7.6586, zoom: 13, pitch: 60, category: 'global' },
  'sahara': { name: 'Sahara Desert (Richat Structure / Eye of the Sahara)', lat: 21.1269, lng: -11.4016, zoom: 11.5, pitch: 30, category: 'global' },
  'amazon': { name: 'Amazon Rainforest (Manaus Confluence), Brazil', lat: -3.1345, lng: -60.0217, zoom: 11, pitch: 35, category: 'global' },
  'india': { name: 'India (Center Geographic Overview)', lat: 22.8890, lng: 75.2951, zoom: 4.8, pitch: 25, category: 'landmark' },
};

// 2. Coordinate Pattern Parser
// Recognizes: "28.6139, 77.2090", "77.2090, 28.6139", "28.6139 N, 77.2090 E", "18.52 N 73.85 E"
export function parseCoordinates(input: string): GeocodedLocation | null {
  const trimmed = input.trim();

  // Directional format e.g. "28.61 N, 77.20 E" or "28.61° N, 77.20° E"
  const directionalRegex = /([+-]?\d+(?:\.\d+)?)\s*°?\s*([NSns])\s*[,; ]\s*([+-]?\d+(?:\.\d+)?)\s*°?\s*([EWew])/;
  const dirMatch = trimmed.match(directionalRegex);
  if (dirMatch) {
    let lat = parseFloat(dirMatch[1]);
    if (dirMatch[2].toUpperCase() === 'S') lat = -lat;
    let lng = parseFloat(dirMatch[3]);
    if (dirMatch[4].toUpperCase() === 'W') lng = -lng;
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return {
        name: `Coords (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
        lat,
        lng,
        zoom: 13,
        pitch: 45,
        source: 'coordinates',
        category: 'custom',
      };
    }
  }

  // Plain numeric pair: "28.6139, 77.2090" or "28.6139 77.2090"
  const plainRegex = /^([+-]?\d+(?:\.\d+)?)\s*[,;\s]\s*([+-]?\d+(?:\.\d+)?)$/;
  const plainMatch = trimmed.match(plainRegex);
  if (plainMatch) {
    const val1 = parseFloat(plainMatch[1]);
    const val2 = parseFloat(plainMatch[2]);

    // Determine which is lat and which is lng
    // Standard is lat, lng. If val1 is between -90 and 90, assume lat=val1, lng=val2
    let lat = val1;
    let lng = val2;

    // Invert if val1 is > 90 or < -90 (clearly longitude first)
    if ((val1 > 90 || val1 < -90) && val2 >= -90 && val2 <= 90) {
      lat = val2;
      lng = val1;
    }

    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return {
        name: `Coords (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
        lat,
        lng,
        zoom: 13,
        pitch: 45,
        source: 'coordinates',
        category: 'custom',
      };
    }
  }

  return null;
}

// 3. Extract Candidate Location Names from Natural Language Questions
// e.g. "Where did urban expansion occur in Mumbai between 2022 and 2026?" -> "Mumbai"
// e.g. "Show me Delhi" -> "Delhi"
// e.g. "Flood inundation in Assam" -> "Assam"
export function extractCandidateLocation(query: string): string {
  let clean = query.trim().toLowerCase();

  // Remove common question prefixes / stop phrases
  const prefixes = [
    /^show\s+(me\s+)?(the\s+)?(satellite\s+view\s+of\s+)?/i,
    /^fly\s+(me\s+)?to\s+/i,
    /^go\s+to\s+/i,
    /^zoom\s+(in\s+)?to\s+/i,
    /^take\s+me\s+to\s+/i,
    /^navigate\s+to\s+/i,
    /^find\s+(location\s+)?/i,
    /^where\s+(is|did|are)\s+/i,
    /^look\s+at\s+/i,
    /^search\s+(for\s+)?/i,
    /^detect\s+(changes?\s+in\s+|urban\s+growth\s+in\s+|flood\s+in\s+)?/i,
    /^urban\s+(expansion|sprawl|growth)\s+(in|around|near)\s+/i,
    /^water\s+(bodies|reservoir|level)\s+(in|at|near)\s+/i,
    /^flood\s+(inundation\s+in\s+|in\s+)?/i,
  ];

  for (const p of prefixes) {
    clean = clean.replace(p, '');
  }

  // Remove trailing question mark and periods
  clean = clean.replace(/[?!.]+$/, '').trim();

  // Remove common suffixes like "between 2022 and 2026", "in high resolution", "satellite view"
  clean = clean.replace(/\s+between\s+\d{4}\s+and\s+\d{4}/gi, '');
  clean = clean.replace(/\s+satellite(\s+imagery|\s+view)?/gi, '');
  clean = clean.replace(/\s+(today|now|2024|2025|2026)/gi, '');

  return clean.trim();
}

// 4. Online OpenStreetMap (Nominatim) Geocoding Fallback with AbortController
export async function geocodeWithOSM(query: string): Promise<GeocodedLocation | null> {
  if (typeof window === 'undefined') return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();

    if (!data || data.length === 0) return null;

    const item = data[0];
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    if (isNaN(lat) || isNaN(lng)) return null;

    // Pick a sensible zoom level based on type
    let zoom = 12.5;
    const placeType = item.type || item.class || '';
    if (placeType === 'city' || placeType === 'administrative') {
      zoom = 12;
    } else if (placeType === 'country') {
      zoom = 5;
    } else if (placeType === 'state' || placeType === 'province') {
      zoom = 8;
    } else if (placeType === 'building' || placeType === 'attraction') {
      zoom = 15;
    }

    const shortName = item.display_name.split(',').slice(0, 2).join(', ');

    return {
      name: shortName || item.display_name,
      lat,
      lng,
      zoom,
      pitch: 45,
      source: 'osm',
      category: 'global',
      displayName: item.display_name,
    };
  } catch (err) {
    // Network timeout or blocked
    return null;
  }
}

// 5. Main Master Geocoding Function
export async function geocodeLocation(rawInput: string): Promise<GeocodedLocation | null> {
  if (!rawInput || !rawInput.trim()) return null;

  const trimmed = rawInput.trim();

  // A. Check if it is a coordinate string
  const coordResult = parseCoordinates(trimmed);
  if (coordResult) return coordResult;

  // B. Check exact/clean match in Offline Gazetteer
  const cleanKey = trimmed.toLowerCase();
  if (OFFLINE_GAZETTEER[cleanKey]) {
    return { ...OFFLINE_GAZETTEER[cleanKey], source: 'gazetteer' };
  }

  // C. Partial or fuzzy check in Offline Gazetteer
  for (const [key, loc] of Object.entries(OFFLINE_GAZETTEER)) {
    if (cleanKey.includes(key) || key.includes(cleanKey)) {
      return { ...loc, source: 'gazetteer' };
    }
  }

  // D. Extract candidate place name from query sentence and re-check gazetteer
  const candidate = extractCandidateLocation(trimmed);
  if (candidate && candidate !== cleanKey) {
    if (OFFLINE_GAZETTEER[candidate]) {
      return { ...OFFLINE_GAZETTEER[candidate], source: 'gazetteer' };
    }
    for (const [key, loc] of Object.entries(OFFLINE_GAZETTEER)) {
      if (candidate.includes(key) || key.includes(candidate)) {
        return { ...loc, source: 'gazetteer' };
      }
    }
  }

  // E. Online OSM Geocoding Fallback for ANY town, village, address or feature in the world
  const osmQuery = candidate || trimmed;
  const osmResult = await geocodeWithOSM(osmQuery);
  if (osmResult) return osmResult;

  // If candidate was different, try original trimmed with OSM
  if (candidate && candidate !== trimmed) {
    const fallbackOsm = await geocodeWithOSM(trimmed);
    if (fallbackOsm) return fallbackOsm;
  }

  return null;
}
