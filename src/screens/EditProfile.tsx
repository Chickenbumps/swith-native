import { useMutation, useReactiveVar, gql, ApolloCache } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, TouchableHighlight } from "react-native";
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
        // await refetch();
      }
    },
  });
  const getPhotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      console.log("result", result.uri);
      const file = new ReactNativeFile({
        uri: result.uri,
        name: `${userData?.isMe.id}.jpg`,
        type: "image/jpeg",
      });
      // setChosenPhoto(result.uri);
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

  return (
    <ScreenLayout loading={loading}>
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

      <Index>개인 설정</Index>
      <UserSetting>
        <Wrapper>
          <Component>이름</Component>
          <TouchableHighlight
            onPress={() => {
              modalVisibleVar(true);
              setEditPart("name");
            }}
          >
            <Component>{userData?.isMe.name}</Component>
          </TouchableHighlight>
        </Wrapper>
        <Wrapper>
          <Component>소개</Component>
          <TouchableHighlight
            onPress={() => {
              modalVisibleVar(true);
              setEditPart("bio");
            }}
          >
            <Component>
              {userData?.isMe?.bio ? userData.isMe.bio : "반갑습니다"}
            </Component>
          </TouchableHighlight>
        </Wrapper>
        <Wrapper>
          <Component>프로필 사진</Component>
          <TouchableHighlight onPress={() => selectPhoto()}>
            <Component>
              <Ionicons name="camera" size={28} />
            </Component>
          </TouchableHighlight>
        </Wrapper>
        <Wrapper>
          <Component>감시자 설정</Component>
          <Component>미구현</Component>
        </Wrapper>
        <Wrapper>
          <Component>알림 설정</Component>
          <Component>미구현</Component>
        </Wrapper>
      </UserSetting>
      <Index>계정 설정</Index>
      <AccountSetting>
        <Wrapper>
          <TouchableOpacity onPress={() => logUserOut()}>
            <Component>로그 아웃</Component>
          </TouchableOpacity>
        </Wrapper>
      </AccountSetting>
    </ScreenLayout>
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
