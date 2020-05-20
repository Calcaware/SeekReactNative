// @flow

import React, { Component } from "react";
import {
  ScrollView,
  Platform
} from "react-native";
import { NavigationEvents } from "@react-navigation/compat";
import inatjs from "inaturalistjs";
import Realm from "realm";

import i18n from "../../i18n";
import { fetchTruncatedUserLocation } from "../../utility/locationHelpers";
import { checkLocationPermissions } from "../../utility/androidHelpers.android";
import realmConfig from "../../models/index";
import styles from "../../styles/species/species";
import SpeciesError from "./SpeciesError";
import Spacer from "../UIComponents/TopSpacer";
import SafeAreaView from "../UIComponents/SafeAreaView";
import {
  getSpeciesId,
  getRoute,
  checkForInternet,
  getTaxonCommonName
} from "../../utility/helpers";
import NoInternetError from "./OnlineOnlyCards/NoInternetError";
import createUserAgent from "../../utility/userAgent";
import { formatShortMonthDayYear } from "../../utility/dateHelpers";
import SpeciesHeader from "./SpeciesHeader";

const latitudeDelta = 0.2;
const longitudeDelta = 0.2;

type Props = {};

type State = {
  id: ?number,
  photos: Array<Object>,
  taxon: Object,
  about: ?string,
  seenDate: ?string,
  timesSeen: ?number,
  region: Object,
  error: ?string,
  seenTaxa: ?Object,
  stats: Object,
  ancestors: Array<Object>,
  routeName: ?string,
  wikiUrl: ?string
};

class SpeciesDetail extends Component<Props, State> {
  scrollView: ?any

  constructor() {
    super();

    this.state = {
      id: null,
      photos: [],
      taxon: {
        commonName: null,
        scientificName: null,
        iconicTaxonId: null
      },
      about: null,
      seenDate: null,
      timesSeen: null,
      region: {},
      error: null,
      seenTaxa: null,
      stats: {},
      ancestors: [],
      routeName: null,
      wikiUrl: null
    };

    ( this:any ).fetchiNatData = this.fetchiNatData.bind( this );
    ( this:any ).updateScreen = this.updateScreen.bind( this );
  }

  setError( newError: ?string ) {
    const { error } = this.state;

    if ( error !== newError ) {
      this.setState( { error: newError } );
    }
  }

  setRegion( latitude: number, longitude: number, id: number ) {
    this.checkIfSpeciesIsNative( latitude, longitude, id );
    this.setState( {
      region: {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      }
    } );
  }

  setTaxonStats( stats: Object ) {
    // this is causing a second render because it's being set in two places
    this.setState( { stats } );
  }

  async setupScreen() {
    const id = await getSpeciesId();

    this.checkIfSpeciesSeen( id );
    this.fetchTaxonDetails( id );

    const routeName = await getRoute();

    console.log( routeName, "route name" );

    this.setState( { id, routeName } );
  }

  setSeenTaxa( seenTaxa: Object, id: number ) {
    const { taxon, latitude, longitude } = seenTaxa;
    const seenDate = seenTaxa ? formatShortMonthDayYear( seenTaxa.date ) : null;

    if ( latitude && longitude ) {
      this.checkIfSpeciesIsNative( latitude, longitude, id );
    }

    getTaxonCommonName( id ).then( ( deviceCommonName ) => {
      this.setState( {
        seenTaxa,
        taxon: {
          commonName: deviceCommonName,
          scientificName: taxon.name,
          iconicTaxonId: taxon.iconicTaxonId
        },
        seenDate,
        region: {
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta
        }
      } );
    } ).catch( () => console.log( "couldn't fetch device common name" ) );
  }

  setUserLocation( id: number ) {
    fetchTruncatedUserLocation().then( ( coords ) => {
      const { latitude, longitude } = coords;

      this.setRegion( latitude, longitude, id );
    } ).catch( () => this.setError( "location" ) );
  }

  fetchUserLocation( id: number ) {
    if ( Platform.OS === "android" ) {
      checkLocationPermissions().then( ( granted ) => {
        if ( granted ) {
          this.setUserLocation( id );
        }
      } );
    } else {
      this.setUserLocation( id );
    }
  }

  updateScreen() {
    this.fetchiNatData();
  }

  resetState() {
    this.setState( {
      photos: [],
      taxon: {
        commonName: null,
        scientificName: null,
        iconicTaxonId: null
      },
      about: null,
      seenDate: null,
      timesSeen: null,
      region: {},
      error: null,
      seenTaxa: null,
      stats: {},
      ancestors: [],
      routeName: null,
      wikiUrl: null
    } );
  }

  checkIfSpeciesSeen( id: number ) {
    Realm.open( realmConfig ).then( ( realm ) => {
      const observations = realm.objects( "ObservationRealm" );
      const seenTaxa = observations.filtered( `taxon.id == ${id}` )[0];

      if ( seenTaxa ) {
        this.setSeenTaxa( seenTaxa, id );
      } else {
        this.fetchUserLocation( id );
      }
    } ).catch( () => {
      // console.log( "[DEBUG] Failed to open realm, error: ", err );
    } );
  }

  fetchTaxonDetails( id: number ) {
    const { stats } = this.state;

    const params = { locale: i18n.currentLocale() };
    const options = { user_agent: createUserAgent() };

    inatjs.taxa.fetch( id, params, options ).then( ( response ) => {
      const taxa = response.results[0];
      const commonName = taxa.preferred_common_name;
      const scientificName = taxa.name;
      const conservationStatus = taxa.taxon_photos[0].taxon.conservation_status;
      const ancestors = [];
      const ranks = ["kingdom", "phylum", "class", "order", "family", "genus"];
      taxa.ancestors.forEach( ( ancestor ) => {
        if ( ranks.includes( ancestor.rank ) ) {
          ancestors.push( ancestor );
        }
      } );

      ancestors.push( {
        rank: "species",
        name: scientificName || null,
        preferred_common_name: commonName || null
      } );

      stats.endangered = ( conservationStatus && conservationStatus.status_name === "endangered" ) || false;

      getTaxonCommonName( id ).then( ( deviceCommonName ) => {
        this.setState( {
          taxon: {
            commonName: deviceCommonName || commonName,
            scientificName,
            iconicTaxonId: taxa.iconic_taxon_id
          },
          photos: taxa.taxon_photos.map( ( p ) => p.photo ),
          wikiUrl: taxa.wikipedia_url,
          about: taxa.wikipedia_summary
            ? i18n.t( "species_detail.wikipedia", {
              about: taxa.wikipedia_summary.replace( /<[^>]+>/g, "" ).replace( "&amp", "&" )
            } )
            : null,
          timesSeen: taxa.observations_count,
          ancestors,
          stats
        } );
      } );
    } ).catch( ( e ) => console.log( "couldn't fetch common name from device", e ) );
  }

  checkIfSpeciesIsNative( latitude: number, longitude: number, id: number ) {
    const { stats } = this.state;

    const params = {
      per_page: 1,
      lat: latitude,
      lng: longitude,
      radius: 50,
      taxon_id: id
    };

    const options = { user_agent: createUserAgent() };

    inatjs.observations.search( params, options ).then( ( { results } ) => {
      if ( results.length > 0 ) {
        const { taxon } = results[0];
        if ( taxon ) {
          stats.threatened = taxon.threatened;
          stats.endemic = taxon.endemic;
          stats.introduced = taxon.introduced;
          stats.native = taxon.native;
          this.setTaxonStats( stats );
        }
      }
    } ).catch( ( err ) => {
      console.log( err, "err fetching native threatened etc" );
    } );
  }

  scrollToTop() {
    if ( this.scrollView ) {
      this.scrollView.scrollTo( {
        x: 0, y: 0, animated: Platform.OS === "android"
      } );
    }
  }

  fetchiNatData( screen: ?string ) {
    this.setupScreen();
    this.checkInternetConnection();
    if ( screen === "similarSpecies" ) {
      this.resetState();
    }

    if ( Platform.OS === "android" ) {
      setTimeout( () => this.scrollToTop(), 1 );
      // hacky but this fixes scroll not getting to top of screen
    } else {
      this.scrollToTop();
    }
  }

  checkInternetConnection() {
    checkForInternet().then( ( internet ) => {
      if ( internet === "none" || internet === "unknown" ) {
        this.setError( "internet" );
      } else {
        this.setError( null );
      }
    } );
  }

  render() {
    const {
      about,
      taxon,
      id,
      photos,
      region,
      seenDate,
      timesSeen,
      error,
      seenTaxa,
      ancestors,
      stats,
      routeName,
      wikiUrl
    } = this.state;

    const { commonName } = taxon;

    return (
      <>
        <SafeAreaView />
        <NavigationEvents
          onWillBlur={() => this.resetState()}
          onWillFocus={() => this.fetchiNatData()}
        />
        <ScrollView
          ref={( ref ) => { this.scrollView = ref; }}
          contentContainerStyle={[styles.footerMargin, styles.background]}
        >
          <Spacer />
          <SpeciesHeader
            taxon={taxon}
            seenTaxa={seenTaxa}
            photos={photos}
            routeName={routeName}
          />
          {error === "internet" ? (
            <SpeciesError
              seenDate={seenDate}
              updateScreen={this.updateScreen}
            />
          ) : (
            <NoInternetError
              about={about}
              ancestors={ancestors}
              commonName={commonName}
              error={error}
              fetchiNatData={this.fetchiNatData}
              id={id}
              region={region}
              seenDate={seenDate}
              stats={stats}
              timesSeen={timesSeen}
              wikiUrl={wikiUrl}
            />
          )}
        </ScrollView>
      </>
    );
  }
}

export default SpeciesDetail;
