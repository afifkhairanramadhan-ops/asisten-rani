import React, { useState, useEffect } from "react";
import { 
  Sparkles, CheckCircle2, FileText, Share2, 
  FileCheck, History, BookOpen, AlertCircle, 
  ChevronRight, RefreshCw, Send, Shield
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Modo1InputVerifikasi } from "./components/Modo1InputVerifikasi";
import { Modo2EpaGenerator } from "./components/Modo2EpaGenerator";
import { Modo3SosmedPublisher } from "./components/Modo3SosmedPublisher";
import { Modo4EvidentChecklist } from "./components/Modo4EvidentChecklist";
import { HistoryArchive } from "./components/HistoryArchive";
import { RegulationGuide } from "./components/RegulationGuideModal";
import { SaveReportModal } from "./components/SaveReportModal";
import { EpaFullOutput, SavedReport, NagariType, SasaranBinaanType } from "./types";
import { PRESET_ACTIVITIES, REGULATION_INFO, INITIAL_DEFAULT_OUTPUT } from "./data/presets";

const STORAGE_KEY = "epa_assistant_saved_reports_v1";

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<"generator" | "history" | "guidelines">("generator");
  const [activeModoTab, setActiveModoTab] = useState<"modo1" | "modo2" | "modo3" | "modo4">("modo1");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  // Form State initialized with Preset 1 (Nagari Sunua Tengah)
  const defaultPreset = PRESET_ACTIVITIES[0];
  const [formData, setFormData] = useState({
    selectedNagari: defaultPreset.nagari,
    sasaranType: defaultPreset.sasaran,
    participantCount: defaultPreset.pesertaCount,
    activityDate: new Date().toISOString().split("T")[0],
    activityLocation: defaultPreset.location,
    topic: defaultPreset.topic,
    inputNotes: defaultPreset.notes,
    testimonyRaw: defaultPreset.testimonyRaw,
    narasumberName: `${defaultPreset.narasumber} (${defaultPreset.peran})`
  });

  // Generated Output state initialized with compliant default so UI is immediately rich & usable
  const [epaOutput, setEpaOutput] = useState<EpaFullOutput | null>(INITIAL_DEFAULT_OUTPUT as EpaFullOutput);

  // Saved reports in localStorage
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // Load saved reports on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedReports(JSON.parse(stored));
      } else {
        // Seed initial history record
        const initialRecord: SavedReport = {
          id: "report-initial",
          createdAt: new Date().toISOString(),
          title: INITIAL_DEFAULT_OUTPUT.modo2_epa.judulKegiatan,
          nagari: "Nagari Sunua Tengah",
          sasaran: "Majelis Taklim",
          pesertaCount: 38,
          date: new Date().toISOString().split("T")[0],
          score: 98,
          fullData: INITIAL_DEFAULT_OUTPUT as EpaFullOutput,
          status: "Terverifikasi SE 29"
        };
        setSavedReports([initialRecord]);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([initialRecord]));
        } catch {}
      }
    } catch (e) {
      console.warn("Failed to load saved reports from localStorage", e);
    }
  }, []);

  // Save to localStorage when savedReports changes
  const updateSavedReports = (newReports: SavedReport[]) => {
    setSavedReports(newReports);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  };

  const handleGenerate = async (currentData: any, switchTab: boolean = true) => {
    setIsLoading(true);
    setErrorNotice(null);

    try {
      const response = await fetch("/api/generate-epa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentData),
      });

      const resJson = await response.json().catch(() => null);

      if (resJson && resJson.data) {
        setEpaOutput(resJson.data);

        // Auto-save or update in local history
        const newRecord: SavedReport = {
          id: "report-" + Date.now(),
          createdAt: new Date().toISOString(),
          title: resJson.data.modo2_epa?.judulKegiatan || currentData.topic,
          nagari: currentData.selectedNagari as NagariType,
          sasaran: currentData.sasaranType as SasaranBinaanType,
          pesertaCount: Number(currentData.participantCount) || 30,
          date: currentData.activityDate,
          score: resJson.data.verification?.score || 95,
          fullData: resJson.data,
          status: "Terverifikasi SE 29",
        };

        setSavedReports((prev) => {
          const updated = [newRecord, ...prev.filter((r) => r.title !== newRecord.title)];
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        if (switchTab) {
          setActiveModoTab("modo2");
          showToast("Laporan E-PA & Evident berhasil diaudit dan dibuat!");
        }
      } else {
        throw new Error(resJson?.error || "Gagal memproses data laporan.");
      }
    } catch (err: any) {
      console.warn("Notice during generate:", err?.message || err);
      if (switchTab) {
        setErrorNotice(err?.message || "Terjadi kesalahan saat memproses laporan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  const handleSelectSavedReport = (report: SavedReport) => {
    setEpaOutput(report.fullData);
    setFormData({
      selectedNagari: report.nagari,
      sasaranType: report.sasaran,
      participantCount: report.pesertaCount,
      activityDate: report.date,
      activityLocation: report.fullData.modo2_epa.lokasiSpesifik,
      topic: report.title,
      inputNotes: report.fullData.modo2_epa.deskripsiBerdampak.teksLengkapLKP,
      testimonyRaw: report.fullData.modo2_epa.testimoniOtentik.isiKutipan,
      narasumberName: report.fullData.modo2_epa.testimoniOtentik.namaNarasumber
    });
    setActiveNavTab("generator");
    setActiveModoTab("modo2");
    showToast(`Laporan "${report.title.slice(0, 30)}..." berhasil dibuka.`);
  };

  const handleDeleteReport = (id: string) => {
    const filtered = savedReports.filter((r) => r.id !== id);
    updateSavedReports(filtered);
    showToast("Laporan telah dihapus dari arsip.");
  };

  const handleUpdateReportStatus = (id: string, newStatus: SavedReport["status"]) => {
    const updated = savedReports.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    updateSavedReports(updated);
    showToast(`Status laporan diperbarui: ${newStatus}`);
  };

  const handleDuplicateReport = (report: SavedReport) => {
    const today = new Date().toISOString().split("T")[0];
    const duplicated: SavedReport = {
      ...report,
      id: "report-" + Date.now(),
      title: `${report.title} (Salinan)`,
      date: today,
      status: "Draf",
      createdAt: new Date().toISOString(),
    };
    updateSavedReports([duplicated, ...savedReports]);
    showToast("Laporan berhasil diduplikasi ke draf!");
  };

  const handleImportReports = (imported: SavedReport[]) => {
    const existingIds = new Set(savedReports.map((r) => r.id));
    const newItems = imported.filter((r) => !existingIds.has(r.id));
    const merged = [...newItems, ...savedReports];
    updateSavedReports(merged);
    showToast(`${newItems.length} laporan berhasil dipulihkan ke penyimpanan.`);
  };

  const handleUpdateEvidentPhotos = (photos: any[]) => {
    if (epaOutput) {
      setEpaOutput((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modo4_evident: {
            ...prev.modo4_evident,
            attachedPhotos: photos,
          },
        };
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        savedCount={savedReports.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Alert */}
        {successToast && (
          <div className="p-3.5 bg-emerald-800 text-white rounded-xl shadow-md flex items-center justify-between animate-fade-in text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-200 hover:text-white cursor-pointer ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorNotice && (
          <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-red-600 hover:text-red-900 cursor-pointer font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs Logic */}
        {activeNavTab === "guidelines" && (
          <RegulationGuide />
        )}

        {activeNavTab === "history" && (
          <HistoryArchive
            reports={savedReports}
            onSelectReport={handleSelectSavedReport}
            onDeleteReport={handleDeleteReport}
            onUpdateStatus={handleUpdateReportStatus}
            onDuplicateReport={handleDuplicateReport}
            onImportReports={handleImportReports}
          />
        )}

        {activeNavTab === "generator" && (
          <div className="space-y-6">
            {/* 4 Modo Sub-Navigation Bar */}
            <div className="bg-white rounded-2xl p-2 border border-stone-200/90 shadow-xs flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                id="tab-modo-1"
                onClick={() => setActiveModoTab("modo1")}
                className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeModoTab === "modo1"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  epaOutput?.verification.isComplete ? "bg-amber-400" : "bg-stone-300"
                }`} />
                <span>MODO 1: Verifikasi & Input</span>
              </button>

              <button
                id="tab-modo-2"
                onClick={() => setActiveModoTab("modo2")}
                className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeModoTab === "modo2"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>MODO 2: Laporan E-PA</span>
              </button>

              <button
                id="tab-modo-3"
                onClick={() => setActiveModoTab("modo3")}
                className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeModoTab === "modo3"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>MODO 3: Publikasi Medsos</span>
              </button>

              <button
                id="tab-modo-4"
                onClick={() => setActiveModoTab("modo4")}
                className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeModoTab === "modo4"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>MODO 4: Evident PDF & GPS</span>
              </button>
            </div>

            {/* Active Modo View */}
            {activeModoTab === "modo1" && (
              <Modo1InputVerifikasi
                onGenerate={handleGenerate}
                isLoading={isLoading}
                verificationResult={epaOutput?.verification || null}
                currentFormData={formData}
                onFormUpdate={setFormData}
                onOpenSaveReport={() => setIsSaveModalOpen(true)}
              />
            )}

            {activeModoTab === "modo2" && (
              <Modo2EpaGenerator 
                report={epaOutput?.modo2_epa || null} 
                onNavigateToModo4={() => setActiveModoTab("modo4")}
                onSaveReport={() => setIsSaveModalOpen(true)}
              />
            )}

            {activeModoTab === "modo3" && (
              <Modo3SosmedPublisher
                sosmedData={epaOutput?.modo3_sosmed || null}
                locationInfo={`${formData.selectedNagari}, KUA Nan Sabaris`}
              />
            )}

            {activeModoTab === "modo4" && (
              <Modo4EvidentChecklist
                evidentData={epaOutput?.modo4_evident || null}
                reportData={epaOutput?.modo2_epa || null}
                onSaveReport={() => setIsSaveModalOpen(true)}
                onUpdatePhotos={handleUpdateEvidentPhotos}
              />
            )}
          </div>
        )}
      </main>

      {/* Persistent Save Report Modal */}
      {epaOutput && (
        <SaveReportModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          reportData={epaOutput}
          defaultNagari={formData.selectedNagari as NagariType}
          defaultSasaran={formData.sasaranType as SasaranBinaanType}
          defaultDate={formData.activityDate}
          defaultPesertaCount={Number(formData.participantCount) || 35}
          locationName={formData.activityLocation}
          gpsCoordinates={
            epaOutput.modo4_evident?.rekomendasiFotoGeotag?.lokasiKoordinat ||
            REGULATION_INFO.coordinates[formData.selectedNagari as NagariType]?.display ||
            "-0.6865, 100.2291"
          }
          onSave={(savedReport) => {
            updateSavedReports([savedReport, ...savedReports.filter((r) => r.id !== savedReport.id)]);
            setIsSaveModalOpen(false);
            showToast("Laporan berhasil disimpan ke arsip penyimpanan!");
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-stone-200">
              EPA-AI Assistant — KUA Kecamatan Nan Sabaris
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Dikhususkan untuk Penyuluh Agama Islam Rani Humaira, S.H.I. • Wilayah Binaan Nagari Sunua Tengah & Nagari Sunua Barat
            </p>
          </div>

          <div className="text-[11px] text-stone-400 flex flex-wrap items-center gap-3">
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/80">
              SE Sekjen No. SE 29 Tahun 2025
            </span>
            <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
              Kemenag Padang Pariaman
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
