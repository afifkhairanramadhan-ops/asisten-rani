import React, { useState } from "react";
import { 
  Sparkles, X, Check, RefreshCw, AlertCircle, Quote, 
  TrendingUp, FileText, CheckCircle2, ShieldAlert, Award
} from "lucide-react";
import { NagariType, SasaranBinaanType, AiImpactResponse } from "../types";

interface AiImpactAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  nagari: NagariType;
  sasaran: SasaranBinaanType;
  topik: string;
  pesertaCount: number;
  lokasiSpesifik: string;
  initialNotes?: string;
  onApply: (
    catatanKegiatan: string, 
    dampakNyata: string, 
    combinedNotes: string,
    testimoniKutipan?: string,
    namaNarasumber?: string
  ) => void;
}

const IMPACT_TEMPLATES = [
  {
    id: "fiqih-keluarga",
    label: "Fiqih Munakahat & Hak Nafkah",
    tema: "Keluarga Sakinah & Perlindungan Hak Perempuan",
    defaultTopik: "Penguatan Hak Nafkah dan Mitigasi Sengketa Perkawinan",
    promptHint: "Membahas kewajiban nafkah lahir batin, perlindungan hak istri, dan cara musyawarah keluarga sakinah tanpa kekerasan."
  },
  {
    id: "cegah-nikah-anak",
    label: "Cegah Pernikahan Anak (BRUN)",
    tema: "Bimbingan Remaja Usia Nikah & Kesiapan Mental",
    defaultTopik: "Edukasi Kesiapan Mental dan Hukum Pernikahan bagi Remaja",
    promptHint: "Bimbingan remaja masjid/BRUN tentang usia ideal nikah 19 tahun, bahaya stunting, dan pentingnya kematangan agama & emosional."
  },
  {
    id: "moderasi-beragama",
    label: "Moderasi Beragama & ABS-SBK",
    tema: "Kerukunan Umat & Nilai Adat Basandi Syarak",
    defaultTopik: "Internalisasi 4 Pilar Moderasi Beragama dalam Kehidupan Nagari",
    promptHint: "Meneguhkan komitmen kebangsaan, toleransi, tolak ujaran kebencian di media sosial, dan sinergi adat Minangkabau."
  },
  {
    id: "maghrib-mengaji",
    label: "Literasi Al-Qur'an & Akhlak",
    tema: "Pengentasan Buta Aksara Al-Qur'an",
    defaultTopik: "Gerakan Maghrib Mengaji dan Peningkatan Mutu Bacaan Al-Qur'an",
    promptHint: "Pelatihan tahsin tajwid, fadhilah membaca Al-Qur'an bersama keluarga, dan pengaktifan wirid pengajian surau."
  },
  {
    id: "zakat-wakaf",
    label: "Zakat & Wakaf Produktif",
    tema: "Pemberdayaan Ekonomi Syariah Umat",
    defaultTopik: "Edukasi Sadar Zakat Maal dan Tata Kelola Wakaf Berdaya Guna",
    promptHint: "Kajian fiqih zakat penghasilan, nisab, dan kolaborasi bersama UPZ nagari untuk mengentaskan kemiskinan jamaah."
  }
];

export const AiImpactAssistantModal: React.FC<AiImpactAssistantModalProps> = ({
  isOpen,
  onClose,
  nagari,
  sasaran,
  topik,
  pesertaCount,
  lokasiSpesifik,
  initialNotes = "",
  onApply,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(IMPACT_TEMPLATES[0].id);
  const [keywordInput, setKeywordInput] = useState<string>(initialNotes);
  const [customTopik, setCustomTopik] = useState<string>(topik);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<AiImpactResponse | null>(null);

  if (!isOpen) return null;

  const handleSelectTemplate = (item: typeof IMPACT_TEMPLATES[0]) => {
    setSelectedTemplate(item.id);
    setCustomTopik(item.defaultTopik);
    if (!keywordInput || keywordInput.length < 15) {
      setKeywordInput(item.promptHint);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const activeItem = IMPACT_TEMPLATES.find((t) => t.id === selectedTemplate);

    try {
      const response = await fetch("/api/generate-impact-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topik: customTopik || topik,
          nagari,
          sasaran,
          pesertaCount,
          lokasiSpesifik,
          kataKunciAtauPoin: keywordInput || activeItem?.promptHint,
          temaSpesifik: activeItem?.tema,
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setGeneratedResult(resJson.data);
      } else {
        throw new Error(resJson.error || "Gagal menghasilkan narasi dampak AI.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kendala saat merumuskan narasi via AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToForm = () => {
    if (!generatedResult) return;

    // Combine into a structured, compliant narrative for inputNotes / LKP
    const combinedNotes = `${generatedResult.catatanKegiatan}\n\n[DAMPAK NYATA DI UMAT & CAPAIAN SE 29/2025]:\n${generatedResult.dampakNyataUmat}\n\n[POIN PERUBAHAN KUANTITATIF]:\n${generatedResult.poinKuantitatif.map((p) => `• ${p}`).join("\n")}`;

    const narasumberFormatted = `${generatedResult.rekomendasiTestimoni.namaNarasumber} (${generatedResult.rekomendasiTestimoni.peran})`;

    onApply(
      generatedResult.catatanKegiatan,
      generatedResult.dampakNyataUmat,
      combinedNotes,
      generatedResult.rekomendasiTestimoni.isiKutipan,
      narasumberFormatted
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-stone-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Fasilitas AI: Catatan Kegiatan & Dampak Nyata di Umat
              </h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Kepatuhan Standar SE Sekjen Kemenag No. SE 29 Tahun 2025 untuk Rani Humaira, S.H.I.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-stone-800">
          {/* Quick Context Summary */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-stone-500">Binaan:</span>{" "}
              <strong className="text-emerald-950">{sasaran} ({pesertaCount} Jamaah)</strong>
            </div>
            <div>
              <span className="text-stone-500">Wilayah:</span>{" "}
              <strong className="text-emerald-950">{nagari}</strong>
            </div>
            <div>
              <span className="text-stone-500">Lokasi:</span>{" "}
              <strong className="text-emerald-950">{lokasiSpesifik}</strong>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">
              Pilih Fokus Tema Bimbingan Keagamaan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {IMPACT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? "border-emerald-600 bg-emerald-800 text-white shadow-xs"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:border-stone-300"
                  }`}
                >
                  <span className="block truncate">{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic / Subject */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Topik / Judul Materi Bimbingan:
            </label>
            <input
              type="text"
              value={customTopik}
              onChange={(e) => setCustomTopik(e.target.value)}
              placeholder="Contoh: Fiqih Munakahat, Hak Nafkah, dan Ketahanan Keluarga"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* User Raw Input / Bullet points */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">
                Poin Masukan Lapangan / Kata Kunci / Hasil Rekaman Suara:
              </label>
              <span className="text-[11px] text-stone-400">Boleh ketik singkat, AI akan menyempurnakannya</span>
            </div>
            <textarea
              rows={3}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Ketik apa saja yang terjadi di lapangan, misal: ibu-ibu tanya cara pembagian nafkah, ada 35 jamaah, sepakat buat pengajian rutin bulanan..."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Sedang Merumuskan Narasi Berdampak..." : "Rumuskan Catatan & Dampak Nyata via AI"}</span>
            </button>
          </div>

          {/* AI Result Card */}
          {generatedResult && (
            <div className="mt-4 p-5 bg-stone-50 rounded-2xl border border-stone-300/80 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Hasil Rumusan AI Sesuai SE 29/2025
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  Siap Diterapkan
                </span>
              </div>

              {/* 1. Catatan Kegiatan Lapangan */}
              <div>
                <h5 className="text-xs font-bold text-stone-700 flex items-center space-x-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1. Catatan Kegiatan Lapangan (Metode & Dinamika Umat)</span>
                </h5>
                <p className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 leading-relaxed">
                  {generatedResult.catatanKegiatan}
                </p>
              </div>

              {/* 2. Dampak Nyata di Umat */}
              <div>
                <h5 className="text-xs font-bold text-stone-700 flex items-center space-x-1.5 mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Uraian Dampak Nyata di Umat (Bebas Seremoni Belaka)</span>
                </h5>
                <p className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-stone-800 leading-relaxed font-medium">
                  {generatedResult.dampakNyataUmat}
                </p>
              </div>

              {/* 3. Poin Kuantitatif */}
              <div>
                <h5 className="text-xs font-bold text-stone-700 flex items-center space-x-1.5 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>3. Indikator Kuantitatif Perubahan</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedResult.poinKuantitatif.map((p, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 flex items-start space-x-2">
                      <span className="font-bold text-emerald-700 shrink-0">•</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Rekomendasi Testimoni Otentik */}
              <div>
                <h5 className="text-xs font-bold text-stone-700 flex items-center space-x-1.5 mb-1.5">
                  <Quote className="w-3.5 h-3.5 text-emerald-700" />
                  <span>4. Rekomendasi Kutipan Testimoni Jamaah</span>
                </h5>
                <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs italic text-stone-700">
                  {generatedResult.rekomendasiTestimoni.isiKutipan}
                  <div className="mt-1 font-semibold not-italic text-[11px] text-emerald-800">
                    — {generatedResult.rekomendasiTestimoni.namaNarasumber} ({generatedResult.rekomendasiTestimoni.peran})
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>

          {generatedResult && (
            <button
              type="button"
              onClick={handleApplyToForm}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>Terapkan Langsung ke Formulir Laporan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
