import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useSelectTheme } from "../styles";
import { StyleSheet, View, Text } from "react-native";
import Constants from "expo-constants";

type CameraScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "CameraScreen"
>;

export default function CameraScreen({ route, navigation }: CameraScreenProps) {
  const [cameraHasPermission, setCameraHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [faces, setFaces] = useState<any>([]);
  const cameraRef = useRef<Camera>(null);
  const theme = useSelectTheme();
  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    setCameraHasPermission(granted);
  };

  const handleFacesDetected = ({ faces }: any) => {
    setFaces(faces);
    if (faces.length) {
      setFaces([]);
      navigation.navigate("Plan", {
        faceDetected: true,
        second: route.params.second,
      });
    } else if (!faces.length && route.params.second) {
      // console.log("ttttt");
    }
  };

  useEffect(() => {
    getPermissions();
  }, [route]);
  const faceRender = ({ bounds, faceID, rollAngle, yawAngle }: any) => (
    <View
      key={faceID}
      //@ts-ignore
      transform={[
        { perspective: 600 },
        { rotateZ: `${rollAngle.toFixed(0)}deg` },
        { rotateY: `${yawAngle.toFixed(0)}deg` },
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}
    >
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );
  const visualFace = () => (
    <View style={styles.visualFaceContainer} pointerEvents="none">
      {faces.map((face: any) => faceRender(face))}
    </View>
  );
  return (
    <Container>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />

      {faces.length ? visualFace() : undefined}
      <CameraReverseBtnView>
        <CameraReverseBtn
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Ionicons
            name="camera-reverse-outline"
            size={40}
            color={theme.txtColor}
          />
        </CameraReverseBtn>
      </CameraReverseBtnView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;
const CameraReverseBtnView = styled.View`
  flex: 0.15;
  background-color: transparent;
  justify-content: center;
  padding-right: 20px;
  align-items: flex-end;
`;
const CameraReverseBtn = styled.TouchableOpacity``;

const styles = StyleSheet.create({
  visualFaceContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 1,
    position: "absolute",
    borderColor: "#00B1D2",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  faceText: {
    color: "#FEFEFE",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    backgroundColor: "transparent",
  },
  textcolor: {
    color: "#FEFEFE",
  },
  topBar: {
    flex: 0.2,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Constants.statusBarHeight + 1,
  },

  bottomBar: {
    flex: 0.2,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
