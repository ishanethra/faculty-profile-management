import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ApprovalCard from '@/components/ApprovalCard';



export default async function HODDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== 'HOD') {
    redirect('/login');
  }

  // Get HOD's own profile and department
  const hodUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      facultyProfile: {
        include: {
          department: true,
          pendingChanges: { orderBy: { submittedAt: 'desc' }, take: 1 }
        }
      }
    }
  });

  if (!hodUser?.facultyProfile?.departmentId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-8">
        <div className="text-center p-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] shadow-2xl">
           <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/20">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
           </div>
           <h2 className="text-2xl font-black mb-2">Administrative Hold</h2>
           <p className="text-slate-400 font-medium max-w-sm mx-auto">You are not currently assigned as Head of Department for any registered academic unit. Please contact the Office of Dean (Faculty Welfare).</p>
           <Link href="/api/auth/signout" className="mt-8 inline-block px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-red-900/40">Secure Sign Out</Link>
        </div>
      </div>
    );
  }

  const profile = hodUser.facultyProfile;
  const department = profile.department;

  // Get all pending changes for faculties in this department (excluding the HOD if we want, but let's show all)
  const pendingChanges = await prisma.pendingChange.findMany({
    where: {
      facultyProfile: { departmentId: department.id },
      status: 'PENDING',
      NOT: {
        facultyProfileId: profile.id // Optional: HODs might not approve their own? But let's follow user's "flexible" request
      }
    },
    include: { facultyProfile: true },
    orderBy: { submittedAt: 'desc' }
  });

  const completionColor = profile.profileCompletion >= 80 ? 'text-green-400' : profile.profileCompletion >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              Department Administration
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
              {department.name}
            </h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              Managing Authority: <span className="text-blue-400 font-black">{profile.name}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/profile/edit" className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all text-sm shadow-xl shadow-blue-900/40 active:scale-95">
              Edit My Profile
            </Link>
            <Link href={`/profile/${profile.id}`} className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all text-sm">
              Public Portal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content: Approvals */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  </div>
                  Pending Approvals
                </h2>
                <span className="px-5 py-2 bg-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                  {pendingChanges.length} Request{pendingChanges.length !== 1 ? 's' : ''}
                </span>
              </div>

              {pendingChanges.length === 0 ? (
                <div className="text-center py-20 bg-slate-950/50 rounded-[3rem] border border-dashed border-white/10">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-slate-500 font-bold text-sm tracking-tight">No pending faculty update requests.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingChanges.map(change => (
                    <ApprovalCard key={change.id} change={change as any} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: HOD's Own Profile Summary */}
          <div className="space-y-10">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem]">
              <h2 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                My Profile Status
              </h2>
              
              <div className="flex flex-col items-center py-6">
                <div className="relative w-32 h-32 mb-6">
                   <svg className="w-32 h-32 transform -rotate-90">
                     <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                     <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" 
                       strokeDasharray={351.8} 
                       strokeDashoffset={351.8 - (351.8 * profile.profileCompletion) / 100}
                       className={profile.profileCompletion >= 80 ? 'text-green-500' : profile.profileCompletion >= 50 ? 'text-yellow-500' : 'text-red-500'} 
                     />
                   </svg>
                   <span className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">{profile.profileCompletion}%</span>
                </div>
                <p className="text-sm font-black text-white uppercase tracking-wider">{profile.designation}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">{profile.office || 'No office set'}</p>
              </div>

              <div className="h-px bg-white/5 my-8" />

              {profile.pendingChanges.length > 0 && (
                <div className="p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Pending Own Update</p>
                  <p className="text-xs text-slate-400 font-medium">Your request from {new Date(profile.pendingChanges[0].submittedAt).toLocaleDateString()} is awaiting admin review.</p>
                </div>
              )}

              <Link href="/dashboard/profile/edit" className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-black text-white transition-all text-xs uppercase tracking-widest">
                Update My Info
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>

            <div className="bg-[#002147] p-10 rounded-[3rem] shadow-xl shadow-blue-900/40 text-white border border-white/5">
               <h2 className="text-xl font-black mb-2">Department Portal</h2>
               <p className="text-xs text-blue-200/60 mb-8 font-medium">Manage faculty records and department visibility.</p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-white">—</p>
                    <p className="text-[9px] text-blue-200/40 font-black uppercase tracking-widest mt-1">Total Faculty</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-yellow-400">{pendingChanges.length}</p>
                    <p className="text-[9px] text-blue-200/40 font-black uppercase tracking-widest mt-1">New Pending</p>
                  </div>
               </div>
               <Link href="/directory" className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-3 font-black transition-all text-xs uppercase tracking-widest shadow-xl shadow-blue-900/40">
                View Faculty Profiles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
