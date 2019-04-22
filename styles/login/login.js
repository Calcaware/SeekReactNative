import { StyleSheet, Platform } from "react-native";

import { fonts, colors, padding } from "../global";

export default StyleSheet.create( {
  container: {
    flex: 1
  },
  safeViewTop: {
    flex: 0,
    backgroundColor: colors.seekForestGreen
  },
  safeView: {
    flex: 1,
    backgroundColor: "transparent"
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  greenHeaderText: {
    marginTop: 22,
    textAlign: "center",
    color: colors.seekForestGreen,
    fontFamily: fonts.semibold,
    fontSize: 23,
    lineHeight: 30,
    letterSpacing: 1.0
  },
  inputField: {
    width: 307,
    backgroundColor: colors.white,
    height: 37,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.darkGray,
    paddingLeft: 15
  },
  greenButton: {
    backgroundColor: colors.seekForestGreen,
    width: 317,
    height: 52,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    paddingTop: padding.iOSPadding,
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: 1.0,
    color: colors.white
  },
  image: {
    width: 264,
    height: 264,
    resizeMode: "contain",
    marginTop: 36,
    marginBottom: 44
  },
  headerText: {
    textAlign: "center",
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 23,
    letterSpacing: 1.0
  },
  header: {
    textAlign: "center",
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: 19,
    lineHeight: 24
  },
  secondHeaderTextContainer: {
    marginTop: 11,
    marginHorizontal: 25
  },
  text: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: 17,
    lineHeight: 19,
    color: colors.white
  },
  leftTextContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "flex-start",
    marginLeft: 39,
    marginTop: 16,
    marginBottom: 8
  },
  leftText: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: 1.0,
    lineHeight: 24,
    color: colors.seekForestGreen
  },
  rightTextContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "flex-end",
    marginRight: 41,
    marginTop: 11,
    marginBottom: 51
  },
  textLink: {
    marginTop: 30,
    fontFamily: fonts.book,
    fontSize: 19,
    color: colors.white,
    textDecorationLine: "underline"
  },
  forgotPasswordText: {
    fontFamily: fonts.book,
    fontSize: 16,
    lineHeight: 21,
    color: colors.seekForestGreen,
    textDecorationLine: "underline"
  },
  datePickerContainer: {
    marginTop: Platform.OS === "android" ? 40 : null,
    marginBottom: Platform.OS === "android" ? 60 : null,
    alignItems: Platform.OS === "android" ? "center" : null,
    flex: Platform.OS === "ios" ? 1 : null,
    justifyContent: "center"
  },
  datePickerInputField: {
    width: 307,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    height: 37,
    borderRadius: 40
  },
  secondHeaderText: {
    textAlign: "center",
    fontFamily: fonts.medium,
    fontSize: 19,
    color: colors.white,
    lineHeight: 24
  }
} );
