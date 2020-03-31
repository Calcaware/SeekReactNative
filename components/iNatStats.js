// @flow

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform
} from "react-native";
import { NavigationEvents } from "@react-navigation/compat";
import inatjs from "inaturalistjs";

import styles from "../styles/iNatStats";
import i18n from "../i18n";
import icons from "../assets/icons";
import backgrounds from "../assets/backgrounds";
import logos from "../assets/logos";
import Padding from "./UIComponents/Padding";
import {
  capitalizeNames,
  shuffleList,
  localizeNumber
} from "../utility/helpers";
import { localizeAttributions } from "../utility/photoHelpers";
import LoadingWheel from "./UIComponents/LoadingWheel";
import LoginCard from "./UIComponents/LoginCard";
import BackArrow from "./UIComponents/Buttons/BackArrow";
import GreenText from "./UIComponents/GreenText";
import { getiNatStats } from "../utility/iNatStatsHelpers";
import createUserAgent from "../utility/userAgent";
import HorizontalScroll from "./UIComponents/HorizontalScroll";

type Props = {}

type State = {
  observations: number,
  observers: number,
  photos: Array<Object>
};

class iNatStatsScreen extends Component<Props, State> {
  scrollView: ?any

  constructor() {
    super();

    this.state = {
      observations: localizeNumber( 25000000 ),
      observers: localizeNumber( 700000 ),
      photos: []
    };
  }

  scrollToTop() {
    if ( this.scrollView ) {
      this.scrollView.scrollTo( {
        x: 0, y: 0, animated: Platform.OS === "android"
      } );
    }
  }

  fetchProjectPhotos() {
    const params = {
      project_id: 29905,
      photos: true,
      quality_grade: "research",
      lrank: "species",
      hrank: "species",
      locale: i18n.currentLocale()
    };

    const options = { user_agent: createUserAgent() };

    inatjs.observations.search( params, options ).then( ( { results } ) => {
      const taxa = results.map( ( r ) => r.taxon );
      const photos = [];

      taxa.forEach( ( photo ) => {
        const { defaultPhoto } = photo;

        if ( defaultPhoto.license_code ) {
          if ( defaultPhoto.original_dimensions.width > defaultPhoto.original_dimensions.height ) {
            photos.push( {
              photoUrl: defaultPhoto.medium_url,
              commonName: photo.preferred_common_name
                ? capitalizeNames( photo.preferred_common_name )
                : capitalizeNames( photo.iconic_taxon_name ),
              attribution: localizeAttributions(
                defaultPhoto.attribution,
                defaultPhoto.license_code,
                "iNatStats"
              )
            } );
          }
        }
      } );

      this.setState( {
        photos: shuffleList( photos )
      } );
    } ).catch( ( error ) => {
      console.log( error, "couldn't fetch project photos" );
    } );
  }

  async fetchiNatStats() {
    const { observations, observers } = await getiNatStats();

    this.setState( {
      observations: localizeNumber( observations ),
      observers: localizeNumber( observers )
    } );
  }

  render() {
    const {
      observations,
      observers,
      photos
    } = this.state;

    const photoList = [];

    photos.forEach( ( photo, i ) => {
      if ( i <= 8 ) {
        const image = (
          <View
            key={`image${photo.photoUrl}`}
            style={styles.center}
          >
            <Image
              source={{ uri: photo.photoUrl }}
              style={styles.image}
            />
            <Text style={[styles.missionText, styles.caption]}>
              {photo.commonName}
              {" "}
              {i18n.t( "inat_stats.by" )}
              {" "}
              {photo.attribution}
            </Text>
          </View>
        );
        photoList.push( image );
      }
    } );

    return (
      <SafeAreaView style={styles.safeView}>
        <ScrollView
          contentContainerStyle={styles.background}
          ref={( ref ) => { this.scrollView = ref; }}
        >
          <NavigationEvents
            onWillFocus={() => {
              this.fetchiNatStats();
              this.scrollToTop();
              this.fetchProjectPhotos();
            }}
          />
          <StatusBar barStyle="dark-content" />
          <BackArrow green />
          <View style={styles.logoContainer}>
            <Image source={logos.wordmark} style={styles.logo} />
          </View>
          <View style={styles.headerMargin} />
          <Image source={backgrounds.heatMap} style={styles.heatMap} />
          <View style={styles.missionContainer}>
            <GreenText smaller text="inat_stats.global_observations" />
            <Image source={logos.bird} style={styles.bird} />
            <Text style={styles.numberText}>
              {observations}
              {"+"}
            </Text>
            <GreenText smaller text="inat_stats.naturalists_worldwide" />
            <Text style={styles.numberText}>
              {observers}
              {"+"}
            </Text>
            <Image
              source={icons.iNatExplanation}
              style={styles.explainImage}
            />
            <Text style={styles.missionHeaderText}>
              {i18n.t( "inat_stats.seek_data" )}
            </Text>
            <Text style={styles.missionText}>
              {i18n.t( "inat_stats.about_inat" )}
            </Text>
          </View>
          {photoList.length === 0 ? (
            <View style={[styles.center, styles.photoContainer]}>
              <LoadingWheel color="black" />
            </View>
          ) : <HorizontalScroll photoList={photoList} screen="iNatStats" />}
          <LoginCard screen="iNatStats" />
          <Padding />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default iNatStatsScreen;
