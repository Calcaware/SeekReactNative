// @flow

import React from "react";
import { Text } from "react-native";

import styles from "../../styles/uiComponents/greenText";

type Props = {
  +text: string,
  +smaller: ?boolean,
  +center: ?boolean
}

const GreenText = ( { smaller, text, center }: Props ) => (
  <Text style={[
    styles.greenHeaderText,
    smaller && styles.smallerText,
    center && styles.center
  ]}
  >
    {text}
  </Text>
);

export default GreenText;