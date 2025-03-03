//MainNavigator.js


import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import CameraScreen from '../screens/MedicineScreens/CameraScreen';
import GalleryScreen from '../screens/MedicineScreens/GalleryScreen';
import ManualEntryScreen from '../screens/MedicineScreens/ManualEntryScreen';
import MedicineDetailScreen from "../screens/MedicineScreens/MedicineDetailScreen";
import YoutubeScreen from "../screens/Youtube/YoutubeScreen";
import PlayerScreen from "../screens/Youtube/PlayerScreen.js";
import NameAgeEdit from '../screens/MyPage/NameAgeEdit';
import AlcoholSmoking from "../screens/MyPage/AlcoholSmoking";
import ConditionsEdit from '../screens/MyPage/ConditionsEdit';
import ConcernsEdit from '../screens/MyPage/ConcernsEdit';
import ProfilepicEdit from '../screens/MyPage/ProfilepicEdit'
import Settings1 from '../screens/MyPage/Settings1';
import ChangePassword from '../screens/MyPage/ChangePassword';
import Settings2 from '../screens/MyPage/Settings2';
import Settings3 from '../screens/MyPage/Settings3';
import NutrientDetail from '../screens/Home/NutrientDetail';


const Stack = createStackNavigator();

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* ✅ 메인 탭 네비게이터 */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />

            {/* ✅ 개별 화면으로 추가해야 함 (Navigator 자체를 스크린으로 넣으면 안됨) */}
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
            <Stack.Screen name="ManualEntryScreen" component={ManualEntryScreen} />
            <Stack.Screen name="MedicineDetailScreen" component={MedicineDetailScreen} options={{ tabBarStyle: { display: 'none' } }}/> 
            <Stack.Screen name="NutrientDetail" component={NutrientDetail} />
            <Stack.Screen name="NameAgeEdit" component={NameAgeEdit} />
            <Stack.Screen name="AlcoholSmoking" component={AlcoholSmoking} />
            <Stack.Screen name="ConditionsEdit" component={ConditionsEdit} />
            <Stack.Screen name="ConcernsEdit" component={ConcernsEdit}/>
            <Stack.Screen name="ProfilepicEdit" component={ProfilepicEdit}/>
            <Stack.Screen name="Settings1" component={Settings1}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Settings2" component={Settings2}/>
            <Stack.Screen name="Settings3" component={Settings3}/>
            <Stack.Screen name="YoutubeScreen" component={YoutubeScreen}/>
            <Stack.Screen name="PlayerScreen" component={PlayerScreen}/> 

        </Stack.Navigator>
    );
}
