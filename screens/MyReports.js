import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebaseConfig'; 
import { collection, query, where, onSnapshot } from "firebase/firestore";


const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;

    if (currentUserId) {
      // Real-time Firestore listener
      const unsubscribe = onSnapshot(
        query(collection(db, "reports"), where("userId", "==", currentUserId)),
        (snapshot) => {
          const fetchedReports = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReports(fetchedReports);
          setLoading(false); // Data is loaded
        },
        (err) => {
          console.error(err);
          setError("Failed to load reports.");
          setLoading(false); // Stop loading on error
        }
      );

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>{item.disease_name}</Text>
          <Text style={styles.reportDescription}>{Date(item.createdAt)}</Text>
          <Text style={styles.reportDescription}>{item.approvedBy || "N/A"}</Text>
        </View>
      )}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  flatListContainer: {
    padding: 10,
  },
  reportCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default MyReports;