// import React, { useState } from "react";
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   Button, 
//   ScrollView, 
//   StyleSheet, 
//   Alert, 
//   Image, 
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform, 
// } from "react-native";
// import Icon from 'react-native-vector-icons/FontAwesome';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import * as FileSystem from 'expo-file-system';
// import {db, auth} from "../firebaseConfig";
// import axios from "axios";
// import { addDoc, collection } from 'firebase/firestore';
// import { useTranslation } from 'react-i18next';


             
// const ChatBot = ({route, navigation}) => {
//   const { answers = [] } = route.params || {};
//   const { t } = useTranslation();

//   const API_KEY = "API_KEY"; // Replace with your actual API key
//   const [query, setQuery] = useState("");
//   const [response, setResponse] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
  
//   // State for three images
//   const [images, setImages] = useState([null, null, null]);

//   // Function to pick image
//   const pickImage = async (index) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert("Permission Needed", "Camera roll permissions are required.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       // Create a new array with the updated image
//       const newImages = [...images];
//       newImages[index] = result.assets[0].uri;
//       setImages(newImages);
//     }
//   };

//   const uploadImageToStorage = async (uri, index) => {
//     const storage = getStorage(); // Get Firebase storage instance
//     const fileName = `image_${index}_${new Date().toISOString()}.jpg`; // Unique name for each image
//     const imageRef = ref(storage, `reports/${fileName}`);
  
//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob(); // Convert image URI to blob
//       const uploadTask = await uploadBytes(imageRef, blob);
//       const downloadURL = await getDownloadURL(uploadTask.ref); // Get the download URL
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading image: ", error);
//       return null; // Return null in case of error
//     }
//   };

//   const handlePickImage = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert("Permission Needed", "Camera permissions are required.");
//       return;
//     }
  
//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });
  
//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       // Find the first null index in the images array to set the photo
//       const index = images.findIndex((image) => image === null);
//       if (index !== -1) {
//         const newImages = [...images];
//         newImages[index] = result.assets[0].uri;
//         setImages(newImages);
//       } else {
//         Alert.alert("All slots filled", "Please remove an image to add a new one.");
//       }
//     }
//   };

//   // Function to remove image
//   const removeImage = (index) => {
//     const newImages = [...images];
//     newImages[index] = null;
//     setImages(newImages);
//   };

//   const handleChat = async () => {
//     // Check if either query or at least one image is present
//     const hasImages = images.some(image => image !== null);
//     // if (!hasImages) {
//     //   Alert.alert("Input Required", "Please enter a query or upload at least one image.");
//     //   return;
//     // }

//     setIsLoading(true);
//     try {
//       // Convert images to base64
//       const base64Images = await Promise.all(
//         images.map(async (imageUri) => {
//           if (imageUri) {
//             const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
//             return `data:image/jpeg;base64,${base64}`;
//           }
//           return null;
//         })
//       );

      
//       const combinedQuery = `
//       Livestock type: ${route.params?.livestockType}, 
      
//       Symptom Questionnaire Responses:
//       ${answers.map(a => `${a.question}: ${a.answer}`).join('\n')}
      
//       `;
//       // Additional Context:
//       // ${query || ''}
      
//       const payload = {
//         model: "gpt-4o",
//         messages: [
//           {
//             role: "system",
//             content: `
//             You are a medical diagnosis assistant. 
//             Analyze the provided symptoms, images, and context. 
//             Respond ONLY with a JSON object containing:
//             - disease_name: string (most likely disease)
//             - is_disease_detected: boolean
//             - prevention_steps: string[]
//             - additional_info: string
//             - severity: string
//             - remedy: string
        
//             Scenarios:
//             1. If the uploaded image is irrelevant (not livestock-related), respond with:
//               {
//                 "error": "irrelevant_image",
//                 "message": "The uploaded image does not appear to be related to livestock. Please upload a relevant image."
//               }
//             2. If the livestock appears healthy, respond with:
//               {
//                 "is_disease_detected": false,
//                 "message": "The livestock appears healthy based on the provided images and symptoms."
//               }
//             3. If a disease is detected, provide full details as per the structure above.
                      
//             `
//           },
//           { 
//             role: "user", 
//             content: [
//               { type: "text", text: combinedQuery },
//               // Add non-null images to the content
//               ...base64Images
//                 .filter(img => img !== null)
//                 .map(img => ({
//                   type: "image_url", 
//                   image_url: { url: img }
//                 }))
//             ]
//           }
//         ],
//         response_format: { type: "json_object" },
//         max_tokens: 300,
//       };

//       const chatResponse = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const responseData = JSON.parse(chatResponse.data.choices[0].message.content);
//       setResponse(responseData);

//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Location permission is required.");
//         return;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;

//       const user = auth.currentUser;
//       if (!user) {
//         Alert.alert("Authentication Error", "User not logged in.");
//         return;
//       }



//       if (responseData.is_disease_detected) {
//       const docRef = await addDoc(collection(db, "reports"), {
//         userId: user.uid,
//         userName: user.displayName || "Anonymous",
//         latitude,
//         longitude,
//         cattle: route.params.cattle || "Unknown",
//         disease_name: responseData.disease_name,
//         is_disease_detected: responseData.is_disease_detected,
//         prevention_steps: responseData.prevention_steps,
//         additional_info: responseData.additional_info,
//         severity: responseData.severity,
//         remedy: responseData.remedy,
//         createdAt: new Date(),
//       });

//       if (responseData){
//         navigation.navigate("MedicalReport", { report: responseData });
//       }

//     }else if(responseData.error == "irrelevant_image") {
//       Alert.alert("Irrelevant Image", "The uploaded image does not appear to be related to livestock. Please upload a relevant image.");
//     }else if(responseData.is_disease_detected == false){
//       Alert.alert("No Disease Detected", "The system did not detect any disease.");
//     }


//     } catch (error) {
//       console.error("Error fetching response:", error.response?.data || error.message);
//       Alert.alert("Error", "Something went wrong while fetching the response.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollViewContent}
//         keyboardShouldPersistTaps="handled"
//       >

//       <Text style={styles.header}>{t('chatBot.header')}</Text> 


//         {/* <TextInput
//           style={styles.input}
//           placeholder="Enter disease or symptoms"
//           value={query}
//           onChangeText={(text) => setQuery(text)}
//           multiline={true}
//           numberOfLines={3}
//         /> */}

//         {/* Image Upload Sections */}
//         {[0, 1, 2].map((index) => (
//           <View key={index} style={styles.imageSection}>
//             <View style={styles.imageUploadContainer}>
//               <TouchableOpacity 
//               onPress={() => pickImage(index)}
//               style={styles.addImageButton}
//               >
//                 <Text style={styles.addImageText}>{images[index] ? `Change Image ${index + 1}` : `Upload Image ${index + 1}`} </Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={handlePickImage}>
//                 <Icon name="camera" size={30} color="#333333" />
//               </TouchableOpacity>
              
//               {images[index] && (
//                 <TouchableOpacity 
//                   onPress={() => removeImage(index)} 
//                   style={styles.removeImageButton}
//                 >
//                   <Text style={styles.removeImageText}>Remove</Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//             {images[index] && (
//               <Image 
//                 source={{ uri: images[index] }} 
//                 style={styles.image} 
//               />
//             )}
//           </View>
//         ))}

//         <TouchableOpacity disabled={isLoading} style={styles.btn} onPress={handleChat}>
//           <Text style={styles.btnText}>{isLoading ? "Processing..." : "Submit"}</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };


import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  Image, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform, 
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import {db, auth} from "../firebaseConfig";
import axios from "axios";
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
             
const ChatBot = ({route, navigation}) => {
  const { answers = [] } = route.params || {};
  const { t } = useTranslation();

  const API_KEY = "API_KEY"; // Replace with your actual API key
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State for three images
  const [images, setImages] = useState([null, null, null]);

  // Function to upload image to Firebase Storage
  const uploadImageToStorage = async (uri, index) => {
    const storage = getStorage(); // Get Firebase storage instance
    const fileName = `image_${index}_${new Date().toISOString()}.jpg`; // Unique name for each image
    const imageRef = ref(storage, `reports/${fileName}`);
  
    try {
      const response = await fetch(uri);
      const blob = await response.blob(); // Convert image URI to blob
      const uploadTask = await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref); // Get the download URL
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null; // Return null in case of error
    }
  };

  // Function to pick image
  const pickImage = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Needed", "Camera roll permissions are required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      // Create a new array with the updated image
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Needed", "Camera permissions are required.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Find the first null index in the images array to set the photo
      const index = images.findIndex((image) => image === null);
      if (index !== -1) {
        const newImages = [...images];
        newImages[index] = result.assets[0].uri;
        setImages(newImages);
      } else {
        Alert.alert("All slots filled", "Please remove an image to add a new one.");
      }
    }
  };

  // Function to remove image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleChat = async () => {
    // Check if either query or at least one image is present
    const hasImages = images.some(image => image !== null);
    // if (!hasImages) {
    //   Alert.alert("Input Required", "Please enter a query or upload at least one image.");
    //   return;
    // }

    setIsLoading(true);
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (imageUri, index) => {
          if (imageUri) {
            return await uploadImageToStorage(imageUri, index);
          }
          return null;
        })
      );

      // Convert images to base64
      const base64Images = await Promise.all(
        images.map(async (imageUri) => {
          if (imageUri) {
            const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
            return `data:image/jpeg;base64,${base64}`;
          }
          return null;
        })
      );

      
      const combinedQuery = `
      Livestock type: ${route.params?.livestockType}, 
      
      Symptom Questionnaire Responses:
      ${answers.map(a => `${a.question}: ${a.answer}`).join('\n')}

      ${route.params?.input}
      
      `;
      
      const payload = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
            You are a medical diagnosis assistant. 
            Analyze the provided symptoms, images, and context.
            Don't combine image and text, give seperate response for text and image. 
            Respond ONLY with a JSON object containing:
            - disease_name: string (most likely disease)
            - is_disease_detected: boolean
            - prevention_steps: string[]
            - additional_info: string
            - severity: string
            - remedy: string
        
            Scenarios:
            1. If the uploaded image is irrelevant (not livestock-related), respond with:
              {
                "error": "irrelevant_image",
                "message": "The uploaded image does not appear to be related to livestock. Please upload a relevant image."
              }
            2. If the livestock appears healthy, respond with:
              {
                "is_disease_detected": false,
                "message": "The livestock appears healthy based on the provided images and symptoms."
              }
            3. If a disease is detected, provide full details as per the structure above.
                      
            `
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: combinedQuery },
              // Add non-null images to the content
              ...base64Images
                .filter(img => img !== null)
                .map(img => ({
                  type: "image_url", 
                  image_url: { url: img }
                }))
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      };

      const chatResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = JSON.parse(chatResponse.data.choices[0].message.content);
      setResponse(responseData);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "User not logged in.");
        return;
      }

      if (responseData.is_disease_detected) {
        const docRef = await addDoc(collection(db, "reports"), {
          userId: user.uid,
          userName: user.displayName || "Anonymous",
          latitude,
          longitude,
          cattle: route.params.cattle || "Unknown",
          disease_name: responseData.disease_name,
          is_disease_detected: responseData.is_disease_detected,
          prevention_steps: responseData.prevention_steps,
          additional_info: responseData.additional_info,
          severity: responseData.severity,
          remedy: responseData.remedy,
          imageUrls: imageUrls.filter(url => url !== null),
          createdAt: new Date(),
        });

        if (responseData){
          navigation.navigate("MedicalReport", { report: responseData });
        }

      } else if(responseData.error == "irrelevant_image") {
        Alert.alert("Irrelevant Image", "The uploaded image does not appear to be related to livestock. Please upload a relevant image.");
      } else if(responseData.is_disease_detected == false){
        Alert.alert("No Disease Detected", "The system did not detect any disease.");
      }

    } catch (error) {
      console.error("Error fetching response:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while fetching the response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >

      <Text style={styles.header}>{t('chatBot.header')}</Text> 

      {/* <TextInput 
          style={styles.input}
          placeholder="Enter disease or symptoms"
          value={query}
          onChangeText={(text) => setQuery(text)}
          multiline={true}
          numberOfLines={3}
      />  */}

        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.imageSection}>
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity 
              onPress={() => pickImage(index)}
              style={styles.addImageButton}
              >
                <Text style={styles.addImageText}>{images[index] ? `Change Image ${index + 1}` : `Upload Image ${index + 1}`} </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePickImage}>
                <Icon name="camera" size={30} color="#333333" />
              </TouchableOpacity>
              
              {images[index] && (
                <TouchableOpacity 
                  onPress={() => removeImage(index)} 
                  style={styles.removeImageButton}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            {images[index] && (
              <Image 
                source={{ uri: images[index] }} 
                style={styles.image} 
              />
            )}
          </View>
        ))}

        <TouchableOpacity disabled={isLoading} style={styles.btn} onPress={handleChat}>
          <Text style={styles.btnText}>{isLoading ? "Processing..." : "Submit"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1f7",
  },
  header: {
    marginBottom: 30,
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333"
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  input: {
    height: 120,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    fontSize: 16,
    color: "#333",
  },
  imageSection: {
    marginBottom: 15,
  },
  imageUploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addImageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    shadowColor: "#000",
    elevation: 2,
    borderColor: "#333333",
    borderWidth: 1
  },
  addImageText: {
    color: "#333333",
    fontWeight: "600",
    fontSize: 14,
  },
  removeImageButton: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  removeImageText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
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
  responseContainer: {
    marginTop: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    maxHeight: 250,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#e9ecef',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  responseScrollView: {
    maxHeight: 200,
  },
  responseScrollViewContent: {
    padding: 10,
  },
  responseText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
});

export default ChatBot;
