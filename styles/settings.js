import { StyleSheet, Platform } from "react-native";
import {
  colors,
  fonts,
  row,
  center,
  padding
} from "./global";

export default StyleSheet.create( {
  center,
  checkBox: {
    paddingRight: 10.3
  },
  checkboxRow: {
    marginTop: 17
  },
  greenButton: {
    backgroundColor: colors.seekForestGreen,
    borderRadius: 6,
    paddingBottom: 11,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 18 : 12
  },
  subHeader: {
    color: colors.settingsGray,
    fontFamily: fonts.semibold,
    fontSize: 17,
    letterSpacing: 0.94
  },
  header: {
    color: colors.seekForestGreen,
    fontFamily: fonts.semibold,
    fontSize: 19,
    letterSpacing: 1.12
  },
  languageText: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 20,
    letterSpacing: 1.11
  },
  leftMargin: {
    marginBottom: 5,
    marginLeft: 10
  },
  margin: {
    marginTop: 35
  },
  marginGreenButton: {
    marginTop: 19
  },
  marginHorizontal: {
    justifyContent: "space-between",
    marginHorizontal: 28
  },
  marginMedium: {
    marginTop: 22
  },
  marginSmall: {
    marginTop: 15
  },
  marginTop: {
    marginTop: 24
  },
  padding: {
    paddingTop: padding.iOSPaddingSmall
  },
  radioButtonSmallMargin: {
    paddingTop: 19 / 2
  },
  radioMargin: {
    paddingVertical: 19 / 2,
    paddingLeft: 20,
    paddingRight: 14
  },
  radioButtonMarginBottom: {
    paddingTop: 35 - ( 19 / 2 )
  },
  row,
  switch: {
    paddingHorizontal: 10.3 / 2,
    paddingVertical: 19 / 2
  },
  text: {
    color: colors.black,
    fontFamily: fonts.book,
    fontSize: 16,
    lineHeight: 21
  },
  radioButtonWidth: {
    maxWidth: 295,
    marginTop: -3
  },
  textWidth: {
    maxWidth: 239
  },
  inputIOS: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 20,
    letterSpacing: 1.11
  },
  inputIOSContainer: {
    backgroundColor: colors.seekForestGreen,
    borderRadius: 6,
    paddingBottom: 11,
    paddingHorizontal: 18,
    paddingTop: 12
  },
  viewContainer: {
    marginTop: 19,
    alignItems: "center"
  },
  inputAndroid: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 20,
    backgroundColor: colors.seekForestGreen,
    borderRadius: 6,
    letterSpacing: 1.11,
    paddingBottom: 11,
    paddingHorizontal: 18,
    paddingTop: 12
  },
  inputAndroidContainer: {
    marginTop: 19,
    alignItems: "center"
  }
} );
