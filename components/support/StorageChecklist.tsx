import React from 'react';
import { CheckSquare, Square, Trash2, ShieldAlert, FolderOpen } from 'lucide-react';

export default function StorageChecklist() {
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});

  const toggle = (idx: number) => {
    setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const steps = [
    {
      title: 'Login to cPanel',
      desc: 'Access your cPanel dashboard using your hosting provider credentials.'
    },
    {
      title: 'Open Disk Usage tool',
      desc: 'Locate and click on the "Disk Usage" icon under the "Files" category.'
    },
    {
      title: 'Check total used storage',
      desc: 'Verify the total space used compared to your account quota at the top.'
    },
    {
      title: 'Check public_html folder size',
      desc: 'Expand folders at the bottom table to inspect the "public_html" directory size (which holds the Next.js/WP code).'
    },
    {
      title: 'Check MySQL databases size',
      desc: 'Verify database storage sizes from "MySQL Databases" or "phpMyAdmin" list.'
    },
    {
      title: 'Check email accounts storage',
      desc: 'Review space allocated and consumed by active email accounts under "Email Accounts".'
    },
    {
      title: 'Check backup folder size',
      desc: 'Look inside the "backups" directory. Large old ZIP files should be downloaded locally and deleted.'
    },
    {
      title: 'Check logs and tmp folders',
      desc: 'Audit the "logs" and "tmp" folders for large error logs or expired session cache logs.'
    },
    {
      title: 'Purge redundant files',
      desc: 'Delete unused installer files (e.g. installer.php), cached ZIP files, and core dumps.'
    }
  ];

  const targetDirs = [
    { path: '/public_html', type: 'App codebase and static asset uploads (wp-content, etc.)' },
    { path: '/backups', type: 'Compressed site backups and sql dumps' },
    { path: '/mail', type: 'Active and archived inbox data storage files' },
    { path: '/tmp', type: 'System session cache and session state files' },
    { path: '/logs', type: 'Apache/Nginx error logs and access log dumps' }
  ];

  return (
    <div className="space-y-6">
      {/* Checklist */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <CheckSquare size={16} className="text-[#0f766e]" />
          cPanel Disk Audit Checklist
        </h3>
        <div className="mt-4 space-y-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100"
            >
              <button className="mt-0.5 shrink-0 text-slate-400 hover:text-[#0f766e]">
                {checked[idx] ? (
                  <CheckSquare size={18} className="text-[#0f766e]" />
                ) : (
                  <Square size={18} />
                )}
              </button>
              <div>
                <h4 className={`text-xs font-bold ${checked[idx] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {step.title}
                </h4>
                <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Folders of interest */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <FolderOpen size={16} className="text-indigo-500" />
          Crucial Directories to Check
        </h3>
        <div className="mt-4 space-y-3">
          {targetDirs.map((dir, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-[#0f766e] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 shrink-0 select-all">
                {dir.path}
              </span>
              <span className="text-[10.5px] text-slate-500 font-semibold mt-1">{dir.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
