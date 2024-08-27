import env from '../env';
import ExpoConstants from 'expo-constants';
import { Platform } from 'react-native';

class Constants {
    static domain = env.URL;
    static url = env.API_URL;
    static version = ExpoConstants.versionCode;
    static getStoreUrl() {
        if (Platform.OS === 'ios') {
            return 'https://apps.apple.com';
        } else {
            return 'https://play.google.com';
        }
    }
}

export default Constants;
