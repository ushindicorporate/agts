"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle, Building2 } from "lucide-react"; // Ajout de Building2
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner"; // Utilisation du toaster pour le mode entreprise

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Échec de connexion", {
          description: error.message === "Invalid login credentials" 
            ? "Identifiants incorrects. Vérifiez votre email et mot de passe." 
            : error.message,
        });
        return;
      }

      if (data.user) {
        toast.success("Connexion réussie", {
          description: "Bienvenue sur la plateforme AGTS.",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Erreur système", {
        description: "Une erreur inattendue est survenue.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Background plus "Corporate" avec un léger dégradé
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-slate-950 px-4">
      {/* Petit décor pour le mode entreprise */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AGTS Sarlu
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Gestion Immobilière & Automobile
          </p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Email professionnel
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 transition-colors group-focus-within:text-blue-600">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 py-3 pl-10 text-slate-900 dark:text-white transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none sm:text-sm"
                  placeholder="agent@agts.cd"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 transition-colors group-focus-within:text-blue-600">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 py-3 pl-10 text-slate-900 dark:text-white transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Accéder au tableau de bord"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AGTS Sarlu. Système de gestion sécurisé.
        </p>
      </div>
    </div>
  );
}