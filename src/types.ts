export type NagariType = "Nagari Sunua Tengah" | "Nagari Sunua Barat";

export type SasaranBinaanType =
  | "Majelis Taklim"
  | "Remaja Masjid / BRUN"
  | "BKMT"
  | "TPQ / MDTA"
  | "Kelompok Dasa Wisma"
  | "Tokoh Masyarakat & Umat";

export interface CriteriaCheck {
  valid: boolean;
  message: string;
  count?: number;
  quote?: string;
  impactSummary?: string;
}

export interface VerificationResult {
  isComplete: boolean;
  score: number;
  criteriaChecks: {
    wilayahCheck: CriteriaCheck;
    pesertaCheck: CriteriaCheck;
    topikCheck: CriteriaCheck;
    testimoniCheck: CriteriaCheck;
    dampakCheck: CriteriaCheck;
    kelembagaanCheck: CriteriaCheck;
  };
  suggestions: string[];
}

export interface Modo2EpaReport {
  judulKegiatan: string;
  sasaranBinaan: string;
  wilayahBinaan: string;
  lokasiSpesifik: string;
  tanggalWaktu: string;
  jumlahPeserta: number;
  deskripsiBerdampak: {
    latarBelakangMasalah: string;
    metodeBimbingan: string;
    dataKuantitas: string;
    dampakHasilNyata: string;
    teksLengkapLKP: string;
  };
  testimoniOtentik: {
    namaNarasumber: string;
    peran: string;
    isiKutipan: string;
  };
}

export interface Modo3Sosmed {
  headline: string;
  captionInstagram: string;
  captionFacebook: string;
  callToAction: string;
  hashtags: string[];
}

export interface ChecklistItem {
  name: string;
  description: string;
  wajib: boolean;
}

export interface AttachedPhoto {
  id: string;
  url: string; // base64 data URL
  caption: string;
  category?: "Foto Utama Bimbingan" | "Audiens / Jamaah" | "Testimoni Narasumber" | "Daftar Hadir / Presensi" | "Lainnya";
  timestamp?: string;
  coordinates?: string;
  watermarked?: boolean;
}

export interface Modo4Evident {
  ringkasanKinerjaHalaman1: string;
  rekomendasiFotoGeotag: {
    lokasiKoordinat: string;
    catatanFoto: string;
    watermarkPreview: string;
  };
  lampiranTestimoniTertulis: string;
  daftarHadirPanduan: string;
  checklistItems: ChecklistItem[];
  attachedPhotos?: AttachedPhoto[];
}

export interface EpaFullOutput {
  verification: VerificationResult;
  modo2_epa: Modo2EpaReport;
  modo3_sosmed: Modo3Sosmed;
  modo4_evident: Modo4Evident;
}

export interface PimpinanInfo {
  nama: string;
  jabatan: string;
  nip: string;
}

export interface SavedReport {
  id: string;
  createdAt: string;
  title: string;
  nagari: NagariType;
  sasaran: SasaranBinaanType;
  pesertaCount: number;
  date: string;
  score: number;
  fullData: EpaFullOutput;
  status: "Draf" | "Terverifikasi SE 29" | "Siap Unggah E-PA" | "Sudah Diunggah";
  locationName?: string;
  gpsCoordinates?: string;
  tags?: string[];
  catatanInternal?: string;
  internalNotes?: string;
}

export interface LocationGpsInfo {
  id: string;
  namaLokasi: string;
  nagari: NagariType;
  lat: number;
  lng: number;
  displayGps: string;
  plusCode?: string;
  kategori: "Masjid/Mushalla" | "Kantor Desa/Nagari" | "KUA" | "MDTA/TPQ" | "Balai Pertemuan" | "Titik Kustom";
  deskripsi: string;
}

export interface AiImpactRequest {
  topik: string;
  nagari: NagariType;
  sasaran: SasaranBinaanType;
  pesertaCount: number;
  kataKunciAtauPoin: string;
  temaSpesifik?: string;
  lokasiSpesifik?: string;
}

export interface AiImpactResponse {
  catatanKegiatan: string;
  dampakNyataUmat: string;
  rekomendasiTestimoni: {
    namaNarasumber: string;
    peran: string;
    isiKutipan: string;
  };
  poinKuantitatif: string[];
}
