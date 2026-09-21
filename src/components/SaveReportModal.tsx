import React, { useState } from "react";
import { 
  Bookmark, X, Check, Tag, MapPin, Calendar, 
  Users, CheckCircle2, ShieldCheck, FileCheck
} from "lucide-react";
import { SavedReport, EpaFullOutput, NagariType, SasaranBinaanType } from "../types";

interface SaveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: EpaFullOutput;
  defaultNagari: NagariType;
  defaultSasaran: SasaranBinaanType;
  defaultDate: string;
  defaultPesertaCount: number;
  locationName: string;
  gpsCoordinates: string;
  onSave: (report: SavedReport) => void;
}

export const SaveReportModal: React.FC<SaveReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
  defaultNagari,
  defaultSasaran,
  defaultDate,
  defaultPesertaCount,
  locationName,
  gpsCoordinates,
  onSave,
}) => {
  const [title, setTitle] = useState<string>(
    reportData?.modo2_epa?.judulKegiatan || "Laporan Kinerja Penyuluhan Agama Islam KUA Nan Sabaris"
  );
  const [status, setStatus] = useState<SavedReport["status"]>("Terverifikasi SE 29");
  const [tagInput, setTagInput] = useState<string>("Binaan, SE-29, KUA-NanSabaris");
  const [internalNotes, setInternalNotes] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = () => {
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newReport: SavedReport = {
      id: "report-" + Date.now(),
      createdAt: new Date().toISOString(),
      title: title.trim() || reportData.modo2_epa.judulKegiatan,
      nagari: defaultNagari,
      sasaran: defaultSasaran,
      pesertaCount: defaultPesertaCount,
      date: defaultDate,
      score: reportData.verification?.score || 95,
      fullData: reportData,
      status,
      locationName: locationName || reportData.modo2_epa.lokasiSpesifik,
      gpsCoordinates: gpsCoordinates || reportData.modo4_evident.rekomendasiFotoGeotag.lokasiKoordinat,
      tags,
      catatanInternal: internalNotes
    };

    onSave(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-stone-950">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold">Simpan Laporan ke Penyimpanan</h4>
              <p className="text-xs text-emerald-200">Arsip Digital Resmi Rani Humaira, S.H.I.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-5 space-y-4 text-xs text-stone-800">
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Judul Laporan Kinerja:
            </label>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Wilayah Binaan:
              </label>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 font-semibold truncate">
                {defaultNagari}
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Kelompok Sasaran:
              </label>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 font-semibold truncate">
                {defaultSasaran} ({defaultPesertaCount} Jamaah)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Lokasi & Titik GPS:
              </label>
              <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 font-mono text-[11px] truncate">
                {gpsCoordinates || "-0.6865, 100.2291"}
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Status Laporan:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SavedReport["status"])}
                className="w-full p-2 rounded-lg border border-stone-300 font-bold bg-white text-emerald-950 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Draf">Draf</option>
                <option value="Terverifikasi SE 29">Terverifikasi SE 29</option>
                <option value="Siap Unggah E-PA">Siap Unggah E-PA</option>
                <option value="Sudah Diunggah">Sudah Diunggah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Label / Kategori Tag (Pisahkan dengan koma):
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Contoh: MajelisTaklim, FiqihMunakahat, NagariSunuaTengah"
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Catatan Khusus Penyuluh (Opsional):
            </label>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Contoh: Sudah dikonsultasikan dengan Kepala KUA, siap cetak bukti fisik..."
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-amber-300" />
            <span>Simpan ke Arsip Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
