import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

export default function CustomModal({ visible, children }: any) {
  return (
    <Modal animationIn="fadeIn" animationOut="fadeOut" isVisible={visible}>
      {children}
    </Modal>
  );
}
