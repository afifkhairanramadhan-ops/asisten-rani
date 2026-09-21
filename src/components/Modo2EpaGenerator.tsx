import React, { useState } from "react";
import { 
  Copy, Check, ExternalLink, FileText, UserCheck, 
  MapPin, Users, Calendar, Award, Sparkles, CheckCircle2,
  Printer, BookmarkCheck
} from "lucide-react";
import { Modo2EpaReport } from "../types";

interface Modo2Props {
  report: Modo2EpaReport | null;
  onNavigateToModo4?: () => void;
  onSaveReport?: () => void;
}

export const Modo2EpaGenerator: React.FC<Modo2Props> = ({ report, onNavigateToModo4, onSaveReport }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!report) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center space-y-3">
        <FileText className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold text-stone-800">Draf Laporan E-PA Belum Dibuat</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Silakan isi formulir atau pilih template pada tab MODO 1 dan klik "Audit & Generate Laporan E-PA" untuk menghasilkan draf LKP siap tempel.
        </p>
      </div>
    );
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2200);
  };

  const copyAllEpaFormat = () => {
    const fullText = `=== FORM LAPORAN KINERJA PENYULUH AGAMA ISLAM (E-PA KEMENAG) ===
Penyuluh: Rani Humaira, S.H.I. (KUA Kec. Nan Sabaris)
Tanggal Kegiatan: ${report.tanggalWaktu}

1. JUDUL KEGIATAN:
${report.judulKegiatan}

2. SASARAN BINAAN:
${report.sasaranBinaan}

3. WILAYAH BINAAN & LOKASI:
${report.wilayahBinaan} - ${report.lokasiSpesifik}

4. JUMLAH PESERTA (DATA KUANTITAS):
${report.jumlahPeserta} Orang Jamaah / Peserta Binaan

5. DESKRIPSI KEGIATAN BERDAMPAK (SE 29/2025):
${report.deskripsiBerdampak.teksLengkapLKP}

- Latar Belakang Masalah: ${report.deskripsiBerdampak.latarBelakangMasalah}
- Metode Bimbingan: ${report.deskripsiBerdampak.metodeBimbingan}
- Data Kuantitas: ${report.deskripsiBerdampak.dataKuantitas}
- Dampak / Hasil Akhir: ${report.deskripsiBerdampak.dampakHasilNyata}

6. TESTIMONI OTENTIK PENERIMA MANFAAT:
Narasumber: ${report.testimoniOtentik.namaNarasumber} (${report.testimoniOtentik.peran})
Kutipan: "${report.testimoniOtentik.isiKutipan}"
================================================================`;

    copyToClipboard(fullText, "all");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Actions */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              MODO 2
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Draf Laporan Kinerja LKP (epa.kemenag.go.id)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Format narasi dan isian telah distandarisasi sesuai kolom formulir input E-PA Kemenag RI dan juknis SE 29/2025.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-copy-all-epa"
            onClick={copyAllEpaFormat}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            {copiedField === "all" ? (
              <>
                <Check className="w-4 h-4 text-amber-300" />
                <span>Tersalin Semua!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Seluruh Format E-PA</span>
              </>
            )}
          </button>

          {onSaveReport && (
            <button
              id="btn-save-report-modo2"
              onClick={onSaveReport}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              title="Simpan laporan ini ke arsip penyimpanan digital"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-white" />
              <span>Simpan ke Arsip</span>
            </button>
          )}

          {onNavigateToModo4 && (
            <button
              onClick={onNavigateToModo4}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Cetak Evident PDF</span>
            </button>
          )}

          <a
            id="btn-open-epa-portal"
            href="https://epa.kemenag.go.id"
            target="_blank"
            rel="noreferrer noopener"
            className="px-4 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <span>Buka Portal E-PA</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          </a>
        </div>
      </div>

      {/* Form Fields Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Form Meta Fields */}
        <div className="md:col-span-4 space-y-4">
          {/* Judul Kegiatan */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Field 1: Judul Kegiatan
              </span>
              <button
                onClick={() => copyToClipboard(report.judulKegiatan, "judul")}
                className="text-stone-400 hover:text-emerald-700 p-1 cursor-pointer transition-colors"
                title="Salin Judul"
              >
                {copiedField === "judul" ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs font-bold text-stone-900 leading-snug">
              {report.judulKegiatan}
            </p>
          </div>

          {/* Sasaran Binaan */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Field 2: Sasaran Binaan
              </span>
              <button
                onClick={() => copyToClipboard(report.sasaranBinaan, "sasaran")}
                className="text-stone-400 hover:text-emerald-700 p-1 cursor-pointer transition-colors"
                title="Salin Sasaran"
              >
                {copiedField === "sasaran" ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs font-semibold text-stone-900">
              {report.sasaranBinaan}
            </p>
          </div>

          {/* Wilayah Binaan & Lokasi */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Field 3: Lokasi & Wilayah
              </span>
              <button
                onClick={() => copyToClipboard(`${report.wilayahBinaan} - ${report.lokasiSpesifik}`, "lokasi")}
                className="text-stone-400 hover:text-emerald-700 p-1 cursor-pointer transition-colors"
                title="Salin Lokasi"
              >
                {copiedField === "lokasi" ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs font-bold text-emerald-900">
              {report.wilayahBinaan}
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              {report.lokasiSpesifik}
            </p>
            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Tanggal: {report.tanggalWaktu}</span>
              <span className="font-bold text-emerald-800">{report.jumlahPeserta} Peserta</span>
            </div>
          </div>

          {/* Testimoni Box */}
          <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                Field 4: Testimoni Penerima Manfaat
              </span>
              <button
                onClick={() => copyToClipboard(`"${report.testimoniOtentik.isiKutipan}" (${report.testimoniOtentik.namaNarasumber} - ${report.testimoniOtentik.peran})`, "testimoni")}
                className="text-amber-800 hover:text-amber-950 p-1 cursor-pointer transition-colors"
                title="Salin Testimoni"
              >
                {copiedField === "testimoni" ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <blockquote className="text-xs italic text-amber-950 leading-relaxed border-l-2 border-amber-400 pl-2.5 my-2">
              "{report.testimoniOtentik.isiKutipan}"
            </blockquote>
            <p className="text-[11px] font-bold text-amber-900 text-right mt-1">
              — {report.testimoniOtentik.namaNarasumber} <span className="font-normal text-amber-800">({report.testimoniOtentik.peran})</span>
            </p>
          </div>
        </div>

        {/* Right Column: Deskripsi Kegiatan Berdampak (LKP Form Full Text) */}
        <div className="md:col-span-8 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  Field Utama: Uraian Kegiatan LKP
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1">
                  Deskripsi Kegiatan Berdampak (Sesuai SE No. 29 Tahun 2025)
                </h4>
              </div>
              <button
                id="btn-copy-lkp-text"
                onClick={() => copyToClipboard(report.deskripsiBerdampak.teksLengkapLKP, "lkpFull")}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer border border-emerald-200"
              >
                {copiedField === "lkpFull" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Narasi Lengkap</span>
                  </>
                )}
              </button>
            </div>

            {/* Complete ready-to-paste text box */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap selection:bg-emerald-100">
              {report.deskripsiBerdampak.teksLengkapLKP}
            </div>

            {/* Breakdown of SE 29 Sub-components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-stone-50/70 rounded-lg border border-stone-200/80 text-xs space-y-1">
                <span className="font-bold text-stone-700 block text-[11px] uppercase">
                  1. Latar Belakang Masalah Umat
                </span>
                <p className="text-stone-600">
                  {report.deskripsiBerdampak.latarBelakangMasalah}
                </p>
              </div>

              <div className="p-3 bg-stone-50/70 rounded-lg border border-stone-200/80 text-xs space-y-1">
                <span className="font-bold text-stone-700 block text-[11px] uppercase">
                  2. Metode Bimbingan Solutif
                </span>
                <p className="text-stone-600">
                  {report.deskripsiBerdampak.metodeBimbingan}
                </p>
              </div>

              <div className="p-3 bg-stone-50/70 rounded-lg border border-stone-200/80 text-xs space-y-1">
                <span className="font-bold text-stone-700 block text-[11px] uppercase">
                  3. Data Kuantitas Terverifikasi
                </span>
                <p className="text-stone-600">
                  {report.deskripsiBerdampak.dataKuantitas}
                </p>
              </div>

              <div className="p-3 bg-stone-50/70 rounded-lg border border-stone-200/80 text-xs space-y-1">
                <span className="font-bold text-emerald-800 block text-[11px] uppercase">
                  4. Dampak Nyata / Hasil Terukur
                </span>
                <p className="text-stone-600">
                  {report.deskripsiBerdampak.dampakHasilNyata}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
