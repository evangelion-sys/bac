import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Moon, Sun, Type, Download, Upload, Battery, BatteryWarning } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Settings() {
  const { settings, updateSettings, restoreData } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.progress && data.mistakes) {
          restoreData({
            progress: data.progress,
            mistakes: data.mistakes,
            settings: data.settings || settings,
          });
          setRestoreStatus('success');
          setTimeout(() => setRestoreStatus('idle'), 3000);
        } else {
          setRestoreStatus('error');
        }
      } catch (err) {
        setRestoreStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const forceBackup = () => {
    const { progress, mistakes } = useAppStore.getState();
    const backupData = {
      progress,
      mistakes,
      settings,
      timestamp: Date.now(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `serine_bac_backup_manual.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <header className="pt-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-2xl">
            <SettingsIcon className="w-6 h-6 text-pink-500 dark:text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Customize your experience & protect your data.</p>
      </header>

      {/* Appearance */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Appearance & Reading</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-500 dark:text-indigo-400">
                {settings.theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Midnight Lavender Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Protect your eyes at night</p>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ theme: settings.theme === 'light' ? 'midnight' : 'light' })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.theme === 'midnight' ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.theme === 'midnight' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-500 dark:text-emerald-400">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">High Legibility Font</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Easier to read text</p>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ highLegibility: !settings.highLegibility })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.highLegibility ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.highLegibility ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Text Size</p>
              <span className="text-xs text-slate-500 dark:text-slate-400">{settings.fontSize}px</span>
            </div>
            <input 
              type="range" 
              min="12" 
              max="24" 
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Data Vault */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">The Data Vault</h2>
        
        <div className="space-y-3">
          <button 
            onClick={forceBackup}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <div className="text-left">
                <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Manual Backup</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Download your data now</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors border border-pink-100 dark:border-pink-900/50"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-pink-500 dark:text-pink-400" />
              <div className="text-left">
                <p className="font-medium text-pink-700 dark:text-pink-300 text-sm">Restore Data</p>
                <p className="text-xs text-pink-500/70 dark:text-pink-400/70">Load from a backup file</p>
              </div>
            </div>
          </button>
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleRestore}
          />
          
          {restoreStatus === 'success' && (
            <p className="text-xs text-emerald-500 text-center font-medium">Data restored successfully! 🎉</p>
          )}
          {restoreStatus === 'error' && (
            <p className="text-xs text-red-500 text-center font-medium">Invalid backup file.</p>
          )}
        </div>
      </section>

      {/* System Status */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">System Status</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${settings.lowBatteryMode ? 'bg-orange-50 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {settings.lowBatteryMode ? <BatteryWarning className="w-5 h-5" /> : <Battery className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">Smart Battery Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {settings.lowBatteryMode ? 'Active (Animations disabled)' : 'Inactive (Battery OK)'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
