import React, { useState, useRef } from "react";
import { 
  History, Search, Filter, Trash2, Eye, Calendar, 
  MapPin, Users, CheckCircle2, Download, Upload, Copy,
  Printer, FileText, Sparkles, FolderArchive, ArrowUpDown,
  Tag, ShieldCheck, ExternalLink, BookmarkCheck
} from "lucide-react";
import { SavedReport, NagariType, PimpinanInfo } from "../types";
import { executePrintDocument, buildPrintableHtml } from "../utils/printDocument";
import { REGULATION_INFO } from "../data/presets";

interface HistoryArchiveProps {
  reports: SavedReport[];
  onSelectReport: (report: SavedReport) => void;
  onDeleteReport: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: SavedReport["status"]) => void;
  onDuplicateReport?: (report: SavedReport) => void;
  onImportReports?: (imported: SavedReport[]) => void;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onUpdateStatus,
  onDuplicateReport,
  onImportReports,
}) => {
  const [filterNagari, setFilterNagari] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed metrics
  const totalReports = reports.length;
  const totalJamaah = reports.reduce((acc, r) => acc + (r.pesertaCount || 0), 0);
  const sunuaTengahCount = reports.filter((r) => r.nagari === "Nagari Sunua Tengah").length;
  const sunuaBaratCount = reports.filter((r) => r.nagari === "Nagari Sunua Barat").length;
  const uploadedCount = reports.filter((r) => r.status === "Sudah Diunggah").length;

  const filteredReports = reports.filter((item) => {
    const matchesNagari = filterNagari === "all" || item.nagari === filterNagari;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sasaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nagari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesNagari && matchesStatus && matchesSearch;
  });

  // Export JSON Backup
  const exportAllReportsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `arsip_laporan_epa_kua_nansabaris_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV Table for Kemenag reporting
  const exportReportsCsv = () => {
    const headers = ["No", "Tanggal", "Judul Kegiatan", "Wilayah Binaan", "Lokasi", "Sasaran", "Jumlah Jamaah", "Skor SE-29", "Status", "Titik GPS"];
    const rows = reports.map((r, idx) => [
      idx + 1,
      r.date,
      `"${r.title.replace(/"/g, '""')}"`,
      r.nagari,
      `"${(r.locationName || r.fullData.modo2_epa.lokasiSpesifik).replace(/"/g, '""')}"`,
      r.sasaran,
      r.pesertaCount,
      `${r.score}%`,
      r.status,
      `"${r.gpsCoordinates || r.fullData.modo4_evident.rekomendasiFotoGeotag.lokasiKoordinat}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `rekap_kinerja_penyuluh_rani_humaira_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import JSON Backup handler
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && onImportReports) {
          onImportReports(parsed);
          alert(`Berhasil memulihkan ${parsed.length} laporan dari berkas cadangan.`);
        } else {
          alert("Format berkas cadangan JSON tidak sesuai.");
        }
      } catch (err) {
        alert("Gagal membaca berkas JSON: " + err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Instant Print from archive
  const handlePrintSingleReport = (report: SavedReport) => {
    const storedPimpinan = localStorage.getItem("kua_nan_sabaris_pimpinan_info");
    const pimpinan: PimpinanInfo = storedPimpinan ? JSON.parse(storedPimpinan) : REGULATION_INFO.pimpinan;

    const reportBodyHtml = `
      <div style="border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
        <div style="text-align: center; width: 100%;">
          <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0;">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 2px 0;">KANTOR KEMENTERIAN AGAMA KABUPATEN PADANG PARIAMAN</h4>
          <h2 style="font-size: 15px; font-weight: 800; text-transform: uppercase; margin: 2px 0;">KANTOR URUSAN AGAMA KECAMATAN NAN SABARIS</h2>
          <p style="font-size: 11px; margin: 0; color: #475569;">Pauh Kambar, Kec. Nan Sabaris, Kab. Padang Pariaman, Sumatera Barat</p>
        </div>
      </div>

      <div style="text-align: center; margin: 20px 0 16px 0;">
        <h3 style="font-size: 14px; font-weight: 700; text-decoration: underline; text-transform: uppercase; margin-bottom: 4px;">
          LEMBAR VERIFIKASI & BUKTI FISIK (EVIDENT) KEGIATAN BIMBINGAN PENYULUHAN
        </h3>
        <p style="font-size: 11px; color: #334155;">Dasar: Surat Edaran Sekjen Kemenag RI No. SE 29 Tahun 2025</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="width: 25%; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Nama Penyuluh</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px;">Rani Humaira, S.H.I.</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Satuan Kerja</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px;">KUA Kecamatan Nan Sabaris, Kab. Padang Pariaman</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Wilayah Binaan</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px;"><strong>${report.nagari}</strong> (Sesuai SK Penetapan)</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Sasaran Bimbingan</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px;">${report.sasaran}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Jumlah Peserta</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px;"><strong>${report.pesertaCount} Orang</strong> (Data Riil Lapangan)</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Waktu & Lokasi</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px;">${report.date} • ${report.locationName || report.fullData.modo2_epa.lokasiSpesifik}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Koordinat GPS</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px; font-family: monospace;">${report.gpsCoordinates || report.fullData.modo4_evident.rekomendasiFotoGeotag.lokasiKoordinat}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 10px;">Topik Bimbingan</td><td style="border: 1px solid #cbd5e1; padding: 6px 10px; font-weight: bold;">${report.title}</td></tr>
      </table>

      <div style="margin: 16px 0;">
        <h4 style="font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">Uraian Kegiatan & Dampak Nyata di Umat (SE 29/2025):</h4>
        <p style="font-size: 12px; line-height: 1.6; text-align: justify; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; background: #f8fafc;">
          ${report.fullData.modo2_epa.deskripsiBerdampak.teksLengkapLKP}
        </p>
      </div>

      <div style="margin: 16px 0;">
        <h4 style="font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">Testimoni Otentik Penerima Manfaat:</h4>
        <blockquote style="font-size: 12px; font-style: italic; border-left: 3px solid #065f46; padding: 8px 12px; background: #f0fdf4; margin: 0;">
          "${report.fullData.modo2_epa.testimoniOtentik.isiKutipan}"
          <div style="font-weight: bold; font-style: normal; margin-top: 4px; font-size: 11px;">
            — ${report.fullData.modo2_epa.testimoniOtentik.namaNarasumber} (${report.fullData.modo2_epa.testimoniOtentik.peran})
          </div>
        </blockquote>
      </div>

      ${(report.fullData.modo4_evident?.attachedPhotos && report.fullData.modo4_evident.attachedPhotos.length > 0) ? `
        <div style="margin: 20px 0; border-top: 1px solid #cbd5e1; padding-top: 14px; page-break-inside: avoid;">
          <h4 style="font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">
            Lampiran Foto Dokumentasi Kegiatan Ber-Geotag (${report.fullData.modo4_evident.attachedPhotos.length} Foto):
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${report.fullData.modo4_evident.attachedPhotos.map((p, idx) => `
              <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; background: #f8fafc; page-break-inside: avoid;">
                <div style="position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: #0f172a;">
                  <img src="${p.url}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.9); color: #ffffff; padding: 6px 8px; font-size: 9px; line-height: 1.3;">
                    <div style="display: flex; justify-content: space-between; color: #facc15; font-weight: bold;">
                      <span>KUA KEC. NAN SABARIS</span>
                      <span>FOTO #${idx + 1}</span>
                    </div>
                    <div style="color: #6ee7b7; font-family: monospace;">GPS: ${p.coordinates || report.gpsCoordinates || "-0.6865, 100.2291"}</div>
                    <div style="color: #cbd5e1; font-size: 8px;">${p.timestamp || report.date} • ${report.nagari}</div>
                  </div>
                </div>
                <div style="margin-top: 6px; font-size: 10px; color: #1e293b;">
                  <strong style="color: #065f46; display: block; font-size: 9px; text-transform: uppercase;">[${p.category || "Dokumentasi Kegiatan"}]</strong>
                  ${p.caption}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <table class="signature-table" style="width: 100%; border-collapse: collapse; border: none; margin-top: 36px; page-break-inside: avoid;">
        <tbody>
          <tr style="border: none;">
            <td style="width: 50%; border: none; text-align: center; vertical-align: top; padding: 0 16px;">
              <p style="font-size: 12px; margin: 0 0 2px 0;">Mengetahui,</p>
              <p style="font-size: 12px; font-weight: bold; margin: 0;">${pimpinan.jabatan}</p>
              <div class="signature-space" style="height: 85px; min-height: 85px; width: 100%;"></div>
              <p style="font-size: 12px; font-weight: bold; text-decoration: underline; margin: 0;">${pimpinan.nama}</p>
              <p style="font-size: 11px; color: #475569; font-family: monospace; margin: 2px 0 0 0;">NIP. ${pimpinan.nip}</p>
            </td>
            <td style="width: 50%; border: none; text-align: center; vertical-align: top; padding: 0 16px;">
              <p style="font-size: 12px; margin: 0 0 2px 0;">Pauh Kambar, ${report.date}</p>
              <p style="font-size: 12px; font-weight: bold; margin: 0;">Penyuluh Agama Islam Fungsional,</p>
              <div class="signature-space" style="height: 85px; min-height: 85px; width: 100%;"></div>
              <p style="font-size: 12px; font-weight: bold; text-decoration: underline; margin: 0;">Rani Humaira, S.H.I.</p>
              <p style="font-size: 11px; color: #475569; margin: 2px 0 0 0;">Penyuluh KUA Nan Sabaris</p>
            </td>
          </tr>
        </tbody>
      </table>
    `;

    executePrintDocument(`Evident_${report.title.slice(0, 25)}`, reportBodyHtml);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-800 text-amber-300 shadow-md">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Penyimpanan & Arsip Laporan Kinerja (E-PA)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Basis data bimbingan penyuluhan resmi Rani Humaira, S.H.I. (KUA Kecamatan Nan Sabaris).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJsonFile}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Pulihkan data laporan dari cadangan JSON"
          >
            <Upload className="w-3.5 h-3.5 text-stone-600" />
            <span>Impor Cadangan</span>
          </button>

          {reports.length > 0 && (
            <>
              <button
                type="button"
                onClick={exportReportsCsv}
                className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Unduh rekapitulasi data format tabel CSV/Excel"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Rekap CSV/Excel</span>
              </button>

              <button
                type="button"
                onClick={exportAllReportsJson}
                className="px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Cadangkan semua data laporan ke berkas JSON"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Cadangan JSON</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Laporan Tersimpan</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-stone-900">{totalReports}</span>
            <span className="text-xs text-stone-400">Berkas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Jamaah Terbina</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-800">{totalJamaah}</span>
            <span className="text-xs text-emerald-600 font-semibold">Orang</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Cakupan Wilayah Binaan</span>
          <div className="text-xs text-stone-700 mt-1 font-semibold space-y-0.5">
            <div>Sunua Tengah: <strong className="text-stone-900">{sunuaTengahCount}</strong> lap</div>
            <div>Sunua Barat: <strong className="text-stone-900">{sunuaBaratCount}</strong> lap</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Status Unggah ke E-PA</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-amber-700">{uploadedCount}</span>
            <span className="text-xs text-stone-500">dari {totalReports} Terunggah</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari judul, sasaran, nagari, atau label..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filter Nagari */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={filterNagari}
              onChange={(e) => setFilterNagari(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
            >
              <option value="all">Semua Wilayah Binaan</option>
              <option value="Nagari Sunua Tengah">Nagari Sunua Tengah</option>
              <option value="Nagari Sunua Barat">Nagari Sunua Barat</option>
            </select>
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
          >
            <option value="all">Semua Status Laporan</option>
            <option value="Draf">Draf</option>
            <option value="Terverifikasi SE 29">Terverifikasi SE 29</option>
            <option value="Siap Unggah E-PA">Siap Unggah E-PA</option>
            <option value="Sudah Diunggah">Sudah Diunggah</option>
          </select>
        </div>
      </div>

      {/* Reports List Cards */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3 shadow-xs">
          <FileText className="w-12 h-12 text-stone-400 mx-auto" />
          <h4 className="text-base font-bold text-stone-800">
            {reports.length === 0 ? "Belum Ada Laporan Tersimpan di Arsip" : "Tidak Ada Laporan yang Sesuai Filter"}
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {reports.length === 0
              ? "Anda dapat menyimpan laporan kapan saja dari formulir MODO 1, MODO 2 (Generator E-PA), atau MODO 4 (Evident)."
              : "Silakan ubah kata kunci pencarian atau sesuaikan filter wilayah dan status di atas."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.sasaran}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateStatus(item.id, e.target.value as SavedReport["status"])}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                        item.status === "Sudah Diunggah"
                          ? "bg-blue-50 text-blue-900 border-blue-200"
                          : item.status === "Siap Unggah E-PA"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                          : item.status === "Terverifikasi SE 29"
                          ? "bg-amber-50 text-amber-900 border-amber-300"
                          : "bg-stone-100 text-stone-700 border-stone-300"
                      }`}
                    >
                      <option value="Draf">Draf</option>
                      <option value="Terverifikasi SE 29">Terverifikasi SE 29</option>
                      <option value="Siap Unggah E-PA">Siap Unggah E-PA</option>
                      <option value="Sudah Diunggah">Sudah Diunggah</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                {/* Info Metadata */}
                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 mr-1.5 shrink-0" />
                    <span className="font-semibold text-emerald-900">{item.nagari}</span>
                    <span className="text-stone-400 mx-1">•</span>
                    <span className="text-stone-500 truncate">{item.locationName || item.fullData.modo2_epa.lokasiSpesifik}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                      <span>{item.pesertaCount} Jamaah Hadir</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* GPS Tag Coordinates */}
                  <div className="flex items-center text-[11px] font-mono text-stone-500">
                    <span className="text-emerald-700 font-bold mr-1">GPS:</span>
                    <span>{item.gpsCoordinates || item.fullData.modo4_evident.rekomendasiFotoGeotag.lokasiKoordinat}</span>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tg, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Skor SE 29: <strong className="text-emerald-700 font-bold">{item.score}%</strong>
                </span>

                <div className="flex items-center space-x-1.5">
                  {/* Clone button */}
                  {onDuplicateReport && (
                    <button
                      type="button"
                      onClick={() => onDuplicateReport(item)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Duplikasi Laporan untuk Tanggal Baru"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}

                  {/* Print directly */}
                  <button
                    type="button"
                    onClick={() => handlePrintSingleReport(item)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Cetak Berkas Evident PDF Laporan Ini"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus laporan "${item.title.slice(0, 30)}..." dari penyimpanan?`)) {
                        onDeleteReport(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Laporan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Open & Edit in Workspace */}
                  <button
                    type="button"
                    onClick={() => onSelectReport(item)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Laporan</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
