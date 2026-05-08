import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";

const prisma = new PrismaClient();

async function getFacultyData(query: string, deptFilter: string, desFilter: string) {
  const departments = await prisma.department.findMany({
    where: deptFilter ? { id: deptFilter } : {},
    include: {
      faculties: {
        where: {
          AND: [
            { isPublic: true },
            query ? {
              OR: [
                { name: { contains: query } },
                { designation: { contains: query } },
                { researchTags: { contains: query } },
              ]
            } : {},
            desFilter === 'Head of Department' ? {
              OR: [
                { user: { role: 'HOD' } },
                { designation: { contains: 'Head' } },
                { designation: { contains: 'HOD' } },
                { responsibilities: {
                  some: {
                    position: { contains: 'Head' },
                    OR: [{ to: { in: ['Till now', ''] } }, { to: null }]
                  }
                }}
              ]
            } : desFilter ? { designation: { contains: desFilter } } : {},
          ]
        },
        include: {
          responsibilities: true,
          user: {
            select: { role: true }
          }
        },
        orderBy: { name: 'asc' }
      }
    }
  });

  // Filter out departments with no matching faculty
  return departments.filter(d => d.faculties.length > 0);
}

export default async function DirectoryPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; dept?: string; des?: string } 
}) {
  const query = searchParams.q || "";
  const deptFilter = searchParams.dept || "";
  const desFilter = searchParams.des || "";

  const visibleDepts = await getFacultyData(query, deptFilter, desFilter);
  const totalFaculty = visibleDepts.reduce((acc, d) => acc + d.faculties.length, 0);

  const designations = ["Professor", "Associate Professor", "Assistant Professor", "Head of Department"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-600/30">
      {/* ───── HERO SECTION ───── */}
      <div className="relative overflow-hidden bg-[#001021] border-b border-white/5">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Official Academic Profiles
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
            Academic <span className="text-blue-500 underline decoration-blue-500/30 decoration-4 underline-offset-8">Community</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
            Discover our distinguished faculty members, their research expertise, and academic contributions.
          </p>

          {/* Search & Filters Bar */}
          <div className="mt-12 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <form className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search by name, expertise, or designation..."
                  aria-label="Search faculty directory"
                  className="w-full bg-transparent border-none pl-14 pr-6 py-4 text-white focus:ring-0 placeholder:text-slate-600 font-bold text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-blue-900/40 active:scale-95 uppercase tracking-wider text-xs"
              >
                Search Directory
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ───── RESULTS ───── */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div aria-live="polite" className="sr-only">
          {totalFaculty} faculty members found across {visibleDepts.length} departments.
        </div>
        
        {visibleDepts.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white">No Results Found</h2>
            <p className="text-slate-500 font-medium mt-2">Try different keywords or browse all departments.</p>
          </div>
        ) : (
          <div className="space-y-40">
            {visibleDepts.map((dept) => {
              const isHOD = (f: any) => {
                if (f?.user?.role === 'HOD') return true;
                const isHODInDesignation = f.designation.toLowerCase().includes('head') || f.designation.toLowerCase().includes('hod');
                const hasHODResponsibility = f.responsibilities?.some((r: any) => 
                  ((r.position || '').toLowerCase().includes('head of the department') || (r.position || '').toLowerCase().includes('hod')) &&
                  (((r.to || '').toLowerCase() === 'till now') || r.to === '')
                );
                return isHODInDesignation || hasHODResponsibility;
              };

              const groups = [
                { label: 'Head of Department', filter: (f: any) => isHOD(f) },
                { label: 'Professors', filter: (f: any) => !isHOD(f) && f.designation.toLowerCase().includes('professor') && !f.designation.toLowerCase().includes('associate') && !f.designation.toLowerCase().includes('assistant') },
                { label: 'Associate Professors', filter: (f: any) => !isHOD(f) && f.designation.toLowerCase().includes('associate') },
                { label: 'Assistant Professors', filter: (f: any) => !isHOD(f) && f.designation.toLowerCase().includes('assistant') },
                { label: 'Other Faculty', filter: (f: any) => !isHOD(f) && !f.designation.toLowerCase().includes('professor') }
              ];

              return (
                <section key={dept.id} className="space-y-16">
                  <div className="text-center space-y-6">
                    <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">
                      {dept.name}
                    </h2>
                    <div className="flex items-center justify-center gap-6">
                      <div className="h-px bg-white/10 flex-1 max-w-[150px]" />
                      <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px]">{dept.code} Department</p>
                      <div className="h-px bg-white/10 flex-1 max-w-[150px]" />
                    </div>
                  </div>

                  <div className="space-y-32">
                    {groups.map((group) => {
                      const faculties = dept.faculties.filter(group.filter);
                      if (faculties.length === 0) return null;

                      return (
                        <div key={group.label} className="space-y-12">
                          <div className="flex items-center gap-8">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] whitespace-nowrap">
                              {group.label}
                            </h3>
                            <div className="h-px bg-white/5 w-full" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {faculties.map((faculty) => (
                              <Link 
                                key={faculty.id}
                                href={`/profile/${faculty.id}`}
                                className="group bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/50 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 flex flex-col gap-6"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                    {faculty.profileImage ? (
                                      <img src={faculty.profileImage} alt={faculty.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-2xl font-black text-slate-800 uppercase">{faculty.name.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">{faculty.name}</h4>
                                    <p className="text-blue-500 text-[9px] font-black uppercase tracking-wider mt-2.5 bg-blue-500/10 inline-block px-3 py-1 rounded-full border border-blue-500/20">
                                      {isHOD(faculty) ? 'Head of Department' : faculty.designation}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <div className="flex flex-wrap gap-2">
                                    {faculty.researchTags?.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 3).map((tag: string, i: number) => (
                                      <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-all border border-white/5">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="pt-6 flex items-center justify-between border-t border-white/5">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">View Academic Profile</span>
                                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/5 bg-[#001021] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">National Institute of Technology, Tiruchirappalli</p>
          <p className="text-slate-700 text-xs mt-6 font-medium opacity-60">© 2024 Faculty Information Portal · Official Institute Record</p>
        </div>
      </footer>
    </div>
  );
}
