import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/login');
  }

  const facultiesCount = await prisma.facultyProfile.count();
  const deptsCount = await prisma.department.count();
  const pendingCount = await prisma.pendingChange.count({ where: { status: 'PENDING' } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Super Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Manage platform configuration and overview</p>
          </div>
          <Link href="/api/auth/signout" className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl font-semibold transition-all">
            Sign Out
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center hover:bg-white/10 transition-all group">
             <div className="p-4 bg-blue-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             </div>
             <p className="text-slate-400 font-medium">Total Faculties</p>
             <p className="text-5xl font-extrabold text-white mt-2">{facultiesCount}</p>
           </div>
           
           <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center hover:bg-white/10 transition-all group">
             <div className="p-4 bg-purple-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
             </div>
             <p className="text-slate-400 font-medium">Departments</p>
             <p className="text-5xl font-extrabold text-white mt-2">{deptsCount}</p>
           </div>
           
           <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center hover:bg-white/10 transition-all group">
             <div className="p-4 bg-yellow-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
             </div>
             <p className="text-slate-400 font-medium">Pending Approvals</p>
             <p className="text-5xl font-extrabold text-white mt-2">{pendingCount}</p>
           </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            System Actions
          </h2>
          <div className="flex flex-wrap gap-4">
             <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
               Manage Departments
             </button>
             <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
               View Audit Logs
             </button>
             <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold shadow-lg transition-all hover:scale-105 active:scale-95">
               Manage Users
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
