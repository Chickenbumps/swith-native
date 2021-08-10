import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import LoggedOutNav from "./LoggedOutNav";

export default function Router() {
  return (
    <NavigationContainer>
      <LoggedOutNav />
    </NavigationContainer>
  );
}
