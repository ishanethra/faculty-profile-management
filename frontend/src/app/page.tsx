import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 selection:bg-blue-600/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
      
      {/* ───── HERO SECTION ───── */}
      <div className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4">
        {/* Campus Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://www.nitt.edu/home/nitt-admin.jpg" 
            alt="NIT Trichy Campus" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Official Faculty Information System
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-5xl mx-auto">
            Empowering <span className="text-blue-500">Academic</span> Excellence.
          </h1>
          
          <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            The centralized platform for National Institute of Technology Trichy faculty members to manage academic profiles, research portfolios, and departmental collaborations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link 
              href="/directory" 
              className="w-full sm:w-auto group relative overflow-hidden rounded-2xl bg-blue-600 px-12 py-5 font-black text-white shadow-2xl shadow-blue-900/40 transition-all duration-300 hover:scale-105 hover:bg-blue-500 active:scale-95 uppercase tracking-wider text-xs"
            >
              Browse Faculty Profiles
            </Link>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/login" 
                className="flex-1 sm:flex-none px-12 py-5 rounded-2xl border-2 border-white/5 bg-white/5 text-white font-black transition-all duration-300 hover:border-blue-500/50 hover:bg-white/10 active:scale-95 uppercase tracking-wider text-xs text-center backdrop-blur-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ───── FEATURES GRID ───── */}
      <section className="bg-slate-900/50 border-y border-white/5 py-24 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Profile Management",
              desc: "Maintain your comprehensive academic record, including education, experience, and administrative roles.",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            },
            {
              title: "Research Showcase",
              desc: "Highlight your research interests, publications, and professional memberships to the global community.",
              icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z"
            },
            {
              title: "Department Discovery",
              desc: "Department-wise faculty listings with advanced filtering for researchers and academic experts.",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-950/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-blue-500/20">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white mb-4">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA SECTION ───── */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 sm:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-blue-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-indigo-900/20 blur-[100px] rounded-full"></div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">Ready to update your profile?</h2>
          <p className="text-blue-100/70 max-w-xl mx-auto font-medium">Join the official faculty network and keep your professional records up to date.</p>
          <div className="pt-6">
            <Link 
              href="/register" 
              className="inline-block bg-white text-blue-600 font-black px-12 py-5 rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-wider text-xs shadow-xl active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-slate-950 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <div className="h-px bg-white/20 w-12"></div>
            <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">NIT TIRUCHIRAPPALLI</p>
            <div className="h-px bg-white/20 w-12"></div>
          </div>
          <p className="text-slate-600 text-xs font-medium">© 2024 National Institute of Technology, Tiruchirappalli. Official Faculty Portal.</p>
        </div>
      </footer>
    </main>
  );
}
