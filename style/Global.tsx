import { createGlobalStyle } from 'styled-components';
import { TernoaTheme } from 'style/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends TernoaTheme {}
}

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: inherit;
    font-family: ${({ theme }) => theme.fonts.regular};
    line-height: 1.3;
  }

  html {
    box-sizing: border-box;
    font-size: 62.5%;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
  margin: 0;
  padding: 0;

  &.model-open {
    overflow: hidden;
  }
  -webkit-font-smoothing :antialiased;
}
`;

export default GlobalStyle;
