import { StyleSheet } from "react-native";

import { fonts, colors } from "../global";

export default StyleSheet.create( {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 294,
    height: 105,
    resizeMode: "contain",
    marginBottom: 50
  },
  headerText: {
    marginTop: 50,
    marginHorizontal: 70,
    textAlign: "center",
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 26,
    lineHeight: 30
  },
  textContainer: {
    marginTop: 50,
    marginHorizontal: 35
  },
  text: {
    textAlign: "center",
    fontFamily: fonts.default,
    fontSize: 17,
    color: colors.white
  },
  leftTextContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "flex-start",
    marginLeft: 27,
    marginTop: 10,
    marginBottom: 10
  },
  leftText: {
    fontFamily: fonts.default,
    fontSize: 17,
    color: colors.white
  },
  rightTextContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "flex-end",
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10
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
    color: colors.white,
    textDecorationLine: "underline"
  },
  darkText: {
    color: colors.black,
    fontSize: 20,
    textAlign: "center"
  },
  datePickerContainer: {
    justifyContent: "center"
  },
  inputField: {
    width: 307,
    backgroundColor: colors.white,
    height: 37,
    borderRadius: 40,
    paddingLeft: 15
  },
  greenButton: {
    marginBottom: 25,
    backgroundColor: colors.seekiNatGreen,
    width: 274,
    height: 52,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  buttonText: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    color: colors.white
  }
} );
