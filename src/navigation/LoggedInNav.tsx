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
    </Stack.Navigator>
  );
}
