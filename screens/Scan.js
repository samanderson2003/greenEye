import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
// import * as Speech from 'expo-speech';

const fruits = [
  { name: "apple", icon: require("../assets/detection/apple.png") },
  { name: "carrot", icon: require("../assets/detection/carrot.png") },
  { name: "maize", icon: require("../assets/detection/maize.png") },
  { name: "cucumber", icon: require("../assets/detection/cucumber.png") },
  { name: "brinjal", icon: require("../assets/detection/brinjal.png") },
  { name: "guava", icon: require("../assets/detection/guava.png") },
  { name: "tomato", icon: require("../assets/detection/tomato.png") },
  { name: "watermelon", icon: require("../assets/detection/watermelon.png") },
];

const Scan = () => {
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // Add state to store the response
  const [text, setText] = useState('');


  // const speak = () => {
  //   const content = 'Brucellosis also known as contagious abortion or Bang s disease is a costly disease of livestock and wildlife. It is caused by a group of bacteria in the genus Brucella. The disease has significant consequences for animal health, public health, and international trade.';
  //   setText(content);
  //   Speech.speak(content);
  // };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow gallery access!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow camera access!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image || !selectedFruit) {
      Alert.alert("Missing Input", "Please select a fruit and upload an image.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("crop", selectedFruit);
    formData.append("image", {
      uri: image,
      name: "uploaded_image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("http://192.168.13:8080/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponseMessage(response.data.message || JSON.stringify(response.data)); // Set the response in the state
      Alert.alert("Success", "Data uploaded successfully!");
    } catch (error) {
      console.error(error);
      setResponseMessage("Something went wrong while uploading."); // Handle error case
      Alert.alert("Error", "Something went wrong while uploading.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFruitItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        selectedFruit === item.name && styles.selectedCard,
      ]}
      onPress={() => setSelectedFruit(item.name)}
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Fruit and Upload Image</Text>
      <FlatList
        data={fruits}
        keyExtractor={(item) => item.name}
        renderItem={renderFruitItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? "Uploading..." : "Submit"}
        </Text>
      </TouchableOpacity>
      {responseMessage && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{responseMessage}</Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  grid: {
    justifyContent: "space-around",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#e8f5e9",
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  preview: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#a5d6a7",
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  responseText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default Scan;

