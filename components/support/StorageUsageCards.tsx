import React from 'react';
import { ShieldAlert, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface StorageRecord {
  totalStorageGb: number;
  usedStorageGb: number;
  availableStorageGb: number;
  publicHtmlSizeGb: number;
  databaseSizeGb: number;
  emailStorageGb: number;
  backupSizeGb: number;
  logsSizeGb: number;
  temporaryFilesSizeGb: number;
  lastCheckedAt: Date | string;
}

interface StorageUsageCardsProps {
  latestRecord: StorageRecord | null;
}

export default function StorageUsageCards({ latestRecord }: StorageUsageCardsProps) {
  if (!latestRecord) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
        <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
        <div>
          <h4 className="font-bold text-emerald-950">No Storage Record Configured Yet</h4>
          <p className="mt-1 font-medium text-emerald-700/95">
            Use the form below to enter your hosting space measurements. The system will compile metrics and analyze issues.
          </p>
        </div>
      </div>
    );
  }

  const {
    totalStorageGb,
    usedStorageGb,
    emailStorageGb,
    backupSizeGb,
    logsSizeGb,
    temporaryFilesSizeGb
  } = latestRecord;

  const usagePercent = totalStorageGb > 0 ? (usedStorageGb / totalStorageGb) * 100 : 0;
  
  const warnings = [];

  // Warning 1: Storage above 80%
  if (usagePercent >= 80) {
    warnings.push({
      type: 'critical',
      title: `Disk Space Usage is Critical (${usagePercent.toFixed(1)}%)`,
      desc: `Your hosting space has exceeded 80% limit. Purchase additional server space or purge logs/backups immediately to avoid database transaction failures.`,
    });
  } else if (usagePercent >= 70) {
    warnings.push({
      type: 'warning',
      title: `Disk Space Usage is High (${usagePercent.toFixed(1)}%)`,
      desc: `Hosting disk space usage is above 70%. Monitor logs and clean unused files before space runs out.`,
    });
  }

  // Warning 2: Large backup files
  if (backupSizeGb > 10) {
    warnings.push({
      type: 'warning',
      title: `Large Backup Archives Found (${backupSizeGb.toFixed(1)} GB)`,
      desc: `Compressed server backups are occupying significant storage. Download them to offline cold storage and delete old archives from the backups directory.`,
    });
  }

  // Warning 3: Email storage is high
  if (emailStorageGb > 5) {
    warnings.push({
      type: 'info',
      title: `High Email Account Storage (${emailStorageGb.toFixed(1)} GB)`,
      desc: `Email storage is growing. Clean out spam/trash inboxes or configure auto-archive limits for inactive staff mailboxes.`,
    });
  }

  // Warning 4: Large logs
  if (logsSizeGb > 2) {
    warnings.push({
      type: 'warning',
      title: `Large Log Files Found (${logsSizeGb.toFixed(1)} GB)`,
      desc: `Server logs are taking up too much space. Check for recursive error loops in log files, empty the error log, and configure cron log rotation.`,
    });
  }

  // Warning 5: Old installer or archive suggestion
  warnings.push({
    type: 'security',
    title: `Installer & Zip Cleanups Required`,
    desc: `Ensure old 'installer.php' and installation zip files (like backup zip folders) are removed from the public_html root. These pose security vulnerability risks.`,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
        <ShieldAlert size={16} className="text-rose-500" />
        Storage Alerts & Security Warnings
      </h3>

      {warnings.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-2.5">
          <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
          <div>
            <h4 className="text-xs font-bold text-emerald-950">Storage Health is Excellent</h4>
            <p className="text-[10px] font-medium text-emerald-700/90 mt-0.5">
              No warnings detected. Your disk space capacity, logs, backups, and mail stores are within safe operating limits.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((warn, index) => {
            const isCritical = warn.type === 'critical';
            const isWarning = warn.type === 'warning';
            const isSecurity = warn.type === 'security';
            
            let colorClass = 'bg-sky-50 border-sky-100 text-sky-800';
            let icon = <Info className="text-sky-500 shrink-0 mt-0.5" size={16} />;

            if (isCritical) {
              colorClass = 'bg-rose-50 border-rose-100 text-rose-800';
              icon = <ShieldAlert className="text-rose-500 shrink-0 mt-0.5 animate-bounce" size={16} />;
            } else if (isWarning || isSecurity) {
              colorClass = 'bg-amber-50 border-amber-100 text-amber-800';
              icon = <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />;
            }

            return (
              <div
                key={index}
                className={`p-3.5 border rounded-2xl flex items-start gap-2.5 shadow-soft ${colorClass}`}
              >
                {icon}
                <div>
                  <h4 className="text-xs font-bold leading-tight">{warn.title}</h4>
                  <p className="text-[10px] font-semibold opacity-90 mt-1 leading-relaxed">{warn.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
