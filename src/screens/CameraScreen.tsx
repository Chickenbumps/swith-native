import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useSelectTheme } from "../styles";

type CameraScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "CameraScreen"
>;

export default function CameraScreen({ route, navigation }: CameraScreenProps) {
  const [cameraHasPermission, setCameraHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [faces, setFaces] = useState([]);
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
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

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
