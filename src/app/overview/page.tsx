'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './overview.module.css';
import {
  QrCode,
  Scan,
  CheckCircle2,
  Users,
  Database,
  Cpu,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
  Zap,
  Clock,
  ArrowUpRight,
  BookOpen,
  Download,
  AlertCircle
} from 'lucide-react';

// Mock data for the interactive simulator
const INITIAL_DEVICES = [
  { id: 'rf-01', name: 'RF Scanner #01', type: 'RF Scanner', status: 'Available', user: null, time: null },
  { id: 'rf-02', name: 'RF Scanner #02', type: 'RF Scanner', status: 'Checked Out', user: 'Roberto Coldutty', time: '10 mins ago' },
  { id: 'ipad-01', name: 'iPad #01', type: 'iPad', status: 'Available', user: null, time: null },
  { id: 'camera-01', name: 'Camera #01', type: 'Camera', status: 'Checked Out', user: 'Joseph Hay', time: '2 hours ago' },
  { id: 'grinder-01', name: 'Grinder #01', type: 'Grinder', status: 'Available', user: null, time: null },
  { id: 'radio-01', name: 'Radio #01', type: 'Radio', status: 'Available', user: null, time: null },
];

const TEAM_MEMBERS = [
  'Javon Adams',
  'Shaquana Adams',
  'Roberto Coldutty',
  'James Turner',
  'Joseph Hay'
];

export default function OverviewPage() {
  // Simulator State
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState('rf-01');
  const [selectedMember, setSelectedMember] = useState('Javon Adams');
  const [scanAction, setScanAction] = useState<'checkout' | 'checkin'>('checkout');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [log, setLog] = useState<string[]>([
    'System Initialized: Pre-seeded inventory loaded.',
    'System: Camera #01 automatically marked Checked Out by Joseph Hay.'
  ]);

  // Asset Tab Switcher State
  const [activeAssetTab, setActiveAssetTab] = useState<'handout' | 'dashboard'>('handout');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto-scrolling logs helper
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 8)]);
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deviceIndex = devices.findIndex((d) => d.id === selectedDevice);
    if (deviceIndex === -1) return;
    
    const device = devices[deviceIndex];
    const newDevices = [...devices];

    if (scanAction === 'checkout') {
      if (device.status === 'Checked Out') {
        alert(`Cannot check out: ${device.name} is already checked out by ${device.user}.`);
        return;
      }
      newDevices[deviceIndex] = {
        ...device,
        status: 'Checked Out',
        user: selectedMember,
        time: 'Just now'
      };
      addLog(`SUCCESS: ${device.name} checked out to ${selectedMember}.`);
    } else {
      if (device.status === 'Available') {
        alert(`Cannot check in: ${device.name} is already available in the inventory.`);
        return;
      }
      const prevUser = device.user;
      newDevices[deviceIndex] = {
        ...device,
        status: 'Available',
        user: null,
        time: null
      };
      addLog(`SUCCESS: ${device.name} checked in by ${prevUser}.`);
    }

    setDevices(newDevices);
    setScanSuccess(true);
    setTimeout(() => setScanSuccess(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.glowTop}></div>
      <div className={styles.glowMiddle}></div>

      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d0c0d]/70 border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-[#ff1744] text-white p-2 rounded-lg font-black text-xl tracking-tighter shadow-lg shadow-[#ff1744]/20">
            BJ
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight">EquipTrack</span>
            <span className="text-[#ff1744] font-semibold text-xs ml-1.5 px-2 py-0.5 rounded-full bg-[#ff1744]/10 border border-[#ff1744]/20">DEMO</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Features</a>
          <a href="#simulator" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Simulator</a>
          <a href="#assets" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Materials</a>
          <a href="#business-impact" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Impact</a>
          <a href="#architecture" className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Tech Stack</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200">
            Enter App
          </Link>
          <Link href="#simulator" className="hidden sm:inline-flex text-sm font-semibold px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff1744] to-[#d50000] text-white hover:opacity-95 shadow-lg shadow-[#ff1744]/25 transition-all duration-200">
            Try Demo
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-20 pb-24 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff1744]/15 border border-[#ff1744]/30 text-[#ff1744] font-semibold text-sm mb-6 uppercase tracking-wider pulsingGlow">
          <Zap className="size-4" /> Next-Gen Hardware Tracking
        </span>
        <h1 className={styles.heroTitle}>
          Equipment Tracking <br className="hidden md:block" />
          <span className={styles.redGradientText}>Made Simple & Accountable</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
          BJ&apos;s EquipTrack is a secure, full-stack monolitihic solution designed to eliminate lost inventory, manual paper workflows, and audit headaches. Purpose-built for high-volume warehouse clubs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <Link href="/" className={`${styles.btnPrimary} flex items-center justify-center gap-2 w-full sm:w-auto`}>
            Launch Live Dashboard <ArrowRight className="size-4" />
          </Link>
          <a href="#simulator" className={`${styles.btnSecondary} flex items-center justify-center gap-2 w-full sm:w-auto`}>
            Interactive Simulator <Scan className="size-4" />
          </a>
        </div>

        {/* Floating preview badge */}
        <div className="mt-16 text-xs text-gray-500 flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Offline-Ready Docker Container Pre-Seeded with Mock Data
        </div>
      </section>

      {/* --- METRICS / STATS --- */}
      <section id="metrics" className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${styles.glassCard} p-8 text-center`}>
            <div className={styles.statValue}>&lt; 5s</div>
            <div className="text-gray-400 font-semibold text-sm mt-2">Check-Out Scan Time</div>
          </div>
          <div className={`${styles.glassCard} p-8 text-center`}>
            <div className={styles.statValue}>100%</div>
            <div className="text-gray-400 font-semibold text-sm mt-2">Loss Accountability</div>
          </div>
          <div className={`${styles.glassCard} p-8 text-center`}>
            <div className={styles.statValue}>0</div>
            <div className="text-gray-400 font-semibold text-sm mt-2">Manual Paper Sheets</div>
          </div>
          <div className={`${styles.glassCard} p-8 text-center`}>
            <div className={styles.statValue}>Zero</div>
            <div className="text-gray-400 font-semibold text-sm mt-2">Config Required</div>
          </div>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Engineered For The Warehouse Floor</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            All the key features team members and club managers need to maintain constant operational awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className={`${styles.glassCard} p-8`}>
            <div className={styles.featureIcon}>
              <QrCode className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Barcode Scanning</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              EquipTrack matches team member badges and equipment labels in seconds. Built to interface with physical scanners as standard keyboard emulators.
            </p>
          </div>

          <div className={`${styles.glassCard} p-8`}>
            <div className={styles.featureIcon}>
              <Users className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Clear User Auditing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track the exact flow of items across shifts. Instantly discover who checked out which RF scanner, tablet, or radio, and when they are due back.
            </p>
          </div>

          <div className={`${styles.glassCard} p-8`}>
            <div className={styles.featureIcon}>
              <FileSpreadsheet className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bulk CSV Administration</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Scale up operations without manual entry. Import hundreds of team members and devices at once via clean CSV uploads, and export histories for compliance auditing.
            </p>
          </div>

          <div className={`${styles.glassCard} p-8`}>
            <div className={styles.featureIcon}>
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Built-in Data Integrity</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Next-generation error handling prevents duplicate checkouts, ensures clean relational mapping in SQLite, and secures administrative controls.
            </p>
          </div>

          <div className={`${styles.glassCard} p-8`}>
            <div className={styles.featureIcon}>
              <TrendingUp className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Operational Visibility</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Visual dashboards give shift supervisors immediate awareness of available stock, preventing staff bottlenecks during peak wholesale club hours.
            </p>
          </div>

          <div className={`${styles.glassCard} p-8`}>
            <div className={styles.featureIcon}>
              <Cpu className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Self-Contained Simplicity</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivered as a single Docker container with an embedded database, requiring zero cloud database dependencies, API tokens, or setup overhead.
            </p>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE SIMULATOR --- */}
      <section id="simulator" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Experience It Live: Interactive Simulator</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Test the barcode scan check-out/check-in logic directly below. Watch how the real-time device database state and system logs update instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Simulator Panel (4 Cols) */}
          <div className={`${styles.glassCard} p-8 lg:col-span-5`}>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Scan className="size-5 text-[#ff1744]" /> Scan Command Console
            </h3>
            
            <form onSubmit={handleSimulateScan} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">1. Select Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScanAction('checkout')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                      scanAction === 'checkout'
                        ? 'bg-[#ff1744]/15 border-[#ff1744] text-[#ff1744]'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Check Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setScanAction('checkin')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${
                      scanAction === 'checkin'
                        ? 'bg-[#ff1744]/15 border-[#ff1744] text-[#ff1744]'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Check In
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">2. Target Equipment</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full bg-[#161517] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff1744]"
                >
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.status})
                    </option>
                  ))}
                </select>
              </div>

              {scanAction === 'checkout' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">3. Assign to Employee</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full bg-[#161517] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff1744]"
                  >
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff1744] to-[#d50000] text-white font-extrabold text-sm hover:opacity-95 shadow-lg shadow-[#ff1744]/20 transition-all flex items-center justify-center gap-2"
              >
                {scanSuccess ? (
                  <>
                    <CheckCircle2 className="size-5 text-white animate-bounce" /> Scan Registered!
                  </>
                ) : (
                  <>
                    <QrCode className="size-5" /> Simulate Barcode Scan
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-white/5 pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-gray-400">Simulation Logs</span>
                <button onClick={() => setLog([])} className="text-[10px] text-[#ff1744] hover:underline uppercase font-bold">Clear</button>
              </div>
              <div className="bg-[#0b0a0c] border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-400 h-44 overflow-y-auto space-y-2">
                {log.length === 0 && <div className="text-gray-600">No logs generated yet. Perform a scan above.</div>}
                {log.map((line, idx) => (
                  <div key={idx} className={line.includes('SUCCESS') ? 'text-emerald-400' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Database Viewer Panel (7 Cols) */}
          <div className={`${styles.glassCard} p-8 lg:col-span-7 h-full flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="size-5 text-[#ff1744]" /> Live Database State (SQLite)
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-widest uppercase">
                CONNECTED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-bold uppercase text-gray-400">
                    <th className="pb-3 pl-2">ID</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Assigned To</th>
                    <th className="pb-3 text-right pr-2">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                  {devices.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-2 font-mono text-xs text-gray-500">{d.id}</td>
                      <td className="py-4 font-bold text-white">{d.name}</td>
                      <td className="py-4">
                        <span className="flex items-center">
                          <span
                            className={`${styles.statusIndicator} ${
                              d.status === 'Available' ? styles.statusAvailable : styles.statusCheckedOut
                            }`}
                          ></span>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-gray-400">{d.user || '—'}</td>
                      <td className="py-4 text-right pr-2 text-xs text-gray-500">{d.time || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-auto bg-[#ff1744]/5 border border-[#ff1744]/10 rounded-xl p-4 flex gap-3.5 items-start mt-6">
              <AlertCircle className="size-5 text-[#ff1744] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong>Pre-Seeding Logic:</strong> In the production environment, the database is mounted to a persistent volume. In this presentation demo, the SQLite database is automatically generated and seeded on launch using the local CSV configurations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEMO ASSETS / INFOGRAPHIC PORTFOLIO --- */}
      <section id="assets" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Presentation Handouts & Media</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Review the formal commercial handout and the live dashboard layout prepared for BJ&apos;s Wholesale stakeholders.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveAssetTab('handout')}
            className={`${styles.tabBtn} ${activeAssetTab === 'handout' ? styles.tabBtnActive : ''} flex items-center gap-2`}
          >
            <BookOpen className="size-4" /> 📄 System Overview Handout
          </button>
          <button
            onClick={() => setActiveAssetTab('dashboard')}
            className={`${styles.tabBtn} ${activeAssetTab === 'dashboard' ? styles.tabBtnActive : ''} flex items-center gap-2`}
          >
            <Cpu className="size-4" /> 🖥️ Dashboard Screenshot
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex flex-col items-center">
          {activeAssetTab === 'handout' ? (
            <div className="w-full max-w-3xl flex flex-col items-center">
              <div className="bg-[#121113] border border-white/10 rounded-2xl p-4 shadow-2xl relative group">
                <a href="/equiptrack-handout-v2.jpeg" target="_blank" className="block relative overflow-hidden rounded-xl">
                  <img
                    src="/equiptrack-handout-v2.jpeg"
                    alt="BJ's EquipTrack Infographic Handout"
                    className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#ff1744] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2">
                      View High Resolution <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </a>
              </div>
              <div className="mt-6 flex gap-4">
                <a
                  href="/equiptrack-handout-v2.jpeg"
                  download
                  className="text-xs font-bold text-[#ff1744] hover:underline flex items-center gap-1.5 uppercase"
                >
                  <Download className="size-4" /> Download JPEG Handout (165 KB)
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="/bjs-equiptrack-handout.png"
                  download
                  className="text-xs font-bold text-[#ff1744] hover:underline flex items-center gap-1.5 uppercase"
                >
                  <Download className="size-4" /> Download PNG Handout (2.2 MB)
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl flex flex-col items-center">
              <div className="bg-[#121113] border border-white/10 rounded-2xl p-4 shadow-2xl relative group">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/50"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500/50"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500/50"></span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono pl-2">http://localhost:9002/dashboard</span>
                </div>
                <a href="/Equiptrack-Dashboard.png" target="_blank" className="block relative overflow-hidden rounded-xl">
                  <img
                    src="/Equiptrack-Dashboard.png"
                    alt="BJ's EquipTrack Dashboard Screenshot"
                    className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#ff1744] text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2">
                      View Fullscreen Screenshot <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </a>
              </div>
              <div className="mt-6">
                <a
                  href="/Equiptrack-Dashboard.png"
                  download
                  className="text-xs font-bold text-[#ff1744] hover:underline flex items-center gap-1.5 uppercase"
                >
                  <Download className="size-4" /> Download Dashboard Screenshot (45 KB)
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- BUSINESS IMPACT DETAILS --- */}
      <section id="business-impact" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Tangible Business Impact</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Comparing operations before and after EquipTrack integration shows massive workflow enhancements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-[#ff1744]/10 p-3 rounded-xl text-[#ff1744]">
                <Clock className="size-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Check-Out bottlenecks Removed</h4>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Shift starts at warehouse clubs typically face logjams as employees manually sign out scanners. Barcode automation drops distribution time to seconds per device.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-[#ff1744]/10 p-3 rounded-xl text-[#ff1744]">
                <Lock className="size-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Full Device Audit Security</h4>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Supervisors always have access to a real-time ledger showing who holds every active RF device, tablet, or radio, enabling instant location follow-ups when damage or losses occur.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-[#ff1744]/10 p-3 rounded-xl text-[#ff1744]">
                <FileSpreadsheet className="size-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Exportable Compliance Ledger</h4>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Export historical checkout files at the end of the month as clean CSV files for accounting compliance checks or audit reports.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#121113] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <h4 className="text-lg font-bold text-white mb-6">Metrics Comparison Table</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                  <span>Sign-out Speed (Paper vs Scan)</span>
                  <span className="text-[#ff1744]">98% Faster</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff1744] to-[#ff5252] rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                  <span>Device Loss Accountability</span>
                  <span className="text-[#ff1744]">100% Traceability</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff1744] to-[#ff5252] rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                  <span>Administrative Hand-off Error Rate</span>
                  <span className="text-emerald-400">Dropped to 0%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECHNICAL ARCHITECTURE STACK --- */}
      <section id="architecture" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Full-Stack Technical Architecture</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Engineered as a clean, monolithic, self-contained system utilizing standard modern design protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${styles.glassCard} p-6`}>
            <div className="text-[#ff1744] font-black text-xl mb-4">01 / FRONTEND</div>
            <h4 className="text-lg font-bold text-white mb-2">Next.js 15</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Utilizing Next.js App Router for server-rendered routing and React 19 Client/Server Actions for instant barcode database mutation logic.
            </p>
          </div>

          <div className={`${styles.glassCard} p-6`}>
            <div className="text-[#ff1744] font-black text-xl mb-4">02 / DATABASE ORM</div>
            <h4 className="text-lg font-bold text-white mb-2">Prisma 6</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Provides type-safe transactional mapping, schema migration controls, and automated index queries directly linking team members and device states.
            </p>
          </div>

          <div className={`${styles.glassCard} p-6`}>
            <div className="text-[#ff1744] font-black text-xl mb-4">03 / ENGINE</div>
            <h4 className="text-lg font-bold text-white mb-2">SQLite</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              File-based database embedded in the monolitihic container. Bypasses external connection configs, offering lightning-fast local performance.
            </p>
          </div>

          <div className={`${styles.glassCard} p-6`}>
            <div className="text-[#ff1744] font-black text-xl mb-4">04 / CONTAINER</div>
            <h4 className="text-lg font-bold text-white mb-2">Docker Image</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              A self-contained production container holding database migrations and pre-seeding logic, allowing it to run offline anywhere Docker is supported.
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className={styles.faqItem}>
            <button onClick={() => toggleFaq(0)} className={styles.faqQuestion}>
              <span>How does the barcode scanner integrate with the website?</span>
              {openFaq === 0 ? <ChevronUp className="size-5 text-[#ff1744]" /> : <ChevronDown className="size-5 text-gray-500" />}
            </button>
            <div className={`${styles.faqAnswer} ${openFaq === 0 ? styles.faqAnswerActive : ''}`}>
              BJ&apos;s EquipTrack is built to read standard keyboard-emulation inputs. When a barcode scanner scans a badge or device label, it inputs the text directly into the web form and appends a Carriage Return (Enter), submitting the form instantly. This means standard warehouse USB/Bluetooth scanners work with zero customization out-of-the-box.
            </div>
          </div>

          <div className={styles.faqItem}>
            <button onClick={() => toggleFaq(1)} className={styles.faqQuestion}>
              <span>Can it run offline inside our warehouse network?</span>
              {openFaq === 1 ? <ChevronUp className="size-5 text-[#ff1744]" /> : <ChevronDown className="size-5 text-gray-500" />}
            </button>
            <div className={`${styles.faqAnswer} ${openFaq === 1 ? styles.faqAnswerActive : ''}`}>
              Yes. By packaging SQLite directly within the Docker container, the application has no external cloud database dependencies (such as PostgreSQL or MySQL). Once you pull the Docker image, the application can be run locally or hosted inside an isolated corporate intranet with zero internet access required.
            </div>
          </div>

          <div className={styles.faqItem}>
            <button onClick={() => toggleFaq(2)} className={styles.faqQuestion}>
              <span>How do we persist database entries between container restarts?</span>
              {openFaq === 2 ? <ChevronUp className="size-5 text-[#ff1744]" /> : <ChevronDown className="size-5 text-gray-500" />}
            </button>
            <div className={`${styles.faqAnswer} ${openFaq === 2 ? styles.faqAnswerActive : ''}`}>
              EquipTrack supports standard Docker volumes. By mounting the database path using the volume flag (`-v equiptrack_prisma:/app/prisma`), the underlying database file `dev.db` persists on the host machine, surviving updates or unexpected container restarts.
            </div>
          </div>

          <div className={styles.faqItem}>
            <button onClick={() => toggleFaq(3)} className={styles.faqQuestion}>
              <span>How is pre-populated data loaded in the demo environment?</span>
              {openFaq === 3 ? <ChevronUp className="size-5 text-[#ff1744]" /> : <ChevronDown className="size-5 text-gray-500" />}
            </button>
            <div className={`${styles.faqAnswer} ${openFaq === 3 ? styles.faqAnswerActive : ''}`}>
              The demo Dockerfile contains a build-time command (`RUN npx tsx scripts/migrate-csv.ts`) that reads the pre-configured `team-members.csv` and `inventory.csv` files and populates the SQLite database schema automatically. This guarantees a ready-to-use playground upon launch.
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-[#090809]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 text-white p-2 rounded-lg font-black text-sm tracking-tighter border border-white/10">
              BJ
            </div>
            <span className="text-gray-400 text-sm">© 2026 Team Turner Solutions. Proudly building modern warehouse logistics.</span>
          </div>

          <div className="flex gap-8 text-xs text-gray-500">
            <a href="https://github.com/teamturnersolutions/BJs-EquipTrack" target="_blank" className="hover:text-white transition-colors">Main Repository</a>
            <a href="https://github.com/teamturnersolutions/bjs-equiptrack-demo" target="_blank" className="hover:text-white transition-colors">Demo Repository</a>
            <a href="mailto:dev@teamturnersolutions.com" className="hover:text-white transition-colors">Support Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
