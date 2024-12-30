import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';


const Detection = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>{t('detection.detectionTitle')}</Text>
      
      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t('detection.info')}</Text>
        <Text style={styles.infoText}>
          1. Inspect plants for spots, discoloration, or unusual patterns.{"\n"}
          2. Check livestock for lethargy, unusual behavior, or physical symptoms.{"\n"}
          3. Use the Scan feature for AI-based analysis of photos or symptoms.
        </Text>
      </View>

      {/* Button to Scan */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Scan")}
      >
        <Text style={styles.buttonText}>{t('detection.scan')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Detection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
    paddingTop: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
    width: "100%",
    textAlign: "left",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  button: {
    height: 44,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#FCCD2A",
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
  },
});