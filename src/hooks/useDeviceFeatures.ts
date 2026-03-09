import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useDeviceFeatures() {
  const { updateSettings } = useAppStore();

  useEffect(() => {
    // 1. Request Persistent Storage
    const requestPersistence = async () => {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          await navigator.storage.persist();
        }
      }
    };
    requestPersistence();

    // 2. Smart Battery Mode
    const checkBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();
          
          const updateBatteryStatus = () => {
            const isLow = battery.level <= 0.20 && !battery.charging;
            updateSettings({ lowBatteryMode: isLow });
          };

          updateBatteryStatus();
          battery.addEventListener('levelchange', updateBatteryStatus);
          battery.addEventListener('chargingchange', updateBatteryStatus);

          return () => {
            battery.removeEventListener('levelchange', updateBatteryStatus);
            battery.removeEventListener('chargingchange', updateBatteryStatus);
          };
        } catch (e) {
          console.error("Battery API not supported or failed", e);
        }
      }
    };
    checkBattery();
  }, [updateSettings]);
}

export function useWakeLock() {
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        } catch (err: any) {
          if (err.name !== 'NotAllowedError') {
            console.error(`Wake Lock error: ${err}`);
          }
        }
      }
    };

    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (wakeLock !== null) {
        wakeLock.release().catch((err: any) => {
          if (err.name !== 'NotAllowedError') {
            console.error(err);
          }
        });
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}

export function useAutoBackup() {
  const { progress, mistakes, settings, updateSettings } = useAppStore();

  useEffect(() => {
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (now - settings.lastBackupDate > ONE_WEEK) {
      // Generate backup
      const backupData = {
        progress,
        mistakes,
        settings: { ...settings, lastBackupDate: now },
        timestamp: now,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `serine_bac_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      updateSettings({ lastBackupDate: now });
    }
  }, [progress, mistakes, settings, updateSettings]);
}
