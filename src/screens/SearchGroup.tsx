import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { useSelectTheme } from "../styles";
import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  searchGroups,
  searchGroupsVariables,
  searchGroups_searchGroups,
} from "../__generated__/searchGroups";
import { useForm } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";
import GroupItem from "../components/GroupItem";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInNavStackParamList } from "../navigation/Router";

const SEARCH_GROUPS_QUERY = gql`
  query searchGroups($title: String!) {
    searchGroups(title: $title) {
      id
      title
      memberNum
      groupAvatar
    }
  }
`;

type SearchGroupScreenProps = StackScreenProps<
  LoggedInNavStackParamList,
  "SearchGroup"
>;
const { width } = Dimensions.get("screen");
export default function SearchGroup({ navigation }: SearchGroupScreenProps) {
  const theme = useSelectTheme();
  const { register, setValue, handleSubmit } = useForm();
  const [searchGroup, { data, loading, called }] = useLazyQuery<
    searchGroups,
    searchGroupsVariables
  >(SEARCH_GROUPS_QUERY, {
    onCompleted: (data: searchGroups) => {
      // console.log(data);
    },
  });

  const onValid = (data: searchGroupsVariables) => {
    searchGroup({
      variables: {
        title: data.title,
      },
    });
  };

  const renderItem = ({ item }: { item: searchGroups_searchGroups }) => (
    <GroupItem
      title={item.title}
      groupAvatar={item.groupAvatar}
      memberNum={item.memberNum}
      onPress={() => navigation.navigate("GroupInfo", { id: item.id })}
    />
  );

  return (
    <ScreenLayout isKeyboard={true} loading={false}>
      <SearchView>
        <SearchBar
          ref={
            register("title", {
              required: true,
              minLength: 2,
            }).ref
          }
          placeholder="그룹 이름으로 검색하세요."
          returnKeyType="search"
          returnKeyLabel="Search"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setValue("title", text)}
          onSubmitEditing={handleSubmit(onValid)}
        />
        <SearchIcon onPress={handleSubmit(onValid)}>
          <Ionicons name="search-outline" size={28} color={theme.txtColor} />
        </SearchIcon>
      </SearchView>
      <ResultVeiw>
        {loading ? (
          <LoadingContainer>
            <LoadingText>그룹 찾는중...</LoadingText>
          </LoadingContainer>
        ) : null}
        {data?.searchGroups !== undefined ? (
          data.searchGroups?.length !== 0 ? (
            <FlatList
              data={data?.searchGroups}
              keyExtractor={(group) => "" + group.id}
              renderItem={renderItem}
            />
          ) : (
            <Logo source={require("../../assets/image/logo.png")} />
          )
        ) : (
          <Logo source={require("../../assets/image/logo.png")} />
        )}
      </ResultVeiw>
    </ScreenLayout>
  );
}

const SearchView = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const SearchBar = styled.TextInput`
  border: 2px solid ${(props) => props.theme.txtColor};
  padding-left: 10px;
  margin-left: 10px;
  border-radius: 1000px;
  width: 90%;
  height: 40px;
`;
const SearchIcon = styled.TouchableOpacity`
  justify-content: center;
`;

const ResultVeiw = styled.View`
  align-items: center;
  justify-content: flex-start;
`;
const LoadingContainer = styled.View``;
const LoadingText = styled.Text``;

const NotFoundContainer = styled.View``;
const NotFoundText = styled.Text``;
const Logo = styled.Image`
  max-width: 100%;
  width: 30%;
  height: 130px;
  top: ${width / 2}px;
`;
