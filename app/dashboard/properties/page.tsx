import { Plus, Search, Filter } from "lucide-react";

export default function PropertiesManagement() {
  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion Immobilière</h1>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
          <Plus className="h-4 w-4" />
          Nouveau Mandat
        </button>
      </div>

      {/* Barre d'outils (Filtres) */}
      <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher par ref, adresse, propriétaire..." 
            className="w-full rounded-md border border-gray-300 pl-10 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Tableau de gestion (Data Table) */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bien</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Propriétaire</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Agent</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* Row Mock 1 */}
            <tr>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200"></div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Villa Duplex 5P</div>
                    <div className="text-sm text-gray-500">Ref: AG-2023-001</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                  Disponible
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                450.000.000 FCFA
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                SCI Les Palmiers
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Jean Dupont
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Éditer</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Odoo</a>
              </td>
            </tr>
            {/* Row Mock 2 */}
            <tr>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200"></div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Appartement T3 Plateau</div>
                    <div className="text-sm text-gray-500">Ref: AG-2023-045</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                  Sous offre
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                1.200.000 FCFA/mois
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                M. Kouassi
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Marie Koné
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Éditer</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Odoo</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}