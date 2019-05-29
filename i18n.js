import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";

import en from "./translations/en.json";
import fr from "./translations/fr.json";
import de from "./translations/de.json";
import es from "./translations/es.json";
import hi from "./translations/hi.json";
import nl from "./translations/nl.json";
import zh from "./translations/zh.json";
import pt from "./translations/pt.json";
import ptBR from "./translations/pt-BR.json";

i18n.translations = {
  en,
  fr,
  de,
  es,
  hi,
  nl,
  zh,
  pt,
  ptBR
};
i18n.fallbacks = true;

const fallback = { languageTag: "en", isRTL: false };
const languages = Object.keys( i18n.translations );
const { languageTag } = RNLocalize.findBestAvailableLanguage( languages ) || fallback;

i18n.locale = languageTag;

export default i18n;
