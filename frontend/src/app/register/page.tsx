"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
  code: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptLoading, setDeptLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "FACULTY",
    departmentId: "",
    designation: "",
  });

  const needsProfile = formData.role === "FACULTY" || formData.role === "HOD";

  const emailValid = formData.email === "" || formData.email.endsWith("@nitt.edu");
  const passwordMatch =
    formData.confirmPassword === "" || formData.password === formData.confirmPassword;

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data: Department[]) => {
        setDepartments(Array.isArray(data) ? data : []);
        setDeptLoading(false);
      })
      .catch(() => setDeptLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.endsWith("@nitt.edu")) {
      setError("Only @nitt.edu email addresses are allowed.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (needsProfile && !formData.departmentId) {
      setError("Please select your department.");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center space-y-4 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl max-w-sm mx-4">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Account Created!</h2>
          <p className="text-slate-400 text-sm">
            Your account has been registered successfully. Redirecting you to sign in…
          </p>
          <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
            <div className="h-1 bg-green-400 rounded-full animate-[progress_2.5s_linear_forwards]" style={{ width: "100%", transformOrigin: "left", animation: "width 2.5s linear" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl p-8 sm:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-5">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
            Join the Portal
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Official Registration System</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3.5 rounded-xl mb-6 text-xs font-bold">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Official Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="faculty@nitt.edu"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700 text-sm font-bold ${
                  !emailValid
                    ? "border-red-500/30 focus:ring-red-500/20"
                    : "border-white/5 focus:ring-blue-500/20 focus:border-blue-500 text-white"
                }`}
              />
              {!emailValid && (
                <p className="text-[10px] text-red-400 font-bold ml-1 uppercase">Must end with @nitt.edu</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Full Academic Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Dr. First Last"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/5 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-700 text-sm font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/5 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-700 text-sm font-bold pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Confirm Security Key
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700 text-sm font-bold pr-12 ${
                    !passwordMatch
                      ? "border-red-500/30 focus:ring-red-500/20"
                      : "border-white/5 focus:ring-blue-500/20 focus:border-blue-500 text-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {!passwordMatch && (
                <p className="text-[10px] text-red-400 font-bold ml-1 uppercase">Passwords do not match</p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Select User Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: "FACULTY", label: "Faculty", icon: "👨‍🏫" },
                { value: "HOD", label: "HOD", icon: "🏛️" },
              ].map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.role === r.value
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "bg-slate-950/50 border-white/5 text-slate-500 hover:border-blue-500/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={formData.role === r.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-base">{r.icon}</span>
                  <span className="text-xs font-black uppercase tracking-wider">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {needsProfile && (
            <div className="space-y-6 pt-4">
              <div className="h-px bg-white/5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Your Department
                  </label>
                  <div className="relative">
                    <select
                      name="departmentId"
                      required={needsProfile}
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-white/5 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-sm font-bold"
                    >
                      <option value="" disabled className="bg-slate-900">
                        {deptLoading ? "Connecting to database..." : "Select Department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id} className="bg-slate-900">
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="e.g., Associate Professor"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/5 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-700 text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || !emailValid || !passwordMatch}
              className="w-full group rounded-xl bg-blue-600 px-8 py-5 font-black text-white shadow-xl shadow-blue-900/20 transition-all duration-300 hover:bg-blue-500 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-[10px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Register Account
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>

          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-black transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest opacity-50">
            Internal Academic Use Only
          </p>
        </form>
      </div>
    </div>
  );
}
