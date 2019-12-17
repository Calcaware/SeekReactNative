import { StyleSheet } from "react-native";
import { colors, fonts } from "../global";

export default StyleSheet.create( {
  back: {
    position: "absolute",
    right: 23,
    top: 18
  },
  bottom: {
    backgroundColor: colors.seekForestGreen,
    height: 60
  },
  header: {
    backgroundColor: colors.seekForestGreen,
    height: 55
  },
  text: {
    alignSelf: "center",
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: 1.0,
    top: 19
  }
} );
