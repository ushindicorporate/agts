// lib/odoo.ts
import xmlrpc from "xmlrpc";

const ODOO_URL = process.env.ODOO_URL || "https://votre-odoo.com";
const ODOO_DB = process.env.ODOO_DB || "agts_db";
const ODOO_USER = process.env.ODOO_EMAIL || "admin";
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "admin";

// Fonction helper pour créer un client et exécuter une méthode
export async function odooCall(model: string, method: string, args: any[]) {
  const urlParts = new URL(ODOO_URL);
  const clientOptions = {
    host: urlParts.hostname,
    port: urlParts.port ? parseInt(urlParts.port) : 443,
    path: "/xmlrpc/2/object",
    headers: {
      "User-Agent": "AGTS-NextJS-Client",
    },
  };

  // Création du client (Secure ou non selon l'URL)
  const client = urlParts.protocol === "https:" 
    ? xmlrpc.createSecureClient(clientOptions) 
    : xmlrpc.createClient(clientOptions);

  return new Promise((resolve, reject) => {
    // 1. Authentification pour récupérer l'UID (User ID)
    const commonPath = "/xmlrpc/2/common";
    const authOptions = { ...clientOptions, path: commonPath };
    const authClient = urlParts.protocol === "https:" 
      ? xmlrpc.createSecureClient(authOptions) 
      : xmlrpc.createClient(authOptions);

    authClient.methodCall("authenticate", [ODOO_DB, ODOO_USER, ODOO_PASSWORD, {}], (err, uid) => {
      if (err) return reject(err);
      if (!uid) return reject(new Error("Échec authentification Odoo"));

      // 2. Exécution de la commande réelle avec l'UID
      client.methodCall("execute_kw", [ODOO_DB, uid, ODOO_PASSWORD, model, method, args], (err, value) => {
        if (err) return reject(err);
        resolve(value);
      });
    });
  });
}