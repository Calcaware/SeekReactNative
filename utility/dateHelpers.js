import moment from "moment";

import i18n from "../i18n";

const requiresParent = ( birthday ) => {
  const today = moment().format( "YYYY-MM-DD" );
  const thirteen = moment( today ).subtract( 13, "year" ).format( "YYYY-MM-DD" );
  if ( moment( birthday ).isAfter( thirteen ) ) {
    return true;
  }
  return false;
};

const checkIfChallengeAvailable = ( date ) => {
  if ( date <= new Date() ) {
    return true;
  }
  return false;
};

const isWithinPastYear = ( reviewShownDate ) => {
  const today = moment().format( "YYYY-MM-DD" );
  const lastYear = moment( today ).subtract( 1, "year" ).format( "YYYY-MM-DD" );
  if ( moment( reviewShownDate ).isAfter( lastYear ) ) {
    return true;
  }
  return false;
};

const setMonthLocales = () => {
  const monthsShort = [
    i18n.t( "months_short.1" ),
    i18n.t( "months_short.2" ),
    i18n.t( "months_short.3" ),
    i18n.t( "months_short.4" ),
    i18n.t( "months_short.5" ),
    i18n.t( "months_short.6" ),
    i18n.t( "months_short.7" ),
    i18n.t( "months_short.8" ),
    i18n.t( "months_short.9" ),
    i18n.t( "months_short.10" ),
    i18n.t( "months_short.11" ),
    i18n.t( "months_short.12" )
  ];

  moment.updateLocale( i18n.locale, {
    monthsShort
  } );
};

export {
  checkIfChallengeAvailable,
  requiresParent,
  isWithinPastYear,
  setMonthLocales
};
