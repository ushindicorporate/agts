'use client'

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// 1. Graphique en Barres (Ventes Mensuelles)
export function SalesChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
        <Tooltip 
            formatter={(value: number | undefined) => value !== undefined ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value) : ''}
            cursor={{ fill: '#f3f4f6' }}
        />
        <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Chiffre d'Affaires" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 2. Graphique Camembert (Sources)
export function SourcePieChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 3. Graphique Pipeline (Forecast)
export function FunnelChart({ data }: { data: any[] }) {
    // On trie pour avoir un effet d'entonnoir (ou on garde l'ordre des étapes si la data est propre)
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={100} fontSize={11} />
          <Tooltip formatter={(value: number | undefined) => value !== undefined ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value) : ''} />
          <Bar dataKey="value" fill="#10B981" barSize={20} radius={[0, 4, 4, 0]} name="Montant Potentiel" />
        </BarChart>
      </ResponsiveContainer>
    );
  }