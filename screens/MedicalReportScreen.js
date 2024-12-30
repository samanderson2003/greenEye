import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const MedicalReportScreen = ({ route, navigation}) => {
  const { report } = route.params;
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.reportContent}>
        {report.is_disease_detected ? (
          <>
           <Text style={styles.text}>
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>{report.disease_name || "N/A"}</Text> 
            </Text>
            {/* <Text style={styles.text}>
              <Text style={styles.label}>Severity:</Text> {report.severity || "Unknown"}
            </Text> */}
            <Text style={styles.text}>
              <Text style={styles.label}>Remedy:</Text> {report.remedy || "N/A"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Additional Info:</Text> {report.additional_info || "N/A"}
            </Text>
            {report.prevention_steps && report.prevention_steps.length > 0 && (
              <Text style={styles.text}>
                <Text style={styles.label}>Prevention Steps:</Text>
                {"\n"}
                {report.prevention_steps.map((step, index) => (
                  <Text key={index}>
                    {index + 1}. {step}
                    {"\n"}
                  </Text>
                ))}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.text}>
            No disease detected. Your livestock appears healthy.
          </Text>
        )}
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Main", { screen: "Home" })}>
          <Text style={styles.btnText}>Go to Home</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  reportContent: {
    padding: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  btn: {
    height: 44,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#FCCD2A",
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    textAlign: "center",
    color: "#333333",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MedicalReportScreen;

