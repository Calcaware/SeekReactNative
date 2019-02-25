import { Dimensions, StyleSheet } from "react-native";
import {
  colors,
  fonts
} from "../global";

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
    marginTop: 35,
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
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center"
  },
  checkmark: {
    marginRight: 10
  },
  greenButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  greenButton: {
    flexDirection: "row",
    backgroundColor: colors.seekiNatGreen,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 4,
    marginRight: 10,
    marginBottom: 7,
    alignSelf: "flex-start"
  },
  greenButtonText: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.white,
    letterSpacing: 1.0
  },
  taxonomyHeader: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
    lineHeight: 21
  },
  taxonomyText: {
    maxWidth: 200,
    fontSize: 16,
    fontFamily: fonts.book,
    color: colors.black,
    lineHeight: 21
  },
  taxonomyRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center"
  },
  bullets: {
    color: colors.seekiNatGreen,
    fontSize: 38,
    marginRight: 16
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainer: {
    marginTop: 15,
    height: 109,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#102b1f"
  },
  errorRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between"
  },
  errorText: {
    textAlign: "center",
    color: colors.white,
    maxWidth: 245,
    fontFamily: fonts.book,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 12
  },
  safeViewTop: {
    flex: 0,
    backgroundColor: colors.seekForestGreen
  },
  safeView: {
    flex: 1,
    backgroundColor: "transparent"
  }
} );
