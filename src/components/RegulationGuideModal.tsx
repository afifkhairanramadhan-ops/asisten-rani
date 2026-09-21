import React from "react";
import { BookOpen, CheckCircle, Award, Scale, Users, ShieldAlert, Sparkles, X } from "lucide-react";
import { REGULATION_INFO } from "../data/presets";

interface RegulationGuideProps {
  onClose?: () => void;
}

export const RegulationGuide: React.FC<RegulationGuideProps> = ({ onClose }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Scale className="w-4 h-4" />
            <span>Landasan Yuridis & Juknis Kemenag RI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Regulasi Wajib Pembuatan Laporan Kinerja & Evident Penyuluh Agama
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-2 leading-relaxed">
            Pedoman resmi berdasarkan <strong>{REGULATION_INFO.seNumber}</strong> dan <strong>{REGULATION_INFO.suratPenguatan}</strong> bagi Penyuluh Agama Islam KUA Kecamatan Nan Sabaris, atas nama Rani Humaira, S.H.I.
          </p>
        </div>
      </div>

      {/* 5 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pilar 1 */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-1">
            01
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Berbasis Data & Berdampak (Data-Driven & Impact-Oriented)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Laporan <strong>TIDAK BOLEH</strong> sekadar berisi berita acara atau seremonial pembukaan belaka. Laporan WAJIB mencantumkan kuantitas/data angka peserta yang hadir secara riil serta dampak/perubahan positif yang terukur di tengah masyarakat binaan (seperti peningkatan literasi hukum perkawinan, penyelesaian sengketa keluarga sakinah, pengentasan buta aksara Qur'an).
          </p>
        </div>

        {/* Pilar 2 */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm mb-1">
            02
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Memuat Testimoni Otentik Penerima Manfaat
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Setiap laporan atau berkas evident <strong>WAJIB</strong> menyertakan kutipan/testimoni langsung dari jamaah, peserta majelis taklim, remaja masjid, atau tokoh masyarakat setempat yang merasakan faedah nyata dari bimbingan penyuluhan yang diselenggarakan.
          </p>
        </div>

        {/* Pilar 3 */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm mb-1">
            03
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Bebas Jargon & Klaim Tanpa Bukti
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Hindari narasi normatif berlebihan ("kegiatan berjalan lancar dan sukses") tanpa didukung bukti fisik terverifikasi. Berkas evident wajib dilengkapi bukti foto geotagging GPS, timestamp waktu nyata, notula bimbingan, dan daftar hadir bertandatangan basah.
          </p>
        </div>

        {/* Pilar 4 */}
        <div className="bg-white rounded-xl p-5 border border-stone-200/90 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-sm mb-1">
            04
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Fokus Kelembagaan (Kemenag & KUA Nan Sabaris)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Narasi publikasi maupun laporan teknis difokuskan pada peran, kepedulian, dan respon cepat KUA Kecamatan Nan Sabaris serta Kementerian Agama dalam mendampingi dan memberikan solusi keagamaan bagi umat, bukan semata-mata penonjolan figur individu.
          </p>
        </div>
      </div>

      {/* Wilayah Binaan & Standar Evident */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" />
          Ketentuan Khusus Penyuluh Rani Humaira, S.H.I. (KUA Nan Sabaris)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
            <span className="font-bold text-emerald-900 block">1. Nagari Sunua Tengah</span>
            <p className="text-stone-600">
              Koordinat Geotag Satelit: <strong className="font-mono text-stone-900">{REGULATION_INFO.coordinates["Nagari Sunua Tengah"].display}</strong>
            </p>
            <p className="text-stone-500">
              Kelompok binaan: Majelis Taklim Ibu-Ibu, Dasa Wisma, TPQ/MDTA Korong Kampung Ladang.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
            <span className="font-bold text-emerald-900 block">2. Nagari Sunua Barat</span>
            <p className="text-stone-600">
              Koordinat Geotag Satelit: <strong className="font-mono text-stone-900">{REGULATION_INFO.coordinates["Nagari Sunua Barat"].display}</strong>
            </p>
            <p className="text-stone-500">
              Kelompok binaan: Remaja Masjid / Karang Taruna (BRUN), BKMT Korong Pauh, Tokoh Adat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
