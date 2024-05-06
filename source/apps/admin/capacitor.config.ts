import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.djamba.seyconeladmin',
  appName: 'Seyconel Admin',
  bundledWebRuntime: false,

  webDir: '../../dist/apps/admin',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  cordova: {},
};

export default config;
