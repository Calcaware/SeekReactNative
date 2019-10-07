import { StyleSheet } from "react-native";
import {
  colors,
  fonts
} from "./global";

export default StyleSheet.create( {
  card: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
    height: 112,
    justifyContent: "flex-start",
    marginHorizontal: 22
  },
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  divider: {
    backgroundColor: colors.dividerGray,
    height: 1,
    marginHorizontal: 23
  },
  greenDot: {
    backgroundColor: colors.seekiNatGreen,
    borderRadius: 11 / 2,
    height: 11,
    width: 11
  },
  image: {
    height: 72,
    marginRight: 24,
    resizeMode: "contain",
    width: 72
  },
  messageText: {
    fontFamily: fonts.book,
    fontSize: 14,
    lineHeight: 21
  },
  textContainer: {
    width: 214
  },
  titleText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 21,
    marginBottom: 6
  }
} );
