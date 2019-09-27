import { StyleSheet, Platform } from "react-native";
import { colors, fonts, touchable } from "./global";

export default StyleSheet.create( {
  container: {
    height: 55,
    backgroundColor: colors.seekForestGreen
  },
  text: {
    top: Platform.OS === "android" ? -4 : null,
    alignSelf: "center",
    fontSize: 18,
    color: colors.white,
    letterSpacing: 1.0,
    fontFamily: fonts.semibold
  },
  help: {
    alignSelf: "flex-end",
    top: -32,
    right: 21
  },
  touchable
} );
