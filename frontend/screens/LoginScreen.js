import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserData, getData } = useContext(AuthContext);

    // ✅ 로그인 버튼 (토큰 저장 후 Main으로 이동)
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("입력 확인", "이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }
        const userData = { email, password };
    
        try {
            const res = await axios.post("http://10.0.2.2:5001/login-user", userData);
    
            if (res.data.status === "ok" && res.data.token) {
                await AsyncStorage.setItem("token", res.data.token);
                Alert.alert("로그인 성공", "성공적으로 로그인하였습니다.");

                await getData();

            } else {
                Alert.alert("로그인 실패", res.data.message || "아이디 또는 비밀번호를 확인하세요.");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            Alert.alert("오류", "로그인 중 문제가 발생했습니다.");
        }
    };
    

    // ✅ "건너뛰기" 버튼을 누르면 로그인 없이 Main으로 이동
    const handleSkip = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }]
        });
    };

    // ✅ "회원가입" 버튼 클릭 시 회원가입 페이지로 이동
    const handleSignup = () => {
        navigation.navigate('Signup');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* ✅ 로고 */}
                <Image 
                    source={require('../assets/icons/logo.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />

                {/* ✅ 이메일 로그인 입력 필드 */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>e-mail 주소로 로그인</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="이메일 주소 입력" 
                        value={email} 
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="비밀번호 입력"  
                        secureTextEntry 
                        value={password} 
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>

                {/* ✅ 비밀번호 찾기 | 아이디 찾기 | 회원가입하기 */}
                <View style={styles.linkContainer}>
                    <TouchableOpacity><Text style={styles.linkText}>비밀번호 찾기</Text></TouchableOpacity>
                    <Text style={styles.divider}> | </Text>
                    <TouchableOpacity><Text style={styles.linkText}>아이디 찾기</Text></TouchableOpacity>
                    <Text style={styles.divider}> | </Text>
                    <TouchableOpacity onPress={handleSignup}>
                        <Text style={styles.linkText}>회원가입하기</Text>
                    </TouchableOpacity>
                </View>

                {/* ✅ SNS 로그인 버튼 */}
                <View style={styles.snsContainer}>
                    <TouchableOpacity style={styles.snsButton}>
                        <Image source={require('../assets/icons/google.png')} style={styles.snsIcon} />
                        <Text style={styles.snsText}>구글로 로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.snsButton}>
                        <Image source={require('../assets/icons/naver.png')} style={styles.snsIcon} />
                        <Text style={styles.snsText}>네이버로 로그인</Text>
                    </TouchableOpacity>
                </View>

                {/* ✅ 건너뛰기 버튼 */}
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipText}>건너뛰기</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    container: { 
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: { 
        width: 270,
        height: 120,
        marginBottom: 40,
    },

    inputContainer: {
        width: '80%',
        alignItems: 'flex-start',
    },

    label: { 
        fontSize: 16, 
        color: '#888', 
        marginBottom: 10,
        textAlign: 'left',
    },

    input: { 
        width: '100%', 
        height: 50, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        marginBottom: 10, 
        paddingHorizontal: 10 
    },

    loginButton: { 
        backgroundColor: '#FBAF8B', 
        padding: 15, 
        borderRadius: 5, 
        width: '80%', 
        alignItems: 'center',
        marginTop: 10,
    },

    loginText: { color: 'white', fontSize: 16 },

    linkContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },

    linkText: {
        fontSize: 14,
        color: '#000000',
    },

    divider: {
        fontSize: 14,
        color: '#999',
        marginHorizontal: 5,
    },

    snsContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },

    snsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
    },

    snsIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: 'contain',
    },

    snsText: {
        fontSize: 14,
        color: '#333',
    },

    skipButton: {
        marginTop: 20,
        padding: 10,
    },

    skipText: {
        fontSize: 14,
        color: '#FBAF8B',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
