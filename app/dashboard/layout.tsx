import { Sidebar } from "@/components/Layout/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Fixe */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Zone Principale */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Interne (User Profile, Search) */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Espace Agent</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Jean Dupont</p>
              <p className="text-xs text-gray-500">Agent Senior • Zone Cocody</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}