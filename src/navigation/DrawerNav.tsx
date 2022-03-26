import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Group from "../screens/Group";
import { Ionicons } from "@expo/vector-icons";
import { useSelectTheme } from "../styles";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "./Router";
import styled from "styled-components/native";
import DrawerContent from "../screens/DrawerContent";

const Drawer = createDrawerNavigator();
type DrawerProps = StackScreenProps<LoggedInNavStackParamList, "Group">;

export default function DrawerNav({ route, navigation }: DrawerProps) {
  const theme = useSelectTheme();
  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      drawerContent={(props) => (
        <DrawerContent
          id={route.params?.id}
          username={route.params?.username}
        />
      )}
      screenOptions={{
        headerShadowVisible: false,

        headerLeft: () => (
          <BackBtn onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={theme.txtColor}
            />
          </BackBtn>
        ),
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen
        name="Group"
        component={Group}
        initialParams={{
          id: route.params?.id,
          username: route.params?.username,
        }}
        options={
          {
            // gestureEnabled: false,
          }
        }
      />
    </Drawer.Navigator>
  );
}

const BackBtn = styled.TouchableOpacity``;
