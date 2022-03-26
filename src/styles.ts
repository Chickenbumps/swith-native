import { Dimensions } from "react-native";
import { useColorScheme } from "react-native";
import { DefaultTheme } from "styled-components";

export const colors = {
  white: "#FEFEFE",
  blue: "#00B1D2",
  skyblue: "#a0c7ce",
};

export const lightTheme: DefaultTheme = {
  bgColor: "#FEFEFE",
  txtColor: "#00B1D2",
  activeColor: "#4831D4",
  phColor: "#a0c7ce",
  border: "#5ad9f0",
  error: "tomato",
};

export const darkTheme: DefaultTheme = {
  bgColor: "#FEFEFE",
  txtColor: "#00B1D2",
  phColor: "#a0c7ce",
  activeColor: "#4831D4",
  border: "#5ad9f0",
  error: "tomato",
};

export const useSelectTheme = () => {
  const theme = useColorScheme() === "light";
  return theme ? lightTheme : darkTheme;
};

const { width, height } = Dimensions.get("screen");
export const screenXY = {
  width: (width * 335) / 428,
  height: height,
};
