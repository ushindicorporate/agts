'use client'

import { formatCurrency } from '@/lib/utils';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Définition des styles (proche du CSS standard)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  logoPlaceholder: {
    width: 100,
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB', // Couleur Primary de ton app
    textTransform: 'uppercase',
  },
  ref: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  clientBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    width: '50%',
    alignSelf: 'flex-end',
  },
  clientTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  table: {
    marginTop: 30,
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    height: 30,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
    color: '#111',
  },
  colDesc: { width: '60%', paddingLeft: 8 },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '25%', textAlign: 'right', paddingRight: 8 },
  
  totals: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalFinal: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    marginTop: 4,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    textAlign: 'center',
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

// Types simplifiés pour l'exemple
interface QuoteTemplateProps {
  data: {
    id: string | number;
    ref: string;
    date: string;
    clientName: string;
    propertyName: string; // ex: Villa Riviera
    price: number;
    agentName: string;
  }
}

export const QuoteTemplate = ({ data }: QuoteTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* HEADER AGENCE */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
            {/* Remplace par <Image src="/logo.png" /> */}
            <View style={styles.logoPlaceholder}>
                <Text style={{fontWeight:'bold'}}>IMMO AGENT</Text>
            </View>
            <Text>123 Avenue de l'Immobilier</Text>
            <Text>Abidjan, Côte d'Ivoire</Text>
            <Text>contact@immoagent.com</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 24, fontWeight: 'black', color: '#eee' }}>DEVIS</Text>
            <Text>Date: {new Date(data.date).toLocaleDateString('fr-FR')}</Text>
            <Text>Agent: {data.agentName}</Text>
        </View>
      </View>

      {/* TITRE DOCUMENT */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Offre d'achat / Location</Text>
        <Text style={styles.ref}>Réf: {data.ref}</Text>
      </View>

      {/* INFO CLIENT */}
      <View style={styles.clientBox}>
        <Text style={styles.clientTitle}>Destinataire</Text>
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{data.clientName}</Text>
        <Text>Client enregistré</Text>
      </View>

      {/* TABLEAU */}
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.colDesc}>Désignation</Text>
          <Text style={styles.colQty}>Qté</Text>
          <Text style={styles.colPrice}>Montant</Text>
        </View>
        
        {/* Ligne Produit */}
        <View style={styles.tableRow}>
          <Text style={styles.colDesc}>{data.propertyName}</Text>
          <Text style={styles.colQty}>1</Text>
          <Text style={styles.colPrice}>{formatCurrency(data.price)}</Text>
        </View>
        
        {/* Exemple ligne frais dossier */}
        <View style={styles.tableRow}>
            <Text style={styles.colDesc}>Frais de dossier & visite</Text>
            <Text style={styles.colQty}>1</Text>
            <Text style={styles.colPrice}>{formatCurrency(0)}</Text>
        </View>
      </View>

      {/* TOTAUX */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
            <Text>Total HT</Text>
            <Text>{formatCurrency(data.price)}</Text>
        </View>
        <View style={styles.totalRow}>
            <Text>TVA (0%)</Text>
            <Text>{formatCurrency(0)}</Text>
        </View>
        <View style={[styles.totalRow, styles.totalFinal]}>
            <Text style={styles.totalText}>Total TTC</Text>
            <Text style={[styles.totalText, { color: '#2563EB' }]}>{formatCurrency(data.price)}</Text>
        </View>
      </View>
      
      {/* SIGNATURE */}
      <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
            <Text style={{ marginBottom: 40 }}>Bon pour accord, le Client :</Text>
            <Text style={{ color: '#ccc' }}>______________________</Text>
        </View>
        <View>
            <Text style={{ marginBottom: 40 }}>L'Agence :</Text>
            <Text style={{ color: '#ccc' }}>______________________</Text>
        </View>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        ImmoAgent SARL - Capital de 1.000.000 FCFA - RC Abidjan 123456 - Ce devis est valable 30 jours.
      </Text>

    </Page>
  </Document>
);