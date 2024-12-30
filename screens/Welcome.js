import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, FlatList } from "react-native";

const { width } = Dimensions.get("window");

const data = [
  {
    image: require("../assets/images/searching.png"),
    title: "AI-Powered Disease Diagnosis",
    description: "Revolutionize farming with AI-driven tools for accurate crop and livestock disease detection.",
  },
  {
    image: require("../assets/images/crops.png"),
    title: "Heal Your Crops",
    description: "Diagnose and treat crop diseases with AI-powered tools.",
  },
  {
    image: require("../assets/images/tips.png"),
    title: "Farmer Tips",
    description: "Learn best practices and seasonal advice to improve your yields.",
  },
  {
    image: require("../assets/images/livestocks.png"),
    title: "Livestock Care",
    description: "Monitor and manage livestock health with expert guidance.",
  }
];

const Welcome = ({ onComplete }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to auto-scroll to the next item
  const scrollToNext = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(scrollToNext, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval); // Clear interval on unmount
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
      />
      <Text style={styles.skip} onPress={onComplete}>
        Skip
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "60%", 
    height: "200", 
    resizeMode: "contain",
    margin: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  skip: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#FCCD2A",
    borderRadius: 20,
    paddingVertical: 10,
    width: "90%", 
    textAlign: "center",
  },
});

export default Welcome;