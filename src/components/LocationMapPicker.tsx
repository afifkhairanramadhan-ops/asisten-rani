import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, Navigation, Compass, ExternalLink, Check, 
  Search, Layers, Info, CheckCircle2, Crosshair, Building2,
  MousePointerClick, LocateFixed, Sparkles, ZoomIn, ZoomOut, RotateCcw
} from "lucide-react";
import { NagariType, LocationGpsInfo } from "../types";
import { STRATEGIC_LOCATIONS_NAN_SABARIS, REGULATION_INFO } from "../data/presets";

interface LocationMapPickerProps {
  selectedNagari: NagariType;
  currentLocationName: string;
  onSelectLocation: (
    locationName: string, 
    nagari: NagariType, 
    gpsDisplay: string, 
    lat: number, 
    lng: number
  ) => void;
}

// Geographical bounding box for Kecamatan Nan Sabaris (Nagari Sunua Tengah & Sunua Barat)
const BOUNDS = {
  minLat: -0.7010, // Batas Selatan (Sunua Barat)
  maxLat: -0.6780, // Batas Utara (Pauh Kambar / KUA)
  minLng: 100.2100, // Batas Barat (Pesisir Pantai Sunua / Selat Mentawai)
  maxLng: 100.2390, // Batas Timur (Jl. Raya Pauh Kambar / Batang Ulakan)
};

// Convert Lat, Lng to percentage (X: 0..100%, Y: 0..100%)
function coordsToPercent(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(6, Math.min(94, y)),
  };
}

// Convert click percentage on container to real Lat, Lng
function percentToCoords(xPercent: number, yPercent: number): { lat: number; lng: number } {
  const lng = BOUNDS.minLng + (xPercent / 100) * (BOUNDS.maxLng - BOUNDS.minLng);
  const lat = BOUNDS.maxLat - (yPercent / 100) * (BOUNDS.maxLat - BOUNDS.minLat);
  return {
    lat: Number(lat.toFixed(5)),
    lng: Number(lng.toFixed(5)),
  };
}

// Smart locator for Nan Sabaris
function identifyNanSabarisLocation(lat: number, lng: number): {
  name: string;
  nagari: NagariType;
  closestLandmark?: typeof STRATEGIC_LOCATIONS_NAN_SABARIS[0];
  isDirectLandmark: boolean;
} {
  // Check distance to all strategic landmarks
  let closestDist = Infinity;
  let closestLandmark: typeof STRATEGIC_LOCATIONS_NAN_SABARIS[0] | undefined;

  for (const loc of STRATEGIC_LOCATIONS_NAN_SABARIS) {
    const dLat = loc.lat - lat;
    const dLng = loc.lng - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < closestDist) {
      closestDist = dist;
      closestLandmark = loc;
    }
  }

  // If very close to landmark (< ~140 meters)
  if (closestLandmark && closestDist < 0.0014) {
    return {
      name: closestLandmark.namaLokasi,
      nagari: closestLandmark.nagari,
      closestLandmark,
      isDirectLandmark: true,
    };
  }

  // If moderately close to landmark (< ~380 meters)
  if (closestLandmark && closestDist < 0.0036) {
    return {
      name: `Area ${closestLandmark.namaLokasi} (${closestLandmark.nagari})`,
      nagari: closestLandmark.nagari,
      closestLandmark,
      isDirectLandmark: false,
    };
  }

  // Geographically determine Nagari
  const isSunuaTengah = lng >= 100.2235 || lat >= -0.6905;
  const nagari: NagariType = isSunuaTengah ? "Nagari Sunua Tengah" : "Nagari Sunua Barat";

  // Determine Korong
  let korongName = "";
  if (isSunuaTengah) {
    if (lng > 100.2310) korongName = "Korong Simpang Sunua";
    else if (lat > -0.6860) korongName = "Korong Kampung Ladang";
    else korongName = "Korong Padang Pauh";
  } else {
    if (lng < 100.2145) korongName = "Korong Pesisir Pantai Sunua";
    else if (lat < -0.6955) korongName = "Korong Duku Manyang";
    else if (lng > 100.2205) korongName = "Korong Sungai Laban";
    else korongName = "Korong Pauh";
  }

  return {
    name: `Titik Binaan ${korongName} (${nagari})`,
    nagari,
    closestLandmark,
    isDirectLandmark: false,
  };
}

// Convert decimal degrees to Degree-Minute-Second string
function toDms(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  const absLat = Math.abs(lat);
  const absLng = Math.abs(lng);

  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = ((absLat - latDeg - latMin / 60) * 3600).toFixed(1);

  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);
  const lngSec = ((absLng - lngDeg - lngMin / 60) * 3600).toFixed(1);

  return `${latDeg}°${latMin}'${latSec}"${latDir} ${lngDeg}°${lngMin}'${lngSec}"${lngDir}`;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  selectedNagari,
  currentLocationName,
  onSelectLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Find initial matching location or fallback
  const initialLoc = STRATEGIC_LOCATIONS_NAN_SABARIS.find(
    (l) => l.namaLokasi.toLowerCase() === currentLocationName.toLowerCase() ||
           currentLocationName.toLowerCase().includes(l.namaLokasi.toLowerCase())
  ) || STRATEGIC_LOCATIONS_NAN_SABARIS.find((l) => l.nagari === selectedNagari) || STRATEGIC_LOCATIONS_NAN_SABARIS[1];

  const [activeLocId, setActiveLocId] = useState<string>(initialLoc.id);
  const [currentLat, setCurrentLat] = useState<number>(initialLoc.lat);
  const [currentLng, setCurrentLng] = useState<number>(initialLoc.lng);
  const [customLocationName, setCustomLocationName] = useState<string>(currentLocationName || initialLoc.namaLokasi);
  const [activeNagari, setActiveNagari] = useState<NagariType>(selectedNagari);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsNotice, setGpsNotice] = useState<{ type: "success" | "warning"; message: string } | null>({
    type: "success",
    message: `Peta siap digunakan. Klik titik manapun pada peta di bawah untuk langsung memasukkan lokasi ke formulir.`
  });
  const [showPermissionHelp, setShowPermissionHelp] = useState<boolean>(false);
  const [mapViewType, setMapViewType] = useState<"interactive" | "google_embed">("interactive");
  const [filterNagari, setFilterNagari] = useState<"all" | NagariType>(selectedNagari);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lng: number; x: number; y: number } | null>(null);

  // Sync if selectedNagari prop changes
  useEffect(() => {
    setActiveNagari(selectedNagari);
    setFilterNagari(selectedNagari);
  }, [selectedNagari]);

  // Sync if external currentLocationName prop changes
  useEffect(() => {
    if (currentLocationName && currentLocationName !== customLocationName) {
      setCustomLocationName(currentLocationName);
      const match = STRATEGIC_LOCATIONS_NAN_SABARIS.find(
        (l) => l.namaLokasi.toLowerCase() === currentLocationName.toLowerCase() ||
               currentLocationName.toLowerCase().includes(l.namaLokasi.toLowerCase())
      );
      if (match) {
        setActiveLocId(match.id);
        setCurrentLat(match.lat);
        setCurrentLng(match.lng);
      }
    }
  }, [currentLocationName]);

  // Direct Click on the Map Canvas
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    // Calculate real coordinates
    const coords = percentToCoords(xPercent, yPercent);
    const locInfo = identifyNanSabarisLocation(coords.lat, coords.lng);

    // Trigger visual pulse ripple
    setClickRipple({ x: clickX, y: clickY });
    setTimeout(() => setClickRipple(null), 900);

    // Update state
    setActiveLocId(locInfo.closestLandmark?.id || "custom-map-click");
    setCurrentLat(coords.lat);
    setCurrentLng(coords.lng);
    setCustomLocationName(locInfo.name);
    setActiveNagari(locInfo.nagari);

    const displayGps = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

    // Immediate confirmation notice
    setGpsNotice({
      type: "success",
      message: `✓ Lokasi langsung terpilih & masuk ke formulir: "${locInfo.name}" (${displayGps})`
    });

    // CRITICAL: Immediately send data to parent form so it enters the location field without extra clicks!
    onSelectLocation(locInfo.name, locInfo.nagari, displayGps, coords.lat, coords.lng);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const xPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (clickY / rect.height) * 100));
    const coords = percentToCoords(xPercent, yPercent);
    setHoverCoords({ ...coords, x: clickX, y: clickY });
  };

  const handleMouseLeave = () => {
    setHoverCoords(null);
  };

  // Picking a preset location directly
  const handlePickPreset = (loc: typeof STRATEGIC_LOCATIONS_NAN_SABARIS[0]) => {
    setActiveLocId(loc.id);
    setCurrentLat(loc.lat);
    setCurrentLng(loc.lng);
    setCustomLocationName(loc.namaLokasi);
    setActiveNagari(loc.nagari);
    setGpsNotice({
      type: "success",
      message: `✓ Titik binaan terpilih & masuk ke formulir: ${loc.namaLokasi} (${loc.displayGps})`
    });
    // Immediately send to parent form
    onSelectLocation(loc.namaLokasi, loc.nagari, loc.displayGps, loc.lat, loc.lng);
  };

  const handleQuickNagariCoord = (nagari: NagariType) => {
    const coord = REGULATION_INFO.coordinates[nagari];
    const lat = parseFloat(coord.lat);
    const lng = parseFloat(coord.lng);
    setActiveLocId(`nagari-${nagari}`);
    setCurrentLat(lat);
    setCurrentLng(lng);
    setActiveNagari(nagari);
    const locName = `Pusat Wilayah Binaan ${nagari}`;
    setCustomLocationName(locName);
    setGpsNotice({
      type: "success",
      message: `✓ Koordinat resmi ${nagari} berhasil diterapkan & masuk ke formulir: ${coord.display}`
    });
    onSelectLocation(locName, nagari, coord.display, lat, lng);
  };

  const handleCustomCoordinatesChange = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCurrentLat(lat);
      setCurrentLng(lng);
      const displayGps = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const locInfo = identifyNanSabarisLocation(lat, lng);
      setCustomLocationName(locInfo.name);
      setActiveNagari(locInfo.nagari);
      onSelectLocation(locInfo.name, locInfo.nagari, displayGps, lat, lng);
    }
  };

  // Browser Geolocation API
  const handleDetectDeviceGps = () => {
    if (!navigator.geolocation) {
      setGpsNotice({
        type: "warning",
        message: "Peramban tidak mendukung API Geolocation. Silakan klik langsung pada peta di bawah."
      });
      setShowPermissionHelp(true);
      return;
    }

    setIsDetectingGps(true);
    setGpsNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setCurrentLat(lat);
        setCurrentLng(lng);
        setActiveLocId("custom-gps");

        const displayGps = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const locInfo = identifyNanSabarisLocation(lat, lng);
        const autoName = locInfo.name || `Lokasi Binaan Nan Sabaris (GPS ±${Math.round(pos.coords.accuracy)}m)`;
        setCustomLocationName(autoName);
        setActiveNagari(locInfo.nagari);
        onSelectLocation(autoName, locInfo.nagari, displayGps, lat, lng);

        setGpsNotice({
          type: "success",
          message: `✓ GPS Riil Akurat: ${displayGps} (Akurasi: ±${Math.round(pos.coords.accuracy)}m) - otomatis masuk ke formulir!`
        });
        setShowPermissionHelp(false);
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn("Geolocation permission/error:", err);
        const defaultCoord = REGULATION_INFO.coordinates[activeNagari];
        setCurrentLat(parseFloat(defaultCoord.lat));
        setCurrentLng(parseFloat(defaultCoord.lng));
        const fallbackDisplay = defaultCoord.display;
        onSelectLocation(customLocationName || `Wilayah ${activeNagari}`, activeNagari, fallbackDisplay, parseFloat(defaultCoord.lat), parseFloat(defaultCoord.lng));

        let reason = "Izin lokasi GPS belum diaktifkan di peramban.";
        if (err.code === 1) {
          reason = "Izin akses lokasi ditolak/diblokir di peramban.";
        } else if (err.code === 2) {
          reason = "Perangkat tidak dapat menemukan sinyal posisi GPS saat ini.";
        } else if (err.code === 3) {
          reason = "Waktu pencarian sinyal GPS habis (timeout).";
        }

        setGpsNotice({
          type: "warning",
          message: `${reason} Anda bisa langsung mengklik titik lokasi pada peta di bawah.`
        });
        setShowPermissionHelp(true);
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Filter locations by nagari and search query
  const filteredLocations = STRATEGIC_LOCATIONS_NAN_SABARIS.filter((loc) => {
    const matchNagari = filterNagari === "all" || loc.nagari === filterNagari;
    const matchSearch = searchQuery === "" || 
      loc.namaLokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchNagari && matchSearch;
  });

  const displayGpsText = `${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}`;
  const dmsText = toDms(currentLat, currentLng);
  const currentPinPercent = coordsToPercent(currentLat, currentLng);
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${currentLat},${currentLng}&z=16&output=embed`;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/90 shadow-sm space-y-5">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <MapPin className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <span>Peta Interaktif Wilayah Binaan & GPS Satelit</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Klik Langsung di Peta
                </span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Klik titik manapun pada peta di bawah ini untuk <strong>langsung memilih dan memasukkan lokasi kegiatan</strong> ke formulir.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Map View Toggle */}
          <div className="inline-flex rounded-xl p-1 bg-stone-100 border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setMapViewType("interactive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                mapViewType === "interactive"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <MousePointerClick className="w-3.5 h-3.5 text-amber-300" />
              <span>Peta Klik Interaktif</span>
            </button>
            <button
              type="button"
              onClick={() => setMapViewType("google_embed")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                mapViewType === "google_embed"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>Satelit Google Maps</span>
            </button>
          </div>

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka titik koordinat ini langsung di Google Maps resmi"
            className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs border border-stone-300 transition-colors flex items-center space-x-1"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          </a>
        </div>
      </div>

      {/* Main Grid: Interactive Map vs Preset Location List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Map Viewer */}
        <div className="lg:col-span-7 space-y-3">
          {/* Interactive Map Visualizer Canvas */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-700/40 bg-stone-950 shadow-inner">
            {mapViewType === "google_embed" ? (
              <div className="aspect-video w-full h-[360px]">
                <iframe
                  title="Google Maps KUA Nan Sabaris"
                  src={googleMapsEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                ref={mapRef}
                onClick={handleMapClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-[360px] sm:h-[400px] bg-[#0c2419] overflow-hidden select-none cursor-crosshair group"
                title="Klik di mana saja pada peta ini untuk memilih lokasi kegiatan"
              >
                {/* Visual Terrain & Water Background */}
                {/* 1. Sea/Coast on West (Left side) */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[18%] bg-gradient-to-r from-sky-900 to-sky-800/80 border-r border-sky-400/30"
                  style={{ opacity: 0.85 }}
                >
                  <div className="absolute top-4 left-2 text-[9px] font-bold text-sky-200 uppercase tracking-widest -rotate-90 origin-top-left opacity-75">
                    Samudera Hindia
                  </div>
                  <div className="absolute bottom-6 left-2 text-[9px] text-sky-300 font-semibold">
                    Pantai Sunua
                  </div>
                </div>

                {/* 2. Topographic & Road SVG Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="15" cy="15" r="1" fill="#10b981" opacity="0.25" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-dots)" />

                  {/* River: Batang Ulakan / Batang Mangoi */}
                  <path 
                    d="M 100,50 Q 250,90 400,75 T 700,120" 
                    fill="none" 
                    stroke="#0284c7" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    opacity="0.6" 
                  />

                  {/* Major Road: Jl. Raya Padang - Pariaman / Jl. Syekh Burhanuddin */}
                  <path 
                    d="M 80,360 Q 280,240 500,150 T 800,40" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  {/* Road centerline stripe */}
                  <path 
                    d="M 80,360 Q 280,240 500,150 T 800,40" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    strokeDasharray="8 6"
                    opacity="0.9"
                  />

                  {/* Connecting Nagari Village Roads */}
                  <path 
                    d="M 220,180 Q 320,150 420,220 T 600,280" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />

                  {/* Nagari Boundary Dividing Line */}
                  <line 
                    x1="45%" y1="0%" x2="45%" y2="100%" 
                    stroke="#34d399" 
                    strokeWidth="1.5" 
                    strokeDasharray="6 4" 
                    opacity="0.3" 
                  />
                </svg>

                {/* Nagari Zone Labels on Map */}
                <div className="absolute top-3 left-24 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-200 pointer-events-none backdrop-blur-xs">
                  <span className="font-bold text-amber-300 block">ZONA SUNUA BARAT</span>
                  <span className="text-[9px] text-emerald-300">Pesisir, BRUN, BKMT</span>
                </div>

                <div className="absolute top-3 right-4 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-200 pointer-events-none backdrop-blur-xs text-right">
                  <span className="font-bold text-amber-300 block">ZONA SUNUA TENGAH</span>
                  <span className="text-[9px] text-emerald-300">KUA Nan Sabaris, Majelis Taklim</span>
                </div>

                {/* Click Instruction Banner */}
                <div className="absolute top-12 inset-x-4 flex justify-center pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-black/75 border border-amber-400/70 text-white text-[11px] font-medium flex items-center space-x-1.5 shadow-lg backdrop-blur-xs animate-pulse">
                    <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
                    <span>Klik di mana saja pada peta untuk memilih lokasi</span>
                  </div>
                </div>

                {/* All Strategic Landmark Pins plotted on map */}
                {filteredLocations.map((loc) => {
                  const isSelected = loc.id === activeLocId;
                  const pos = coordsToPercent(loc.lat, loc.lng);

                  return (
                    <div
                      key={loc.id}
                      style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickPreset(loc);
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin"
                      title={`${loc.namaLokasi} (${loc.displayGps}) - Klik untuk memilih`}
                    >
                      <div className={`p-1.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? "bg-amber-400 text-stone-950 ring-4 ring-amber-300/50 scale-125 z-30"
                          : "bg-emerald-800 text-emerald-100 hover:bg-emerald-600 hover:scale-115 border border-emerald-400/40"
                      }`}>
                        {loc.kategori === "KUA" ? (
                          <Building2 className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Tooltip Label */}
                      <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all duration-150 ${
                        isSelected
                          ? "bg-stone-950 text-amber-300 border border-amber-400 opacity-100 scale-105 z-30"
                          : "bg-stone-900/90 text-white opacity-0 group-hover/pin:opacity-100"
                      }`}>
                        {loc.namaLokasi}
                      </div>
                    </div>
                  );
                })}

                {/* CURRENT ACTIVE SELECTION PIN (Always visible, animated) */}
                <div
                  style={{ top: `${currentPinPercent.y}%`, left: `${currentPinPercent.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-300"
                >
                  {/* Expanding Ring Pulse */}
                  <div className="absolute inset-0 -m-3 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
                  
                  {/* Pin Head */}
                  <div className="relative p-2 rounded-full bg-amber-400 text-stone-950 shadow-xl border-2 border-white flex items-center justify-center scale-110">
                    <MapPin className="w-4 h-4 fill-stone-950" />
                  </div>

                  {/* Active Pin Floating HUD */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-11 px-2.5 py-1 rounded-lg bg-stone-950 text-white border border-amber-400 text-[10px] font-bold whitespace-nowrap shadow-2xl flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-amber-300 truncate max-w-[170px]">{customLocationName}</span>
                  </div>
                </div>

                {/* Click Ripple Effect */}
                {clickRipple && (
                  <div
                    style={{ left: clickRipple.x, top: clickRipple.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-400/40 border-2 border-amber-300 animate-ping" />
                  </div>
                )}

                {/* Hover Coordinate Crosshair Tracker */}
                {hoverCoords && (
                  <div
                    style={{ left: hoverCoords.x, top: hoverCoords.y }}
                    className="absolute -translate-x-1/2 -translate-y-10 pointer-events-none z-10 px-2 py-0.5 rounded bg-black/80 text-[9px] text-emerald-300 font-mono border border-emerald-500/50 whitespace-nowrap"
                  >
                    {hoverCoords.lat.toFixed(4)}, {hoverCoords.lng.toFixed(4)} (Klik untuk pilih)
                  </div>
                )}

                {/* Bottom Map HUD: Current Selected Location & Direct GPS status */}
                <div className="absolute bottom-2 inset-x-2 bg-stone-950/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-20">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="font-bold text-amber-300 truncate">{customLocationName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 font-semibold shrink-0">
                        {activeNagari}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] sm:text-[11px] text-emerald-400 flex items-center space-x-2">
                      <span>GPS: {displayGpsText}</span>
                      <span className="text-stone-400 hidden sm:inline">({dmsText})</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDetectDeviceGps}
                      disabled={isDetectingGps}
                      title="Gunakan posisi GPS perangkat saat ini"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Crosshair className={`w-3.5 h-3.5 text-amber-300 ${isDetectingGps ? "animate-spin" : ""}`} />
                      <span>{isDetectingGps ? "Mencari..." : "GPS HP/PC"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Status Notice */}
          {gpsNotice && (
            <div className={`p-3 rounded-xl text-xs flex items-start space-x-2.5 ${
              gpsNotice.type === "success"
                ? "bg-emerald-50 border border-emerald-300 text-emerald-950 font-medium"
                : "bg-amber-50/90 border border-amber-300 text-amber-950"
            }`}>
              {gpsNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-0.5">
                <p>{gpsNotice.message}</p>
                {gpsNotice.type === "warning" && (
                  <button
                    type="button"
                    onClick={() => setShowPermissionHelp((prev) => !prev)}
                    className="text-[11px] font-bold text-amber-900 underline hover:text-amber-800 cursor-pointer block mt-1"
                  >
                    {showPermissionHelp ? "Sembunyikan Panduan Izin GPS" : "💡 Klik di sini jika peramban memblokir izin GPS"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Preset Buttons (1-Click Instant Nagari Center) */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
            <span className="font-bold text-stone-700 block">Pilihan Cepat Titik Resmi:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickNagariCoord("Nagari Sunua Tengah")}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>Pusat Sunua Tengah (-0.6865, 100.2291)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickNagariCoord("Nagari Sunua Barat")}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>Pusat Sunua Barat (-0.6950, 100.2185)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const kua = STRATEGIC_LOCATIONS_NAN_SABARIS[0];
                  handlePickPreset(kua);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>KUA Kec. Nan Sabaris (-0.6812, 100.2345)</span>
              </button>
            </div>
          </div>

          {/* Manual Coordinate Adjuster */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-stone-600 block mb-1">
                Latitude (Garis Lintang):
              </label>
              <input
                type="number"
                step="0.0001"
                value={currentLat}
                onChange={(e) => handleCustomCoordinatesChange(e.target.value, String(currentLng))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono text-[11px] text-stone-800 bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-600 block mb-1">
                Longitude (Garis Bujur):
              </label>
              <input
                type="number"
                step="0.0001"
                value={currentLng}
                onChange={(e) => handleCustomCoordinatesChange(String(currentLat), e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono text-[11px] text-stone-800 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Search & Strategic Location List */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Filter Nagari & Search Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Titik Binaan di Nan Sabaris:</span>
                <div className="flex items-center space-x-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setFilterNagari("all")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      filterNagari === "all" ? "bg-stone-900 text-white font-bold" : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterNagari("Nagari Sunua Tengah")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      filterNagari === "Nagari Sunua Tengah" ? "bg-emerald-800 text-white font-bold" : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Sunua Tengah
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterNagari("Nagari Sunua Barat")}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      filterNagari === "Nagari Sunua Barat" ? "bg-emerald-800 text-white font-bold" : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Sunua Barat
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari masjid, mushalla, korong..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Scrollable list of locations (Clicking any card immediately enters into form) */}
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 text-xs">
              {filteredLocations.length === 0 ? (
                <div className="p-4 text-center text-stone-400 text-xs">
                  Tidak ditemukan titik lokasi yang sesuai kata kunci pencarian.
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isSelected = loc.id === activeLocId;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => handlePickPreset(loc)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/90 shadow-sm ring-1 ring-emerald-500"
                          : "border-stone-200 hover:border-emerald-300 hover:bg-stone-50/80 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1">
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            loc.kategori === "KUA"
                              ? "bg-amber-100 text-amber-900"
                              : loc.kategori === "Masjid/Mushalla"
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-blue-100 text-blue-900"
                          }`}>
                            {loc.kategori}
                          </span>
                          <span className="font-bold text-stone-900">{loc.namaLokasi}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3" /> Terpilih
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-500 line-clamp-1 mb-1.5">
                        {loc.deskripsi}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                        <span className="text-emerald-800 font-bold">{loc.nagari}</span>
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-semibold">
                          GPS: {loc.displayGps}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Selection Summary Card */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
            <div className="text-xs min-w-0">
              <span className="text-emerald-800 font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Langsung Masuk ke Formulir:
              </span>
              <strong className="text-stone-900 truncate block">{customLocationName}</strong>
              <span className="text-[11px] text-stone-500 font-mono">
                {activeNagari} • GPS: {displayGpsText}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectLocation(customLocationName, activeNagari, displayGpsText, currentLat, currentLng)}
              className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
              title="Konfirmasi penerapan lokasi"
            >
              <Check className="w-3.5 h-3.5 text-amber-300" />
              <span>Terapkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
