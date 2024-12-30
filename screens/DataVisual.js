import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, FlatList, TouchableOpacity, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import data from '../processed_data.json'; // Adjust the path as necessary

const DataVisual = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("PRAKASAM"); // Default to the first district
  const [modalVisible, setModalVisible] = useState(false);
  const [isStatePicker, setIsStatePicker] = useState(true);
  const [pieChartData, setPieChartData] = useState([]); // Initialize as an empty array

  useEffect(() => {
    // Initialize the state with the first state and its districts
    const states = Object.keys(data);
    if (states.length > 0) {
      setSelectedState(states[0]);
      setPieChartData(data[states[0]].districts); // Set districts as an array
    }
  }, []);

  // Get the data for the selected district
  const districtData = pieChartData.find(district => district.name === selectedDistrict)?.data || {};

  // Define colors for each metric
  const colors = [
    "#FF6384", // Color for No. of AIs
    "#36A2EB", // Color for No. of PDs
    "#FFCE56", // Color for No. of Calvings
    "#4BC0C0"  // Color for Farmers Benefited
  ];

  // Transform the district data into an array for the PieChart
  const chartData = [
    { name: "No. of AIs", value: districtData["No. of AIs"] || 0, color: colors[0] },
    { name: "No. of PDs", value: districtData["No. of PDs"] || 0, color: colors[1] },
    { name: "No. of Calvings", value: districtData["No. of Calvings"] || 0, color: colors[2] },
    { name: "Farmers Benefited", value: districtData["Farmers Benefited"] || 0, color: colors[3] }
  ];

  const renderItem = (item, isState) => (
    <TouchableOpacity
      onPress={() => {
        if (isState) {
          setSelectedState(item);
          setSelectedDistrict(data[item].districts[0].name); // Reset district on state change
          setPieChartData(data[item].districts); // Update districts based on selected state
        } else {
          setSelectedDistrict(item);
        }
        setModalVisible(false);
      }}
      style={styles.item}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { setIsStatePicker(true); setModalVisible(true); }}>
        <Text style={styles.pickerText}>Selected State: {selectedState}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setIsStatePicker(false); setModalVisible(true); }}>
        <Text style={styles.pickerText}>Selected District: {selectedDistrict}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={isStatePicker ? Object.keys(data) : pieChartData.map(d => d.name)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderItem(item, isStatePicker)}
            style={{ marginTop: 50, borderColor: "#000", borderStyle: "solid", borderWidth: 1, borderRadius: 10 }}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.chartContainer}>
        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData} // Use the transformed chartData
            width={screenWidth * 0.9}
            height={screenWidth * 0.4}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => `rgba(0, 0, 0, 0)`,
            }}
            accessor={"value"} // Use "value" to match the chartData structure
            backgroundColor={"transparent"}
            paddingLeft="-26"
            absolute
            style={{ padding: 10, alignSelf: 'center', boxSizing: 'border-box' }}
            renderLabel={(label, value) => (
              <Text style={{ transform: [{ rotate: '90deg' }], textAlign: 'center' }}>{label}: {value}</Text>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10, backgroundColor: "#ffffff" },
  pickerText: { fontSize: 18, margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#ffffff' },
  modalContainer: { flex: 1, padding: 10, backgroundColor: "#ffffff" },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemText: { color: '#000' },
  closeButton: { padding: 15, backgroundColor: '#2196F3', borderRadius: 5, marginBottom: 40, marginTop: 10, marginHorizontal: 50 },
  closeButtonText: { color: '#fff', textAlign: 'center' },
  chartContainer: { alignItems: "center", marginTop: 20, paddingBottom: 40 },
  chartWrapper: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    overflow: "scroll"
  },
});

export default DataVisual;