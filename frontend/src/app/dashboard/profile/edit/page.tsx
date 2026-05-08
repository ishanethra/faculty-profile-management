"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [appliedDirectly, setAppliedDirectly] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    office: "",
    phone: "",
    researchTags: "",
    scholarLink: "",
    linkedinLink: "",
    orcid: "",
    cvUrl: "",
    phdGuidance: false,
    collaboration: false,
    consultancy: false,
  });


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      
      setFormData({
        name: data.name || "",
        designation: data.designation || "",
        office: data.office || "",
        phone: data.phone || "",
        researchTags: data.researchTags || "",
        scholarLink: data.scholarLink || "",
        linkedinLink: data.linkedinLink || "",
        orcid: data.orcid || "",
        cvUrl: data.cvUrl || "",
        phdGuidance: data.phdGuidance || false,
        collaboration: data.collaboration || false,
        consultancy: data.consultancy || false,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    setAppliedDirectly(false);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setAppliedDirectly(Boolean(data.appliedDirectly));
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Redirect back to dashboard after a delay
      setTimeout(() => {
        if (session?.user?.role === 'HOD') router.push('/dashboard/hod');
        else router.push('/dashboard/faculty');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center p-12 bg-white border border-slate-200 rounded-[3rem] shadow-xl shadow-blue-900/5">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-[#002147] mb-2">Syncing Profile Data</h2>
          <p className="text-slate-500 font-medium">Please wait while we establish a secure connection to the database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <span className="mx-3 text-slate-800">/</span>
          <span className="text-slate-300">Edit Profile</span>
        </nav>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="bg-[#002147] p-10 sm:p-12 text-center border-b border-white/5">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">Edit Faculty Profile</h1>
            <p className="text-blue-200/60 mt-3 font-medium">
              {session?.user?.role === 'HOD'
                ? 'Update your academic and professional information. HOD updates are published immediately.'
                : 'Update your academic and professional information. Changes require departmental approval.'}
            </p>
          </div>

          {error && (
            <div className="m-8 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-4 text-sm font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          {success && (
            <div className="m-8 p-6 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center gap-4 text-sm font-bold animate-pulse">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              {appliedDirectly ? 'Profile updated successfully and published immediately.' : 'Profile update request submitted successfully! Redirecting...'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-12">
            {/* Section 01: Basic Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-sm border border-blue-500/20">01</div>
                <h2 className="text-xl font-black text-white">Identity & Location</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name (Official)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office / Lab Room</label>
                  <input
                    type="text"
                    name="office"
                    placeholder="e.g. Room 204, CSE Dept"
                    value={formData.office}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Intercom / Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 431 250XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 02: Research */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-black text-sm border border-purple-500/20">02</div>
                <h2 className="text-xl font-black text-white">Academic Research</h2>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expertise Tags (Comma separated)</label>
                <textarea
                  name="researchTags"
                  rows={2}
                  placeholder="e.g. Cryptography, Blockchain, Network Security"
                  value={formData.researchTags}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all resize-none placeholder:text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Google Scholar URL</label>
                  <input
                    type="url"
                    name="scholarLink"
                    value={formData.scholarLink}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 03: Opportunities */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 font-black text-sm border border-green-500/20">03</div>
                <h2 className="text-xl font-black text-white">Opportunities</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: 'phdGuidance', label: 'PhD Guidance', icon: '🎓' },
                  { id: 'collaboration', label: 'Collaboration', icon: '🤝' },
                  { id: 'consultancy', label: 'Consultancy', icon: '💼' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-6 rounded-[1.5rem] border cursor-pointer transition-all ${
                      (formData as any)[opt.id]
                        ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-900/40"
                        : "bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs font-black uppercase tracking-widest">{opt.label}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      (formData as any)[opt.id] ? "border-white" : "border-slate-800"
                    }`}>
                      {(formData as any)[opt.id] && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <input
                      type="checkbox"
                      name={opt.id}
                      checked={(formData as any)[opt.id]}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-5">
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Submit Profile Update"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
