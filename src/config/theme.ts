import type { ThemeConfig } from "antd";
import { getColors } from "./colors";

export const getAntdTheme = (isDark: boolean): ThemeConfig => {
  const colors = getColors(isDark);

  return {
    token: {
      colorPrimary: colors.primary[500],
      colorSuccess: colors.success.light,
      colorWarning: colors.warning.light,
      colorError: colors.error.light,
      colorInfo: colors.info.light,
      colorBgBase: colors.background.primary,
      colorBgContainer: colors.background.secondary,
      colorBgElevated: colors.background.tertiary,
      colorBorder: colors.border.light,
      colorText: colors.text.primary,
      colorTextSecondary: colors.text.secondary,
      colorTextTertiary: colors.text.tertiary,
      borderRadius: 8,
      fontSize: 14,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    components: {
      Layout: {
        colorBgHeader: colors.background.secondary,
        colorBgBody: colors.background.primary,
        colorBgTrigger: colors.background.tertiary,
      },
      Menu: {
        colorItemBg: "transparent",
        colorItemBgSelected: colors.accent.selected,
        colorItemBgHover: colors.accent.hover,
        colorItemText: colors.text.secondary,
        colorItemTextSelected: isDark ? colors.text.primary : "#ffffff",
        colorItemTextHover: colors.text.primary,
      },
      Button: {
        colorPrimaryHover: colors.primary[400],
        colorPrimaryActive: colors.primary[600],
      },
      Input: {
        colorBgContainer: colors.background.secondary,
        colorBorder: colors.border.light,
        colorTextPlaceholder: colors.text.muted,
      },
      Card: {
        colorBgContainer: colors.background.secondary,
        colorBorderSecondary: colors.border.light,
      },
      Modal: {
        contentBg: colors.background.secondary,
        headerBg: colors.background.secondary,
      },
      Table: {
        colorBgContainer: colors.background.secondary,
        colorBorderSecondary: colors.border.light,
      },
    },
  };
};

// Default light theme
export const antdTheme = getAntdTheme(false);
