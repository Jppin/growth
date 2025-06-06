import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createAPI from '../api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);

    async function getData() {
        try {
            const api = await createAPI();
            const token = await AsyncStorage.getItem("token");
            const newUserStatus = await AsyncStorage.getItem("isNewUser");

            if (!token) {
                setUserData(null);
                setIsNewUser(false);
                setLoading(false);
                return;
            }

            const res = await api.get("/user-full-data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data && res.data.data) {
                setUserData(res.data.data);
            } else {
                setUserData(null);
            }

            setIsNewUser(newUserStatus === "true"); // ✅ 더 명확한 조건 설정

        } catch (error) {
            console.error("❌ 유저 데이터 가져오기 실패:", error);
            setUserData(null);
            setIsNewUser(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <AuthContext.Provider value={{ userData, loading, setUserData, getData, isNewUser, setIsNewUser, fetchUserData2: getData, }}>
            {children}
        </AuthContext.Provider>
    );
};
