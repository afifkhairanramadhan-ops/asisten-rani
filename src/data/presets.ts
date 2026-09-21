import { NagariType, SasaranBinaanType } from "../types";

export interface PresetActivity {
  id: string;
  tag: string;
  title: string;
  nagari: NagariType;
  sasaran: SasaranBinaanType;
  pesertaCount: number;
  location: string;
  topic: string;
  notes: string;
  testimonyRaw: string;
  narasumber: string;
  peran: string;
}

export const PRESET_ACTIVITIES: PresetActivity[] = [
  {
    id: "preset-1",
    tag: "Majelis Taklim",
    title: "Edukasi Hak Perlindungan Perempuan dalam Hukum Perkawinan Islam",
    nagari: "Nagari Sunua Tengah",
    sasaran: "Majelis Taklim",
    pesertaCount: 38,
    location: "Mushalla Baiturrahim Korong Kampung Ladang",
    topic: "Kajian Fiqih Munakahat: Hak Nafkah, Perjanjian Perkawinan, dan Mitigasi KDRT Menurut Hukum Islam",
    notes: "Telah dilaksanakan bimbingan penyuluhan tatap muka bersama jamaah Majelis Taklim Kaum Ibu Nagari Sunua Tengah. Masalah utama yang dihadapi jamaah adalah minimnya pemahaman tentang hak-hak keperdataan istri pasca akad serta cara islami menyelesaikan perselisihan keluarga tanpa kekerasan. Metode yang digunakan adalah ceramah tematik dilanjutkan dengan klinik konsultasi keluarga sakinah secara privat dan kelompok. Hasilnya, 38 peserta memahami langkah hukum dan bimbingan KUA, serta 4 ibu jamaah langsung berkonsultasi solusi sakinah bersama Penyuluh.",
    testimonyRaw: "Selama ini kami di korong merasa tabu membicarakan hak nafkah dan hukum perceraian secara terbuka. Melalui kehadiran Ibu Rani Humaira, S.H.I. dari KUA Nan Sabaris, kami mendapatkan pemahaman syariat yang sangat menentramkan dan solutif bagi keutuhan rumah tangga kami.",
    narasumber: "Ibu Hj. Salmawati",
    peran: "Ketua Majelis Taklim Baiturrahim Sunua Tengah"
  },
  {
    id: "preset-2",
    tag: "Remaja (BRUN)",
    title: "Bimbingan Remaja Usia Nikah (BRUN) & Literasi Pra-Nikah",
    nagari: "Nagari Sunua Barat",
    sasaran: "Remaja Masjid / BRUN",
    pesertaCount: 29,
    location: "Masjid Raya Nagari Sunua Barat",
    topic: "Pencegahan Perkawinan Anak di Bawah Umur dan Kesiapan Fisik-Mental Menuju Mahligai Rumah Tangga",
    notes: "Bimbingan pencegahan stunting dan perkawinan anak ditujukan bagi generasi muda dan Karang Taruna Nagari Sunua Barat. Mengulas regulasi UU No. 16 Tahun 2019 tentang Batas Usia Minimal Kawin 19 tahun serta hikmah maqashid syariah dalam pernikahan. Forum bimbingan diadakan interaktif dengan kuis literasi fiqih munakahat dan komitmen bersama pemuda nagari. Sebanyak 29 pemuda-pemudi hadir penuh dan menandatangani pakta komitmen mengutamakan pendidikan dan kematangan usia sebelum berumah tangga.",
    testimonyRaw: "Penyuluhan dari KUA Nan Sabaris membuka mata kami bahwa pernikahan itu bukan sekadar pesta, melainkan amanah syariat yang butuh kesiapan lahir batin. Penjelasan Ibu Rani Humaira sangat relevan dengan dinamika anak muda sekarang.",
    narasumber: "M. Farhan Al-Ghifari",
    peran: "Ketua Remaja Masjid Sunua Barat"
  },
  {
    id: "preset-3",
    tag: "Kelompok Dasa Wisma",
    title: "Pemberdayaan Zakat, Infaq, Sedekah (ZIS) & Penguatan Ekonomi Keluarga Berkah",
    nagari: "Nagari Sunua Tengah",
    sasaran: "Kelompok Dasa Wisma",
    pesertaCount: 26,
    location: "Balai Pertemuan Korong Sunua Tengah",
    topic: "Fiqih Muamalah: Urgensi Berzakat Melalui Baznas/UPZ KUA Nan Sabaris dan Keberkahan Rezeki Halal",
    notes: "Edukasi kepada kader Dasa Wisma mengenai fiqih pengelolaan harta keluarga, penguatan etos kerja Islami, serta sosialisasi Unit Pengumpul Zakat (UPZ) KUA Nan Sabaris. Diikuti oleh 26 anggota Dasa Wisma. Hasil nyata: terbentuk kesepakatan pembentukan Gerakan Koin Sedekah Subuh Dasa Wisma untuk membantu kaum dhuafa di lingkungan korong.",
    testimonyRaw: "Kami sangat berterima kasih KUA Nan Sabaris merangkul Dasa Wisma. Kami sekarang paham tata cara menghitung nishab zakat perniagaan dan terdorong menggalakkan sedekah subuh di lingkungan kami.",
    narasumber: "Ibu Desmita",
    peran: "Koordinator Dasa Wisma Dahlia Sunua Tengah"
  },
  {
    id: "preset-4",
    tag: "BKMT",
    title: "Penguatan Moderasi Beragama & Silaturahmi Ukhuwah Islamiyah",
    nagari: "Nagari Sunua Barat",
    sasaran: "BKMT",
    pesertaCount: 47,
    location: "Mushalla Darussalam Korong Pauh, Sunua Barat",
    topic: "Meneguhkan Wasathiyah Islam: Menangkal Berita Hoaks dan Menjaga Kerukunan Bermasyarakat di Ranah Minang",
    notes: "Pertemuan rutin BKMT gabungan se-Nagari Sunua Barat. Fokus materi adalah internalisasi 4 pilar moderasi beragama Kemenag RI (Komitmen Kebangsaan, Toleransi, Anti-Kekerasan, dan Akomodatif terhadap Budaya Lokal Adat Basandi Syarak, Syarak Basandi Kitabullah). Hadir 47 jamaah aktif. Dampak: terbangun komitmen menyaring informasi keagamaan dari sumber terpercaya (KUA/Kemenag) dan menolak ujaran kebencian di media sosial.",
    testimonyRaw: "Ibu Rani Humaira selalu memberikan kesejukan bagi jamaah BKMT. Kami diajarkan untuk bijak bermedsos dan menjaga kerukunan antar warga dengan pegangan ABS-SBK.",
    narasumber: "Ustadzah Nurmawati",
    peran: "Pengurus BKMT Cabang Sunua Barat"
  }
];

export const REGULATION_INFO = {
  seNumber: "Surat Edaran Sekretaris Jenderal Kemenag RI No. SE 29 Tahun 2025",
  suratPenguatan: "Surat No. B-409/SJ/B.VIII/HM.01/09/2026 tentang Penguatan Publikasi Capaian Kinerja",
  penyuluhName: "Rani Humaira, S.H.I.",
  satker: "KUA Kecamatan Nan Sabaris, Kab. Padang Pariaman, Sumatera Barat",
  pimpinan: {
    nama: "H. Suardi, S.Ag., M.H.",
    jabatan: "Kepala KUA Kec. Nan Sabaris",
    nip: "197405122003121002"
  },
  coordinates: {
    "Nagari Sunua Tengah": {
      lat: "-0.6865",
      lng: "100.2291",
      display: "-0.6865, 100.2291",
      kecamatan: "Kec. Nan Sabaris",
      kabupaten: "Kab. Padang Pariaman",
      provinsi: "Sumatera Barat"
    },
    "Nagari Sunua Barat": {
      lat: "-0.6950",
      lng: "100.2185",
      display: "-0.6950, 100.2185",
      kecamatan: "Kec. Nan Sabaris",
      kabupaten: "Kab. Padang Pariaman",
      provinsi: "Sumatera Barat"
    }
  }
};

export const STRATEGIC_LOCATIONS_NAN_SABARIS: Array<{
  id: string;
  namaLokasi: string;
  nagari: "Nagari Sunua Tengah" | "Nagari Sunua Barat";
  lat: number;
  lng: number;
  displayGps: string;
  plusCode: string;
  kategori: "Masjid/Mushalla" | "Kantor Desa/Nagari" | "KUA" | "MDTA/TPQ" | "Balai Pertemuan" | "Titik Kustom";
  deskripsi: string;
}> = [
  {
    id: "loc-1",
    namaLokasi: "Kantor Urusan Agama (KUA) Kec. Nan Sabaris",
    nagari: "Nagari Sunua Tengah",
    lat: -0.6812,
    lng: 100.2345,
    displayGps: "-0.6812, 100.2345",
    plusCode: "829J+G7 Pauh Kambar",
    kategori: "KUA",
    deskripsi: "Pusat komando bimbingan penyuluhan dan layanan nikah rujuk, Jl. Syekh Burhanuddin."
  },
  {
    id: "loc-2",
    namaLokasi: "Mushalla Baiturrahim Korong Kampung Ladang",
    nagari: "Nagari Sunua Tengah",
    lat: -0.6852,
    lng: 100.2305,
    displayGps: "-0.6852, 100.2305",
    plusCode: "827J+W6 Sunua Tengah",
    kategori: "Masjid/Mushalla",
    deskripsi: "Lokasi utama majelis taklim kaum ibu dan bimbingan keluarga sakinah."
  },
  {
    id: "loc-3",
    namaLokasi: "Kantor Wali Nagari Sunua Tengah",
    nagari: "Nagari Sunua Tengah",
    lat: -0.6865,
    lng: 100.2291,
    displayGps: "-0.6865, 100.2291",
    plusCode: "827H+CJ Sunua Tengah",
    kategori: "Kantor Desa/Nagari",
    deskripsi: "Pusat koordinasi pemerintahan nagari, Dasa Wisma, dan kemitraan penyuluh agama."
  },
  {
    id: "loc-4",
    namaLokasi: "Majelis Taklim Nurul Huda Korong Padang Pauh",
    nagari: "Nagari Sunua Tengah",
    lat: -0.6878,
    lng: 100.2274,
    displayGps: "-0.6878, 100.2274",
    plusCode: "826G+W3 Sunua Tengah",
    kategori: "Masjid/Mushalla",
    deskripsi: "Kelompok binaan pengajian fiqih muamalah dan pengentasan buta aksara Al-Qur'an."
  },
  {
    id: "loc-5",
    namaLokasi: "MDTA / TPQ Al-Ikhlas Sunua Tengah",
    nagari: "Nagari Sunua Tengah",
    lat: -0.6841,
    lng: 100.2318,
    displayGps: "-0.6841, 100.2318",
    plusCode: "828J+9P Sunua Tengah",
    kategori: "MDTA/TPQ",
    deskripsi: "Sentra pembinaan santri Al-Qur'an dan bimbingan guru mengaji nagari."
  },
  {
    id: "loc-6",
    namaLokasi: "Masjid Raya Sunua Barat Korong Pauh",
    nagari: "Nagari Sunua Barat",
    lat: -0.6942,
    lng: 100.2198,
    displayGps: "-0.6942, 100.2198",
    plusCode: "8249+8W Sunua Barat",
    kategori: "Masjid/Mushalla",
    deskripsi: "Masjid jami' pusat kegiatan BKMT, wirid remaja masjid (BRUN), dan konsultasi syariah."
  },
  {
    id: "loc-7",
    namaLokasi: "Kantor Wali Nagari Sunua Barat",
    nagari: "Nagari Sunua Barat",
    lat: -0.6950,
    lng: 100.2185,
    displayGps: "-0.6950, 100.2185",
    plusCode: "8249+2C Sunua Barat",
    kategori: "Kantor Desa/Nagari",
    deskripsi: "Pusat koordinasi pencegahan perkawinan usia dini & mediasi keluarga di Sunua Barat."
  },
  {
    id: "loc-8",
    namaLokasi: "MDTA Sunua Barat Korong Duku Manyang",
    nagari: "Nagari Sunua Barat",
    lat: -0.6965,
    lng: 100.2168,
    displayGps: "-0.6965, 100.2168",
    plusCode: "8238+CP Sunua Barat",
    kategori: "MDTA/TPQ",
    deskripsi: "Ruang pembinaan remaja masjid, pelatihan tahsin tilawah, dan keputrian."
  },
  {
    id: "loc-9",
    namaLokasi: "Mushalla Al-Muhajirin Korong Sungai Laban",
    nagari: "Nagari Sunua Barat",
    lat: -0.6930,
    lng: 100.2210,
    displayGps: "-0.6930, 100.2210",
    plusCode: "824C+5C Sunua Barat",
    kategori: "Masjid/Mushalla",
    deskripsi: "Lokasi pengajian subuh binaan dan konsultasi zakat wakaf produktif."
  }
];

export const INITIAL_DEFAULT_OUTPUT = {
  verification: {
    isComplete: true,
    score: 98,
    criteriaChecks: {
      wilayahCheck: { valid: true, message: "Terverifikasi sah di wilayah kerja: Nagari Sunua Tengah, Kec. Nan Sabaris." },
      pesertaCheck: { valid: true, count: 38, message: "Kuantitas data kuantitatif tercatat jelas: 38 orang jamaah/peserta binaan." },
      topikCheck: { valid: true, message: "Topik spesifik dan bermakna hukum keagamaan: Fiqih Munakahat & Hak Perlindungan Perempuan." },
      testimoniCheck: { valid: true, quote: "Selama ini kami merasa tabu membicarakan hak nafkah...", message: "Kutipan penerima manfaat otentik dan menyentuh substansi bimbingan." },
      dampakCheck: { valid: true, impactSummary: "Peningkatan literasi hukum perkawinan dan konsultasi keluarga sakinah 38 jamaah.", message: "Berdampak nyata sesuai standar SE 29/2025 (bebas seremoni belaka)." },
      kelembagaanCheck: { valid: true, message: "Menonjolkan kehadiran responsif KUA Nan Sabaris dan Kementerian Agama." }
    },
    suggestions: [
      "Pastikan daftar hadir fisik ditandatangani basah oleh perwakilan peserta.",
      "Ambil foto dokumentasi tepat saat sesi tanya-jawab interaktif dengan penanda GPS aktif."
    ]
  },
  modo2_epa: {
    judulKegiatan: "Bimbingan Penyuluhan Keagamaan dan Edukasi Hukum Keluarga Islam: Kajian Fiqih Munakahat & Perlindungan Perempuan",
    sasaranBinaan: "Majelis Taklim",
    wilayahBinaan: "Nagari Sunua Tengah",
    lokasiSpesifik: "Mushalla Baiturrahim Korong Kampung Ladang",
    tanggalWaktu: new Date().toISOString().split("T")[0],
    jumlahPeserta: 38,
    deskripsiBerdampak: {
      latarBelakangMasalah: "Adanya kebutuhan mendalam dari masyarakat di Nagari Sunua Tengah terkait pemahaman fiqih munakahat dan mitigasi perselisihan rumah tangga yang kerap dihadapi jamaah di tingkat korong.",
      metodeBimbingan: "Ceramah tematik interaktif, bedah studi kasus hukum Islam praktis, serta ruang konsultasi keluarga sakinah terbuka.",
      dataKuantitas: "Diikuti oleh 38 orang peserta binaan yang hadir secara penuh dari awal hingga penutupan sesi tanya jawab.",
      dampakHasilNyata: "Terjadinya peningkatan pemahaman jamaah sebesar 85% berdasarkan feedback evaluasi, terselesaikannya 4 konsultasi hukum keluarga secara kekeluargaan, serta terbentuknya kesepakatan kelompok belajar lanjutan di nagari.",
      teksLengkapLKP: "KUA Kecamatan Nan Sabaris melalui Penyuluh Agama Islam Rani Humaira, S.H.I. menyelenggarakan kegiatan pembinaan bertema Kajian Fiqih Munakahat: Hak Nafkah, Perjanjian Perkawinan, dan Mitigasi KDRT bersama Majelis Taklim di Mushalla Baiturrahim, Nagari Sunua Tengah. Kegiatan ini dilatarbelakangi kebutuhan jamaah terhadap edukasi keagamaan yang aplikatif dan berbasis solusi hukum Islam. Sebanyak 38 orang hadir aktif mengikuti sesi pemaparan materi dan studi kasus. Dampak langsung dari kegiatan ini, jamaah memperoleh panduan konkret dalam membangun ketahanan keluarga berlandaskan sakinah mawaddah wa rahmah, menuntaskan kebimbangan hukum seputar hak dan kewajiban keluarga, serta disepakatinya forum musyawarah berkala bersama KUA Nan Sabaris."
    },
    testimoniOtentik: {
      namaNarasumber: "Ibu Hj. Salmawati",
      peran: "Ketua Majelis Taklim Baiturrahim Sunua Tengah",
      isiKutipan: "Selama ini kami di korong merasa tabu membicarakan hak nafkah dan hukum perceraian secara terbuka. Melalui kehadiran Ibu Rani Humaira, S.H.I. dari KUA Nan Sabaris, kami mendapatkan pemahaman syariat yang sangat menentramkan dan solutif bagi keutuhan rumah tangga kami."
    }
  },
  modo3_sosmed: {
    headline: "KUA Nan Sabaris Hadir: Perkuat Fondasi Keluarga Sakinah di Nagari Sunua Tengah",
    captionInstagram: "KUA Nan Sabaris Menyapa Umat! 🌿✨\n\nKomitmen Kementerian Agama dalam memberikan layanan bimbingan keagamaan yang berdampak nyata terus diwujudkan. Bertempat di Mushalla Baiturrahim Korong Kampung Ladang, Penyuluh Agama Islam KUA Nan Sabaris Rani Humaira, S.H.I. menggelar pembinaan intensif bersama 38 jamaah Majelis Taklim.\n\nMelalui bimbingan bertajuk \"Kajian Fiqih Munakahat & Perlindungan Keluarga\", jamaah diajak memahami prinsip hukum Islam secara aplikatif untuk memperkokoh ketahanan rumah tangga.\n\n\"Alhamdulillah, penyuluhan ini sangat membuka wawasan kami...\" tutur Ibu Hj. Salmawati.\n\nKemenag Berdampak, Umat Terlayani! 💚\n\n#KUANanSabaris #KemenagPadangPariaman #KemenagSumbar #PenyuluhAgamaIslam #RaniHumairaSHI #SE29Tahun2025 #KemenagBerdampak #NagariSunuaTengah",
    captionFacebook: "[KEMENAG HADIR MELAYANI] KUA Kecamatan Nan Sabaris terus proaktif memberikan bimbingan hukum keluarga Islam dan penguatan keagamaan bagi masyarakat. Bertempat di Mushalla Baiturrahim Korong Kampung Ladang, Nagari Sunua Tengah, kegiatan bimbingan bertajuk Fiqih Munakahat sukses diikuti oleh 38 peserta dengan antusiasme tinggi. KUA Nan Sabaris berkomitmen menghadirkan layanan agama yang solutif, inklusif, dan menyentuh kebutuhan hakiki umat.",
    callToAction: "Konsultasikan bimbingan keagamaan dan keluarga sakinah Anda bersama KUA Nan Sabaris!",
    hashtags: ["#KUANanSabaris", "#KemenagPadangPariaman", "#PenyuluhAgamaIslam", "#KemenagBerdampak", "#SE29Tahun2025", "#NagariSunuaTengah"]
  },
  modo4_evident: {
    ringkasanKinerjaHalaman1: "Laporan Evident Bimbingan Penyuluhan Agama Islam KUA Nan Sabaris - Rani Humaira, S.H.I. Sasaran: 38 Peserta di Nagari Sunua Tengah.",
    rekomendasiFotoGeotag: {
      lokasiKoordinat: "-0.6865, 100.2291",
      catatanFoto: "Foto horizontal sudut 45 derajat memperlihatkan Penyuluh Rani Humaira, S.H.I. sedang memaparkan materi bimbingan di hadapan 38 jamaah, dilengkapi watermark timestamp dan koordinat GPS -0.6865, 100.2291.",
      watermarkPreview: "Penyuluh: Rani Humaira, S.H.I. | NIP/Satker: KUA Kec. Nan Sabaris | Lokasi: Mushalla Baiturrahim, Nagari Sunua Tengah | GPS: -0.6865, 100.2291"
    },
    lampiranTestimoniTertulis: "Formulir Testimoni Otentik terlampir dengan paraf narasumber jamaah (Majelis Taklim), menyatakan kepuasan dan manfaat riil bimbingan keagamaan.",
    daftarHadirPanduan: "Daftar hadir bertandatangan asli dari 38 peserta dilampirkan lengkap pada halaman 3 berkas evident PDF.",
    checklistItems: [
      { name: "Halaman 1: Lembar LKP & Ringkasan Capaian Data Kuantitatif", description: "Memuat data 38 peserta, tujuan, dan dampak nyata", wajib: true },
      { name: "Halaman 2: Foto Dokumentasi Ber-Geotag GPS & Waktu Nyata", description: "Koordinat -0.6865, 100.2291 Nagari Sunua Tengah", wajib: true },
      { name: "Halaman 3: Lampiran Testimoni Otentik Jamaah", description: "Pernyataan kesan dan faedah bimbingan", wajib: true },
      { name: "Halaman 4: Berkas Scan Daftar Hadir Peserta", description: "Daftar hadir 38 jamaah bertanda tangan basah", wajib: true }
    ]
  }
};

