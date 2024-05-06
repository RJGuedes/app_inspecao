import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.djamba.seyconelapp',
  appName: 'Seyconel',
  bundledWebRuntime: false,
  server: { cleartext: true },
  webDir: '../../dist/apps/app',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
  },
  cordova: {},
};

export default config;
