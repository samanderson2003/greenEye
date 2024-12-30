import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { auth } from '../firebaseConfig';
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithCredential 
} from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Google Sign-In imports
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Google Sign-In configuration
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '254783288201-0mhtf4avk0qdim2gdiddlla7ogmvl7e4.apps.googleusercontent.com',
        scopes: ['openid', 'profile', 'email']
    });

    // Handle Google Sign-In
    React.useEffect(() => {
        const handleGoogleSignIn = async () => {
            if (response?.type === 'success') {
                const { authentication } = response;
                
                try {
                    setLoading(true);
                    const credential = GoogleAuthProvider.credential(
                        authentication?.idToken,
                        authentication?.accessToken
                    );
                    
                    // Sign in with Firebase
                    const userCredential = await signInWithCredential(auth, credential);
                    
                    Alert.alert('Success', 'Logged in successfully with Google!');
                } catch (error) {
                    Alert.alert('Error', error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        handleGoogleSignIn();
    }, [response]);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Email and Password are required.');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Logged in successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In handler
    const handleGoogleSignIn = async () => {
        try {
            await promptAsync();
        } catch (error) {
            Alert.alert('Error', 'Failed to initiate Google Sign-In');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Login to your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.toggleButton}
                    >
                        <Ionicons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={20}
                            color="#333333"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && { backgroundColor: '#ccc' }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#333333" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                {/* Google Sign-In Button */}
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={!request || loading}
                >
                    <Ionicons name="logo-google" size={20} color="#fff" />
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>

                <Text
                    style={styles.forgotPassword}
                    onPress={() =>
                        Alert.alert('Forgot Password?', 'Password reset functionality is under development.')
                    }
                >
                    Forgot Password?
                </Text>

                <Text style={styles.registerLink}>
                    Don't have an account?{' '}
                    <Text
                        style={styles.registerText}
                        onPress={() => navigation.navigate('Register')}
                    >
                        Register
                    </Text>
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    // ... previous styles ...
    googleButton: {
        height: 44,
        width: "100%",
        borderRadius: 30,
        backgroundColor: "#4285F4",
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    googleButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    toggleButton: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 44,
        width: "100%",
        borderRadius: 30,
        backgroundColor: "#FCCD2A",
        marginTop: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: "#333333",
        fontSize: 18,
        fontWeight: "bold",
    },
    forgotPassword: {
        color: '#333333',
        marginTop: 15,
        fontSize: 14,
    },
    registerLink: {
        marginTop: 25,
        fontSize: 14,
        color: '#666',
    },
    registerText: {
        color: '#333333',
        fontWeight: 'bold',
    },
});

export default Login;