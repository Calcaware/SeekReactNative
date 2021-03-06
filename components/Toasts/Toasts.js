// @flow
import React, { Component } from "react";
import {
  Animated,
  View,
  Dimensions,
  Platform
} from "react-native";
import type { Node } from "react";

import BadgeToast from "./BadgeToast";
import ChallengeToast from "./ChallengeToast";
import { viewStyles } from "../../styles/toasts/badgeToast";

const { height } = Dimensions.get( "window" );

type Props = {
  +badge: ?Object,
  +challenge: ?Object
}

class Toasts extends Component<Props> {
  animatedBadge: any

  animatedChallenge: any

  constructor() {
    super();

    this.animatedBadge = new Animated.Value( -120 );
    this.animatedChallenge = new Animated.Value( -120 );
  }

  componentDidUpdate( prevProps: Object ) {
    const { badge, challenge } = this.props;
    if ( prevProps.badge !== badge ) {
      this.showToasts();
    }
    if ( prevProps.challenge !== challenge ) {
      this.showToasts();
    }
  }

  showToasts() {
    const { badge, challenge } = this.props;

    const entranceSpeed = 700;
    const exitSpeed = 1000;
    const displayTime = 3000;

    const entrance = {
      toValue: 0,
      duration: entranceSpeed,
      useNativeDriver: true
    };

    const exit = {
      toValue: height > 570 ? -170 : -120,
      delay: displayTime,
      duration: exitSpeed,
      useNativeDriver: true
    };

    const badgeToast = [
      Animated.timing( this.animatedBadge, entrance ),
      Animated.timing( this.animatedBadge, exit )];

    const challengeToast = [
      Animated.timing( this.animatedChallenge, entrance ),
      Animated.timing( this.animatedChallenge, exit )
    ];

    if ( challenge && !badge ) {
      Animated.sequence( [
        challengeToast[0],
        challengeToast[1]
      ] ).start();
    } else {
      Animated.sequence( [
        badgeToast[0],
        badgeToast[1],
        challengeToast[0],
        challengeToast[1]
      ] ).start();
    }
  }

  render(): Node {
    const { badge, challenge } = this.props;

    return (
      <View style={Platform.OS === "ios" ? viewStyles.topContainer : null}>
        {badge && (
          <Animated.View style={[
            viewStyles.animatedStyle, {
              transform: [{ translateY: this.animatedBadge }]
            }
          ]}
          >
            <BadgeToast badge={badge} />
          </Animated.View>
        )}
        {challenge && (
          <Animated.View style={[
            viewStyles.animatedStyle, {
              transform: [{ translateY: this.animatedChallenge }]
            }
          ]}
          >
            <ChallengeToast challenge={challenge} />
          </Animated.View>
        )}
      </View>
    );
  }
}

export default Toasts;
