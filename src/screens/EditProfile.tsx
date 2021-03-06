import { useMutation, useReactiveVar, gql, ApolloCache } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { logUserOut, modalVisibleVar } from "../apollo";
import CustomModal from "../components/CustomModal";
import ScreenLayout from "../components/ScreenLayout";
import useUser from "../hooks/useUser";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import {
  editProfile,
  editProfileVariables,
} from "../__generated__/editProfile";
import { useSelectTheme } from "../styles";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $name: String
    $bio: String
    $password: String
    $avatar: Upload
  ) {
    editProfile(name: $name, bio: $bio, password: $password, avatar: $avatar) {
      ok
      error
    }
  }
`;

type EditProfileScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "EditProfile"
>;

export default function EditProfile({ navigation }: EditProfileScreenProps) {
  const theme = useSelectTheme();
  const { data: userData, loading, refetch } = useUser();
  const modalVisible = useReactiveVar(modalVisibleVar);
  const [editPart, setEditPart] = useState("name");
  const [chosenPhoto, setChosenPhoto] = useState<any>(null);
  const [editProfile, { error, loading: profileLoading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    update: async (cache: ApolloCache<any>, result: any) => {
      const {
        data: {
          editProfile: { ok, error },
        },
      } = result;
      if (ok) {
        cache.modify({
          id: `User:${userData?.isMe.id}`,
          fields: {
            avatar(prev) {
              return chosenPhoto;
            },
          },
        });
      }
    },
  });
  const getPhotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.01,
    });
    if (!result.cancelled) {
      const file = new ReactNativeFile({
        uri: result.uri,
        name: `${userData?.isMe.id}.jpg`,
        type: "image/jpeg",
      });
      setChosenPhoto(result.uri);
      editProfile({
        variables: {
          avatar: file,
        },
      });
    }
  };

  const getPermissions = async () => {
    const {
      granted,
      canAskAgain,
    } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted === false && canAskAgain) {
      getPhotos();
    } else if (granted) {
      getPhotos();
    }
  };

  const selectPhoto = async () => {
    await getPermissions();
  };

  const onPressLogOut = () => {
    Alert.alert("?????? ???????????? ???????????????????", "", [
      {
        text: "???",
        onPress: () => logUserOut(),
      },
      {
        text: "?????????",
      },
    ]);
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <ScreenLayout loading={loading} isKeyboard={false}>
        <CustomModal part={editPart} />

        <BasicInfo>
          <AvatarContainer onPress={() => getPermissions()}>
            <Avatar source={{ uri: userData?.isMe.avatar }} />
            <Ionicons
              style={{ position: "absolute", left: 110, top: 110 }}
              name="camera"
              size={30}
              color={theme.phColor}
            />
          </AvatarContainer>
          <Username>{userData?.isMe.username}</Username>
          <Email>{userData?.isMe.email}</Email>
        </BasicInfo>

        <Index>?????? ??????</Index>
        <UserSetting>
          <Wrapper>
            <Component>??????</Component>
            <TouchableOpacity
              onPress={() => {
                modalVisibleVar(true);
                setEditPart("name");
              }}
            >
              <Component>{userData?.isMe.name}</Component>
            </TouchableOpacity>
          </Wrapper>
          <Wrapper>
            <Component>??????</Component>
            <TouchableOpacity
              onPress={() => {
                modalVisibleVar(true);
                setEditPart("bio");
              }}
            >
              <Component>
                {userData?.isMe?.bio ? userData.isMe.bio : "???????????????"}
              </Component>
            </TouchableOpacity>
          </Wrapper>
          <Wrapper>
            <Component>????????? ??????</Component>
            <TouchableOpacity onPress={() => selectPhoto()}>
              <Component>
                <Ionicons name="camera" size={28} />
              </Component>
            </TouchableOpacity>
          </Wrapper>
          <Wrapper>
            <Component>????????? ??????</Component>
            <TouchableOpacity onPress={() => navigation.navigate("Observer")}>
              <Component>??????</Component>
            </TouchableOpacity>
          </Wrapper>
          <Wrapper>
            <Component>?????? ??????</Component>
            <Component>?????????</Component>
          </Wrapper>
        </UserSetting>
        <Index>?????? ??????</Index>
        <AccountSetting>
          <Wrapper>
            <LogOutBtn onPress={() => onPressLogOut()}>
              <Component>?????? ??????</Component>
            </LogOutBtn>
          </Wrapper>
        </AccountSetting>
      </ScreenLayout>
    </ScrollView>
  );
}

const BasicInfo = styled.View`
  justify-content: center;
  align-items: center;
`;
const NormalText = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.txtColor};
`;

const AvatarContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

const Avatar = styled.Image`
  height: 150px;
  width: 150px;
  border-radius: 75px;
`;
const Username = styled(NormalText)``;
const Email = styled(NormalText)``;

const UserSetting = styled.View`
  border: 1px solid ${(props) => props.theme.txtColor};
  border-radius: 10px;
  margin: 10px;
  background-color: ${(props) => props.theme.bgColor};
`;
const Component = styled.Text`
  color: ${(props) => props.theme.phColor};
  font-size: 16px;
`;
const Wrapper = styled.View`
  border-bottom-color: ${(props) => props.theme.txtColor};
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
`;

const Index = styled(Component)`
  margin-top: 10px;
  margin-left: 20px;
`;

const AccountSetting = styled(UserSetting)``;

const LogOutBtn = styled.TouchableOpacity``;
