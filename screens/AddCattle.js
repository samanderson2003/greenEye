import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db, auth } from "../firebaseConfig";
import { doc, collection, addDoc } from "firebase/firestore";

const AddCattle = ({ navigation }) => {
  const [cattleType, setCattleType] = useState("cow");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");

  const breeds = {
    cow: [ "Gir",
        "Sahiwal",
        "Red Sindhi",
        "Tharparkar",
        "Kankrej",
        "Hariana",
        "Rathi",
        "Ongole",
        "Krishna Valley",
        "Deoni",
        "Hallikar",
        "Amrit Mahal",
        "Vechur",
    ],
    goat: [
      "Jamunapari",
      "Beetal",
      "Barbari",
      "Sirohi",
      "Jakhrana",
      "Tellicherry",
      "Osmanabadi",
      "Black Bengal",
      "Malabari",
      "Mehsana",
      "Kanni Aadu",
      "Kodi Aadu",
    ],
    buffalo: [
      "Murrah",
      "Surti",
      "Jaffarabadi",
      "Mehsana",
      "Nagpuri",
      "Banni",
      "Nili-Ravi",
      "Pandharpuri",
      "Toda",
      "Godavari"
    ]
  };

  const handleAddCattle = async () => {
    if (!cattleType || !age || !breed) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userCattleRef = collection(
          doc(db, "users", currentUser.uid),
          "cattle"
        );

        await addDoc(userCattleRef, {
          cattle: cattleType,
          age: parseInt(age, 10), // Ensure age is stored as a number
          breed,
        });

        Alert.alert("Success", "Cattle added successfully!");
        setCattleType("cow");
        setAge("");
        setBreed("");
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        Alert.alert("Error", "User not authenticated!");
      }
    } catch (error) {
      console.error("Error adding cattle:", error);
      Alert.alert("Error", "Failed to add cattle. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Livestock Type</Text>
          <Picker
            selectedValue={cattleType}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setCattleType(itemValue);
              setBreed(""); // Reset breed when cattle type changes
            }}
          >
            <Picker.Item label="🐄 Cattle" value="cow" />
            <Picker.Item label="🐐 Goat" value="goat" />
            <Picker.Item label="🐃 Buffalo" value="buffalo" />
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Breed</Text>
          <Picker
            selectedValue={breed}
            style={styles.picker}
            onValueChange={(itemValue) => setBreed(itemValue)}
          >
            <Picker.Item label="Select Breed" value="" />
            {breeds[cattleType]?.map((breedOption, index) => (
              <Picker.Item key={index} label={breedOption} value={breedOption} />
            ))}
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age (in years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => setAge(text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddCattle}>
          <Text style={styles.buttonText}>Add Cattle</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
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
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddCattle;