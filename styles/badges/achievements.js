// @flow

import { StyleSheet } from "react-native";
import {
  colors,
  fonts,
  center,
  row,
  dimensions
} from "../global";

import type { ViewStyleProp, TextStyleProp, ImageStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create( {
  center,
  container: {
    backgroundColor: colors.seekForestGreen,
    flex: 1
  },
  containerWhite: {
    backgroundColor: colors.white
  },
  gridRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  margin: {
    marginTop: 12
  },
  marginLarge: {
    marginTop: 42
  },
  row,
  secondHeaderText: {
    marginHorizontal: 23,
    maxWidth: 150
  },
  header: {
    minHeight: 117 + 25 + 26
  },
  textContainer: {
    marginLeft: 22,
    paddingBottom: 26,
    paddingTop: 25,
    width: 167
  }
} );

const textStyles: { [string]: TextStyleProp } = StyleSheet.create( {
  headerText: {
    color: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 23,
    letterSpacing: 1.0
  },
  lightText: {
    color: colors.white,
    fontFamily: fonts.light,
    fontSize: 18,
    letterSpacing: 0.78,
    marginBottom: 10
  },
  number: {
    color: colors.black,
    fontFamily: fonts.light,
    fontSize: 22,
    marginTop: 10,
    textAlign: "center"
  },
  text: {
    color: colors.white,
    fontFamily: fonts.book,
    fontSize: 16,
    lineHeight: 21,
    marginTop: 7
  }
} );

const imageStyles: { [string]: ImageStyleProp } = StyleSheet.create( {
  badgeIcon: {
    height: dimensions.width / 4,
    resizeMode: "contain",
    width: dimensions.width / 4,
    marginHorizontal: 6
  },
  levelImage: {
    height: 117,
    resizeMode: "contain",
    width: 117
  }
} );

export {
  imageStyles,
  viewStyles,
  textStyles
};
