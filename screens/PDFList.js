import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

const pdfFiles = [
  // { id: '1', name: 'Document 1', uri: require('../assets/pdfs/cow/Anthrax.pdf') },
  // { id: '2', name: 'Document 2', uri: require('./assets/pdfs/Black Quarter(BQ).pdf') },
  // { id: '3', name: 'Document 3', uri: require('./assets/pdfs/Bovine Viral Diarrhoea (BVD).pdf') },
  // { id: '4', name: 'Document 4', uri: require('./assets/pdfs/Gastrointestinal parasitism.pdf') },
  // { id: '5', name: 'Document 5', uri: require('./assets/pdfs/Ketosis(Acetonemia).pdf') },
  // { id: '5', name: 'Document 5', uri: require('./assets/pdfs/Mastitis.pdf') },
];

const PDFList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={pdfFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pdfItem}
            onPress={() => navigation.navigate('PDFViewer', { pdfUri: item.uri })}
          >
            <Text style={styles.pdfText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pdfItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pdfText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PDFList;