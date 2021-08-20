import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import CameraScreen from "../screens/CameraScreen";
import Comment from "../screens/Comment";
import EditProfile from "../screens/EditProfile";
import Result from "../screens/Result";
import { useSelectTheme } from "../styles";
import TabNav from "./TabNav";

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
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
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}
