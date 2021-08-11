import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    txtColor: string;
    activeColor: string;
    phColor: string;
    border: string;
    error: string;
  }
}
