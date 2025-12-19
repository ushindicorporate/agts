import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // On retire le préfixe "data:image/jpeg;base64," pour Odoo
      const base64Clean = result.split(',')[1];
      resolve(base64Clean);
    };
    reader.onerror = error => reject(error);
  });
};

export const formatPrice = (amount: number, type: string) => {
  const formatted = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(amount);
  return type === 'rent' ? `${formatted} / mois` : formatted;
};

export const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);