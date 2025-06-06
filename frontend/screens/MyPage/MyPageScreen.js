import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSpinner from "../../components/CustomSpinner";
import Feather from "react-native-vector-icons/Feather";
import createAPI from '../../api';
import { AuthContext } from "../../context/AuthContext";


const MyPageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 사용자 정보 상태 변수
  const [userInfo, setUserInfo] = useState(null);
  const [activeMedicines, setActiveMedicines] = useState([]); // 복용 중인 약품들
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const { getData } = useContext(AuthContext);





  
  // 프로필 이미지 불러오기 함수
const loadProfileImage = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("❌ 토큰이 없습니다.");
      return;
    }

    const api = await createAPI();
    const res = await api.get("/user-full-data", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = res.data;

    if (result.status === "ok") {
      const profileImage = result.data.profileImage;
      const baseURL = api.defaults?.baseURL || "http://10.0.2.2:5001"; // 필요시 실제 URL로 대체

      if (profileImage) {
        const isRelative = profileImage.startsWith("/"); // "/uploads/..." 같은 상대 경로인지 확인
        const fullUri = isRelative ? `${baseURL}${profileImage}` : profileImage;
        setProfileImage({ uri: fullUri });
      } else {
        setProfileImage({ uri: `${baseURL}/uploads/default_profile.png` });
      }
    }
  } catch (error) {
    console.error("❌ 프로필 이미지 로드 오류:", error);
  }
};







  // 복용 약물 불러오기 함수 (active:true인 약품)
  const fetchActiveMedicines = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
  
      const api = await createAPI();
  
      const res = await api.get("/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = res.data;
      const active = Array.isArray(data) ? data.filter(med => med.active) : [];
      setActiveMedicines(active);
    } catch (error) {
      console.error("복용 약물 불러오기 오류:", error);
    }
  };






  // 사용자 정보 가져오기 함수
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("🟢 AsyncStorage에서 가져온 토큰:", token);
      if (!token) {
        console.error("토큰 없음, 로그인 필요");
        return;
      }
  
      const api = await createAPI();
  
      const res = await api.get("/user-full-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = res.data;
      console.log("🟢 서버에서 받은 응답:", result.data);
  
      if (result.status === "ok") {
        setUserInfo(result.data);
      } else {
        console.error("사용자 정보를 불러오지 못함:", result.message);
      }
    } catch (error) {
      console.error("사용자 정보 요청 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };






  // 마이페이지에 들어올 때마다 최신 정보 가져오기
  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
      loadProfileImage();
      fetchActiveMedicines();
      getData();
    }, [])
  );



  // AsyncStorage에서 프로필 사진 불러오기
  useEffect(() => {
    const loadProfileImageFromStorage = async () => {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage({ uri: savedImage });
      }
    };
    loadProfileImageFromStorage();



  }, []);



  // 만성질환 처리 (생략된 기존 코드)
  const conditionList = Array.isArray(userInfo?.conditions) ? userInfo.conditions : [];
  const conditionCount = conditionList.length === 0 || conditionList.includes("해당 사항이 없어요") ? 0 : conditionList.length;

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      
      
      
      {/* 페이지 제목 배경 */}
      
      <View style={styles.pageHeader}>

        {/* 상단 뒤로 가기 버튼 */}
      <TouchableOpacity 
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.navigate("MainTabs", { screen: "Home" });   // ✅ 이전 화면이 있으면 뒤로 가기
                        } else {
                            navigation.navigate("Login");  // ✅ 이전 화면이 없으면 Login 화면으로 이동
                        }
                    }} 
                    style={styles.backButton}
                >
                <Feather name="chevron-left" size={30} color="white" />
            </TouchableOpacity>

        <Text style={styles.pageTitle}>마이페이지</Text>
      </View>

      {/* 프로필 영역 */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={profileImage ? profileImage : require('../../assets/icons/madrelogo.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate("ProfilepicEdit", { currentProfileImage: profileImage })}>
            <Image source={require("../../assets/icons/camera.png")} style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileTextContainer}>
          <View style={styles.profileRow}>
            <Text style={styles.username}>{userInfo?.nickname || "사용자"}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("NameAgeEdit")}>
              <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userInfo}>태어난 연도 : {userInfo?.birthYear || "모름"}</Text>
          <Text style={styles.userInfo}>키 : {userInfo?.height || "모름"}cm</Text>
          <Text style={styles.userInfo}>몸무게 : {userInfo?.weight || "모름"}kg</Text>
        </View>
      </View>

      {/* 건강 상태 정보 */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoLabel}>현재 건강 상태</Text>
          </View>
        </View>
        <View style={styles.infoDetailRow}>
          <Text style={styles.infoDetail}>
          운동 : 주 {userInfo?.exercise}회 / 임신 관련 : {userInfo?.pregnancy}
      {userInfo?.pregnancy === "임신 중" && (
        <>
          {"\n"}- 임신 단계 : {userInfo?.subPregnancy}
          {"\n"}- 임신 주차 : {userInfo?.pregnancyWeek}주차
          {"\n"}- 입덧 정도 : {(() => {
            const levels = ["없음", "조금 있음", "보통", "심함", "매우심함"];
            return levels[userInfo?.nausea] ?? "정보 없음";
          })()}
        </>
      )}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("AlcoholSmoking")}>
            <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon2} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoLabel}>만성질환 여부</Text>
            <Text style={styles.infoCount}>{conditionCount}</Text>
          </View>
        </View>
        <View style={styles.infoDetailRow}>
          <Text style={styles.infoDetail}>
            {conditionList.length === 0 || conditionList.includes("해당 사항이 없어요") 
              ? "해당사항없음" 
              : conditionList.join(", ")}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("ConditionsEdit")}>
            <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon2} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoLabel}>건강고민</Text>
            <Text style={styles.infoCount}>{userInfo?.concerns?.length || 0}</Text>
          </View>
        </View>
        <View style={styles.infoDetailRow}>
          <Text style={styles.infoDetail}>{userInfo?.concerns?.join(", ") || "해당사항없음"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ConcernsEdit")}>
            <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon2} />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />

        {/* 복용약물 영역 */}
        <View style={styles.infoRow}>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoLabel}>복용약물</Text>
            <Text style={styles.infoCount}>{activeMedicines.length}</Text>
          </View>
        </View>
        <View style={styles.infoDetailRow}>
          <Text style={styles.infoDetail}>
            {activeMedicines.length > 0
              ? activeMedicines.map(med => med.name).join(", ")
              : "등록된 복용약물이 없습니다."}
          </Text>
        </View>
      </View>
      <View style={styles.separator} />

      {/* 설정 메뉴 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings1")}>
          <Image source={require("../../assets/icons/settings.png")} style={styles.menuIcon} />
          <Text style={styles.menuText}>내 계정 관리</Text>
          <Image source={require("../../assets/icons/rightarrow.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings2")}>
          <Image source={require("../../assets/icons/paper.png")} style={styles.menuIcon} />
          <Text style={styles.menuText}>서비스 이용약관</Text>
          <Image source={require("../../assets/icons/rightarrow.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Settings3")}>
          <Image source={require("../../assets/icons/privacy.png")} style={styles.menuIcon} />
          <Text style={styles.menuText}>개인정보 처리 방침</Text>
          <Image source={require("../../assets/icons/rightarrow.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  pageHeader: {
    backgroundColor: '#FBAF8B',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  pageTitle: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "left",
    color: "#fff",
  },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },
  profileContainer: { flexDirection: "row", padding: 20, alignItems: "center" },
  profileImageWrapper: { position: "relative" },
  profileImage: { width: 100, height: 150, borderWidth: 1, borderRadius: 10, borderColor: "lightgrey" },
  cameraButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 15, padding: 5 },
  cameraIcon: { width: 20, height: 20 },
  profileTextContainer: { marginLeft: 15 },
  profileRow: { flexDirection: "row", alignItems: "center" },
  username: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  userInfo: { fontSize: 14, color: "#777" },
  editIcon: { width: 20, height: 20, marginLeft: 10, marginBottom: 10 },
  editIcon2: {
    width: 20,
    height: 20,
    marginLeft: 10,
    alignSelf: "center",
  },
  infoContainer: {
    padding: 25,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  infoLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 2, marginTop: 10 },
  infoCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FBAF8B",
    marginBottom: 3,
    marginTop: 10,
    marginLeft: 10,
  },
  infoDetail: {
    fontSize: 14,
    color: "#555",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "85%",
  },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoTextWrapper: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  infoDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 5,
  },
  menuContainer: { padding: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, justifyContent: "space-between" },
  menuIcon: { width: 24, height: 24, marginRight: 20, marginLeft: 10 },
  menuText: { fontSize: 16, flex: 1 },
  arrowIcon: { width: 20, height: 20 },
  backButton: {
    marginRight: 10,
    
  },
});

export default MyPageScreen;
