// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __TIMESTAMP__: string;
declare const __VERSION__: string;
declare const __SERVER_API_URL__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;
export const SERVER_API_URL = __SERVER_API_URL__;
export const TIMESTAMP = __TIMESTAMP__;
