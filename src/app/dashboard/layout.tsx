import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  User as UserIcon, 
  Calendar, 
  BookOpen,
  LogOut,
  Target,
  BarChart3,
  LayoutDashboard
} from "lucide-react";
import VersionFooter from "@/components/VersionFooter";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    return (
      <div className="p-12 text-center h-screen flex flex-col items-center justify-center bg-gray-50 uppercase tracking-widest font-black">
        <p className="text-red-500 mb-4 text-2xl">Unauthorized or Invalid Session</p>
        <Link href="/api/auth/signout?callbackUrl=/login" className="px-6 py-3 bg-gray-900 text-white text-sm">
          Reset Session & Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-indigo-700 flex items-center justify-center text-white font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-indigo-900 tracking-tight uppercase">DevOps</span>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-none text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wider">
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link href="/dashboard/coursework" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-none text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wider">
              <BookOpen className="w-5 h-5" />
              Coursework
            </Link>
            <Link href="/dashboard/attendance" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-none text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wider">
              <Calendar className="w-5 h-5" />
              Attendance
            </Link>
            <Link href="/dashboard/marks" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-none text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wider">
              <BarChart3 className="w-5 h-5" />
              Marks
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-none bg-gray-200 flex items-center justify-center">
               <UserIcon className="w-4 h-4 text-gray-600" />
             </div>
             <div>
               <p className="text-sm font-bold text-gray-800 line-clamp-1">{user.name}</p>
             </div>
          </div>
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <button className="p-2 rounded-none text-gray-500 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
          <div className="mt-12">
            <VersionFooter />
          </div>
        </div>
      </main>
    </div>
  );
}
