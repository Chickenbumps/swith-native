import { gql, useMutation } from "@apollo/client";

import { StackScreenProps } from "@react-navigation/stack";
import React, { useRef } from "react";

import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import styled from "styled-components/native";
import { logUserIn } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import AuthFormError from "../components/auth/AuthFormError";
import AuthLayout from "../components/auth/AuthLayout";
import AuthTextInput from "../components/auth/AuthTextInput";
import { LoggedOutNavStackParamList } from "../navigation/Router";
import { colors, useSelectTheme } from "../styles";
import { login, loginVariables, login_login } from "../__generated__/login";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

type LoginScreenProps = StackScreenProps<LoggedOutNavStackParamList, "Login">;

export default function Login({ navigation, route }: LoginScreenProps) {
  const theme = useSelectTheme();
  const { handleSubmit, setError, formState, control } = useForm({
    mode: "onChange",
    defaultValues: {
      username: route?.params?.username,
      password: route?.params?.password,
      loginResult: "",
    },
  });

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const onCompleted = (data: login) => {
    const {
      login: { ok, token, error },
    } = data;
    console.log("onComplete", data);
    if (!ok) {
      setError("loginResult", {
        message: "가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.",
      });
    } else {
      logUserIn(token);
    }
  };

  const [login, { loading, error }] = useMutation<login, loginVariables>(
    LOGIN_MUTATION,
    {
      onCompleted,
    }
  );
  const nextRef = (ref: React.RefObject<TextInput>) => {
    ref?.current?.focus();
  };

  const onValid = (data: loginVariables) => {
    if (!loading) {
      login({
        variables: {
          ...data,
        },
      });
    }
    return false;
  };

  return (
    <AuthLayout>
      <Logo
        resizeMode="contain"
        source={require("../../assets/image/logo.png")}
      />
      <AuthTextInput
        name="username"
        refName={usernameRef}
        control={control}
        rules={{
          required: {
            value: true,
            message: "필수 정보입니다.",
          },
        }}
        placeholder="아이디"
        placeholderTextColor={theme.phColor}
        selectionColor={theme.txtColor}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => nextRef(passwordRef)}
        hasError={Boolean(formState.errors?.username)}
      />
      <AuthFormError message={formState.errors?.username?.message} />

      <AuthTextInput
        name="password"
        refName={passwordRef}
        control={control}
        rules={{
          required: {
            value: true,
            message: "필수 정보입니다.",
          },
        }}
        placeholder="비밀번호"
        placeholderTextColor={theme.phColor}
        selectionColor={theme.txtColor}
        returnKeyType="next"
        autoCapitalize="none"
        secureTextEntry
        keyboardType="ascii-capable"
        onSubmitEditing={handleSubmit(onValid)}
        hasError={Boolean(formState.errors?.password)}
      />
      <AuthFormError message={formState.errors?.password?.message} />
      <LostContainer>
        <LostText>회원정보 찾기</LostText>
      </LostContainer>
      <AuthButton
        text="로그인"
        disabled={!formState.isValid || loading}
        onPress={handleSubmit(onValid)}
      />
      <AuthButton
        text="회원가입"
        disabled={false}
        onPress={() => navigation.navigate("CreateAccount")}
      />
    </AuthLayout>
  );
}

const LoginImage = styled.Image`
  max-width: 70%;
  width: 100%;
  height: 170px;
  margin: 0 auto;
`;
const Logo = styled.Image`
  max-width: 100%;
  width: 100%;
  height: 150px;
`;

const LostContainer = styled.TouchableOpacity`
  align-items: flex-end;
`;
const LostText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
