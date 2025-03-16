import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from 'expo-notifications'
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
    const [expoPushToken, setExpoPushToken] = useState<ExpoPushToken | string>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );

    const { profile } = useAuth();

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    const savePushToken = async (newToken: string | undefined) => {
        setExpoPushToken(newToken);

        if (!newToken || !profile) {
            return;
        }

        // update the token in the database
        await supabase.from('profiles').update({expo_push_token: newToken}).eq('id', profile.id);
    }
    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => savePushToken(token))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
            });

            return () => {
                if (notificationListener.current) {
                    Notifications.removeNotificationSubscription(
                        notificationListener.current
                    );
                }
                if (responseListener.current) {
                    Notifications.removeNotificationSubscription(responseListener.current);
                }
            };
        });
    }, [])
    return <>{children}</>

}

export default NotificationProvider;