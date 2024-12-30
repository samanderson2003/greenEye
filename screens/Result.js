import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

const ResultScreen = ({ result, onBack }) => {
  const { image, response } = result;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Result</Text>
      {/* Display the uploaded image */}
      <Image source={{ uri: image }} style={styles.image} />
      {/* Display the response */}
      <Text style={styles.responseText}>{JSON.stringify(response, null, 2)}</Text>
      {/* Back Button */}
      <Button title="Go Back" onPress={onBack} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  responseText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ResultScreen;