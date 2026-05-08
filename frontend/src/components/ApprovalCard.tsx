"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApprovalCardProps {
  change: {
    id: string;
    changeData: string;
    submittedAt: Date | string;
    facultyProfile: {
      name: string;
    };
  };
}

export default function ApprovalCard({ change }: ApprovalCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  let data: any = {};
  try {
    data = JSON.parse(change.changeData);
  } catch (e) {
    console.error("Failed to parse change data", e);
  }

  const sections = Array.isArray(data.sections)
    ? data.sections
    : [{ key: "profile", label: "Profile Information", data }];

  const facultyName = data.facultyName || change.facultyProfile.name;

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    try {
      const res = await fetch("/api/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingChangeId: change.id, status }),
      });

      if (!res.ok) throw new Error("Failed to process approval");
      
      router.refresh();
    } catch (err) {
      alert("Error processing approval");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-slate-800 rounded-3xl bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-all group">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{facultyName}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            {sections.map((section: any) => section.label).join(" + ")} · Request ID: #{change.id.slice(-6)} · {new Date(change.submittedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("APPROVED")}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-900/40 active:scale-95 disabled:opacity-50"
          >
            Approve Request
          </button>
          <button
            onClick={() => handleAction("REJECTED")}
            disabled={loading}
            className="px-6 py-2.5 bg-white/5 hover:bg-red-500/10 text-red-400 border border-white/10 hover:border-red-500/30 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Section Requests</p>
        <div className="space-y-4">
          {sections.map((section: any, index: number) => (
            <div key={`${section.key}-${index}`} className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black text-blue-400 uppercase tracking-wider">{section.label}</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{section.key}</p>
              </div>

              {section.details && (
                <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">{section.details}</p>
              )}

              {Array.isArray(section.changes) && section.changes.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {section.changes.map((change: any, changeIndex: number) => (
                    <div key={`${change.field}-${changeIndex}`} className="bg-slate-900/70 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-2">{String(change.field).replace(/([A-Z])/g, ' $1')}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Current</p>
                          <p className="text-slate-400 font-bold break-words">{String(change.from || 'Empty')}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-blue-400 font-black uppercase tracking-wider">Requested</p>
                          <p className="text-slate-100 font-bold break-words">{String(change.to || 'Empty')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(section.data) ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <tbody className="divide-y divide-white/5">
                      {section.data.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                          <td className="py-3 pr-4 text-[10px] font-black text-slate-600 uppercase tracking-widest align-top w-24">Row {rowIndex + 1}</td>
                          <td className="py-3 text-xs text-slate-300 font-mono align-top whitespace-pre-wrap">{JSON.stringify(row, null, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(section.data || {}).map(([key, value]) => {
                    if (value === null || value === "" || typeof value === "object") return null;
                    return (
                      <div key={key} className="bg-slate-900/70 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm text-slate-200 font-bold truncate">{String(value)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {sections.every((section: any) => !section.details && (!section.data || Object.keys(section.data).length === 0)) && (
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <p className="text-sm text-slate-500 font-medium">No displayable field changes found in this request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
