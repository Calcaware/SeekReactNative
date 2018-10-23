import { Dimensions, StyleSheet } from "react-native";
import {
  colors,
  fonts,
  fontSize,
  margins,
  padding
} from "./global";

const { width, height } = Dimensions.get( "screen" );

export default StyleSheet.create( {
  backgroundImage: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    flex: 2,
    width,
    marginTop: margins.large,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  headerText: {
    fontSize: fontSize.header,
    lineHeight: 18,
    color: colors.white,
    fontFamily: fonts.default,
    marginBottom: margins.medium
  },
  text: {
    fontSize: fontSize.text,
    lineHeight: 14,
    color: colors.white,
    fontFamily: fonts.default,
    flexWrap: "wrap",
    marginBottom: margins.medium
  },
  button: {
    backgroundColor: colors.darkGreen,
    justifyContent: "flex-end",
    marginHorizontal: margins.large,
    marginBottom: margins.small,
    marginTop: margins.small,
    paddingTop: padding.medium,
    paddingBottom: padding.medium,
    borderRadius: 40
  },
  buttonText: {
    fontFamily: fonts.button,
    fontSize: fontSize.button,
    color: colors.white,
    textAlign: "center",
    justifyContent: "center"
  },
  imageBackground: {
    flex: 3,
    backgroundColor: colors.darkDesaturatedBlue,
    width,
    height: height / 3
  },
  imageCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "nowrap"
  },
  textCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "nowrap"
  },
  imageContainer: {
    borderColor: colors.white,
    borderWidth: 1,
    width: width / 3 - 10,
    height: width / 3 - 10
  },
  footer: {
    flex: 2
  }
} );
