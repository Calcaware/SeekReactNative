import { StyleSheet } from "react-native";
import {
  colors,
  fonts
} from "./global";

export default StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  notificationsContainer: {
    flexGrow: 1
  },
  greenContainer: {
    backgroundColor: "#CDE5DA"
  },
  cardContainer: {
    height: 118,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  card: {
    marginHorizontal: 23,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around",
    alignItems: "center"
  },
  imageContainer: {
    marginRight: 20
  },
  image: {
    marginRight: 5
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  titleText: {
    maxWidth: 232,
    fontFamily: fonts.default,
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 21
  },
  messageText: {
    textAlign: "left",
    maxWidth: 232,
    fontFamily: fonts.book,
    fontSize: 14,
    lineHeight: 21
  },
  divider: {
    backgroundColor: colors.dividerGray,
    height: 1,
    marginTop: 10,
    marginHorizontal: 27,
    width: "85%"
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
