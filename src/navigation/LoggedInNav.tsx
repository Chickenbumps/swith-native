import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import CameraScreen from "../screens/CameraScreen";
import Comment from "../screens/Comment";
import CreateGroup from "../screens/CreateGroup";
import EditProfile from "../screens/EditProfile";
import Result from "../screens/Result";
import { useSelectTheme } from "../styles";
import TabNav from "./TabNav";
import { Ionicons } from "@expo/vector-icons";
import Group from "../screens/Group";
import Observer from "../screens/Observer";
import PushNotification from "../components/PushNotification";
import SelectPhoto from "../screens/SelectPhoto";
import CommentList from "../screens/CommentList";
import UserProfile from "../screens/UserProfile";
import DrawerNav from "./DrawerNav";
import SearchGroup from "../screens/SearchGroup";
import GroupInfo from "../screens/GroupInfo";
const Stack = createStackNavigator();

export default function LoggedInNav() {
  const navigation = useNavigation<any>();
  const theme = useSelectTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Result"
        component={Result}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          gestureEnabled: false,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Home");
              }}
              style={{ marginLeft: 10 }}
            >
              <Text
                style={{
                  color: theme.txtColor,
                  fontWeight: "bold",
                }}
              >
                취소
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Comment" component={Comment} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={theme.txtColor}
            />
          ),
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{
          headerBackTitleVisible: false,
          headerTitle: "그룹 만들기",
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={theme.txtColor}
            />
          ),
        }}
      />
      <Stack.Screen
        name="SearchGroup"
        component={SearchGroup}
        options={{
          headerBackTitleVisible: false,
          headerTitle: "그룹 검색",
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={theme.txtColor}
            />
          ),
        }}
      />
      <Stack.Screen
        name="GroupInfo"
        component={GroupInfo}
        options={{
          headerBackTitleVisible: false,
          headerTitle: "그룹 정보",
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={theme.txtColor}
            />
          ),
        }}
      />
      {/* <Stack.Screen
        name="Group"
        component={Group}
        options={{
          headerBackTitleVisible: false,
          title: "그룹",
          headerBackImage: () => (
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={theme.txtColor}
            />
          ),
        }}
      /> */}
      <Stack.Screen
        name="Drawer"
        component={DrawerNav}
        options={{
          headerShown: false,
          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color={theme.txtColor}
            />
          ),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Observer"
        component={Observer}
        options={{
          headerTitle: "감시자",
          headerTintColor: theme.txtColor,
          headerBackTitleVisible: false,
          // headerBackImage: () => (
          //   <Ionicons
          //     name="chevron-back-outline"
          //     size={28}
          //     color={theme.txtColor}
          //   />
          // ),
        }}
      />
      <Stack.Screen name="PushNotification" component={PushNotification} />
      <Stack.Screen name="SelectPhoto" component={SelectPhoto} />
      <Stack.Screen name="CommentList" component={CommentList} />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}
