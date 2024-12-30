import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const VetRegister = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [vetId, setVetId] = useState('');
    const [proofImage, setProofImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePickImage = async () => {
      const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.Images,
          allowsEditing: true,
          quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
          setProofImage(result.assets[0].uri);
      }
  };

    const handleRegister = async () => {
      if (
          !name.trim() ||
          !email.trim() ||
          !password.trim() ||
          !phone.trim() ||
          !vetId.trim() ||
          !proofImage
      ) {
          Alert.alert('Error', 'All fields are required. Please ensure all fields are filled correctly.');
          return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          Alert.alert('Error', 'Please enter a valid email address.');
          return;
      }

      // Phone number validation (example for 10-digit numbers)
      if (phone.length !== 10 || isNaN(phone)) {
          Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
          return;
      }

      setLoading(true);

      try {
          // Step 1: Create the user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
          );
          const user = userCredential.user;

          // Step 2: Upload image to Firebase Storage
          const response = await fetch(proofImage);
          const blob = await response.blob();
          const storageRef = ref(storage, `proofImages/${user.uid}`);
          await uploadBytes(storageRef, blob);

          // Step 3: Get download URL
          const downloadURL = await getDownloadURL(storageRef);

          // Step 4: Save user data in Firestore
          await setDoc(doc(db, 'users', user.uid), {
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              vetId: vetId.trim(),
              proofImage: downloadURL, // Save the download URL here
              vet: true,
              dateJoined: new Date(),
          });

          Alert.alert('Success', 'Account created successfully!');
          setLoading(false);
      } catch (error) {
          Alert.alert('Error', error.message);
          setLoading(false);
      }
  };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.title}>Veterinarian Registration</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        placeholderTextColor="#aaa"
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.iconButton}
                        >
                            <Ionicons
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={20}
                                color="#333333"
                            />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Veterinarian Id"
                        value={vetId}
                        onChangeText={setVetId}
                        placeholderTextColor="#aaa"
                    />

                    <TouchableOpacity
                        style={styles.imagePicker}
                        onPress={handlePickImage}
                    >
                        <Text style={styles.imagePickerText}>
                            {proofImage
                                ? 'Change Veterinarian Proof Image'
                                : 'Upload Veterinarian Proof Image'}
                        </Text>
                    </TouchableOpacity>
                    {proofImage && (
                        <Image
                            source={{ uri: proofImage }}
                            style={styles.previewImage}
                        />
                    )}

                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            loading && { backgroundColor: '#ddd' },
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>
                                Register as Veterinarian
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fc',
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4A4A4A',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconButton: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    imagePicker: {
        width: '100%',
        backgroundColor: '#E8E8E8',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    registerButton: {
        height: 50,
        width: '100%',
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        fontSize: 16,
        color: '#555',
        marginTop: 15,
        textDecorationLine: 'underline',
    },
});

export default VetRegister;