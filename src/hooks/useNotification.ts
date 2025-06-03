import { useRef, useState, useCallback } from 'react';
import { NotificationElement } from '../base-components/Notification';
import { INotification } from '../components/Notification';

export const useNotification = () => {
    const notificationRef = useRef<NotificationElement | undefined>(undefined);
    const [notification, setNotification] = useState<INotification | undefined>();

    const showNotification = useCallback(() => {
        if (notificationRef.current) {
            notificationRef.current.showToast();
        }
    }, []);

    const displayNotification = useCallback((notification: INotification) => {
        setNotification(notification);
        setTimeout(() => {
            showNotification();
        }, 100);
    }, [showNotification]);

    return {
        notificationRef,
        notification,
        displayNotification
    };
}; 