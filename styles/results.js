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
  container: {
    flex: 1
  },
  header: {
    width: 100
  },
  headerText: {
    fontSize: fontSize.header,
    lineHeight: 18,
    color: colors.white,
    fontFamily: fonts.default
  },
  text: {
    fontSize: fontSize.text,
    lineHeight: 14,
    color: colors.white,
    fontFamily: fonts.default,
    flexWrap: "wrap"
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
  }
} );
