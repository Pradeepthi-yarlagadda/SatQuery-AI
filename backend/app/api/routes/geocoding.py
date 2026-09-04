"""
Backend Geocoding & Spatial Location Intelligence Router
Provides offline gazetteer for Indian and global cities, ISRO facilities,
flexible coordinate parsing, and OpenStreetMap Nominatim fallback.
"""

import re
import urllib.request
import urllib.parse
import json
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(tags=["Geocoding"])


class GeocodeRequest(BaseModel):
    query: str


class GeocodeResponse(BaseModel):
    success: bool
    query: str
    name: str
    lat: float
    lng: float
    zoom: float = 13.0
    pitch: float = 45.0
    bearing: float = 0.0
    source: str = "gazetteer"
    category: str = "city"
    coordinates_str: str = ""
    bounding_box: Optional[List[float]] = None
    message: Optional[str] = None


# Comprehensive Offline Gazetteer
BACKEND_GAZETTEER: Dict[str, Dict[str, Any]] = {
    # Andhra Pradesh & Telangana
    "guntur": {
        "name": "Guntur, Andhra Pradesh",
        "lat": 16.3067,
        "lng": 80.4365,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city",
        "bounding_box": [80.35, 16.25, 80.52, 16.36]
    },
    "amaravati": {
        "name": "Amaravati, Andhra Pradesh",
        "lat": 16.5417,
        "lng": 80.5158,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "capital",
        "bounding_box": [80.45, 16.48, 80.58, 16.60]
    },
    "vijayawada": {
        "name": "Vijayawada, Andhra Pradesh",
        "lat": 16.5062,
        "lng": 80.6480,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "city",
        "bounding_box": [80.55, 16.45, 80.75, 16.58]
    },
    "hyderabad": {
        "name": "Hyderabad, Telangana",
        "lat": 17.3850,
        "lng": 78.4867,
        "zoom": 14.0,
        "pitch": 45.0,
        "category": "metro",
        "bounding_box": [78.35, 17.25, 78.60, 17.50]
    },
    "visakhapatnam": {
        "name": "Visakhapatnam, Andhra Pradesh",
        "lat": 17.6868,
        "lng": 83.2185,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "city"
    },
    "vizag": {
        "name": "Visakhapatnam, Andhra Pradesh",
        "lat": 17.6868,
        "lng": 83.2185,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "city"
    },
    "tirupati": {
        "name": "Tirupati, Andhra Pradesh",
        "lat": 13.6288,
        "lng": 79.4192,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "city"
    },
    "kurnool": {
        "name": "Kurnool, Andhra Pradesh",
        "lat": 15.8281,
        "lng": 78.0373,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city"
    },
    "nellore": {
        "name": "Nellore, Andhra Pradesh",
        "lat": 14.4426,
        "lng": 79.9865,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city"
    },
    "kakinada": {
        "name": "Kakinada, Andhra Pradesh",
        "lat": 16.9891,
        "lng": 82.2475,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city"
    },
    "rajahmundry": {
        "name": "Rajahmundry, Andhra Pradesh",
        "lat": 17.0005,
        "lng": 81.8040,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city"
    },
    "kadapa": {
        "name": "Kadapa, Andhra Pradesh",
        "lat": 14.4673,
        "lng": 78.8242,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city"
    },
    "anantapur": {
        "name": "Anantapur, Andhra Pradesh",
        "lat": 14.6819,
        "lng": 77.6006,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "city"
    },

    # ISRO Facilities
    "sriharikota": {
        "name": "Sriharikota (SDSC SHAR Launch Complex)",
        "lat": 13.7200,
        "lng": 80.2300,
        "zoom": 14.5,
        "pitch": 50.0,
        "category": "space"
    },
    "shar": {
        "name": "Satish Dhawan Space Centre (SHAR), Sriharikota",
        "lat": 13.7200,
        "lng": 80.2300,
        "zoom": 14.5,
        "pitch": 50.0,
        "category": "space"
    },
    "sdsc": {
        "name": "Satish Dhawan Space Centre (SDSC SHAR)",
        "lat": 13.7200,
        "lng": 80.2300,
        "zoom": 14.5,
        "pitch": 50.0,
        "category": "space"
    },
    "nrsc": {
        "name": "National Remote Sensing Centre (NRSC), Hyderabad",
        "lat": 17.4728,
        "lng": 78.4721,
        "zoom": 15.0,
        "pitch": 45.0,
        "category": "space"
    },
    "ursc": {
        "name": "U R Rao Satellite Centre (URSC), Bengaluru",
        "lat": 12.9818,
        "lng": 77.6515,
        "zoom": 15.0,
        "pitch": 45.0,
        "category": "space"
    },
    "sac": {
        "name": "Space Applications Centre (SAC ISRO), Ahmedabad",
        "lat": 23.0232,
        "lng": 72.5186,
        "zoom": 15.0,
        "pitch": 45.0,
        "category": "space"
    },
    "vssc": {
        "name": "Vikram Sarabhai Space Centre (VSSC), Thiruvananthapuram",
        "lat": 8.5284,
        "lng": 76.8687,
        "zoom": 15.0,
        "pitch": 45.0,
        "category": "space"
    },
    "iirs": {
        "name": "Indian Institute of Remote Sensing (IIRS), Dehradun",
        "lat": 30.3414,
        "lng": 78.0772,
        "zoom": 15.0,
        "pitch": 45.0,
        "category": "space"
    },

    # Indian Metros & Capitals
    "delhi": {
        "name": "New Delhi, India",
        "lat": 28.6139,
        "lng": 77.2090,
        "zoom": 13.0,
        "pitch": 45.0,
        "category": "capital"
    },
    "new delhi": {
        "name": "New Delhi, India",
        "lat": 28.6139,
        "lng": 77.2090,
        "zoom": 13.0,
        "pitch": 45.0,
        "category": "capital"
    },
    "mumbai": {
        "name": "Mumbai, Maharashtra",
        "lat": 18.9220,
        "lng": 72.8347,
        "zoom": 13.0,
        "pitch": 45.0,
        "category": "metro"
    },
    "bengaluru": {
        "name": "Bengaluru, Karnataka",
        "lat": 12.9716,
        "lng": 77.5946,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "metro"
    },
    "bangalore": {
        "name": "Bengaluru, Karnataka",
        "lat": 12.9716,
        "lng": 77.5946,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "metro"
    },
    "chennai": {
        "name": "Chennai, Tamil Nadu",
        "lat": 13.0827,
        "lng": 80.2707,
        "zoom": 13.0,
        "pitch": 45.0,
        "category": "metro"
    },
    "kolkata": {
        "name": "Kolkata, West Bengal",
        "lat": 22.5726,
        "lng": 88.3639,
        "zoom": 13.0,
        "pitch": 45.0,
        "category": "metro"
    },
    "ahmedabad": {
        "name": "Ahmedabad, Gujarat",
        "lat": 23.0225,
        "lng": 72.5714,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "metro"
    },
    "pune": {
        "name": "Pune, Maharashtra",
        "lat": 18.5204,
        "lng": 73.8567,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "metro"
    },
    "jaipur": {
        "name": "Jaipur, Rajasthan",
        "lat": 26.9124,
        "lng": 75.7873,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "capital"
    },
    "lucknow": {
        "name": "Lucknow, Uttar Pradesh",
        "lat": 26.8467,
        "lng": 80.9462,
        "zoom": 13.5,
        "pitch": 40.0,
        "category": "capital"
    },
    "himalayas": {
        "name": "Himalayas / Mount Everest Region",
        "lat": 27.9881,
        "lng": 86.9250,
        "zoom": 12.5,
        "pitch": 60.0,
        "category": "landmark"
    },
    "thar desert": {
        "name": "Thar Desert, Rajasthan",
        "lat": 27.0238,
        "lng": 71.3967,
        "zoom": 9.0,
        "pitch": 35.0,
        "category": "landmark"
    },
    "sundarbans": {
        "name": "Sundarbans Mangrove Delta",
        "lat": 21.9497,
        "lng": 89.1833,
        "zoom": 10.5,
        "pitch": 30.0,
        "category": "landmark"
    },

    # Global Landmarks
    "tokyo": {
        "name": "Tokyo, Japan",
        "lat": 35.6895,
        "lng": 139.6917,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "global"
    },
    "new york": {
        "name": "New York City, USA",
        "lat": 40.7128,
        "lng": -74.0060,
        "zoom": 14.0,
        "pitch": 50.0,
        "category": "global"
    },
    "london": {
        "name": "London, United Kingdom",
        "lat": 51.5074,
        "lng": -0.1278,
        "zoom": 13.5,
        "pitch": 45.0,
        "category": "global"
    },
    "paris": {
        "name": "Paris, France",
        "lat": 48.8566,
        "lng": 2.3522,
        "zoom": 14.0,
        "pitch": 40.0,
        "category": "global"
    },
    "dubai": {
        "name": "Dubai (Palm Jumeirah), UAE",
        "lat": 25.1124,
        "lng": 55.1384,
        "zoom": 13.5,
        "pitch": 50.0,
        "category": "global"
    },
    "india": {
        "name": "India (Geographic Center)",
        "lat": 22.8890,
        "lng": 75.2951,
        "zoom": 4.8,
        "pitch": 25.0,
        "category": "landmark"
    }
}


def parse_coordinates(raw_query: str) -> Optional[Dict[str, Any]]:
    """Ultra-flexible coordinate parser handling brackets, prefixes, directions, and decimals."""
    text = raw_query.strip()

    # Clean off labels like "coordinates:", "coords:", "lat:", "lng:", brackets "(", ")", "[", "]"
    cleaned = re.sub(r'^(coordinates|co-ordinates|coords|location)\s*[:=]?\s*', '', text, flags=re.I)
    cleaned = cleaned.strip('()[]{}')

    # Directional e.g. "16.3067 N, 80.4365 E" or "80.4365 E, 16.3067 N"
    dir_match_lat_first = re.search(
        r'([+-]?\d+(?:\.\d+)?)\s*°?\s*([NS])\s*[,; ]\s*([+-]?\d+(?:\.\d+)?)\s*°?\s*([EW])',
        cleaned,
        re.I
    )
    if dir_match_lat_first:
        lat = float(dir_match_lat_first.group(1))
        if dir_match_lat_first.group(2).upper() == 'S':
            lat = -lat
        lng = float(dir_match_lat_first.group(3))
        if dir_match_lat_first.group(4).upper() == 'W':
            lng = -lng
        if -90 <= lat <= 90 and -180 <= lng <= 180:
            return {
                "name": f"Coordinates ({abs(lat):.4f}° {'N' if lat>=0 else 'S'}, {abs(lng):.4f}° {'E' if lng>=0 else 'W'})",
                "lat": lat,
                "lng": lng,
                "zoom": 13.5,
                "pitch": 45.0,
                "source": "coordinates",
                "category": "custom"
            }

    dir_match_lng_first = re.search(
        r'([+-]?\d+(?:\.\d+)?)\s*°?\s*([EW])\s*[,; ]\s*([+-]?\d+(?:\.\d+)?)\s*°?\s*([NS])',
        cleaned,
        re.I
    )
    if dir_match_lng_first:
        lng = float(dir_match_lng_first.group(1))
        if dir_match_lng_first.group(2).upper() == 'W':
            lng = -lng
        lat = float(dir_match_lng_first.group(3))
        if dir_match_lng_first.group(4).upper() == 'S':
            lat = -lat
        if -90 <= lat <= 90 and -180 <= lng <= 180:
            return {
                "name": f"Coordinates ({abs(lat):.4f}° {'N' if lat>=0 else 'S'}, {abs(lng):.4f}° {'E' if lng>=0 else 'W'})",
                "lat": lat,
                "lng": lng,
                "zoom": 13.5,
                "pitch": 45.0,
                "source": "coordinates",
                "category": "custom"
            }

    # Match any two floating-point numbers in the string
    numbers = re.findall(r'[-+]?\d+\.\d+|[-+]?\d+', cleaned)
    if len(numbers) >= 2:
        val1 = float(numbers[0])
        val2 = float(numbers[1])

        # Standard is lat, lng. If val1 is outside [-90, 90] but val2 is within, invert
        lat, lng = val1, val2
        if (val1 > 90 or val1 < -90) and (-90 <= val2 <= 90):
            lat, lng = val2, val1

        if -90 <= lat <= 90 and -180 <= lng <= 180:
            return {
                "name": f"Coordinates ({abs(lat):.4f}° {'N' if lat>=0 else 'S'}, {abs(lng):.4f}° {'E' if lng>=0 else 'W'})",
                "lat": lat,
                "lng": lng,
                "zoom": 13.5,
                "pitch": 45.0,
                "source": "coordinates",
                "category": "custom"
            }

    return None


def extract_candidate_location(raw_query: str) -> str:
    """Strips natural language noise to isolate place name."""
    clean = raw_query.strip().lower()

    prefixes = [
        r"^show\s+(me\s+)?(the\s+)?(satellite\s+view\s+of\s+)?",
        r"^fly\s+(me\s+)?to\s+",
        r"^go\s+to\s+",
        r"^zoom\s+(in\s+)?to\s+",
        r"^take\s+me\s+to\s+",
        r"^navigate\s+to\s+",
        r"^find\s+(location\s+)?",
        r"^where\s+(is|did|are)\s+",
        r"^look\s+at\s+",
        r"^search\s+(for\s+)?",
        r"^coordinates\s+of\s+",
        r"^co-ordinates\s+of\s+",
        r"^detect\s+(changes?\s+in\s+|urban\s+growth\s+in\s+|flood\s+in\s+)?",
        r"^urban\s+(expansion|sprawl|growth)\s+(in|around|near)\s+",
        r"^water\s+(bodies|reservoir|level)\s+(in|at|near)\s+",
        r"^flood\s+(inundation\s+in\s+|in\s+)?",
    ]

    for p in prefixes:
        clean = re.sub(p, "", clean, flags=re.I)

    clean = re.sub(r"[?!.]+$", "", clean).strip()
    clean = re.sub(r"\s+between\s+\d{4}\s+and\s+\d{4}", "", clean, flags=re.I)
    clean = re.sub(r"\s+satellite(\s+imagery|\s+view)?", "", clean, flags=re.I)
    clean = re.sub(r"\s+(city|town|district|ap|andhra pradesh|india)", "", clean, flags=re.I).strip()

    return clean.strip()


def geocode_with_osm(query_str: str) -> Optional[Dict[str, Any]]:
    """OpenStreetMap Nominatim fallback with timeout."""
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(query_str)}&format=json&limit=1&addressdetails=1"
        req = urllib.request.Request(url, headers={"User-Agent": "SatQuery-AI-Geolocator/1.0 (isro-orbitiq)"})
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data and len(data) > 0:
                item = data[0]
                lat = float(item["lat"])
                lng = float(item["lon"])
                short_name = ", ".join(item.get("display_name", "").split(",")[:2])
                return {
                    "name": short_name or item.get("display_name", query_str),
                    "lat": lat,
                    "lng": lng,
                    "zoom": 13.0,
                    "pitch": 45.0,
                    "source": "osm",
                    "category": "global"
                }
    except Exception:
        pass
    return None


def resolve_location(query_str: str) -> Optional[Dict[str, Any]]:
    """Master location resolver."""
    trimmed = query_str.strip()
    if not trimmed:
        return None

    # Handle literal "coordinates" or "co-ordinates" query
    if trimmed.lower() in ["coordinates", "co-ordinates", "coords", "my coordinates", "current coordinates"]:
        return {
            "name": "Guntur & Amaravati Capital Region (Reference)",
            "lat": 16.3067,
            "lng": 80.4365,
            "zoom": 13.5,
            "pitch": 45.0,
            "source": "gazetteer",
            "category": "city",
            "message": "Displaying target reference coordinates for Guntur (16.3067° N, 80.4365° E)"
        }

    # 1. Coordinates check
    coord = parse_coordinates(trimmed)
    if coord:
        return coord

    # 2. Exact match in gazetteer
    clean = trimmed.lower()
    if clean in BACKEND_GAZETTEER:
        return {**BACKEND_GAZETTEER[clean], "source": "gazetteer"}

    # 3. Partial match in gazetteer
    for k, v in BACKEND_GAZETTEER.items():
        if k in clean or clean in k:
            return {**v, "source": "gazetteer"}

    # 4. Extract candidate place name
    candidate = extract_candidate_location(trimmed)
    if candidate:
        if candidate in BACKEND_GAZETTEER:
            return {**BACKEND_GAZETTEER[candidate], "source": "gazetteer"}
        for k, v in BACKEND_GAZETTEER.items():
            if k in candidate or candidate in k:
                return {**v, "source": "gazetteer"}

    # 5. OpenStreetMap Fallback
    target_osm = candidate if candidate else trimmed
    osm_res = geocode_with_osm(target_osm)
    if osm_res:
        return osm_res

    if candidate and candidate != trimmed:
        osm_fallback = geocode_with_osm(trimmed)
        if osm_fallback:
            return osm_fallback

    return None


@router.get("/v1/orbit-iq/geocode", response_model=GeocodeResponse)
@router.get("/api/v1/orbit-iq/geocode", response_model=GeocodeResponse)
def get_geocode(q: str = Query(..., description="Place name, landmark, or coordinates")):
    res = resolve_location(q)
    if not res:
        return GeocodeResponse(
            success=False,
            query=q,
            name=q,
            lat=22.8890,
            lng=75.2951,
            zoom=4.5,
            message=f"Location '{q}' could not be located. Try entering city name or coordinates (lat, lng)."
        )

    lat = res["lat"]
    lng = res["lng"]
    coords_str = f"{abs(lat):.4f}° {'N' if lat>=0 else 'S'}, {abs(lng):.4f}° {'E' if lng>=0 else 'W'}"

    return GeocodeResponse(
        success=True,
        query=q,
        name=res["name"],
        lat=lat,
        lng=lng,
        zoom=res.get("zoom", 13.0),
        pitch=res.get("pitch", 45.0),
        bearing=res.get("bearing", 0.0),
        source=res.get("source", "gazetteer"),
        category=res.get("category", "city"),
        coordinates_str=coords_str,
        bounding_box=res.get("bounding_box"),
        message=res.get("message")
    )


@router.post("/v1/orbit-iq/geocode", response_model=GeocodeResponse)
@router.post("/api/v1/orbit-iq/geocode", response_model=GeocodeResponse)
def post_geocode(body: GeocodeRequest):
    return get_geocode(q=body.query)
