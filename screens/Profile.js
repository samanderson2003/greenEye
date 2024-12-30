import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../firebaseConfig";
import { doc, onSnapshot, updateDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from 'react-i18next';


const Profile = ({ navigation }) => {
  const { t } = useTranslation();

  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [cattle, setCattle] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    let unsubscribeUser = null;
    let unsubscribeCattle = null;
  
    const fetchUserData = () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
  
          unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserData(data);
              setUpdatedData(data);
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
  
    const fetchCattleData = () => {
      try {
        if (user) {
          const userCattleRef = collection(doc(db, "users", user.uid), "cattle");
  
          unsubscribeCattle = onSnapshot(userCattleRef, (querySnapshot) => {
            const cattleData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCattle(cattleData);
          }, (error) => {
            console.error("Error fetching cattle data in real-time:", error);
          });
        }
      } catch (error) {
        console.error("Error setting up cattle data listener:", error);
      }
    };
  
    fetchUserData();
    fetchCattleData();
  
    // Cleanup function to unsubscribe from real-time listeners
    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeCattle) unsubscribeCattle();
    };
  }, [user]);

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updatedData);
      setUserData(updatedData);
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>{userData?.vet ? "Vetnerian Profile 🩺" : "Farmer Profile 🌾"}</Text>
          <View style={styles.card}>
            {editing ? (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={updatedData.name || ""}
                onChangeText={(text) =>
                  setUpdatedData((prev) => ({ ...prev, name: text }))
                }
              />
            ) : (
              <Text style={styles.cardTitle}>{userData?.name || "Anonymous"}</Text>
            )}
            <Text style={styles.cardSubtitle}>{user.email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('profile.date')}</Text>
            <Text style={styles.cardValue}>
              {formatDate(user?.metadata?.creationTime)}
            </Text>
          </View>

          <View style={styles.card}>
      <Text style={styles.cardLabel}>{t('profile.locationTitle')}</Text>
      {editing ? (
        <Picker
          selectedValue={updatedData.location || ""}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setUpdatedData((prev) => ({ ...prev, location: itemValue }))
          }
        >
          <Picker.Item label="Select a state" value="" />
          <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
          <Picker.Item label="Arunachal Pradesh" value="Arunachal Pradesh" />
          <Picker.Item label="Assam" value="Assam" />
          <Picker.Item label="Bihar" value="Bihar" />
          <Picker.Item label="Chhattisgarh" value="Chhattisgarh" />
          <Picker.Item label="Goa" value="Goa" />
          <Picker.Item label="Gujarat" value="Gujarat" />
          <Picker.Item label="Haryana" value="Haryana" />
          <Picker.Item label="Himachal Pradesh" value="Himachal Pradesh" />
          <Picker.Item label="Jharkhand" value="Jharkhand" />
          <Picker.Item label="Karnataka" value="Karnataka" />
          <Picker.Item label="Kerala" value="Kerala" />
          <Picker.Item label="Madhya Pradesh" value="Madhya Pradesh" />
          <Picker.Item label="Maharashtra" value="Maharashtra" />
          <Picker.Item label="Manipur" value="Manipur" />
          <Picker.Item label="Meghalaya" value="Meghalaya" />
          <Picker.Item label="Mizoram" value="Mizoram" />
          <Picker.Item label="Nagaland" value="Nagaland" />
          <Picker.Item label="Odisha" value="Odisha" />
          <Picker.Item label="Punjab" value="Punjab" />
          <Picker.Item label="Rajasthan" value="Rajasthan" />
          <Picker.Item label="Sikkim" value="Sikkim" />
          <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
          <Picker.Item label="Telangana" value="Telangana" />
          <Picker.Item label="Tripura" value="Tripura" />
          <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
          <Picker.Item label="Uttarakhand" value="Uttarakhand" />
          <Picker.Item label="West Bengal" value="West Bengal" />
          <Picker.Item label="Andaman and Nicobar Islands" value="Andaman and Nicobar Islands" />
          <Picker.Item label="Chandigarh" value="Chandigarh" />
          <Picker.Item label="Dadra and Nagar Haveli and Daman and Diu" value="Dadra and Nagar Haveli and Daman and Diu" />
          <Picker.Item label="Delhi" value="Delhi" />
          <Picker.Item label="Jammu and Kashmir" value="Jammu and Kashmir" />
          <Picker.Item label="Ladakh" value="Ladakh" />
          <Picker.Item label="Lakshadweep" value="Lakshadweep" />
          <Picker.Item label="Puducherry" value="Puducherry" />
        </Picker>
      ) : (
        <Text style={styles.cardValue}>
          {userData?.location || "Not provided"}
        </Text>
      )}
    </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>{t('profile.languageTitle')}</Text>
            {editing ? (
              <Picker
                selectedValue={updatedData.language || "english"}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setUpdatedData((prev) => ({ ...prev, language: itemValue }))
                }
              >
                <Picker.Item label="English" value="english" />
                <Picker.Item label="தமிழ்" value="tamil" />
                <Picker.Item label="हिन्दी" value="hindi" />
              </Picker>
            ) : (
              <Text style={styles.cardValue}>
                {userData?.language || "Not selected"}
              </Text>
            )}
          </View>

          {userData?.vet ??
            <View style={styles.card}>
            <Text style={styles.cardLabel}>Livestock</Text>
            {cattle.length > 0 ? (
              cattle.map((cattleItem) => (
                <View key={cattleItem.id} style={styles.cattleItem}>
                  <Text style={styles.cardValue}>
                    Breed: {cattleItem.breed}, Type: {cattleItem.cattle}, Age: {cattleItem.age}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.cardValue}>No cattle added yet.</Text>
            )}
          </View>
          }


            {userData?.vet ??
              <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate("AddCattle")}
            >
              <Text style={styles.buttonText}>Add Cattle</Text>
            </TouchableOpacity>
            }

            {/* {userData?.admin ?
              <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate("Admin")}
            >
              <Text style={styles.buttonText}>Admin</Text>
            </TouchableOpacity>
            : ""
            } */}


          {editing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditing(false);
                  setUpdatedData(userData);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>{t('profile.edit')}</Text>
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>{t('profile.logoutTitle')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.error}>No user is logged in</Text>
      )}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    paddingTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#28a745",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#6c757d",
    marginTop: 10,
  },
  cattleItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default Profile;