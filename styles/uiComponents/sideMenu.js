import {
  StyleSheet,
  Dimensions,
  PixelRatio
} from "react-native";

import {
  colors,
  fonts,
  padding,
  row
} from "../global";

const { width, height } = Dimensions.get( "window" );
const fontScale = PixelRatio.getFontScale();

export default StyleSheet.create( {
  container: {
    backgroundColor: colors.seekForestGreen,
    flex: 1,
    justifyContent: "space-between"
  },
  divider: {
    backgroundColor: colors.dividerWhite,
    height: 1
  },
  height: {
    height: height / 11,
    justifyContent: "flex-start"
  },
  image: {
    height: 25,
    marginHorizontal: 25,
    resizeMode: "contain",
    width: 27
  },
  logo: {
    alignSelf: "center",
    height: 79,
    marginTop: 25,
    resizeMode: "contain",
    width: ( width / 2 ) * 1.5
  },
  row,
  text: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: ( fontScale > 1 ) ? 15 : 18,
    letterSpacing: 1.0,
    // maxWidth: Platform.OS === "ios" ? width / 2 + 50 : 150,
    paddingTop: padding.iOSPadding
  },
  textContainer: {
    marginBottom: ( height / 11 ) * 1.5,
    width: width / 2 + 30
  }
} );
