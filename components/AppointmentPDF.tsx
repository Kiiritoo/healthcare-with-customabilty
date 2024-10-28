import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  addressContainer: {
    flexDirection: "column",
    maxWidth: "70%",
    alignItems: "center",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  address: {
    fontSize: 10,
    color: "#64748B",
    textAlign: "center",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginVertical: 10,
  },
  footerSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop: 20,
    marginBottom: 10,
  },
  signatureArea: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: "flex-end",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    width: 200,
  },
  signatureText: {
    fontSize: 10,
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  infoContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    color: "#64748B",
    width: '30%',
  },
  value: {
    fontSize: 12,
    width: '70%',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    flexDirection: 'row',
  },
  bullet: {
    width: 10,
    fontSize: 12,
  },
  listItemText: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#64748B",
  },
});

const AppointmentPDF = ({
  username,
  doctorName,
  appointmentDate,
  patientGender,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        <Image src="/assets/icons/logo-icon.png" style={styles.logo} />
        <View style={styles.addressContainer}>
          <Text style={styles.companyName}>CarePulse</Text>
          <Text style={styles.address}>
            Alamat: Jl. SumberJaya Graha Melasti
          </Text>
          <Text style={styles.address}>
            BLOK FA 14 NO 15 Tambun Selatan, Jawa Barat.
          </Text>
        </View>
        <View style={styles.logo} />
      </View>
      <View style={styles.separator} />

      <Text style={styles.header}>Appointment Confirmation</Text>
      <View style={styles.section}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{patientGender}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>Dr. {doctorName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Appointment Date:</Text>
          <Text style={styles.value}>{appointmentDate}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>What to Bring</Text>
      <View style={styles.section}>
        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>Valid government-issued photo ID (e.g., driver's license, passport)</Text>
        </View>
      </View>

      <View style={styles.signatureArea}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureText}>Head Administrator Signature</Text>
      </View>

      <View style={styles.footerSeparator} />
      <Text style={styles.footer}>© 2024 CarePulse. All rights reserved.</Text>
    </Page>
  </Document>
);

export default AppointmentPDF;
