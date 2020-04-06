import React from "react";
import {
  Image,
  Text,
  View
} from "react-native";

import i18n from "../../i18n";
import styles from "../../styles/onboarding";
import Swiper from "./Swiper";
import icons from "../../assets/icons";

const OnboardingScreen = () => (
  <Swiper>
    {[1, 2, 3].map( ( item ) => (
      <View key={`${item}`} style={styles.image}>
        <Image source={icons[`onboarding${item}`]} />
        <View style={styles.margin} />
        <Text style={[styles.text, styles.center]}>
          {i18n.t( `onboarding.onboarding_${item}` )}
        </Text>
      </View>
    ) )}
  </Swiper>
);

export default OnboardingScreen;
