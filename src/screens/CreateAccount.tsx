import { gql, useMutation } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Alert, TextInput } from "react-native";
import styled from "styled-components/native";
import AuthButton from "../components/auth/AuthButton";
import AuthFormError from "../components/auth/AuthFormError";
import AuthLayout from "../components/auth/AuthLayout";
import AuthTextInput from "../components/auth/AuthTextInput";
import { registerForPushNotificationsAsnyc } from "../components/PushNotification";
import { LoggedOutNavStackParamList } from "../navigation/Router";
import { colors, useSelectTheme } from "../styles";
import { EMAIL_EXP, PASSWORD_EXP, USERNAME_EXP } from "../variables";
import {
  createAccount,
  createAccountVariables,
} from "../__generated__/createAccount";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
    $passwordConfirm: String!
    $token: String
  ) {
    createAccount(
      name: $name
      username: $username
      email: $email
      password: $password
      passwordConfirm: $passwordConfirm
      token: $token
    ) {
      ok
      error
    }
  }
`;
type CreateAccountScreenProps = StackScreenProps<
  LoggedOutNavStackParamList,
  "CreateAccount"
>;

export default function CreateAccount({
  navigation,
}: CreateAccountScreenProps) {
  const theme = useSelectTheme();
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
      name: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      createAccountResult: "",
    },
  });
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);

  const onCompleted = (data: createAccount) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      setError("createAccountResult", { message: `?????? ?????? ??????,${error}` });
    } else {
      Alert.alert("????????? ??????????????????. ????????? ?????????.");
      const { email, password } = getValues();
      navigation.navigate("Login", { email, password });
    }
  };

  const [createAccount, { loading, error }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const nextRef = (ref: React.RefObject<TextInput>) => {
    ref?.current?.focus();
  };

  const onValid = async (data: createAccountVariables) => {
    const token = await registerForPushNotificationsAsnyc();
    if (!loading) {
      createAccount({
        variables: {
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          token: token,
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
        name="name"
        refName={nameRef}
        control={control}
        rules={{
          minLength: {
            value: 2,
            message: "2-15??? ????????? ???????????????.",
          },
          maxLength: {
            value: 15,
            message: "2-15??? ????????? ???????????????.",
          },
          required: {
            value: true,
            message: "?????? ???????????????.",
          },
        }}
        placeholder="??????"
        placeholderTextColor={theme.phColor}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => nextRef(usernameRef)}
        selectionColor={theme.txtColor}
        hasError={Boolean(formState.errors.name)}
      />
      <AuthFormError message={formState.errors?.name?.message} />
      <AuthTextInput
        name="username"
        refName={usernameRef}
        control={control}
        rules={{
          pattern: {
            value: USERNAME_EXP,
            message:
              "5-20?????? ?????? ?????????,????????? ????????????(_,-)??? ?????? ???????????????.",
          },
          required: {
            value: true,
            message: "?????? ???????????????.",
          },
        }}
        placeholder="?????????"
        placeholderTextColor={theme.phColor}
        selectionColor={theme.txtColor}
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => nextRef(emailRef)}
        hasError={Boolean(formState.errors?.username)}
      />
      <AuthFormError message={formState.errors?.username?.message} />
      <AuthTextInput
        name="email"
        refName={emailRef}
        control={control}
        rules={{
          pattern: {
            value: EMAIL_EXP,
            message: "????????? ????????? ?????? ??????????????????.",
          },
          required: {
            value: true,
            message: "?????? ???????????????.",
          },
        }}
        placeholder="?????????"
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
          pattern: {
            value: PASSWORD_EXP,
            message: "8-16??? ?????? ??? ?????????, ??????, ??????????????? ???????????????.",
          },
          required: {
            value: true,
            message: "?????? ???????????????.",
          },
        }}
        placeholder="????????????"
        placeholderTextColor={theme.phColor}
        selectionColor={theme.txtColor}
        returnKeyType="next"
        autoCapitalize="none"
        secureTextEntry
        keyboardType="ascii-capable"
        onSubmitEditing={() => nextRef(passwordConfirmRef)}
        hasError={Boolean(formState.errors?.password)}
      />
      <AuthFormError message={formState.errors?.password?.message} />
      <AuthTextInput
        name="passwordConfirm"
        refName={passwordConfirmRef}
        control={control}
        rules={{
          pattern: {
            value: PASSWORD_EXP,
            message: "8~16??? ?????? ??? ?????????, ??????, ??????????????? ???????????????.",
          },
          required: {
            value: true,
            message: "?????? ???????????????.",
          },
          validate: {
            value: (v) =>
              v === getValues("password") || "??????????????? ???????????? ????????????.",
          },
        }}
        placeholder="???????????? ??????"
        placeholderTextColor={theme.phColor}
        selectionColor={theme.txtColor}
        returnKeyType="done"
        autoCapitalize="none"
        secureTextEntry
        keyboardType="ascii-capable"
        onSubmitEditing={handleSubmit(onValid)}
        hasError={Boolean(formState.errors?.passwordConfirm)}
      />
      <AuthFormError message={formState.errors?.passwordConfirm?.message} />
      <AuthButton
        text="?????? ?????????"
        disabled={!formState.isValid || loading}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
const Logo = styled.Image`
  max-width: 100%;
  width: 100%;
  height: 150px;
`;
