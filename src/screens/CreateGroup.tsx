import { useMutation } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import HomeLayout from "../components/HomeLayout";
import { LoggedInNavStackParamList } from "../navigation/Router";
import {
  createGroup,
  createGroupVariables,
} from "../__generated__/createGroup";
const { width } = Dimensions.get("screen");

type CreateGroupProps = StackScreenProps<
  LoggedInNavStackParamList,
  "CreateGroup"
>;

const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($title: String!, $description: String) {
    createGroup(title: $title, description: $description) {
      ok
      error
    }
  }
`;

export default function CreateGroupProps({ navigation }: CreateGroupProps) {
  const { register, handleSubmit, getValues, watch, setValue } = useForm();

  const [createGroup, { data, loading }] = useMutation<
    createGroup,
    createGroupVariables
  >(CREATE_GROUP_MUTATION, {
    onCompleted: (data) => {
      const {
        createGroup: { ok, error },
      } = data;

      console.log(ok, error);
      if (ok) {
        navigation.navigate("GroupList", { isCreated: true });
      }
    },
  });
  const onValid = () => {
    const title = getValues("title");
    const description = getValues("description");
    if (!title) {
      Alert.alert("제목을 입력해주세요.");
    } else {
      createGroup({
        variables: {
          title: title,
          description: description,
        },
      });
    }
    setValue("title", "");
    setValue("description", "");
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ConfirmBtn onPress={() => onValid()}>
          <ConfirmBtnText>완료</ConfirmBtnText>
        </ConfirmBtn>
      ),
    });
  }, []);
  return (
    <DismissKeyboard>
      <Container>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 0}
        >
          <GroupTitle
            ref={register("title").ref}
            onChangeText={(data) => setValue("title", data)}
            placeholder={"그룹 이름을 입력하세요."}
          />

          <RankLimitView>
            <RankNavView>
              <RankNavText>랭크 제한</RankNavText>
            </RankNavView>
            <RankView>
              <Rank>
                <RankText>Bronze</RankText>
              </Rank>
              <Rank>
                <RankText>Silver</RankText>
              </Rank>
              <Rank>
                <RankText>Gold</RankText>
              </Rank>
            </RankView>
          </RankLimitView>
          <DescView>
            <DescNavView>
              <DescNavText>그룹 소개글</DescNavText>
            </DescNavView>
            <Desc
              value={watch("description")}
              onChangeText={(data) => setValue("description", data)}
              ref={register("description").ref}
              multiline={true}
              autoCompleteType="off"
              maxLength={50}
              textAlignVertical="top"
              placeholder="멤버를 모으기 위한 그룹 소개글을 작성해주세요:)"
            />
          </DescView>
        </KeyboardAvoidingView>
      </Container>
    </DismissKeyboard>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

const GroupTitle = styled.TextInput`
  font-size: 16px;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 0 10px 20px;
`;

const RankLimitView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  margin-top: 20px;
`;

const RankNavView = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  border-bottom-color: #f1f3f5;
  border-bottom-width: 1px;
  padding: 10px 0;
`;
const RankNavText = styled.Text`
  font-size: 16px;
  margin-left: 20px;
`;

const RankView = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 0;
`;

const Rank = styled.View`
  border: 1px solid ${(props) => props.theme.txtColor};
  border-radius: 10px;
  width: 60px;
  align-items: center;
  justify-content: center;
`;

const RankText = styled.Text``;

const DescView = styled(RankLimitView)``;
const DescNavView = styled(RankNavView)``;

const DescNavText = styled.Text`
  font-size: 16px;
  margin-left: 20px;
`;

const Desc = styled.TextInput`
  padding: 10px 0 10px 20px;
  margin-bottom: 40px;
  /* max-height: 50px; */
`;

const ConfirmBtn = styled.TouchableOpacity`
  padding: 10px;
`;

const ConfirmBtnText = styled.Text`
  color: ${(props) => props.theme.txtColor};
`;
