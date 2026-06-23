import { DepartmentSidebar } from "@/app/components/features/dashboard/DepartmentSidebar";
import { Header } from "@/app/components/features/dashboard/Header";

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-200 selection:bg-blue-500/30">
      <DepartmentSidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient background glow for visual depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
