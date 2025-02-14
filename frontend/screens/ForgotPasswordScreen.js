import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ API 요청: 비밀번호 찾기
    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert("입력 오류", "이메일을 입력해주세요.");
            return;
        }

        setLoading(true); // ✅ 로딩 상태 시작
        try {
            const response = await fetch("http://10.0.2.2:5001/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            setLoading(false); // ✅ 로딩 상태 종료

            if (response.ok) {
                Alert.alert("이메일 전송 완료", "임시 비밀번호가 이메일로 발송되었습니다.");
                navigation.goBack(); // ✅ 성공 시 로그인 화면으로 이동
            } else {
                Alert.alert("오류", data.message || "요청을 처리할 수 없습니다.");
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("서버 오류", "네트워크 문제로 요청을 처리할 수 없습니다.");
        }
    };

    return (
        <View style={styles.container}>
            {/* ✅ 좌측 상단에 뒤로 가기 버튼 */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Feather name="chevron-left" size={28} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>비밀번호 찾기</Text>
            <TextInput
                style={styles.input}
                placeholder="이메일 주소 입력"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* ✅ 로딩 중이면 버튼 비활성화 & 로딩 표시 */}
            <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>임시 비밀번호 받기</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#FBAF8B",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default ForgotPasswordScreen;
