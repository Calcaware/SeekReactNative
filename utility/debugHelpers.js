// @flow

import { logger, fileAsyncTransport } from "react-native-logs";
import RNFS from "react-native-fs";
import { dirDebugLogs } from "./dirStorage";

RNFS.readDir( RNFS.DocumentDirectoryPath ).then( ( results => {
  results.forEach( result => {
    if ( result.name === "log.txt" ) {
      // console.log( result.name, "result" );
      RNFS.readFile( `${dirDebugLogs}/log` ).then( fileContent => {
        console.log( fileContent, "content" );
      } );
    }
  } );
} ) );

const config = {
  severity: "debug",
  transport: fileAsyncTransport,
  transportOptions: {
    FS: RNFS,
    filePath: dirDebugLogs,
    fileName: "log.txt"
  }
};

// $FlowFixMe
const LOG = logger.createLogger( config );

export { LOG };
