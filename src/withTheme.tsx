import { theme } from "fiap-financeiro-ds";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { ComponentType } from "react";

export function withTheme(Component: ComponentType) {
  const ComponentWithTheme = (props: any) => {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  };

  return ComponentWithTheme;
}
