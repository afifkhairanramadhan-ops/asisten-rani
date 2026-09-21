import React, { useState, useEffect } from "react";
import { 
  Sparkles, Mic, MicOff, CheckCircle2, AlertTriangle, 
  MapPin, Users, Calendar, HelpCircle, ArrowRight, 
  RefreshCw, Check, Info, FileEdit, Compass, Navigation,
  Bookmark, ChevronDown, ChevronUp
} from "lucide-react";
import { NagariType, SasaranBinaanType, VerificationResult } from "../types";
import { PRESET_ACTIVITIES, PresetActivity, REGULATION_INFO } from "../data/presets";
import { LocationMapPicker } from "./LocationMapPicker";
import { AiImpactAssistantModal } from "./AiImpactAssistantModal";

interface Modo1Props {
  onGenerate: (formData: any) => Promise<void>;
  isLoading: boolean;
  verificationResult: VerificationResult | null;
  currentFormData: any;
  onFormUpdate: (data: any) => void;
  onOpenSaveReport?: () => void;
}

export const Modo1InputVerifikasi: React.FC<Modo1Props> = ({
  onGenerate,
  isLoading,
  verificationResult,
  currentFormData,
  onFormUpdate,
  onOpenSaveReport,
}) => {
  const [selectedNagari, setSelectedNagari] = useState<NagariType>(
    currentFormData.selectedNagari || "Nagari Sunua Tengah"
  );
  const [sasaranType, setSasaranType] = useState<SasaranBinaanType>(
    currentFormData.sasaranType || "Majelis Taklim"
  );
  const [participantCount, setParticipantCount] = useState<number | string>(
    currentFormData.participantCount || 35
  );
  const [activityDate, setActivityDate] = useState<string>(
    currentFormData.activityDate || new Date().toISOString().split("T")[0]
  );
  const [activityLocation, setActivityLocation] = useState<string>(
    currentFormData.activityLocation || "Mushalla Baiturrahim Korong Kampung Ladang"
  );
  const [topic, setTopic] = useState<string>(
    currentFormData.topic || "Penguatan Ketahanan Keluarga Sakinah dan Fiqih Munakahat"
  );
  const [inputNotes, setInputNotes] = useState<string>(
    currentFormData.inputNotes || ""
  );
  const [testimonyRaw, setTestimonyRaw] = useState<string>(
    currentFormData.testimonyRaw || "Materi sangat menyentuh dan kami para ibu jadi paham cara menyelesaikan masalah rumah tangga secara islami tanpa kekerasan."
  );
  const [narasumberName, setNarasumberName] = useState<string>(
    currentFormData.narasumberName || "Ibu Rosna (Ketua Majelis Taklim)"
  );

  // Map & GPS State
  const [showMapPicker, setShowMapPicker] = useState<boolean>(true);
  const [currentGpsCoords, setCurrentGpsCoords] = useState<string>(
    REGULATION_INFO.coordinates[selectedNagari]?.display || "-0.6865, 100.2291"
  );

  // AI Impact Assistant Modal State
  const [showAiImpactModal, setShowAiImpactModal] = useState<boolean>(false);

  // Speech recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const handleVoiceToggle = () => {
    if (!speechSupported) {
      alert("Fitur pengenalan suara belum didukung di browser ini. Anda dapat mengetikkan catatan secara manual.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (err: any) => {
        console.error("Speech error", err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const handlePresetSelect = (preset: PresetActivity) => {
    setSelectedNagari(preset.nagari);
    setSasaranType(preset.sasaran);
    setParticipantCount(preset.pesertaCount);
    setActivityLocation(preset.location);
    setTopic(preset.topic);
    setInputNotes(preset.notes);
    setTestimonyRaw(preset.testimonyRaw);
    setNarasumberName(`${preset.narasumber} (${preset.peran})`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      selectedNagari,
      sasaranType,
      participantCount: Number(participantCount) || 25,
      activityDate,
      activityLocation,
      topic,
      inputNotes,
      testimonyRaw,
      narasumberName
    };
    onFormUpdate(data);
    onGenerate(data);
  };

  return (
    <div className="space-y-8">
      {/* Top Presets Banner */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Template Kegiatan KUA Nan Sabaris (Rani Humaira, S.H.I.)
            </h2>
            <p className="text-xs text-stone-500">
              Pilih salah satu agenda bimbingan binaan di Nagari Sunua Tengah atau Sunua Barat untuk mengisi otomatis.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-medium border border-emerald-200 shrink-0 self-start sm:self-auto">
            Sesuai SE 29/2025
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_ACTIVITIES.map((preset) => (
            <button
              key={preset.id}
              id={`btn-preset-${preset.id}`}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="text-left p-3 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group relative cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {preset.tag}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {preset.pesertaCount} Jamaah
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-800 line-clamp-2 group-hover:text-emerald-900">
                {preset.title}
              </p>
              <div className="mt-2 flex items-center text-[11px] text-stone-500">
                <MapPin className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
                <span className="truncate">{preset.nagari}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form & Audit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                    MODO 1: Formulir Input Kegiatan Bimbingan
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Data wajib mencakup kuantitas peserta, wilayah sah, dampak riil, dan testimoni otentik.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  KUA Nan Sabaris
                </span>
              </div>
            </div>

            {/* Wilayah Binaan (Sunua Tengah vs Sunua Barat) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  1. Wilayah Binaan Utama (Wajib Sesuai SK) <span className="text-red-500">*</span>
                </label>

                {/* Map Picker Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    showMapPicker
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showMapPicker ? "Sembunyikan Peta" : "Pilih di Google Maps & GPS"}</span>
                  {showMapPicker ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-nagari-tengah"
                  onClick={() => {
                    setSelectedNagari("Nagari Sunua Tengah");
                    setCurrentGpsCoords(REGULATION_INFO.coordinates["Nagari Sunua Tengah"].display);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNagari === "Nagari Sunua Tengah"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs"
                      : "border-stone-200 hover:border-stone-300 text-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">Nagari Sunua Tengah</span>
                    {selectedNagari === "Nagari Sunua Tengah" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-mono">
                    GPS: {REGULATION_INFO.coordinates["Nagari Sunua Tengah"].display}
                  </p>
                </button>

                <button
                  type="button"
                  id="btn-nagari-barat"
                  onClick={() => {
                    setSelectedNagari("Nagari Sunua Barat");
                    setCurrentGpsCoords(REGULATION_INFO.coordinates["Nagari Sunua Barat"].display);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNagari === "Nagari Sunua Barat"
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs"
                      : "border-stone-200 hover:border-stone-300 text-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">Nagari Sunua Barat</span>
                    {selectedNagari === "Nagari Sunua Barat" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-mono">
                    GPS: {REGULATION_INFO.coordinates["Nagari Sunua Barat"].display}
                  </p>
                </button>
              </div>

              {/* Interactive Location & Google Map Selector */}
              {showMapPicker && (
                <div id="section-map-picker" className="mt-3.5 animate-fade-in scroll-mt-6">
                  <LocationMapPicker
                    selectedNagari={selectedNagari}
                    currentLocationName={activityLocation}
                    onSelectLocation={(locName, nag, gpsDisplay) => {
                      setActivityLocation(locName);
                      setSelectedNagari(nag);
                      setCurrentGpsCoords(gpsDisplay);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Sasaran Binaan & Kuantitas Peserta (Data Driven) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="select-sasaran" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  2. Sasaran Binaan <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-sasaran"
                  value={sasaranType}
                  onChange={(e) => setSasaranType(e.target.value as SasaranBinaanType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                >
                  <option value="Majelis Taklim">Majelis Taklim Kaum Ibu</option>
                  <option value="Remaja Masjid / BRUN">Remaja Masjid / Karang Taruna (BRUN)</option>
                  <option value="BKMT">BKMT (Badan Kontak Majelis Taklim)</option>
                  <option value="TPQ / MDTA">TPQ / MDTA & Ustadz/Ustadzah</option>
                  <option value="Kelompok Dasa Wisma">Kelompok Dasa Wisma</option>
                  <option value="Tokoh Masyarakat & Umat">Tokoh Masyarakat & Jamaah Umum</option>
                </select>
              </div>

              <div>
                <label htmlFor="input-peserta" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>3. Jumlah Peserta (Data Angka) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">SE 29 Wajib Angka</span>
                </label>
                <div className="relative">
                  <input
                    id="input-peserta"
                    type="number"
                    min={1}
                    max={500}
                    value={participantCount}
                    onChange={(e) => setParticipantCount(e.target.value)}
                    required
                    placeholder="Contoh: 35"
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-500 font-medium">
                    Orang
                  </span>
                </div>
              </div>
            </div>

            {/* Tanggal & Lokasi Spesifik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="input-tanggal" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  4. Tanggal Bimbingan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-tanggal"
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="input-lokasi" className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    5. Lokasi Spesifik Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMapPicker(true);
                      const el = document.getElementById("section-map-picker");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center space-x-1 underline cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showMapPicker ? "Lihat / Klik di Peta ↑" : "Buka Peta & Klik Lokasi"}</span>
                  </button>
                </div>
                <input
                  id="input-lokasi"
                  type="text"
                  value={activityLocation}
                  onChange={(e) => setActivityLocation(e.target.value)}
                  required
                  placeholder="Contoh: Mushalla Baiturrahim Korong Kampung Ladang"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                {currentGpsCoords && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Terhubung ke Peta: <strong className="font-mono">{currentGpsCoords}</strong> ({selectedNagari})</span>
                  </p>
                )}
              </div>
            </div>

            {/* Topik / Materi Bimbingan */}
            <div>
              <label htmlFor="input-topik" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                6. Topik & Materi Bimbingan (Perspektif Hukum Islam / Fiqih) <span className="text-red-500">*</span>
              </label>
              <input
                id="input-topik"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                placeholder="Contoh: Fiqih Munakahat, Hak Perlindungan Perempuan & Keluarga Sakinah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Voice-to-Text & Catatan Bebas & AI Impact Assistant */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label htmlFor="textarea-notes" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  7. Catatan Kegiatan & Dampak Nyata di Umat
                </label>

                <div className="flex items-center space-x-2">
                  {/* AI Facility Button */}
                  <button
                    type="button"
                    id="btn-ai-impact-assistant"
                    onClick={() => setShowAiImpactModal(true)}
                    className="text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-2xs"
                    title="Buatkan narasi kegiatan lapangan dan uraian dampak nyata di umat menggunakan AI sesuai SE 29/2025"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Buatkan Catatan & Dampak via AI</span>
                  </button>

                  <button
                    type="button"
                    id="btn-voice-recorder"
                    onClick={handleVoiceToggle}
                    className={`text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      isRecording
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Merekam Suara... (Klik Selesai)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Rekam Suara</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                id="textarea-notes"
                rows={4}
                value={inputNotes}
                onChange={(e) => setInputNotes(e.target.value)}
                placeholder="Ceritakan jalannya bimbingan: permasalahan jamaah di nagari, metode penyuluhan yang digunakan, antusiasme peserta, serta solusi atau perubahan nyata yang tercapai..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Testimoni Penerima Manfaat (Wajib SE 29/2025) */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700" />
                  8. Testimoni Penerima Manfaat (Wajib Berdasarkan SE 29/2025)
                </label>
                <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                  Kutipan Otentik
                </span>
              </div>

              <div>
                <input
                  id="input-narasumber"
                  type="text"
                  value={narasumberName}
                  onChange={(e) => setNarasumberName(e.target.value)}
                  placeholder="Nama & Peran Narasumber (contoh: Ibu Hj. Rosna - Ketua Majelis Taklim)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 bg-white text-stone-800 mb-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <textarea
                  id="textarea-testimoni"
                  rows={2}
                  value={testimonyRaw}
                  onChange={(e) => setTestimonyRaw(e.target.value)}
                  placeholder="Kutipan langsung dari peserta: 'Sebelumnya kami bingung cara mengurus berkas pernikahan dan pembagian waris, setelah Ibu Rani Humaira menjelaskan kami jadi sangat paham...'"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              id="btn-process-epa"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Memvalidasi & Membangun 4 Modo (SE 29/2025)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Audit & Generate Laporan E-PA (4 Modo)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification & Compliance Audit Column (MODO 1 Result) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Status Audit Verifikasi SE 29
                </h3>
                <p className="text-xs text-stone-500">
                  Parameter kelayakan LKP E-PA Kemenag RI
                </p>
              </div>

              {verificationResult ? (
                <div className="text-right">
                  <span className={`text-xl font-extrabold ${
                    verificationResult.score >= 80 ? "text-emerald-700" : "text-amber-600"
                  }`}>
                    {verificationResult.score}%
                  </span>
                  <p className="text-[10px] text-stone-400 font-medium">Skor Kepatuhan</p>
                </div>
              ) : (
                <span className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg font-medium">
                  Menunggu Audit
                </span>
              )}
            </div>

            {verificationResult ? (
              <div className="space-y-4">
                {/* Score Banner */}
                <div className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
                  verificationResult.isComplete && verificationResult.score >= 80
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                    : "bg-amber-50 border-amber-200 text-amber-950"
                }`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">
                      {verificationResult.isComplete
                        ? "Laporan Memenuhi Standar SE No. 29 Tahun 2025"
                        : "Laporan Memerlukan Penguatan Data"}
                    </p>
                    <p className="text-stone-600 mt-0.5">
                      Laporan dinyatakan berbasis data angka, berdampak nyata, memuat testimoni, dan fokus kelembagaan KUA Nan Sabaris.
                    </p>
                  </div>
                </div>

                {/* 6 Audit Checkpoints */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Hasil Pemeriksaan 6 Indikator Wajib:
                  </p>

                  <div className="space-y-2">
                    {/* 1. Wilayah */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-stone-900">Wilayah Binaan Sah</p>
                        <p className="text-stone-600">
                          {verificationResult.criteriaChecks?.wilayahCheck?.message ||
                            `Terverifikasi sah di ${selectedNagari}, Kec. Nan Sabaris.`}
                        </p>
                      </div>
                    </div>

                    {/* 2. Kuantitas Peserta */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-stone-900">Kuantitas Data Angka Peserta</p>
                        <p className="text-stone-600">
                          {verificationResult.criteriaChecks?.pesertaCheck?.message ||
                            `Terdata valid sebanyak ${participantCount} peserta/jamaah.`}
                        </p>
                      </div>
                    </div>

                    {/* 3. Topik & Materi */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-stone-900">Topik Bimbingan & Perspektif Hukum</p>
                        <p className="text-stone-600">
                          {verificationResult.criteriaChecks?.topikCheck?.message ||
                            `Topik spesifik: ${topic}.`}
                        </p>
                      </div>
                    </div>

                    {/* 4. Testimoni */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-stone-900">Kutipan Testimoni Otentik</p>
                        <p className="text-stone-600 italic">
                          "{testimonyRaw.slice(0, 110)}..."
                        </p>
                      </div>
                    </div>

                    {/* 5. Dampak Nyata */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-stone-900">Dampak & Perubahan Nyata</p>
                        <p className="text-stone-600">
                          {verificationResult.criteriaChecks?.dampakCheck?.message ||
                            "Memenuhi kriteria bebas seremonial semata dan menyentuh problematika umat."}
                        </p>
                      </div>
                    </div>

                    {/* 6. Kelembagaan */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-stone-900">Fokus Kelembagaan Kemenag / KUA</p>
                        <p className="text-stone-600">
                          Narasi menonjolkan peran responsif KUA Nan Sabaris dalam melayani umat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions if any */}
                {verificationResult.suggestions && verificationResult.suggestions.length > 0 && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Saran Penyempurnaan Evident:
                    </p>
                    <ul className="text-[11px] text-amber-950 list-disc list-inside space-y-1">
                      {verificationResult.suggestions.map((sug, idx) => (
                        <li key={idx}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 px-4 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                <FileEdit className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">Belum Ada Data yang Diaudit</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Isi formulir di sebelah kiri atau pilih template di atas, kemudian klik tombol "Audit & Generate Laporan E-PA" untuk mengaktifkan validasi SE 29.
                </p>
              </div>
            )}
          </div>

          {/* Quick Info Box: Penyuluh & Satker */}
          <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-5 border border-emerald-900 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-amber-400">
                RH
              </div>
              <div>
                <p className="text-xs text-emerald-300 font-medium">Penyuluh Agama Islam Fungsional</p>
                <h4 className="text-sm font-bold text-white tracking-tight">{REGULATION_INFO.penyuluhName}</h4>
              </div>
            </div>

            <div className="text-xs text-emerald-200/80 space-y-1.5 pt-2 border-t border-emerald-900/60">
              <div className="flex items-start justify-between">
                <span className="text-emerald-400">Satuan Kerja:</span>
                <span className="text-right font-medium text-white">{REGULATION_INFO.satker}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-emerald-400">Wilayah Binaan:</span>
                <span className="text-right font-medium text-white">Nagari Sunua Tengah & Barat</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-emerald-400">Dasar Regulasi:</span>
                <span className="text-right font-medium text-amber-300">SE 29/2025 & SE Publikasi Kinerja</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Impact Assistant Modal */}
      <AiImpactAssistantModal
        isOpen={showAiImpactModal}
        onClose={() => setShowAiImpactModal(false)}
        nagari={selectedNagari}
        sasaran={sasaranType}
        topik={topic}
        pesertaCount={Number(participantCount) || 35}
        lokasiSpesifik={activityLocation}
        initialNotes={inputNotes}
        onApply={(catatan, dampak, combined, testimoni, narasumber) => {
          setInputNotes(combined);
          if (testimoni) setTestimonyRaw(testimoni);
          if (narasumber) setNarasumberName(narasumber);
        }}
      />
    </div>
  );
};
