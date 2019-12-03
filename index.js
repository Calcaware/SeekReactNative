import "react-native-gesture-handler";

import React from "react";
import { AppRegistry } from "react-native";
import SeekApp from "./components/App";
import { name as appName } from "./app.json";

const App = ( ) => (
  <SeekApp />
);

AppRegistry.registerComponent( appName, () => App );
