import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid
} from 'react-native';
import { useDispatch } from 'react-redux';
import { loginData } from '../../redux/actions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()
    const isPasswordStrong = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const doLogin = async () => {
        try {
            const response = await axios.post(
                'https://dummyjson.com/auth/login',
                {
                    username: email,
                    password: password,
                    expiresInMins: 30,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log('Login successful:', response.data.accessToken);


            await AsyncStorage.setItem('token', response.data.accessToken);

            dispatch(loginData(response.data));
            ToastAndroid.show('Login successful!', ToastAndroid.LONG);
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            ToastAndroid.show('Login failed! Please check your credentials', ToastAndroid.LONG);
        }
    };

    const handleLogin = () => {
        if (!email) {
            ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
            return;
        }

        if (!password) {
            ToastAndroid.show('Please enter your password', ToastAndroid.SHORT);
            return;
        }

        // if (!isPasswordStrong(password)) {
        //     ToastAndroid.show(
        //         'Password must be 8+ chars with uppercase, number, and special character',
        //         ToastAndroid.LONG
        //     );
        //     return;
        // }

        doLogin();
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={styles.container}
            >
                <View style={styles.innerContainer}>
                    <Image
                        source={{
                            uri: 'https://cdn-ildccff.nitrocdn.com/nTISDhijuTHStlIolguKwIQSmddYRxop/assets/images/optimized/rev-38e2898/www.webskitters.com/wp-content/uploads/2025/02/header-logo.png',
                        }}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Login</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="username"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="default"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        padding: 24,
    },
    logo: {
        width: 140,
        height: 140,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        borderColor: '#ddd',
        color:"#000",
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default Login;