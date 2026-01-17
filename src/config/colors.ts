// Merkezi Renk Paleti - KTP Teması (Light & Dark Mode)

// Base KTP Colors
export const ktpColors = {
  red: "#BA2038",
  gray: "#161719",
  federal_blue: "#080A4F",
  black: "#01010F",
  delft_blue: "#243568",
  white: "#F5F4F2",
  blue_green: "#3B9EC5",
  yellow: "#EFCB56",
};

// Dark Mode Renk Paleti
export const darkColors = {
  background: {
    primary: "#01010F", // ktp_black
    secondary: "#161719", // ktp_gray
    tertiary: "#1a1d25", // Hover states
  },
  border: {
    light: "#243568", // ktp_delft_blue
    medium: "#2d4580",
    dark: "#3B9EC5", // ktp_blue_green
  },
  text: {
    primary: "#F5F4F2", // ktp_white
    secondary: "#d4d3d1",
    tertiary: "#a8a7a5",
    muted: "#6b6a68",
  },
  accent: {
    selected: "#BA2038", // ktp_red - Seçili menü öğesi
    hover: "#1a1d25", // Hover durumu
  },
};

// Light Mode Renk Paleti
export const lightColors = {
  background: {
    primary: "#ffffff", // Beyaz arka plan
    secondary: "#f8f9fa", // Açık gri (kartlar, sidebar)
    tertiary: "#e9ecef", // Hover states
  },
  border: {
    light: "#dee2e6", // Açık gri border
    medium: "#adb5bd", // Orta ton border
    dark: "#6c757d", // Koyu border
  },
  text: {
    primary: "#01010F", // ktp_black
    secondary: "#343a40",
    tertiary: "#6c757d",
    muted: "#adb5bd",
  },
  accent: {
    selected: "#3B9EC5", // ktp_blue_green - Seçili menü öğesi
    hover: "#e9ecef", // Hover durumu
  },
};

// Primary Renk (Her iki modda aynı)
const primaryColors = {
  50: "#fde8ec",
  100: "#fbd0d9",
  200: "#f7a1b3",
  300: "#f3728d",
  400: "#cf4a68",
  500: "#BA2038", // ktp_red
  600: "#951a2d",
  700: "#701322",
  800: "#4a0d17",
  900: "#25060c",
};

// Status Renkleri (Her iki modda aynı)
const statusColors = {
  success: {
    light: "#5eb3d6",
    DEFAULT: "#3B9EC5", // ktp_blue_green
    dark: "#2d7a9a",
  },
  warning: {
    light: "#f4d97f",
    DEFAULT: "#EFCB56", // ktp_yellow
    dark: "#c7a644",
  },
  error: {
    light: "#d1426a",
    DEFAULT: "#BA2038", // ktp_red
    dark: "#951a2d",
  },
  info: {
    light: "#3d5ba0",
    DEFAULT: "#243568", // ktp_delft_blue
    dark: "#1a2649",
  },
};

// Aktif tema renklerini döndüren fonksiyon
export const getColors = (isDark: boolean) => ({
  background: isDark ? darkColors.background : lightColors.background,
  border: isDark ? darkColors.border : lightColors.border,
  text: isDark ? darkColors.text : lightColors.text,
  accent: isDark ? darkColors.accent : lightColors.accent,
  primary: primaryColors,
  ...statusColors,
});

// Default export (dark mode)
export const colors = {
  background: darkColors.background,
  border: darkColors.border,
  text: darkColors.text,
  accent: darkColors.accent,
  primary: primaryColors,
  ...statusColors,
};

// CSS için hex formatında export
export const cssColors = {
  background: colors.background,
  border: colors.border,
  text: colors.text,
  primary: colors.primary,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
};
