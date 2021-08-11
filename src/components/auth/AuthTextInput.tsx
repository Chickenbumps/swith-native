import React from "react";
import styled from "styled-components/native";

import { TextInput, TextInputProps } from "react-native";
import { Controller, RegisterOptions } from "react-hook-form";

interface textInputProps {
  lastOne?: boolean;
  hasError: boolean;
}
interface ControlTextInput extends TextInputProps {
  control: any;
  name: string;
  defaultValue?: string;
  rules?: Exclude<
    RegisterOptions,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  refName?: React.Ref<TextInput>;
  hasError?: boolean;
}
const BaseTextInput = styled.TextInput<textInputProps>`
  background-color: ${(props) => props.theme.white};
  padding: 15px 7px;
  border-radius: 4px;
  color: ${(props) => props.theme.blue};
  margin-bottom: ${(props) => (props.lastOne ? 15 : 8)}px;
  border: 2px solid
    ${(props) => (props.hasError ? props.theme.error : props.theme.border)};
`;

export default function AuthTextInput({
  control,
  name,
  defaultValue,
  refName,
  rules,
  ...rest
}: ControlTextInput) {
  return (
    <Controller
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <BaseTextInput
          onBlur={onBlur}
          onChangeText={(value) => onChange(value)}
          value={value}
          ref={refName}
          hasError
          {...rest}
        />
      )}
      rules={rules}
      name={name}
    />
  );
}
