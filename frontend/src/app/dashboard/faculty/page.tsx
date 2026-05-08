import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';



export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'FACULTY') {
    redirect('/login');
  }

  const profile = await prisma.facultyProfile.findFirst({
    where: { user: { email: session.user.email } },
    include: { pendingChanges: { orderBy: { submittedAt: 'desc' } } }
  });

  if (!profile) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-8">
      <div className="text-center p-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-2xl font-black mb-2">Profile Not Initialized</h2>
        <p className="text-slate-400 font-medium">Your faculty profile record could not be located. Please contact the Registrar&apos;s office.</p>
        <SignOutButton className="mt-8 inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-900/40">Secure Sign Out</SignOutButton>
      </div>
    </div>
  );

  const completionColor = profile.profileCompletion >= 80 ? 'text-green-400' : profile.profileCompletion >= 50 ? 'text-yellow-400' : 'text-red-400';
  const tags = profile.researchTags ? profile.researchTags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem]">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Faculty Dashboard
            </h1>
            <p className="text-slate-400 mt-1 font-medium">Welcome back, <span className="text-blue-400 font-black">{profile.name}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/profile/edit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all text-sm shadow-xl shadow-blue-900/40">
              Edit Profile
            </Link>
            <Link href={`/profile/${profile.id}`} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all text-sm">
              Public Portal
            </Link>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              Profile Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold">{profile.name}</div>
                <p className="text-[10px] text-slate-600 font-medium px-1 italic">Name changes require admin approval</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Designation</label>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold">{profile.designation}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Office</label>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-slate-400 font-medium">{profile.office || '\u2014'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-slate-400 font-medium">{profile.phone || '\u2014'}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center">
            <p className="text-slate-500 font-bold mb-4 uppercase tracking-widest text-[10px]">Profile Completion</p>
            <div className="relative inline-flex items-center justify-center">
               <svg className="w-32 h-32 transform -rotate-90">
                 <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                 <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" 
                   strokeDasharray={351.8} 
                   strokeDashoffset={351.8 - (351.8 * profile.profileCompletion) / 100}
                   className={profile.profileCompletion >= 80 ? 'text-green-500' : profile.profileCompletion >= 50 ? 'text-yellow-500' : 'text-red-500'} 
                 />
               </svg>
               <span className="absolute text-3xl font-black text-white">{profile.profileCompletion}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-6 font-medium leading-relaxed">Complete your profile to improve visibility in the portal</p>
          </div>
        </div>

        {/* Research Tags */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            </div>
            Research Areas
          </h2>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, i) => (
                <span key={i} className="px-5 py-2.5 bg-slate-950/50 text-slate-300 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-sm font-medium italic">No research tags added yet. Use the profile editor to add your areas of expertise.</p>
          )}
        </div>

        {/* Pending Changes */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            Recent Update Requests
          </h2>
          {profile.pendingChanges.length === 0 ? (
            <div className="flex items-center gap-4 text-slate-500 bg-slate-950/50 rounded-[2rem] p-8 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <p className="text-sm font-bold">All profile updates are current and approved.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.pendingChanges.map(change => (
                <div key={change.id} className="p-8 border border-white/5 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center bg-slate-950/30 hover:bg-slate-950/50 transition-all gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                      <p className="text-base text-white font-black">Request Submitted</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                        {new Date(change.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2.5 ${
                      change.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      change.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        change.status === 'PENDING' ? 'bg-yellow-500 animate-pulse' :
                        change.status === 'APPROVED' ? 'bg-green-500' :
                        'bg-red-500'
                      }`} />
                      {change.status === 'PENDING' ? 'Awaiting Approval' : change.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
