import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

export default function DismissKeyboard({ children }: any) {
  const onPress = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {children}
    </TouchableWithoutFeedback>
  );
}
