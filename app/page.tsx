"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient(); // Initialisation

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Appel Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message); // Ex: "Invalid login credentials"
      setIsLoading(false);
    } else {
      // 2. Succès -> Redirection
      // Le Middleware (étape suivante) laissera passer car le cookie est mis
      router.refresh();
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-200">
        
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            AGTS Sarlu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accès réservé aux agents
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            <AlertCircle className="h-4 w-4" />
            {error === "Invalid login credentials" ? "Email ou mot de passe incorrect." : error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="agent@agts.cd"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {isLoading ? "Vérification..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}