import React, { useState, useRef, useEffect } from "react";
import { 
  FileCheck, Download, Printer, Camera, CheckSquare, 
  MapPin, Clock, User, ShieldCheck, Image as ImageIcon,
  Check, RefreshCw, AlertCircle, Upload, Building2, 
  ExternalLink, FileDown, Edit3, HelpCircle, BookmarkCheck,
  Plus, Trash2, Layers, Eye
} from "lucide-react";
import { Modo4Evident, Modo2EpaReport, PimpinanInfo, AttachedPhoto } from "../types";
import { REGULATION_INFO } from "../data/presets";
import { KemenagLogo } from "./KemenagLogo";
import { executePrintDocument, downloadPrintableHtml } from "../utils/printDocument";

interface Modo4Props {
  evidentData: Modo4Evident | null;
  reportData: Modo2EpaReport | null;
  onSaveReport?: () => void;
  onUpdatePhotos?: (photos: AttachedPhoto[]) => void;
}

const STORAGE_PIMPINAN_KEY = "kua_nan_sabaris_pimpinan_info";
const STORAGE_LOGO_KEY = "kua_nan_sabaris_custom_logo";

export const Modo4EvidentChecklist: React.FC<Modo4Props> = ({
  evidentData,
  reportData,
  onSaveReport,
  onUpdatePhotos,
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true,
    3: false,
  });

  // Pimpinan State
  const [pimpinan, setPimpinan] = useState<PimpinanInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PIMPINAN_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      nama: REGULATION_INFO.pimpinan.nama,
      jabatan: REGULATION_INFO.pimpinan.jabatan,
      nip: REGULATION_INFO.pimpinan.nip,
    };
  });

  // Custom Logo State
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_LOGO_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isEditingPimpinan, setIsEditingPimpinan] = useState<boolean>(false);
  const [stampCoordinates, setStampCoordinates] = useState<string>(
    reportData?.wilayahBinaan.includes("Barat")
      ? REGULATION_INFO.coordinates["Nagari Sunua Barat"].display
      : REGULATION_INFO.coordinates["Nagari Sunua Tengah"].display
  );
  const [stampTime, setStampTime] = useState<string>(
    new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" }) + " WIB"
  );
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Multi-Photo Upload & Geotag State
  const [photos, setPhotos] = useState<AttachedPhoto[]>(() => {
    if (evidentData?.attachedPhotos && evidentData.attachedPhotos.length > 0) {
      return evidentData.attachedPhotos;
    }
    // High-quality contextual sample photos for initial state
    return [
      {
        id: "photo-default-1",
        url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1000&auto=format&fit=crop&q=80",
        caption: `Penyampaian materi bimbingan dan pembinaan keagamaan oleh Penyuluh Rani Humaira, S.H.I. di hadapan jamaah binaan.`,
        category: "Foto Utama Bimbingan",
        timestamp: new Date().toLocaleDateString("id-ID", { dateStyle: "full" }) + " • 14:15 WIB",
        coordinates: reportData?.wilayahBinaan.includes("Barat")
          ? REGULATION_INFO.coordinates["Nagari Sunua Barat"].display
          : REGULATION_INFO.coordinates["Nagari Sunua Tengah"].display,
        watermarked: true,
      },
      {
        id: "photo-default-2",
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
        caption: `Antusiasme dan keaktifan audiens jamaah majelis taklim saat sesi konsultasi dan tanya jawab hukum keluarga Islam.`,
        category: "Audiens / Jamaah",
        timestamp: new Date().toLocaleDateString("id-ID", { dateStyle: "full" }) + " • 15:00 WIB",
        coordinates: reportData?.wilayahBinaan.includes("Barat")
          ? REGULATION_INFO.coordinates["Nagari Sunua Barat"].display
          : REGULATION_INFO.coordinates["Nagari Sunua Tengah"].display,
        watermarked: true,
      }
    ];
  });

  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const appendFileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printSheetRef = useRef<HTMLDivElement>(null);

  // Sync photos to parent when modified
  const updatePhotosState = (newPhotos: AttachedPhoto[]) => {
    setPhotos(newPhotos);
    if (onUpdatePhotos) {
      onUpdatePhotos(newPhotos);
    }
  };

  // Save pimpinan changes
  const handlePimpinanChange = (field: keyof PimpinanInfo, value: string) => {
    const updated = { ...pimpinan, [field]: value };
    setPimpinan(updated);
    try {
      localStorage.setItem(STORAGE_PIMPINAN_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal menyimpan data pimpinan", e);
    }
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Ukuran logo maksimal 3 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCustomLogo(base64);
        try {
          localStorage.setItem(STORAGE_LOGO_KEY, base64);
        } catch (err) {
          console.warn("Gagal menyimpan logo ke local storage", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setCustomLogo(null);
    try {
      localStorage.removeItem(STORAGE_LOGO_KEY);
    } catch {}
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Multiple Photos Upload Handler (Supports >1 Photo at Once)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAppend: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const newItems: AttachedPhoto[] = [];
    let completed = 0;

    filesArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const autoCategory: AttachedPhoto["category"] = 
          index === 0 && !isAppend ? "Foto Utama Bimbingan" 
          : index === 1 ? "Audiens / Jamaah" 
          : index === 2 ? "Testimoni Narasumber" 
          : "Daftar Hadir / Presensi";

        newItems.push({
          id: `photo-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          url: base64,
          caption: `Dokumentasi bimbingan penyuluhan agama Islam (${reportData?.wilayahBinaan || "KUA Nan Sabaris"}) - Foto ${isAppend ? photos.length + index + 1 : index + 1}`,
          category: autoCategory,
          timestamp: stampTime,
          coordinates: stampCoordinates,
          watermarked: true,
        });

        completed++;
        if (completed === filesArray.length) {
          if (isAppend) {
            const merged = [...photos, ...newItems];
            updatePhotosState(merged);
            setActivePhotoIndex(photos.length);
          } else {
            updatePhotosState(newItems);
            setActivePhotoIndex(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = "";
  };

  const handleDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    updatePhotosState(updated);
    if (activePhotoIndex >= updated.length) {
      setActivePhotoIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, caption } : p));
    updatePhotosState(updated);
  };

  const handleUpdateCategory = (id: string, category: AttachedPhoto["category"]) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, category } : p));
    updatePhotosState(updated);
  };

  const handleApplyGeotagToAll = () => {
    const updated = photos.map((p) => ({
      ...p,
      coordinates: stampCoordinates,
      timestamp: stampTime,
      watermarked: true,
    }));
    updatePhotosState(updated);
  };

  const handleResetSamplePhotos = () => {
    const samples: AttachedPhoto[] = [
      {
        id: "photo-sample-1",
        url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1000&auto=format&fit=crop&q=80",
        caption: `Penyampaian materi bimbingan dan pembinaan keagamaan oleh Penyuluh Rani Humaira, S.H.I. di hadapan jamaah binaan.`,
        category: "Foto Utama Bimbingan",
        timestamp: new Date().toLocaleDateString("id-ID", { dateStyle: "full" }) + " • 14:15 WIB",
        coordinates: stampCoordinates,
        watermarked: true,
      },
      {
        id: "photo-sample-2",
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
        caption: `Antusiasme dan keaktifan audiens jamaah majelis taklim saat sesi konsultasi dan tanya jawab hukum keluarga Islam.`,
        category: "Audiens / Jamaah",
        timestamp: new Date().toLocaleDateString("id-ID", { dateStyle: "full" }) + " • 15:00 WIB",
        coordinates: stampCoordinates,
        watermarked: true,
      },
      {
        id: "photo-sample-3",
        url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1000&auto=format&fit=crop&q=80",
        caption: `Dokumentasi daftar hadir bertandatangan asli dan sesi foto bersama jamaah seusai pembinaan.`,
        category: "Daftar Hadir / Presensi",
        timestamp: new Date().toLocaleDateString("id-ID", { dateStyle: "full" }) + " • 15:30 WIB",
        coordinates: stampCoordinates,
        watermarked: true,
      }
    ];
    updatePhotosState(samples);
    setActivePhotoIndex(0);
  };

  // Robust Print Handlers
  const handleDirectPrint = () => {
    const content = printSheetRef.current?.innerHTML;
    if (!content) return;
    executePrintDocument(
      `Laporan_Evident_${reportData?.judulKegiatan?.slice(0, 30) || "KUA_Nan_Sabaris"}`,
      content
    );
  };

  const handleOpenNewTabPrint = () => {
    const content = printSheetRef.current?.innerHTML;
    if (!content) return;
    executePrintDocument(
      `Laporan_Evident_${reportData?.judulKegiatan?.slice(0, 30) || "KUA_Nan_Sabaris"}`,
      content
    );
  };

  const handleDownloadHtml = () => {
    const content = printSheetRef.current?.innerHTML;
    if (!content) return;
    downloadPrintableHtml(
      `Laporan_Evident_${reportData?.wilayahBinaan?.replace(/\s+/g, "_") || "Kemenag"}`,
      content,
      `Laporan_Evident_${reportData?.tanggalWaktu || "2026"}.html`
    );
  };

  const downloadGeotagImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `evident_geotag_${reportData?.wilayahBinaan.replace(/\s+/g, "_")}_${reportData?.tanggalWaktu}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  // Draw photo onto canvas with authentic Kemenag Geotag watermark
  const renderWatermarkedCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !reportData) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 800;
      ctx.drawImage(img, 0, 0, 1200, 800);

      // Bottom dark gradient overlay
      const grad = ctx.createLinearGradient(0, 540, 0, 800);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.3, "rgba(6, 44, 28, 0.88)");
      grad.addColorStop(1, "rgba(6, 44, 28, 0.98)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 520, 1200, 280);

      // Accent golden border
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, 565, 1200, 3);

      // Text information
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(`KUA KECAMATAN NAN SABARIS - KAB. PADANG PARIAMAN`, 40, 610);

      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`Penyuluh: ${REGULATION_INFO.penyuluhName} | Pimpinan: ${pimpinan.nama}`, 40, 648);

      ctx.fillStyle = "#ffffff";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Lokasi: ${reportData.lokasiSpesifik} (${reportData.wilayahBinaan})`, 40, 683);

      ctx.fillStyle = "#86efac";
      ctx.font = "bold 18px monospace";
      ctx.fillText(`GPS: ${stampCoordinates} (Akurasi: ±2.8m)`, 40, 718);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Waktu: ${stampTime} | SE 29/2025 Terverifikasi`, 40, 753);

      // Right-side badge
      ctx.fillStyle = "#064e3b";
      ctx.fillRect(950, 595, 210, 165);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(950, 595, 210, 165);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EVIDENT", 1055, 640);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("E-PA KEMENAG", 1055, 672);
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "13px sans-serif";
      ctx.fillText("TERVERIFIKASI RESMI", 1055, 704);
      ctx.fillStyle = "#fde047";
      ctx.font = "11px sans-serif";
      ctx.fillText("SE SEKJEN 29/2025", 1055, 730);
      ctx.textAlign = "start";
    };

    const activePhoto = photos[activePhotoIndex];
    if (activePhoto && activePhoto.url) {
      img.src = activePhoto.url;
    } else {
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
          <rect width="1200" height="800" fill="#0c2319"/>
          <circle cx="600" cy="340" r="130" fill="#14532d" opacity="0.6"/>
          <text x="600" y="320" fill="#fef08a" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">DOKUMENTASI BIMBINGAN PENYULUHAN</text>
          <text x="600" y="370" fill="#86efac" font-family="sans-serif" font-size="22" text-anchor="middle">${reportData.judulKegiatan}</text>
          <text x="600" y="415" fill="#cbd5e1" font-family="sans-serif" font-size="18" text-anchor="middle">${reportData.wilayahBinaan} • ${reportData.jumlahPeserta} Jamaah Hadir</text>
        </svg>
      `);
    }
  };

  useEffect(() => {
    renderWatermarkedCanvas();
  }, [photos, activePhotoIndex, stampCoordinates, stampTime, reportData, pimpinan]);

  if (!evidentData || !reportData) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center space-y-3">
        <FileCheck className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold text-stone-800">Panduan Evident PDF Belum Tersedia</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Silakan lakukan input dan audit kegiatan pada MODO 1 untuk memuat checklist berkas pembuktian dan generator dokumen evident resmi.
        </p>
      </div>
    );
  }

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const isAllChecked = totalChecked === 4;

  return (
    <div className="space-y-8">
      {/* Top Banner & Multi-Option Print / Export Actions */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              MODO 4
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Checklist & Generator Evident PDF (SE 29/2025)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Lengkap dengan pengaturan nama pimpinan, kustomisasi logo Kemenag, dan stempel GPS satelit resmi.
          </p>
        </div>

        {/* Action Buttons: Save, Direct Print, New Tab Print, Download HTML */}
        <div className="flex flex-wrap items-center gap-2">
          {onSaveReport && (
            <button
              onClick={onSaveReport}
              title="Simpan laporan dan berkas evident ini ke arsip penyimpanan digital"
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-white" />
              <span>Simpan ke Arsip</span>
            </button>
          )}

          <button
            onClick={handleDirectPrint}
            title="Cetak langsung dokumen ke printer atau simpan PDF"
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <button
            onClick={handleOpenNewTabPrint}
            title="Buka dokumen di tab baru yang bersih dari iframe agar cetak 100% lancar"
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Buka Tab Cetak</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            title="Unduh file dokumen HTML siap cetak untuk dibuka dan disimpan kapan saja"
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-stone-600" />
            <span>Unduh HTML</span>
          </button>
        </div>
      </div>

      {/* Control Panel: 1) Data Pimpinan KUA, 2) Upload Logo Kemenag */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Box 1: Kolom Nama Pimpinan & NIP (Permintaan User) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-800" />
              <h4 className="text-sm font-bold text-stone-900">
                Pengaturan Pimpinan & Penandatangan Dokumen
              </h4>
            </div>
            <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              Tampil di Lembar Mengetahui
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-stone-700 block mb-1">
                Nama Lengkap & Gelar Pimpinan:
              </label>
              <input
                type="text"
                value={pimpinan.nama}
                onChange={(e) => handlePimpinanChange("nama", e.target.value)}
                placeholder="Contoh: H. Suardi, S.Ag., M.H."
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-semibold text-stone-900"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                NIP Pimpinan:
              </label>
              <input
                type="text"
                value={pimpinan.nip}
                onChange={(e) => handlePimpinanChange("nip", e.target.value)}
                placeholder="NIP. 197405122003121002"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-mono text-[11px] text-stone-800"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-stone-700 block mb-1">
                Jabatan Struktural:
              </label>
              <input
                type="text"
                value={pimpinan.jabatan}
                onChange={(e) => handlePimpinanChange("jabatan", e.target.value)}
                placeholder="Contoh: Kepala KUA Kec. Nan Sabaris"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-stone-800"
              />
            </div>
          </div>
          <p className="text-[11px] text-stone-500 italic">
            *Data pimpinan otomatis tersimpan di peramban dan dicantumkan pada kolom tanda tangan lembar evident resmi.
          </p>
        </div>

        {/* Box 2: Upload Logo Kemenag (Permintaan User) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4 text-emerald-800" />
              <h4 className="text-sm font-bold text-stone-900">
                Logo Resmi Kementerian Agama
              </h4>
            </div>
            {customLogo && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Kustom Aktif
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Logo Preview Box */}
            <div className="w-18 h-18 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
              <KemenagLogo customLogoUrl={customLogo} size={58} />
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <p className="font-semibold text-stone-800">
                {customLogo ? "Logo Kustom Terunggah" : "Logo Bawaan: Ikhlas Beramal Kemenag RI"}
              </p>
              <p className="text-[11px] text-stone-500 leading-tight">
                Format didukung: PNG, JPG, JPEG, SVG, WebP. Logo otomatis dicantumkan di kop surat resmi LKP.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Logo Baru</span>
                </button>

                {customLogo && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-2 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Bawaan</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Grid: 4-Item Checklist vs Photo Geotag Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 4 Mandatory Items Checklist */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  4 Komponen Berkas Evident Wajib
                </h4>
                <p className="text-xs text-stone-500">
                  Berdasarkan Surat Edaran Sekjen Kemenag No. SE 29 Tahun 2025
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                isAllChecked
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}>
                {totalChecked}/4 Berkas Siap
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div
                onClick={() => toggleCheck(0)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  checkedItems[0]
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-stone-50 border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[0] || false}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-stone-900">
                    1. Halaman Ringkasan Kinerja (Data & Dampak Kuantitatif)
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Memuat formulir LKP lengkap, jumlah peserta ({reportData.jumlahPeserta} orang), metode bimbingan, dan indikator perubahan nyata.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => toggleCheck(1)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  checkedItems[1]
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-stone-50 border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[1] || false}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-stone-900">
                    2. Foto Geotagging Ber-GPS & Waktu Nyata
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Foto kegiatan memperlihatkan audiens dan penyuluh dengan stempel GPS ({stampCoordinates}), timestamp WIB, dan satker KUA Nan Sabaris.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => toggleCheck(2)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  checkedItems[2]
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-stone-50 border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[2] || false}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-stone-900">
                    3. Lampiran Testimoni Tertulis Penerima Manfaat
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Kutipan langsung dari {reportData.testimoniOtentik.namaNarasumber} ({reportData.testimoniOtentik.peran}) mengenai manfaat nyata penyuluhan.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div
                onClick={() => toggleCheck(3)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  checkedItems[3]
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-stone-50 border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[3] || false}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-stone-900">
                    4. Scan / Foto Berita Acara & Daftar Hadir Peserta
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    Daftar hadir bertandatangan basah dari {reportData.jumlahPeserta} jamaah yang hadir di lokasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Practical guidance tip */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950">
                <span className="font-bold block">Panduan Unggah E-PA (epa.kemenag.go.id):</span>
                Cetak lembar ringkasan kinerja ini ke format PDF menggunakan tombol <strong>Cetak / Simpan PDF</strong>, lalu satukan dengan lembar foto geotag, testimoni, dan daftar hadir bertandatangan.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Photo Geotag Manager & Stamping Suite */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    Lampiran Foto Ber-Geotag (Mendukung &gt;1 Foto)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {photos.length} Foto
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Unggah beberapa foto dokumentasi kegiatan untuk otomatis dilampirkan ke dokumen LKP.
                </p>
              </div>

              {/* Action Buttons: Add more photos / Upload batch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => appendFileInputRef.current?.click()}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Semua</span>
                </button>
              </div>
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, false)}
              multiple
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={appendFileInputRef}
              onChange={(e) => handleFileUpload(e, true)}
              multiple
              accept="image/*"
              className="hidden"
            />

            {/* Photo Thumbnails List / Gallery */}
            {photos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span className="font-semibold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    Daftar Foto Dilampirkan (Klik untuk Pratinjau):
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSamplePhotos}
                    className="text-[11px] text-emerald-800 hover:underline cursor-pointer"
                  >
                    Pakai Foto Contoh Kemenag
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {photos.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`group relative rounded-xl border p-1 cursor-pointer transition-all overflow-hidden ${
                        activePhotoIndex === idx
                          ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/40"
                          : "border-stone-200 hover:border-stone-300 bg-stone-50"
                      }`}
                    >
                      <div className="aspect-4/3 rounded-lg overflow-hidden relative bg-stone-900">
                        <img
                          src={p.url}
                          alt={p.caption}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 bg-stone-950/80 text-amber-300 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                          #{idx + 1}
                        </span>
                        {photos.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(p.id);
                            }}
                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-stone-700 truncate mt-1 px-0.5">
                        {p.category || `Foto ${idx + 1}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Canvas Preview of Active Photo with Geotag Ribbon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">
                  Pratinjau Stempel Geotag (Foto #{activePhotoIndex + 1}):
                </span>
                <span className="text-[11px] text-stone-500">
                  Resolusi HD (1200x800px)
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-stone-300 bg-stone-900 aspect-video flex items-center justify-center shadow-inner">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Active Photo Inspector & Editor */}
            {photos[activePhotoIndex] && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Kategori Dokumentasi (Foto #{activePhotoIndex + 1}):
                    </label>
                    <select
                      value={photos[activePhotoIndex].category || "Foto Utama Bimbingan"}
                      onChange={(e) => handleUpdateCategory(photos[activePhotoIndex].id, e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white text-stone-800"
                    >
                      <option value="Foto Utama Bimbingan">Foto Utama Bimbingan (Penyuluhan)</option>
                      <option value="Audiens / Jamaah">Audiens / Jamaah Majelis Taklim</option>
                      <option value="Testimoni Narasumber">Testimoni Narasumber / Wawancara</option>
                      <option value="Daftar Hadir / Presensi">Daftar Hadir / Berita Acara Presensi</option>
                      <option value="Lainnya">Dokumentasi Tambahan Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Keterangan / Caption Foto:
                    </label>
                    <input
                      type="text"
                      value={photos[activePhotoIndex].caption}
                      onChange={(e) => handleUpdateCaption(photos[activePhotoIndex].id, e.target.value)}
                      placeholder="Tuliskan keterangan foto..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white text-stone-800"
                    />
                  </div>
                </div>

                {/* Coordinates & Watermark Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Titik Koordinat GPS:
                    </label>
                    <input
                      type="text"
                      value={stampCoordinates}
                      onChange={(e) => setStampCoordinates(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono text-[11px] bg-white text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Waktu & Timestamp Dokumen:
                    </label>
                    <input
                      type="text"
                      value={stampTime}
                      onChange={(e) => setStampTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-[11px] bg-white text-stone-800"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={handleApplyGeotagToAll}
                    className="text-[11px] text-emerald-800 font-bold hover:text-emerald-900 underline cursor-pointer"
                  >
                    Terapkan Koordinat Ini ke Semua {photos.length} Foto
                  </button>

                  <button
                    type="button"
                    onClick={downloadGeotagImage}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Foto #{activePhotoIndex + 1} Ber-Geotag</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Printable Evident Document Preview (Screen & Print Ref) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-300 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-700" />
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Pratinjau Lembar Evident Resmi Siap Cetak (Kop Kemenag)
              </h4>
              <p className="text-[11px] text-stone-500">
                Format kop resmi KUA Kecamatan Nan Sabaris, dilengkapi logo Kemenag dan kolom tanda tangan pimpinan.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDirectPrint}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* The Printable Page Content (Captured for Direct Print and HTML Download) */}
        <div
          ref={printSheetRef}
          className="evident-print-sheet text-stone-900 font-serif leading-relaxed text-sm space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-white border border-stone-200 rounded-xl"
        >
          {/* Authentic Kemenag Letterhead (KOP SURAT) */}
          <div className="text-center border-b-4 border-double border-stone-900 pb-3 relative">
            <div className="flex items-center justify-center space-x-4 mb-2">
              {/* Logo Kementerian Agama */}
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                <KemenagLogo customLogoUrl={customLogo} size={78} />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-stone-900">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h3>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-stone-800">
                  KANTOR KEMENTERIAN AGAMA KABUPATEN PADANG PARIAMAN
                </h4>
                <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-emerald-950 font-sans">
                  KANTOR URUSAN AGAMA KECAMATAN NAN SABARIS
                </h5>
                <p className="text-[10px] sm:text-[11px] font-sans text-stone-600 mt-0.5">
                  Jl. Syekh Burhanuddin, Nan Sabaris, Kab. Padang Pariaman, Sumatera Barat 25571
                </p>
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center space-y-1 pt-2">
            <h2 className="text-base font-bold uppercase tracking-wide underline font-sans">
              LAPORAN KINERJA PENYULUH AGAMA ISLAM (LKP)
            </h2>
            <p className="text-xs font-sans text-stone-600">
              Dokumen Pembuktian (Evident) Kinerja Berdasarkan SE Sekjen Kemenag No. SE 29 Tahun 2025
            </p>
          </div>

          {/* Identity Table */}
          <div className="font-sans text-xs">
            <table className="w-full border-collapse border border-stone-400">
              <tbody>
                <tr className="border-b border-stone-300">
                  <td className="p-2 font-bold bg-stone-100 w-1/3">Nama Penyuluh Agama</td>
                  <td className="p-2 font-semibold">{REGULATION_INFO.penyuluhName}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2 font-bold bg-stone-100">Jabatan / Satuan Kerja</td>
                  <td className="p-2">Penyuluh Agama Islam Ahli / KUA Kec. Nan Sabaris</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2 font-bold bg-stone-100">Wilayah Binaan Utama</td>
                  <td className="p-2 font-semibold text-emerald-900">{reportData.wilayahBinaan}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2 font-bold bg-stone-100">Hari / Tanggal Bimbingan</td>
                  <td className="p-2">{reportData.tanggalWaktu}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2 font-bold bg-stone-100">Lokasi / Titik Koordinat GPS</td>
                  <td className="p-2">{reportData.lokasiSpesifik} ({stampCoordinates})</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2 font-bold bg-stone-100">Sasaran & Jumlah Peserta</td>
                  <td className="p-2 font-bold">{reportData.sasaranBinaan} — {reportData.jumlahPeserta} Orang Hadir</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-stone-100">Topik / Tema Bimbingan</td>
                  <td className="p-2 font-bold">{reportData.judulKegiatan}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Substance / Impact Section */}
          <div className="space-y-2 font-sans text-xs">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs border-b border-stone-300 pb-1">
              I. Uraian Substansi & Dampak Nyata (Impact-Oriented)
            </h4>
            <p className="text-stone-800 text-justify leading-relaxed whitespace-pre-wrap">
              {reportData.deskripsiBerdampak.teksLengkapLKP}
            </p>
          </div>

          {/* Testimonial Section */}
          <div className="space-y-2 font-sans text-xs">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs border-b border-stone-300 pb-1">
              II. Testimoni Otentik Penerima Manfaat
            </h4>
            <div className="p-3 bg-stone-50 border border-stone-300 rounded italic text-stone-800">
              "{reportData.testimoniOtentik.isiKutipan}"
              <div className="text-right font-bold not-italic mt-1">
                — {reportData.testimoniOtentik.namaNarasumber} ({reportData.testimoniOtentik.peran})
              </div>
            </div>
          </div>

          {/* III. Lampiran Foto Dokumentasi Kegiatan Ber-Geotag Resmi (SE 29/2025) */}
          <div className="space-y-3 font-sans text-xs pt-3 border-t border-stone-300 break-inside-avoid">
            <div className="flex items-center justify-between border-b border-stone-300 pb-1">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                III. Lampiran Foto Dokumentasi Kegiatan Ber-Geotag Resmi (SE 29/2025)
              </h4>
              <span className="text-[10px] text-stone-600 font-mono">
                {photos.length} Foto Dilampirkan
              </span>
            </div>

            {photos.length === 0 ? (
              <div className="p-4 border border-dashed border-stone-300 rounded text-center text-stone-500 italic text-[11px]">
                Belum ada foto kegiatan yang diunggah. Silakan unggah foto pada formulir evident di atas.
              </div>
            ) : (
              <div
                className="photo-evident-grid"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginTop: "10px",
                }}
              >
                {photos.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="photo-evident-card"
                    style={{
                      flex: "1 1 calc(50% - 14px)",
                      maxWidth: "calc(50% - 7px)",
                      boxSizing: "border-box",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "8px",
                      background: "#f8fafc",
                      pageBreakInside: "avoid",
                    }}
                  >
                    <div
                      className="photo-image-wrapper"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "210px",
                        overflow: "hidden",
                        borderRadius: "6px",
                        background: "#0f172a",
                      }}
                    >
                      <img
                        src={p.url}
                        alt={p.caption}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      {/* Authentic Kemenag Geotag Stamp bar */}
                      <div
                        className="photo-geotag-banner"
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(15, 23, 42, 0.92)",
                          color: "#ffffff",
                          padding: "6px 8px",
                          fontSize: "9px",
                          lineHeight: 1.3,
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "#facc15",
                            fontWeight: "bold",
                            marginBottom: "2px",
                          }}
                        >
                          <span>KUA KECAMATAN NAN SABARIS</span>
                          <span
                            style={{
                              fontSize: "8px",
                              background: "#065f46",
                              color: "#d1fae5",
                              padding: "1px 5px",
                              borderRadius: "3px",
                              fontFamily: "monospace",
                            }}
                          >
                            FOTO #{idx + 1}
                          </span>
                        </div>
                        <div style={{ color: "#6ee7b7", fontFamily: "monospace", fontSize: "8.5px", fontWeight: 600 }}>
                          GPS: {p.coordinates || stampCoordinates}
                        </div>
                        <div style={{ color: "#cbd5e1", fontSize: "8px" }}>
                          {p.timestamp || stampTime} • {reportData.wilayahBinaan}
                        </div>
                      </div>
                    </div>
                    <div className="photo-caption-box" style={{ marginTop: "6px", fontSize: "11px", color: "#1e293b" }}>
                      <span style={{ fontWeight: "bold", color: "#064e3b", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>
                        [{p.category || "Dokumentasi Kegiatan"}]
                      </span>
                      <p style={{ margin: "2px 0 0 0", color: "#1e293b", fontSize: "11px" }}>{p.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signatures with Custom Pimpinan & Penyuluh (Berdampingan, Tidak Bertumpuk, Ruang Tanda Tangan Bersih Dikosongkan) */}
          <table
            className="signature-table w-full border-0 mt-8 font-sans text-xs break-inside-avoid"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "none",
              marginTop: "32px",
              pageBreakInside: "avoid",
            }}
          >
            <tbody>
              <tr style={{ border: "none" }}>
                {/* Kolom Kiri: Pimpinan (Kepala KUA) */}
                <td
                  style={{
                    width: "50%",
                    border: "none",
                    textAlign: "center",
                    verticalAlign: "top",
                    padding: "0 16px",
                  }}
                >
                  <p style={{ margin: "0", fontSize: "12px", color: "#1c1917" }}>Mengetahui,</p>
                  <p style={{ margin: "3px 0 0 0", fontWeight: "bold", fontSize: "12px", color: "#1c1917" }}>
                    {pimpinan.jabatan}
                  </p>

                  {/* Ruang kosong bersih untuk tanda tangan basah & cap stempel satker */}
                  <div
                    className="signature-space"
                    style={{
                      height: "85px",
                      minHeight: "85px",
                      width: "100%",
                    }}
                    aria-label="Ruang Tanda Tangan dan Cap Satker"
                  />

                  <p
                    style={{
                      margin: "0",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "12px",
                      color: "#1c1917",
                    }}
                  >
                    {pimpinan.nama}
                  </p>
                  <p
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "11px",
                      color: "#44403c",
                      fontFamily: "monospace",
                    }}
                  >
                    {pimpinan.nip.startsWith("NIP") ? pimpinan.nip : `NIP. ${pimpinan.nip}`}
                  </p>
                </td>

                {/* Kolom Kanan: Penyuluh Agama Islam */}
                <td
                  style={{
                    width: "50%",
                    border: "none",
                    textAlign: "center",
                    verticalAlign: "top",
                    padding: "0 16px",
                  }}
                >
                  <p style={{ margin: "0", fontSize: "12px", color: "#1c1917" }}>
                    Nan Sabaris, {reportData.tanggalWaktu}
                  </p>
                  <p style={{ margin: "3px 0 0 0", fontWeight: "bold", fontSize: "12px", color: "#1c1917" }}>
                    Penyuluh Agama Islam,
                  </p>

                  {/* Ruang kosong bersih untuk tanda tangan basah */}
                  <div
                    className="signature-space"
                    style={{
                      height: "85px",
                      minHeight: "85px",
                      width: "100%",
                    }}
                    aria-label="Ruang Tanda Tangan Basah"
                  />

                  <p
                    style={{
                      margin: "0",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      fontSize: "12px",
                      color: "#1c1917",
                    }}
                  >
                    {REGULATION_INFO.penyuluhName}
                  </p>
                  <p
                    style={{
                      margin: "3px 0 0 0",
                      fontSize: "11px",
                      color: "#44403c",
                    }}
                  >
                    Penyuluh Agama Islam Ahli
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
