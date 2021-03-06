import { gql, useMutation, useReactiveVar } from "@apollo/client";

import { StackScreenProps } from "@react-navigation/stack";
import React, { useRef } from "react";

import { useForm } from "react-hook-form";
import { Alert, TextInput } from "react-native";
import styled from "styled-components/native";
import { logUserIn } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import AuthFormError from "../components/auth/AuthFormError";
import AuthLayout from "../components/auth/AuthLayout";
import AuthTextInput from "../components/auth/AuthTextInput";
import { registerForPushNotificationsAsnyc } from "../components/PushNotification";
import { LoggedOutNavStackParamList } from "../navigation/Router";
import { colors, useSelectTheme } from "../styles";
import { EMAIL_EXP } from "../variables";
import {
  createPushToken,
  createPushTokenVariables,
} from "../__generated__/createPushToken";
import { login, loginVariables, login_login } from "../__generated__/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;

const CREATE_PUSH_TOKEN = gql`
  mutation createPushToken($pushToken: String) {
    createPushToken(pushToken: $pushToken) {
      ok
      error
    }
  }
`;

type LoginScreenProps = StackScreenProps<LoggedOutNavStackParamList, "Login">;

export default function Login({ navigation, route }: LoginScreenProps) {
  const theme = useSelectTheme();
  const [createPushToken, { data: createPushTokenResult }] = useMutation<
    createPushToken,
    createPushTokenVariables
  >(CREATE_PUSH_TOKEN, {
    onCompleted: (data: createPushToken) => {
      const {
        createPushToken: { ok, error },
      } = data;
      if (ok) {
        console.log("성공적으로 푸쉬토큰 생성완료.");
      } else {
        console.error(`푸쉬토큰 생성에러:${error}`);
      }
    },
  });
  const { handleSubmit, setError, formState, control, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      email: route?.params?.email,
      password: route?.params?.password,
      loginResult: "",
    },
  });

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const onCompleted = async (data: login) => {
    const {
      login: { ok, token, error },
    } = data;

    if (!ok) {
      Alert.alert(`${error}`);
    } else {
      logUserIn(token);
      const pushToken = await registerForPushNotificationsAsnyc();
      createPushToken({
        variables: {
          pushToken: pushToken,
        },
      });
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

  const onValid = (data: any) => {
    if (!loading) {
      login({
        variables: {
          ...data,
        },
      });
    }
    return;
  };

  return (
    <AuthLayout>
      <Logo
        resizeMode="contain"
        source={require("../../assets/image/logo.png")}
      />
      <AuthTextInput
        name="email"
        refName={emailRef}
        control={control}
        rules={{
          pattern: {
            value: EMAIL_EXP,
            message: "이메일 주소를 다시 확인해주세요.",
          },
          required: {
            value: true,
            message: "필수 정보입니다.",
          },
        }}
        placeholder="이메일"
        placeholderTextColor={theme.phColor}
        selectionColor={theme.txtColor}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => nextRef(passwordRef)}
        hasError={Boolean(formState.errors?.email)}
      />
      <AuthFormError message={formState.errors?.email?.message} />

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
      <IntroBtn
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("@viewedIntro");
          } catch (e) {
            console.log("Error @clearIntro: ", e);
          }
        }}
      >
        <IntroText>인트로 다시보기</IntroText>
      </IntroBtn>
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

const IntroBtn = styled.TouchableOpacity``;
const IntroText = styled.Text``;
