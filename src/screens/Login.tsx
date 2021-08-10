import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { logUserIn } from "../apollo";
import AuthButton from "../components/auth/AuthButton";
import AuthFormError from "../components/auth/AuthFormError";
import AuthLayout from "../components/auth/AuthLayout";
import AuthTextInput from "../components/auth/AuthTextInput";
import { colors } from "../styles";
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

export default function Login() {
  const {
    handleSubmit,
    setError,
    formState,
    setValue,
    getValues,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      loginResult: "",
    },
  });

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const navigation = useNavigation<any>();

  const onCompleted = (data: login) => {
    const {
      login: { ok, token, error },
    } = data;
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
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => nextRef(passwordRef)}
        selectionColor={`${colors.yellow}`}
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
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        returnKeyType="next"
        autoCapitalize="none"
        secureTextEntry
        keyboardType="ascii-capable"
        onSubmitEditing={handleSubmit(onValid)}
        selectionColor={`${colors.yellow}`}
        hasError={Boolean(formState.errors?.password)}
      />
      <AuthFormError message={formState.errors?.password?.message} />

      <AuthButton
        text="로그인"
        disabled={false}
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
