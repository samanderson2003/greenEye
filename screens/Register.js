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
} from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const Register = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('english');
    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
    
        setLoading(true);
    
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
    
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                bio: '',
                location: '',
                language: language,
                dateJoined: new Date(), // Add the dateJoined field
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
                    <Text style={styles.title}>Create Account</Text>

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

                    <Text style={styles.label}>Preferred Language:</Text>
                    <Picker
                        selectedValue={language}
                        style={styles.picker}
                        onValueChange={(itemValue) => setLanguage(itemValue)}
                    >
                    <Picker.Item label="English" value="english" />
                    <Picker.Item label="हिन्दी" value="hindi" />
                    <Picker.Item label="தமிழ்" value="tamil" />
                    </Picker>

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
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Already have an account? Login</Text>

                    </TouchableOpacity> 
                    
                    <TouchableOpacity onPress={() => navigation.navigate('VetRegister')}>
                        <Text style={styles.link}>Veterinarian Register</Text>
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
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
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
        marginBottom: 20,
    },
    iconButton: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    registerButton: {
        height: 44,
        width: '100%',
        borderRadius: 30,
        backgroundColor: '#FCCD2A',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 30
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    picker: {
        width: '100%',
        backgroundColor: '#fff',
        height: 120, // Adjust this value to reduce the height
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center', 
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        color: '#333',
        width: "100%", 
        alignItems: "left"
    },
});

export default Register;