import { useState, useRef } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useCyberPath } from '@/context/CyberPathContext';
import { HardDrive, Download, FileText, Upload, Database, Check, AlertCircle } from 'lucide-react';

export function DataStorageSection() {
  const { exportUserData, downloadProgressReport, importUserData, getStorageUsage } = useSettings();
  const { xp, completedRooms, completedChallenges, unlockedBadges, completedDays, recentActivity } = useCyberPath();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const storage = getStorageUsage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importUserData(content);
      setImportStatus(res);
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Storage & Telemetry Metrics Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <HardDrive size={14} />
              PERSISTENT STORAGE & TELEMETRY DATA
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
              Local persistent browser storage allocation, progression records, and portable data archives.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="text-[#888888] dark:text-[#777777]">LOCAL STORAGE:</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333333] text-[#111111] dark:text-white">
              ~{storage.usedKb} KB ALLOCATED
            </span>
          </div>
        </div>

        {/* Data Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">ACCUMULATED XP</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white">{xp.toLocaleString()}</p>
            <span className="text-[9px] text-[#666666] dark:text-[#888888] block">Milestone records</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">ROOMS SOLVED</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white">{completedRooms.length}</p>
            <span className="text-[9px] text-[#666666] dark:text-[#888888] block">Practical rooms</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">CHALLENGES SOLVED</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white">{completedChallenges.length}</p>
            <span className="text-[9px] text-[#666666] dark:text-[#888888] block">Flag submissions</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">BADGES EARNED</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white">{unlockedBadges.length}</p>
            <span className="text-[9px] text-[#666666] dark:text-[#888888] block">Clearance items</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">CURRICULUM DAYS</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white">{completedDays.size}</p>
            <span className="text-[9px] text-[#666666] dark:text-[#888888] block">Days completed</span>
          </div>

          <div className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">AUDIT FEED ENTRIES</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white">{recentActivity.length}</p>
            <span className="text-[9px] text-[#666666] dark:text-[#888888] block">Log events</span>
          </div>
        </div>
      </div>

      {/* Export & Import Data Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Database size={14} />
          PORTABLE DATA EXPORT & BACKUP RESTORATION
        </h3>

        {importStatus && (
          <div
            className={`p-3 rounded border text-xs font-sans flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
            }`}
          >
            {importStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Export JSON */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-[#111111] dark:text-white uppercase text-[11px] block">
                EXPORT COMPLETE USER DATA (JSON)
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Generates a portable JSON archive with all operative settings, room marks, and certifications.
              </p>
            </div>
            <button
              type="button"
              onClick={exportUserData}
              className="btn-cyber-primary text-xs py-2 px-3.5 w-full justify-center"
            >
              <Download size={13} />
              <span>EXPORT MY DATA</span>
            </button>
          </div>

          {/* Download Text Report */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-[#111111] dark:text-white uppercase text-[11px] block">
                DOWNLOAD PROGRESS REPORT
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Export an official formatted plaintext training clearance certificate and audit ledger.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadProgressReport}
              className="btn-cyber-secondary text-xs py-2 px-3.5 w-full justify-center"
            >
              <FileText size={13} />
              <span>DOWNLOAD REPORT</span>
            </button>
          </div>

          {/* Import JSON Backup */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-[#111111] dark:text-white uppercase text-[11px] block">
                IMPORT BACKUP ARCHIVE
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Restore your previous training credentials, settings, and XP from a valid CyberPath JSON file.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-cyber-secondary text-xs py-2 px-3.5 w-full justify-center"
            >
              <Upload size={13} />
              <span>IMPORT BACKUP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
