import React from 'react';
import PropTypes from 'prop-types';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import imageShamash from 'images/imageShamash.png'; // Adjust the path

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  companyDetails: {
    fontSize: 10,
    color: '#7f8c8d',
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2980b9',
    marginBottom: 15,
  },
  clientInfo: {
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    border: 1,
    borderColor: '#e0e0e0',
  },
  clientInfoText: {
    fontSize: 10,
    color: '#34495e',
    marginBottom: 4,
  },
  table: {
    width: '100%',
    marginTop: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  tableColHeader: {
    width: '16.66%',
    padding: 8,
    backgroundColor: '#2980b9',
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
  tableCol: {
    width: '16.66%',
    padding: 8,
    textAlign: 'center',
    fontSize: 10,
    color: '#2c3e50',
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    border: 1,
    borderColor: '#e0e0e0',
    textAlign: 'right',
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#95a5a6',
  },
});

const CommandePDF = ({ commande }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image src={imageShamash} style={styles.logo} />
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>Société Shamash IT</Text>
          <Text style={styles.companyDetails}>
            Adresse: étage B03, Centre Urbain Nord, Imm cercle des bureaux
          </Text>
          <Text style={styles.companyDetails}>
            Tél: +216 29 511 251 | Email: contact@shamash-it.com
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>COMMANDE N° {commande.orderNumber}</Text>

      {/* Client Info */}
      <View style={styles.clientInfo}>
        <Text style={styles.clientInfoText}>
          Fournisseur: {commande.supplierName || "Non spécifié"}
        </Text>
        <Text style={styles.clientInfoText}>
          Date création: {new Date().toLocaleDateString()}
        </Text>
        <Text style={styles.clientInfoText}>
          Validité: {commande.validityDate || "Non spécifiée"}
        </Text>
        <Text style={styles.clientInfoText}>
          Référence: {commande.reference}
        </Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text>N°</Text></View>
          <View style={styles.tableColHeader}><Text>Désignation</Text></View>
          <View style={styles.tableColHeader}><Text>Qté</Text></View>
          <View style={styles.tableColHeader}><Text>P.U. HT</Text></View>
          <View style={styles.tableColHeader}><Text>TVA</Text></View>
          <View style={styles.tableColHeader}><Text>Total HT</Text></View>
        </View>

        {/* Table Rows */}
        {commande.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{index + 1}</Text></View>
            <View style={styles.tableCol}><Text>{item.designation}</Text></View>
            <View style={styles.tableCol}><Text>{item.quantity}</Text></View>
            <View style={styles.tableCol}><Text>{item.unitPrice} TND</Text></View>
            <View style={styles.tableCol}><Text>{item.tva}%</Text></View>
            <View style={styles.tableCol}>
              <Text>{(item.quantity * item.unitPrice).toFixed(3)} TND</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalSection}>
        <Text style={styles.totalText}>
          Total HT: {commande.totalHT} TND
        </Text>
        <Text style={styles.totalText}>
          Total TVA: {commande.totalVAT} TND
        </Text>
        <Text style={styles.totalText}>
          Total TTC: {commande.totalTTC} TND
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Société Shamash IT - RCS Tunis B123456 - TVA FR40123456789
      </Text>
    </Page>
  </Document>
);

// Prop-type validation
CommandePDF.propTypes = {
  commande: PropTypes.shape({
    orderNumber: PropTypes.string.isRequired,
    supplierName: PropTypes.string,
    validityDate: PropTypes.string,
    reference: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        designation: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unitPrice: PropTypes.number.isRequired,
        tva: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalHT: PropTypes.string.isRequired,
    totalVAT: PropTypes.string.isRequired,
    totalTTC: PropTypes.string.isRequired,
  }).isRequired,
};

export default CommandePDF;