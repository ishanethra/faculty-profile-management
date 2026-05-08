import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  let hodDepartmentId: string | null = null;
  if ((session?.user as any)?.role === 'HOD' && session?.user?.email) {
    const hodUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { facultyProfile: true },
    });
    hodDepartmentId = hodUser?.facultyProfile?.departmentId ?? null;
  }

  const profile = await prisma.facultyProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { email: true } },
      department: true,
      publications: { orderBy: { year: 'desc' } },
      projects: true,
      patents: true,
      awards: true,
      activities: { orderBy: { year: 'desc' } },
      education: { orderBy: { year: 'desc' } },
      experience: { orderBy: { from: 'desc' } },
      responsibilities: { orderBy: { from: 'desc' } },
      memberships: true,
      foreignVisits: true,
      invitedTalks: { orderBy: { date: 'desc' } },
      phdsGuided: { orderBy: { year: 'desc' } },
    },
  });

  if (!profile) return notFound();

  const canViewNonPublic =
    !!session?.user?.email &&
    (
      (session.user as any).role === 'SUPER_ADMIN' ||
      ((session.user as any).role === 'HOD' && hodDepartmentId === profile.departmentId) ||
      session.user.email === profile.user?.email
    );

  if (!profile.isPublic && !canViewNonPublic) {
    return notFound();
  }

  const tags = profile.researchTags
    ? profile.researchTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  const internalResponsibilities = profile.responsibilities.filter(r => r.type === 'INTERNAL');
  const externalResponsibilities = profile.responsibilities.filter(r => r.type === 'EXTERNAL');
  const hasResponsibilities = internalResponsibilities.length > 0 || externalResponsibilities.length > 0;
  const hasStats = profile.publications.length > 0 || profile.phdsGuided.length > 0;
  const tableClass = "w-full min-w-[760px] table-fixed text-left";
  const headCellClass = "px-4 py-4 text-xs font-black text-slate-500 uppercase tracking-widest";
  const bodyCellClass = "px-4 py-4 align-top text-sm font-medium text-slate-400";
  const titleCellClass = "px-4 py-4 align-top font-bold text-slate-200";

  const initials = profile.name
    .split(' ')
    .filter(n => !n.includes('.'))
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 selection:bg-blue-600/30">
      {/* ── Page Header / Breadcrumb ── */}
      <div className="bg-[#002147] text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/directory"
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Faculty Profiles
          </Link>
          <div className="text-xs text-blue-300 font-medium opacity-60">
            Official Academic Profile
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#002147] to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-6 ring-4 ring-white/5 relative z-10 overflow-hidden">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">{profile.name}</h1>
              {profile.responsibilities?.some(r => 
                (r.position?.toLowerCase().includes('head of the department') || r.position?.toLowerCase().includes('hod')) &&
                (r.to?.toLowerCase() === 'till now' || !r.to)
              ) && (
                <div className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-900/20">
                  Head of the Department
                </div>
              )}
              <p className="text-blue-400 font-bold mt-2 uppercase tracking-wide text-sm">{profile.designation}</p>
              <p className="text-slate-400 font-medium mt-1 text-sm">{profile.department.name}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 text-left">
                {profile.office && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Office</p>
                      <p className="text-sm font-semibold text-slate-300">{profile.office}</p>
                    </div>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-semibold text-slate-300">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {profile.scholarLink && (
                  <a href={profile.scholarLink} target="_blank" rel="noopener noreferrer" 
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-110 group">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z" /></svg>
                  </a>
                )}
                {profile.linkedinLink && (
                  <a href={profile.linkedinLink} target="_blank" rel="noopener noreferrer"
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all hover:scale-110 group">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                )}
              </div>
            </div>

            {tags.length > 0 && (
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Core Specialization</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs rounded-lg font-bold border border-blue-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasStats && (
              <div className="grid grid-cols-2 gap-4">
                {profile.publications.length > 0 && (
                  <div className="bg-[#002147] rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-white">{profile.publications.length}</p>
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Publications</p>
                  </div>
                )}
                {profile.phdsGuided.length > 0 && (
                  <div className="bg-blue-600 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-white">{profile.phdsGuided.length}</p>
                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">PhD Students</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: Detailed Tabs/Sections ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Academic Qualifications */}
            {profile.education.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-black text-white uppercase tracking-tighter text-xl">Academic Qualifications</h2>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-xl shadow-inner">🎓</div>
              </div>
              <div className="p-6 md:p-8">
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className={`${headCellClass} w-[22%]`}>Examination</th>
                        <th className={`${headCellClass} w-[34%]`}>Board / University</th>
                        <th className={`${headCellClass} w-[14%] text-center`}>Year</th>
                        <th className={headCellClass}>Division/Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {profile.education.map((edu) => (
                        <tr key={edu.id} className="group hover:bg-white/5 transition-colors">
                          <td className={titleCellClass}>{edu.degree}</td>
                          <td className={bodyCellClass}>{edu.institution}</td>
                          <td className={`${bodyCellClass} font-black text-blue-400 text-center`}>{edu.year || ''}</td>
                          <td className={bodyCellClass}>{edu.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </section>
            )}

            {/* Employment Profile */}
            {profile.experience.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-black text-white uppercase tracking-tighter text-xl">Employment Profile</h2>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-xl shadow-inner">💼</div>
              </div>
              <div className="p-6 md:p-8">
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className={`${headCellClass} w-[28%]`}>Job Title</th>
                        <th className={`${headCellClass} w-[36%]`}>Employer</th>
                        <th className={`${headCellClass} w-[18%]`}>From</th>
                        <th className={`${headCellClass} w-[18%]`}>To</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {profile.experience.map((exp) => (
                        <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                          <td className={titleCellClass}>{exp.title}</td>
                          <td className={bodyCellClass}>{exp.organization}</td>
                          <td className={`${bodyCellClass} font-bold text-blue-400`}>{exp.from}</td>
                          <td className={bodyCellClass}>{exp.to}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </section>
            )}

            {/* Academic/Administrative Responsibilities */}
            {hasResponsibilities && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-black text-white uppercase tracking-tighter text-xl">Administrative Responsibilities</h2>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-xl shadow-inner">🏛️</div>
              </div>
              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {/* Internal */}
                  {internalResponsibilities.length > 0 && (
                    <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Within the University</h3>
                    <div className="grid gap-4">
                      {internalResponsibilities.map((res) => (
                        <div key={res.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-200 leading-tight">{res.position}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">{res.organization} · {res.from} {res.to ? `to ${res.to}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                  {/* External */}
                  {externalResponsibilities.length > 0 && (
                    <div className="pt-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Outside the University</h3>
                    <div className="grid gap-4">
                      {externalResponsibilities.map((res) => (
                        <div key={res.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-200 leading-tight">{res.position}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">{res.organization} · {res.from} {res.to ? `to ${res.to}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                </div>
              </div>
              </section>
            )}

            {/* Research Projects */}
            {profile.projects.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Sponsored Projects</h2>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-xl shadow-inner">🔬</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={headCellClass}>Title</th>
                          <th className={`${headCellClass} w-[22%]`}>Agency</th>
                          <th className={`${headCellClass} w-[20%]`}>Duration</th>
                          <th className={`${headCellClass} w-[16%]`}>Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.projects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                            <td className={titleCellClass}>{proj.title}</td>
                            <td className={bodyCellClass}>{proj.fundingAgency}</td>
                            <td className={bodyCellClass}>{proj.duration || proj.amount}</td>
                            <td className={bodyCellClass}>{proj.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* PhD Guided */}
            {profile.phdsGuided.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">PhD Scholars</h2>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-xl shadow-inner">👨‍🎓</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={`${headCellClass} w-[28%]`}>Scholar Name</th>
                          <th className={headCellClass}>Thesis Title</th>
                          <th className={`${headCellClass} w-[14%] text-center`}>Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.phdsGuided.map((phd) => (
                          <tr key={phd.id} className="hover:bg-white/5 transition-colors">
                            <td className={titleCellClass}>{phd.studentName}</td>
                            <td className={`${bodyCellClass} italic`}>{phd.thesisTitle}</td>
                            <td className={`${bodyCellClass} font-black text-blue-400 text-center`}>{phd.year || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {profile.foreignVisits.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Academic Foreign Visits</h2>
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 text-xl shadow-inner">✈️</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={`${headCellClass} w-[22%]`}>Country</th>
                          <th className={`${headCellClass} w-[24%]`}>Duration</th>
                          <th className={headCellClass}>Programme</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.foreignVisits.map((visit) => (
                          <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                            <td className={titleCellClass}>{visit.country}</td>
                            <td className={bodyCellClass}>{visit.duration}</td>
                            <td className={bodyCellClass}>{visit.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {profile.publications.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Publications</h2>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-xl shadow-inner">📚</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={`${headCellClass} w-[28%]`}>Authors</th>
                          <th className={headCellClass}>Title</th>
                          <th className={`${headCellClass} w-[24%]`}>Venue</th>
                          <th className={`${headCellClass} w-[12%] text-center`}>Year</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.publications.map((pub) => (
                          <tr key={pub.id} className="hover:bg-white/5 transition-colors">
                            <td className={bodyCellClass}>{pub.authors}</td>
                            <td className={titleCellClass}>
                              {pub.link ? (
                                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                                  {pub.title}
                                </a>
                              ) : pub.title}
                            </td>
                            <td className={bodyCellClass}>{pub.venue}</td>
                            <td className={`${bodyCellClass} font-black text-blue-400 text-center`}>{pub.year || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Awards */}
            {profile.awards.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Awards & Honours</h2>
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-xl shadow-inner">🏆</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={`${headCellClass} w-[14%] text-center`}>Year</th>
                          <th className={headCellClass}>Award</th>
                          <th className={`${headCellClass} w-[32%]`}>Awarding Organization</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.awards.map((award) => (
                          <tr key={award.id} className="hover:bg-white/5 transition-colors">
                            <td className={`${bodyCellClass} font-black text-yellow-500 text-center`}>{award.year || ''}</td>
                            <td className={titleCellClass}>{award.title}</td>
                            <td className={bodyCellClass}>{award.awardedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Patents */}
            {profile.patents.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Patents</h2>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-xl shadow-inner">📜</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={headCellClass}>Title</th>
                          <th className={`${headCellClass} w-[24%]`}>Inventors</th>
                          <th className={`${headCellClass} w-[16%]`}>Patent No.</th>
                          <th className={`${headCellClass} w-[12%] text-center`}>Year</th>
                          <th className={`${headCellClass} w-[16%]`}>Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.patents.map((pat) => (
                          <tr key={pat.id} className="hover:bg-white/5 transition-colors">
                            <td className={titleCellClass}>{pat.title}</td>
                            <td className={bodyCellClass}>{pat.inventors}</td>
                            <td className={bodyCellClass}>{pat.patentNumber}</td>
                            <td className={`${bodyCellClass} text-center`}>{pat.year || ''}</td>
                            <td className={bodyCellClass}>{pat.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Invited Talks */}
            {profile.invitedTalks.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Invited Talks</h2>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-xl shadow-inner">🎤</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={headCellClass}>Topic</th>
                          <th className={`${headCellClass} w-[22%]`}>Date</th>
                          <th className={`${headCellClass} w-[32%]`}>Organization</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.invitedTalks.map((talk) => (
                          <tr key={talk.id} className="hover:bg-white/5 transition-colors">
                            <td className={titleCellClass}>{talk.topic}</td>
                            <td className={`${bodyCellClass} font-bold text-blue-400`}>{talk.date}</td>
                            <td className={bodyCellClass}>{talk.organization}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Membership */}
            {profile.memberships.length > 0 && (
              <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-black text-white uppercase tracking-tighter text-xl">Professional Memberships</h2>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-xl shadow-inner">🎗️</div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className={`${headCellClass} w-[24%]`}>Type</th>
                          <th className={headCellClass}>Organization</th>
                          <th className={`${headCellClass} w-[24%]`}>Membership No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profile.memberships.map((mem) => (
                          <tr key={mem.id} className="hover:bg-white/5 transition-colors">
                            <td className={titleCellClass}>{mem.type}</td>
                            <td className={bodyCellClass}>{mem.organization}</td>
                            <td className={bodyCellClass}>{mem.membershipNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
