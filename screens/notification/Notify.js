import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { handleExpoTokenUsersByCompany } from '../../firebase';
import env from '../../env'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function Notify() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState([]);
    const [notification, setNotification] = useState(
        undefined
    );

    const notificationListener = useRef();
    const responseListener = useRef();

    const registerForPushNotificationsAsync = async () => {

        let token;
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            setTimeout(async () => {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;


                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    Alert.alert('Notificaciones', 'Error obteniendo permisos de notificaciones!', [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },

                    ]);

                    return;
                }

                try {
                    const projectId =
                        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

                    if (!projectId) {
                        throw new Error('Project ID not found');
                    }
                    token = (
                        await Notifications.getExpoPushTokenAsync({
                            projectId,
                        })
                    ).data;

                    if (token) {
                        setExpoPushToken(token)

                        const saveExpoToken = async () => {
                            try {
                                await AsyncStorage.setItem('@expoToken', token)
                            } catch (e) {
                                console.log('error setting expotoken on localstorage', e)
                            }
                        }
                        saveExpoToken()
                    }

                } catch (e) {
                    token = `${e}`;
                }
            }, 5000)

        } else {
            console.log('Must use physical device for Push Notifications');
        }

        return token;
    }

    useEffect(() => {
        if (expoPushToken && expoPushToken.indexOf('ExponentPushToken[') == 0) {
            handleExpoTokenUsersByCompany(expoPushToken, env.COMPANY_ID)
        }
    }, [expoPushToken])

    useEffect(() => {

        registerForPushNotificationsAsync();

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };



    }, []);

    return (
        < >
        </>
    );
}


