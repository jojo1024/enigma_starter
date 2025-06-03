import React, { useRef, RefObject, MutableRefObject } from 'react'
import Toastify, { Options } from "toastify-js";
import Notification, { NotificationElement } from '../base-components/Notification';
import Lucide from '../base-components/Lucide';

export interface INotificationProps {
    title: string;
    message: string | undefined;
    notificationRef: MutableRefObject<NotificationElement | undefined>;
    type: ITypeNotification | undefined;
    // successNotificationToggle:()=>void;
}

export interface INotification { type: ITypeNotification, content: string }

export type ITypeNotification = "error" | "warnig" | "success" | "";

// export interface INotificationData {
//     id: number;
//     type: ITypeNotification;
//     message: string;
// }

export const CustomNotification = (props: INotificationProps) => {
    const { message, title, notificationRef, type } = props;

    return (
        <>
            {message && (
                <Notification
                    getRef={(el) => {
                        if (notificationRef) {
                            (notificationRef as any).current = el;
                        }
                    }}
                    className="flex"
                    options={{
                        duration: 3000,
                    }}
                >
                    <Lucide
                        // icon="CheckCircle"
                        icon={type === "error" ? "X" : "CheckCircle"}
                        className={
                            type === "error"
                                ? "text-danger"
                                : type === "warnig"
                                    ? "text-warning"
                                    : "text-success"
                        }
                    />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">{title}</div>
                        <div className="mt-1 text-slate-500">
                            {message}
                        </div>
                    </div>
                </Notification>
            )}
        </>
    );
};

