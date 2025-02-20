//MyPageScreen.js

import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React,{useEffect, useState} from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSpinner from "../../components/CustomSpinner";



const MyPageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // ✅ 네비게이션에서 받은 params 확인


  // ✅ 사용자 정보 상태 변수
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  const [profileImage, setProfileImage] = useState(null);






   // ✅ 프로필 이미지 불러오기 함수
   const loadProfileImage = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("http://10.0.2.2:5001/user-full-data", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.status === "ok" && result.data.profileImage) {
          setProfileImage({ uri: result.data.profileImage });
      } else {
          // ✅ 기본 프로필 이미지 설정 (서버 URL 사용)
          setProfileImage({ uri: "http://10.0.2.2:5001/uploads/default_profile.png" });
      }
    } catch (error) {
        console.error("❌ 프로필 이미지 로드 오류:", error);
    }
};






    // ✅ 마이페이지에 들어올 때마다 최신 프로필 이미지 가져오기
    useFocusEffect(
      React.useCallback(() => {
        fetchUserInfo(); // ✅ 마이페이지 방문할 때마다 사용자 정보 최신화
          loadProfileImage(); // ✅ 저장된 프로필 이미지 불러오기
      }, [])
  );

 
 




    

// ✅ AsyncStorage에서 프로필 사진 불러오기
useEffect(() => {
  const loadProfileImage = async () => {
    const savedImage = await AsyncStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage({ uri: savedImage });
    }
  };

  loadProfileImage();
}, []);








  //만성질환->해당사항이 없어요이면 숫자 0으로 뜨게
  const conditionList = Array.isArray(userInfo?.conditions) ? userInfo.conditions : [];
  const conditionCount = conditionList.length === 0 || conditionList.includes("해당 사항이 없어요") ? 0 : conditionList.length;






    // ✅ 사용자 정보 가져오기 함수
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // ✅ 토큰 가져오기
        console.log("🟢 AsyncStorage에서 가져온 토큰:", token);
        
        if (!token) {
          console.error("토큰 없음, 로그인 필요");
          return;
        }
  
        const response = await fetch("http://10.0.2.2:5001/user-full-data", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // ✅ 토큰 포함
            "Content-Type": "application/json",
          },
        });
  
        const result = await response.json();
        console.log("🟢 서버에서 받은 응답:", result.data);
        
        
        if (result.status === "ok") {
          setUserInfo(result.data); // ✅ 사용자 정보 저장
        } else {
          console.error("사용자 정보를 불러오지 못함:", result.message);
        }
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
      } finally {
        setLoading(false); // ✅ 로딩 종료
      }
    };

  







  
    // 로딩 중이면 스피너 표시
    if (loading) {
      return <CustomSpinner />;
    }





  return (
    <ScrollView style={styles.container}
    showsVerticalScrollIndicator={false}>
      {/* ✅ 페이지 제목 배경 추가 */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>마이페이지</Text>
      </View>
     
      
      {/* 프로필 영역 */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
        <Image
          source={profileImage 
            ? profileImage : require('../../assets/icons/capybara1.png')}
          style={styles.profileImage}
        />

          <TouchableOpacity style={styles.cameraButton} onPress={()=> navigation.navigate("ProfilepicEdit", { currentProfileImage: profileImage})}>
            <Image source={require("../../assets/icons/camera.png")} style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileTextContainer}>
          <View style={styles.profileRow}>
            <Text style={styles.username}>{userInfo?.nickname || "사용자"}</Text>
            <TouchableOpacity onPress={()=> navigation.navigate("NameAgeEdit")}>
              <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userInfo}>태어난 연도 : {userInfo?.birthYear || "모름"} / 성별 : {userInfo?.gender || "모름"}</Text>
        </View>
      </View>






      {/* 건강 상태 정보 */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoLabel}>현재 건강 습관</Text>
          </View>
        </View>
        
        <View style={styles.infoDetailRow}>
        <Text style={styles.infoDetail}>음주 : 주 {userInfo?.alcohol}회, 흡연 여부 : {userInfo?.smoking}, 임신 관련 : {userInfo?.pregnancy} </Text>
        <TouchableOpacity onPress={()=> navigation.navigate("AlcoholSmoking")}>
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
        <TouchableOpacity onPress={()=> navigation.navigate("ConcernsEdit")}>
            <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon2} />
          </TouchableOpacity>
          </View>
        <View style={styles.separator} />





        {/* 이 밑애는 나중에 약품컬렉션까지 만들면 수정할게여 */}

        <View style={styles.infoRow}>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.infoLabel}>복용약물</Text>
            <Text style={styles.infoCount}>2</Text>
          </View>
        </View>

        <View style={styles.infoDetailRow}>
        <Text style={styles.infoDetail}>디고신정, 이지엔6프로연질캡슐</Text>
        <TouchableOpacity>
            <Image source={require("../../assets/icons/pencil.png")} style={styles.editIcon2} />
          </TouchableOpacity>
          </View>
      </View>
      <View style={styles.separator} />










      {/* 설정 메뉴 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("Settings1")}>
          <Image source={require("../../assets/icons/settings.png")} style={styles.menuIcon} />
          <Text style={styles.menuText}>내 계정 관리</Text>
          <Image source={require("../../assets/icons/rightarrow.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("Settings2")}>
          <Image source={require("../../assets/icons/paper.png")} style={styles.menuIcon} />
          <Text style={styles.menuText}>서비스 이용약관</Text>
          <Image source={require("../../assets/icons/rightarrow.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("Settings3")}>
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
    pageHeader: {backgroundColor: "#FBAF8B",
    paddingVertical: 20, borderBottomLeftRadius:15, borderBottomRightRadius:15
    },

  pageTitle: { fontSize: 24, fontWeight: "bold", textAlign: "left", marginInlineStart: 20, marginTop: 10, color:"#fff" },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },
  profileContainer: { flexDirection: "row", padding: 20, alignItems: "center" },
  profileImageWrapper: { position: "relative" },
  profileImage: { width: 100, height: 150, borderWidth: 1, borderRadius: 10, borderColor: "lightgrey" },
  cameraButton: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 15, padding: 5 },
  cameraIcon: { width: 20, height: 20 },
  profileTextContainer: { marginLeft: 15 },
  profileRow: { flexDirection: "row", alignItems: "center" },
  username: { fontSize: 18, fontWeight: "bold", marginBottom:10 },
  userInfo: { fontSize: 14, color: "#777" },
  editIcon: { width: 20, height: 20, marginLeft: 10, marginBottom:10 },
  
  
  
  editIcon2: {
    width: 20,
    height: 20,
    marginLeft: 10,
    alignSelf: "center", // ✅ 아이콘을 텍스트 높이에 맞춰 정렬
  },
  infoContainer: { padding: 25, backgroundColor: "#F7F7F7", borderRadius: 10, margin: 10, borderWidth: 1, borderColor: "lightgrey" },
  infoLabel: { fontSize: 16, fontWeight: "bold", marginBottom:2, marginTop:10 },
  infoCount: { fontSize: 14, fontWeight: "bold", color: "#FBAF8B", marginBottom:3, marginTop:10, marginLeft:10 },
  infoDetail: {
    fontSize: 14,
    color: "#555",
    flexShrink: 1, // ✅ 줄바꿈 허용
    flexWrap: "wrap", // ✅ 긴 텍스트가 자동 줄바꿈됨
    maxWidth: "85%", // ✅ 아이콘을 위한 공간 확보 (아이콘이 밀려나지 않도록)
  },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoTextWrapper: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  infoDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start", // ✅ 텍스트가 여러 줄일 때, 위쪽 정렬 유지
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap", // ✅ 긴 텍스트가 자동으로 줄바꿈됨
    marginTop: 5,
  },
  
  
  menuContainer: { padding: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, justifyContent: "space-between" },
  menuIcon: { width: 24, height: 24, marginRight: 20, marginLeft: 10 },
  menuText: { fontSize: 16, flex: 1 },
  arrowIcon: { width: 20, height: 20 }
});

export default MyPageScreen;