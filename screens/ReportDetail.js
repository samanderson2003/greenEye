import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import MapView, { Marker } from "react-native-maps";

const ReportDetail = ({ route }) => {
  const { report } = route.params; // Access the selected report data
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    let unsubscribeUser = null;
    const fetchData = () => {
      try {
        if (report) {
          const userDocRef = doc(db, "users", report?.userId);
  
          unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserData(data);
            } else {
              console.log("No such user document!");
            }
          }, (error) => {
            console.error("Error fetching user data in real-time:", error);
          });
        }
      } catch (error) {
        console.error("Error setting up user data listener:", error);
      }
    };
  
    fetchData();
  
    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [report?.userId]);

  const handleApproval = async () => {
    try {
      const reportRef = doc(db, "reports", report.id);

      await updateDoc(reportRef, {
        approval: true,
        approvedBy: user?.uid, 
      });

      Alert.alert("Success", "The report has been approved.");
    } catch (error) {
      console.error("Error updating approval status:", error);
      Alert.alert("Error", "Failed to approve the report. Please try again.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      {!report.approval && (
        <TouchableOpacity 
          style={[
            styles.approveButton, 
            report.approval && styles.disabledButton
          ]}
          onPress={handleApproval}
          disabled={report.approval}
        >
          <Text style={styles.approveButtonText}>
            {report.approval ? "Approved" : "Approve"}
          </Text>
        </TouchableOpacity>
      )}

    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {report.imageUrls?.length > 0 ? (
          report.imageUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.image}
              resizeMode="cover"
            />
          ))
        ) : (
          <Text style={styles.description}>No images available.</Text>
        )}
      </ScrollView>

      <Text style={styles.title}>{report.disease_name}</Text>
      <Text style={styles.info}>Reported by: {userData?.name || "Anonymous"}</Text>
      <Text style={styles.info}>
        Disease Detected: {report.is_disease_detected ? "Yes" : "No"}
      </Text>
      <Text style={styles.sectionTitle}>Additional Information:</Text>
      <Text style={styles.description}>{report.additional_info || "N/A"}</Text>
      <Text style={styles.sectionTitle}>Remedy:</Text>
      <Text style={styles.description}>{report.remedy || "N/A"}</Text>
      <Text style={styles.sectionTitle}>Prevention Steps:</Text>
      {report.prevention_steps?.length > 0 ? (
        report.prevention_steps.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {`• ${step}`}
          </Text>
        ))
      ) : (
        <Text style={styles.description}>No prevention steps available.</Text>
      )}

      <Text style={styles.sectionTitle}>Location on Map</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.latitude,
            longitude: report.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            title="Report Location"
            description={`${report.disease_name} Report`}
          />
        </MapView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
    marginBottom: 5,
  },
  mapContainer: {
    height: 250,
    width: '100%',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 50
  },
  map: {
    width: '100%',
    height: '100%',
  },
  approveButton: {
    backgroundColor: '#FCCD2A',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  approveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 40,
  }
});

export default ReportDetail;