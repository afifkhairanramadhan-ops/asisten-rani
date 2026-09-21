import React from "react";
import { FileText, Award, MapPin, Sparkles, BookOpen, Clock } from "lucide-react";
import { REGULATION_INFO } from "../data/presets";

interface NavbarProps {
  activeTab: "generator" | "history" | "guidelines";
  setActiveTab: (tab: "generator" | "history" | "guidelines") => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold shadow-inner">
              <span className="text-xl tracking-tight">EPA</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight">EPA-AI Assistant</span>
                <span className="bg-emerald-800 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-700">
                  SE 29/2025
                </span>
              </div>
              <div className="text-xs text-emerald-200/90 flex flex-wrap items-center gap-x-2">
                <span className="font-semibold text-white">{REGULATION_INFO.penyuluhName}</span>
                <span className="text-emerald-400">•</span>
                <span>KUA Nan Sabaris</span>
                <span className="hidden md:inline text-emerald-400">•</span>
                <span className="hidden md:inline text-emerald-300">Padang Pariaman</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Badges */}
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/80 text-xs text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Binaan:</span>
            <span className="text-white font-medium">Nagari Sunua Tengah</span>
            <span className="text-emerald-400">&</span>
            <span className="text-white font-medium">Nagari Sunua Barat</span>
          </div>

          {/* Actions / Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-tab-generator"
              onClick={() => setActiveTab("generator")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === "generator"
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Penyusun & Audit</span>
              <span className="sm:hidden">Form</span>
            </button>

            <button
              id="nav-tab-history"
              onClick={() => setActiveTab("history")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === "history"
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Riwayat Laporan</span>
              <span className="sm:hidden">Arsip</span>
              {savedCount > 0 && (
                <span className="bg-emerald-700 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-guidelines"
              onClick={() => setActiveTab("guidelines")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === "guidelines"
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "text-emerald-100 hover:bg-emerald-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Juknis SE 29</span>
              <span className="sm:hidden">Juknis</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
