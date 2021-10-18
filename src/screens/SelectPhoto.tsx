import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles";

const { width, height } = Dimensions.get("screen");

export default function SelectPhoto() {
  const [isGranted, setIsGranted] = useState(false);
  const [photos, setPhotos] = useState<any>([]);
  const [chosenPhoto, setChosenPhoto] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<string>("");
  const [hasNext, setHasNext] = useState(true);
  const numColumns = 4;

  const getPhotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setChosenPhoto(result.uri);
    }
  };

  const getPermissions = async () => {
    const {
      granted,
      canAskAgain,
    } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted === false && canAskAgain) {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges !== "none") {
        setIsGranted(true);
        getPhotos();
      }
    } else if (granted) {
      setIsGranted(true);
      getPhotos();
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  // const renderPhoto = ({ item }: ListRenderItemInfo<MediaLibrary.Asset>) => (
  //   <ImageContainer onPress={() => setChosenPhoto(item.uri)}>
  //     <Image
  //       source={{ uri: item.uri }}
  //       style={{ width: width / numColumns, height: 100 }}
  //     />
  //     <IconContainer>
  //       <Ionicons
  //         name="checkmark-circle"
  //         size={18}
  //         color={item.uri === chosenPhoto ? colors.blue : "white"}
  //       />
  //     </IconContainer>
  //   </ImageContainer>
  // );

  const onRefresh = async () => {
    setRefreshing(true);

    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={getPhotos} />
      {chosenPhoto && (
        <Image
          source={{ uri: chosenPhoto }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: black;
`;

const Top = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const List = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;
const ImageContainer = styled.TouchableOpacity``;
const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;
