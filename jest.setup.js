import { NativeModules } from "react-native";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

global.fetch = require( "jest-fetch-mock" );

NativeModules.RNCNetInfo = {
  addListener: jest.fn(),
  removeListeners: jest.fn()
};

jest.mock( "@react-navigation/native", () => ( {
  ...jest.requireActual( "@react-navigation/native" ),
  useNavigation: jest.fn( () => ( {
    addListener: jest.fn(),
    navigate: jest.fn()
  } ) ),
  useFocusEffect: jest.fn()
} ) );

jest.mock( "@react-native-async-storage/async-storage", () => mockAsyncStorage );

jest.mock( "react-native-fs", () => ( {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
} ) );

jest.mock( "react-native-device-info", () => ( {
  getVersion: jest.fn(),
  getDeviceType: jest.fn(),
  getBuildNumber: jest.fn(),
  getSystemName: jest.fn(),
  getSystemVersion: jest.fn()
} ) );

jest.mock( "react-native-geolocation-service", () => ( {
  getCurrentPosition: jest.fn()
} ) );

