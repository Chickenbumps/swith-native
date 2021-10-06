import { gql, useMutation, useReactiveVar } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components/native";
import { modalVisibleVar } from "../apollo";
import { useSelectTheme } from "../styles";
import {
  editProfile,
  editProfileVariables,
} from "../__generated__/editProfile";
import AuthTextInput from "./auth/AuthTextInput";

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

export default function CustomModal({ part, children }: any) {
  const theme = useSelectTheme();
  const modalVisible = useReactiveVar(modalVisibleVar);
  const { control, formState, handleSubmit, setValue, register } = useForm();
  const [editProfile, { loading, error }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted: (data: editProfile) => {
      const {
        editProfile: { ok, error },
      } = data;
      console.log(ok);
      console.log(error);
    },
  });
  const hanPart =
    part === "name"
      ? "이름"
      : part === "bio"
      ? "소개"
      : part === "password"
      ? "비밀번호"
      : "";

  const onValid = (data: editProfileVariables) => {
    console.log(data);
    if (!loading) {
      if (part === "name") {
        editProfile({
          variables: {
            name: data.name,
          },
        });
      } else if (part === "bio") {
        editProfile({
          variables: {
            bio: data.bio,
          },
        });
      } else if (part === "password") {
        editProfile({
          variables: {
            password: data.password,
          },
        });
      }
    }
    if (part !== null) {
      setValue(part, "");
    }
    // setValue("name", "");
    // setValue("bio", "");
    // setValue("password", "");
    // setValue("avatar", "");
  };

  // useEffect(() => {
  //   register("name");
  //   register("bio");
  //   register("password");
  //   register("avatar");
  // });

  return (
    <Modal animationIn="fadeIn" animationOut="fadeOut" isVisible={modalVisible}>
      <ModalContainer>
        <ModalText>{hanPart}</ModalText>
        <AuthTextInput
          style={{ width: "100%" }}
          name={part}
          refName={register(part).ref}
          control={control}
          rules={{
            minLength: {
              value: 2,
              message: "2-15자 사이로 입력하세요.",
            },
            maxLength: {
              value: 15,
              message: "2-15자 사이로 입력하세요.",
            },
            required: {
              value: true,
              message: "필수 정보입니다.",
            },
          }}
          placeholder=""
          placeholderTextColor={theme.phColor}
          returnKeyType="next"
          autoCapitalize="none"
          onSubmitEditing={handleSubmit(onValid)}
          selectionColor={theme.txtColor}
          hasError={Boolean(formState.errors.name)}
        />
        <TouchableOpacity
          onPress={() => {
            modalVisibleVar(false);
            handleSubmit(onValid);
          }}
        >
          <Text>변경</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => modalVisibleVar(false)}>
          <Text>취소</Text>
        </TouchableOpacity>
      </ModalContainer>
    </Modal>
  );
}

const ModalText = styled.Text`
  align-self: flex-start;
  color: ${(props) => props.theme.txtColor};
  padding: 5px;
`;

const ModalContainer = styled.View`
  background-color: white;
  padding: 22px;
  justify-content: center;
  align-self: center;
  align-items: center;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.1);
`;
