import { 
  TrendingUp, 
  Users, 
  Building2, 
  AlertCircle 
} from "lucide-react";

// Composant pour les cartes KPI
function StatCard({ title, value, subtext, icon: Icon, trend }: any) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
        <span className="ml-2 text-gray-400">{subtext}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue, voici ce qui se passe aujourd'hui à l'agence.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventes ce mois" 
          value="12.5 M" 
          subtext="vs mois dernier" 
          trend={12} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Leads actifs" 
          value="42" 
          subtext="15 nouveaux cette sem." 
          trend={8} 
          icon={Users} 
        />
        <StatCard 
          title="Biens en portefeuille" 
          value="18" 
          subtext="2 mandats expirants" 
          trend={-2} 
          icon={Building2} 
        />
        <StatCard 
          title="Tâches urgentes" 
          value="5" 
          subtext="À traiter aujourd'hui" 
          trend={0} 
          icon={AlertCircle} 
        />
      </div>

      {/* Section 2 colonnes : Derniers Leads / Planning */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Derniers Leads */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Derniers Prospects (CRM)</h3>
            <button className="text-sm text-blue-600 hover:underline">Voir tout</button>
          </div>
          <div className="p-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-b px-6 py-4 last:border-0 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                    JD
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">M. Koffi Jean</p>
                    <p className="text-sm text-gray-500">Intéressé par : Villa Rivera</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Nouveau
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Rapide */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-gray-900">Planning du jour</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-16 text-sm font-bold text-gray-500">09:00</div>
              <div className="flex-1 rounded-lg bg-blue-50 p-3 border-l-4 border-blue-500">
                <p className="font-medium text-blue-900">Visite Villa Riviera</p>
                <p className="text-xs text-blue-700">Client: Mme Touré • Contact: 07 07 ...</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-16 text-sm font-bold text-gray-500">14:30</div>
              <div className="flex-1 rounded-lg bg-purple-50 p-3 border-l-4 border-purple-500">
                <p className="font-medium text-purple-900">Essai Toyota Prado</p>
                <p className="text-xs text-purple-700">Concession Zone 4</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}