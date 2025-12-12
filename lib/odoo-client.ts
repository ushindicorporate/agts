// import xmlrpc from 'xmlrpc';
// import { createClient } from '@/utils/supabase/server'; // Ton client Supabase Server

// // Config Odoo (Variables d'environnement)
// const ODOO_CONFIG = {
//   url: process.env.ODOO_URL!,
//   db: process.env.ODOO_DB!,
//   username: process.env.ODOO_ADMIN_EMAIL!, // Un user système pour les appels API
//   password: process.env.ODOO_ADMIN_PASSWORD!,
// };

// // Fonction générique pour appeler Odoo
// async function callOdoo(model: string, method: string, args: any[]) {
//   const common = xmlrpc.createClient({ url: `${ODOO_CONFIG.url}/xmlrpc/2/common` });
  
//   // 1. Authentification système pour obtenir l'UID Admin
//   const uid = await new Promise<number>((resolve, reject) => {
//     common.methodCall('authenticate', [
//       ODOO_CONFIG.db, 
//       ODOO_CONFIG.username, 
//       ODOO_CONFIG.password, 
//       {}
//     ], (err, val) => (err ? reject(err) : resolve(val)));
//   });

//   // 2. Exécution de la requête
//   const models = xmlrpc.createClient({ url: `${ODOO_CONFIG.url}/xmlrpc/2/object` });
//   return new Promise((resolve, reject) => {
//     models.methodCall('execute_kw', [
//       ODOO_CONFIG.db, 
//       uid, 
//       ODOO_CONFIG.password, 
//       model, 
//       method, 
//       args
//     ], (err, val) => (err ? reject(err) : resolve(val)));
//   });
// }

// // LA FONCTION SÉCURISÉE EXPORTÉE
// export async function fetchOdooData(model: string, domain: any[] = [], fields: string[] = []) {
//   const supabase = createClient();
  
//   // 1. Vérification Auth Supabase
//   const { data: { user }, error: authError } = await supabase.auth.getUser();
//   if (authError || !user) throw new Error("Non autorisé");

//   // 2. Vérification des Permissions (RBAC) via Supabase DB
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role, allowed_modules, odoo_partner_id')
//     .eq('id', user.id)
//     .single();

//   // Logique de sécurité métier
//   // Ex: Si c'est un client, on force le filtre pour qu'il ne voie que SES données
//   let finalDomain = domain;
  
//   if (profile?.role === 'client') {
//     // Sécurité forcée : Un client ne voit que ce qui est lié à son ID partenaire Odoo
//     if (model === 'account.move') { // Factures
//        finalDomain = [...domain, ['partner_id', '=', profile.odoo_partner_id]];
//     }
//     // Interdiction d'accéder aux RH
//     if (model === 'hr.employee') {
//         throw new Error("Accès interdit aux données RH");
//     }
//   }

//   // 3. Appel Odoo
//   try {
//     const data = await callOdoo(model, 'search_read', [finalDomain, { fields, limit: 100 }]);
//     return data;
//   } catch (error) {
//     console.error("Erreur Odoo:", error);
//     throw new Error("Erreur lors de la récupération des données");
//   }
// }