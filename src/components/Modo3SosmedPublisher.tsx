import React, { useState } from "react";
import { 
  Share2, Copy, Check, Instagram, Facebook, 
  Globe, Hash, Heart, MessageCircle, Send, Bookmark, Sparkles 
} from "lucide-react";
import { Modo3Sosmed } from "../types";
import { REGULATION_INFO } from "../data/presets";

interface Modo3Props {
  sosmedData: Modo3Sosmed | null;
  locationInfo?: string;
}

export const Modo3SosmedPublisher: React.FC<Modo3Props> = ({ sosmedData, locationInfo }) => {
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<"instagram" | "facebook">("instagram");

  if (!sosmedData) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center space-y-3">
        <Share2 className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold text-stone-800">Draf Konten Publikasi Belum Dibuat</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Silakan jalankan proses audit pada MODO 1 untuk membuat konten publikasi media sosial yang kekinian dan taat juknis SE 29/2025.
        </p>
      </div>
    );
  }

  const copyText = (text: string, channel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              MODO 3
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Draf Publikasi Media Sosial & Kelembagaan
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Sesuai Surat Edaran SE No. 29/2025 & Surat No. B-409/SJ/B.VIII/HM.01/09/2026: mengedepankan kehadiran nyata Kemenag & respon cepat KUA Nan Sabaris bagi umat.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyText(sosmedData.captionInstagram, "ig-top")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white text-xs font-bold shadow-xs transition-opacity flex items-center space-x-1.5 cursor-pointer"
          >
            {copiedChannel === "ig-top" ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Caption Instagram</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Preview Post vs Text Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Mockup Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden max-w-sm mx-auto lg:max-w-none">
            {/* Header Mockup */}
            <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                  KUA
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900 leading-none">
                    kua.nansabaris
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {locationInfo || "Nan Sabaris, Padang Pariaman"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Official
              </span>
            </div>

            {/* Simulated Visual Post Box */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 p-6 text-white min-h-[200px] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                  Kemenag Hadir Berdampak
                </span>
                <h4 className="text-base font-bold mt-2.5 text-white line-clamp-3 leading-snug">
                  {sosmedData.headline}
                </h4>
              </div>

              <div className="relative z-10 pt-4 border-t border-emerald-700/60 mt-4 flex items-center justify-between text-[11px] text-emerald-200">
                <span>Penyuluh: Rani Humaira, S.H.I.</span>
                <span className="text-amber-300 font-semibold">KUA Nan Sabaris</span>
              </div>

              {/* Decorative Watermark */}
              <div className="absolute -right-4 -bottom-4 opacity-10 text-white pointer-events-none">
                <Sparkles className="w-32 h-32" />
              </div>
            </div>

            {/* Social Engagement Icons */}
            <div className="p-3.5 border-b border-stone-100 flex items-center justify-between text-stone-700">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <MessageCircle className="w-5 h-5 text-stone-600" />
                <Send className="w-5 h-5 text-stone-600" />
              </div>
              <Bookmark className="w-5 h-5 text-stone-600" />
            </div>

            {/* Mockup Caption Snippet */}
            <div className="p-4 text-xs text-stone-800 space-y-2 max-h-64 overflow-y-auto">
              <p className="font-semibold text-stone-900">
                kua.nansabaris{" "}
                <span className="font-normal text-stone-700 whitespace-pre-line">
                  {sosmedData.captionInstagram}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Tabs & Raw Copy Text */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            {/* Tabs Platform */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActivePlatform("instagram")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    activePlatform === "instagram"
                      ? "bg-pink-50 text-pink-700 border border-pink-200"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram & Threads</span>
                </button>

                <button
                  onClick={() => setActivePlatform("facebook")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    activePlatform === "facebook"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook & Portal Web</span>
                </button>
              </div>

              <button
                onClick={() =>
                  copyText(
                    activePlatform === "instagram"
                      ? sosmedData.captionInstagram
                      : sosmedData.captionFacebook,
                    activePlatform
                  )
                }
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedChannel === activePlatform ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Teks</span>
                  </>
                )}
              </button>
            </div>

            {/* Editable or Copyable Text Area */}
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                {activePlatform === "instagram"
                  ? "Teks Lengkap Caption Instagram (Emoticon & Hashtag)"
                  : "Naskah Berita Web / Fanpage Facebook KUA Nan Sabaris"}
              </label>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap selection:bg-emerald-100">
                {activePlatform === "instagram"
                  ? sosmedData.captionInstagram
                  : sosmedData.captionFacebook}
              </div>
            </div>

            {/* Hashtag Cloud */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-emerald-600" />
                  Hashtag Resmi Kementerian Agama & Nagari
                </span>
                <button
                  onClick={() => copyText(sosmedData.hashtags.join(" "), "tags")}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  {copiedChannel === "tags" ? "Tersalin!" : "Salin Semua Tag"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sosmedData.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-stone-200"
                    onClick={() => copyText(tag, `tag-${idx}`)}
                    title="Klik untuk salin"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
