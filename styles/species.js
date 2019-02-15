import { Dimensions, StyleSheet } from "react-native";
import {
  colors,
  fonts,
  fontSize,
  margins,
  padding
} from "./global";

const { width } = Dimensions.get( "screen" );

export default StyleSheet.create( {
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  photoContainer: {
    height: 250,
    backgroundColor: colors.seekForestGreen
  },
  image: {
    width,
    height: 250
  },
  backButton: {
    zIndex: 1,
    position: "absolute",
    marginLeft: 20,
    marginTop: 40
  },
  photoOverlay: {
    zIndex: 1,
    position: "absolute",
    right: 20,
    bottom: 20
  },
  ccButton: {
    backgroundColor: colors.black,
    opacity: 1,
    paddingRight: padding.medium,
    paddingLeft: padding.medium,
    paddingTop: padding.medium,
    paddingBottom: padding.medium,
    borderRadius: 40
  },
  greenBanner: {
    backgroundColor: colors.seekForestGreen,
    justifyContent: "center",
    height: 40
  },
  iconicTaxaText: {
    marginLeft: 28,
    color: colors.white,
    fontSize: 19,
    fontFamily: fonts.semibold,
    letterSpacing: 1.12
  },
  textContainer: {
    marginTop: 20,
    marginHorizontal: 28
  },
  commonNameText: {
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.3,
    color: colors.black,
    fontFamily: fonts.book
  },
  scientificNameText: {
    marginTop: 10,
    fontFamily: fonts.bookItalic,
    color: colors.black,
    fontSize: 19,
    lineHeight: 21
  },
  headerText: {
    marginTop: 30,
    marginBottom: 12,
    fontSize: 19,
    fontFamily: fonts.semibold,
    color: colors.seekForestGreen,
    letterSpacing: 1.12
  },
  text: {
    color: colors.black,
    fontFamily: fonts.book,
    fontSize: 16,
    lineHeight: 21
  },
  ccButtonText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.text,
    color: colors.white
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: margins.medium
  },
  map: {
    width: width - 30,
    height: width / 2,
    borderRadius: 5
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: margins.large,
    marginBottom: margins.medium
  },
  smallImage: {
    width: 56,
    height: 43,
    marginRight: margins.mediumLarge
  },
  footer: {
    height: 72,
    justifyContent: "center"
  },
  stats: {
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  secondHeaderText: {
    textAlign: "center",
    marginHorizontal: 23,
    fontSize: 18,
    fontFamily: fonts.default,
    color: colors.black,
    lineHeight: 24,
    letterSpacing: 1.0
  },
  number: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 22,
    fontFamily: fonts.light,
    color: colors.black
  }
} );
