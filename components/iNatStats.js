// @flow

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  FlatList
} from "react-native";
import { NavigationEvents } from "react-navigation";
import inatjs from "inaturalistjs";

import styles from "../styles/iNatStats";
import i18n from "../i18n";
import icons from "../assets/icons";
import backgrounds from "../assets/backgrounds";
import logos from "../assets/logos";
import Padding from "./UIComponents/Padding";
import { capitalizeNames, shuffleList } from "../utility/helpers";
import LoadingWheel from "./UIComponents/LoadingWheel";
import LoginCard from "./UIComponents/LoginCard";
import BackArrow from "./UIComponents/BackArrow";
import GreenText from "./UIComponents/GreenText";
import { getiNatStats } from "../utility/iNatStatsHelpers";
import { dimensions } from "../styles/global";

type Props = {
  +navigation: any
}

class iNatStatsScreen extends Component<Props> {
  constructor() {
    super();

    this.state = {
      observations: i18n.toNumber( 25000000, { precision: 0 } ),
      observers: i18n.toNumber( 700000, { precision: 0 } ),
      photos: []
    };
  }

  seti18nNumber( number ) {
    return i18n.toNumber( number, { precision: 0 } );
  }

  async fetchiNatStats() {
    const { observations, observers } = await getiNatStats();

    this.setState( {
      observations: this.seti18nNumber( observations ),
      observers: this.seti18nNumber( observers )
    } );
  }

  scrollToTop() {
    this.scrollView.scrollTo( {
      x: 0, y: 0, animated: Platform.OS === "android"
    } );
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

    inatjs.observations.search( params ).then( ( { results } ) => {
      const taxa = results.map( r => r.taxon );
      const photos = [];

      taxa.forEach( ( photo ) => {
        const { defaultPhoto } = photo;
        if ( defaultPhoto.license_code && defaultPhoto.license_code !== "cc0" ) {
          if ( defaultPhoto.original_dimensions.width > defaultPhoto.original_dimensions.height ) {
            photos.push( {
              photoUrl: defaultPhoto.medium_url,
              commonName: photo.preferred_common_name
                ? capitalizeNames( photo.preferred_common_name )
                : capitalizeNames( photo.iconic_taxon_name ),
              attribution: defaultPhoto.attribution
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

  render() {
    const {
      observations,
      observers,
      photos
    } = this.state;
    const { navigation } = this.props;

    const photoList = [];

    photos.forEach( ( photo, i ) => {
      if ( i <= 8 ) {
        const image = (
          <View
            key={`image${photo.photoUrl}${i}`}
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
          <BackArrow green navigation={navigation} />
          <View style={styles.logoContainer}>
            <Image source={logos.wordmark} style={styles.logo} />
          </View>
          <View style={styles.headerMargin} />
          <Image source={backgrounds.heatMap} style={styles.heatMap} />
          <View style={styles.missionContainer}>
            <GreenText smaller text={i18n.t( "inat_stats.global_observations" ).toLocaleUpperCase()} />
            <Image source={logos.bird} style={styles.iNatLogo} />
            <Text style={styles.numberText}>
              {observations}
              {"+"}
            </Text>
            <GreenText smaller text={i18n.t( "inat_stats.naturalists_worldwide" ).toLocaleUpperCase()} />
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
          ) : (
            <View>
              <FlatList
                bounces={false}
                contentContainerStyle={styles.photoContainer}
                data={photoList}
                getItemLayout={( data, index ) => (
                  // skips measurement of dynamic content for faster loading
                  {
                    length: ( dimensions.width ),
                    offset: ( dimensions.width ) * index,
                    index
                  }
                )}
                horizontal
                indicatorStyle="white"
                initialNumToRender={1}
                pagingEnabled
                renderItem={( { item } ) => item}
                showsHorizontalScrollIndicator
              />
              <Image source={icons.swipeLeft} style={styles.leftArrow} />
              <Image source={icons.swipeRight} style={styles.rightArrow} />
            </View>
          )}
          <LoginCard navigation={navigation} />
          <Padding />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default iNatStatsScreen;
