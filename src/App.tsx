import React, { useState } from 'react';
import { AndroidEmulator } from './components/AndroidEmulator';
import { CodeViewer } from './components/CodeViewer';
import { 
  Laptop, Cpu, Database, BookOpen, Layers, Sparkles, 
  ChevronRight, Play, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="min-h-screen bg-[#090D14] text-gray-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Top Professional Header Bar */}
      <header className="bg-[#0E131F]/90 border-b border-gray-800/60 sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">LinguaQuest Developer Workspace</h1>
              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-semibold text-indigo-400">
                Android Native
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Hindi Learning Platform for English & Telugu Speakers</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-5 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Jetpack Compose v3</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Room DB (WAL Enabled)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Hilt Injection Graph</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column (col-span-5): The Live Android Emulator Simulator */}
        <section className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center bg-gradient-to-tr from-[#121624] to-[#161B2E] p-4 lg:p-6 rounded-3xl border border-gray-800/80 shadow-2xl relative overflow-hidden group">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="z-10 flex flex-col items-center">
            {/* Emulator label */}
            <div className="flex items-center gap-2 mb-3 bg-[#1D243A] px-3.5 py-1.5 rounded-full border border-gray-700/50 shadow-inner">
              <Laptop className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-gray-200 tracking-wider uppercase">Android Emulator Shell</span>
            </div>
            
            {/* Physical Frame */}
            <AndroidEmulator />
          </div>
        </section>

        {/* Right column (col-span-7): Native Kotlin Code Explorer & Developer Console */}
        <section className="col-span-1 lg:col-span-7 flex flex-col h-full min-h-[600px]">
          <div className="mb-4 bg-[#111625] p-4 rounded-2xl border border-gray-800/60 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white mb-0.5">Production Kotlin Source Files</h3>
              <p className="text-gray-400 text-[11px]">These files are physically saved inside your workspace directory <code className="text-indigo-400 font-mono">/android/</code> for direct deployment.</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0A0E1A] px-3 py-1.5 rounded-xl border border-gray-800 self-start">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-[10px] text-gray-300">WAL-SQLite Mode</span>
            </div>
          </div>

          <div className="flex-1">
            <CodeViewer />
          </div>
        </section>

      </main>

      {/* App Footer Details */}
      <footer className="bg-[#080B12] border-t border-gray-850 px-6 py-4 text-xs text-gray-500 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 LinguaQuest Platform. Crafted with Native Kotlin Architecture guidelines.</span>
        <div className="flex items-center gap-4 text-gray-400">
          <span className="hover:text-white transition-all cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-white transition-all cursor-pointer">Developer SDK</span>
        </div>
      </footer>

    </div>
  );
}
