import React, { memo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'app/store';
import { Notification, clearNotifications, NotificationType } from './slice';

interface IProps {};

function NotificationList(props: IProps) {
    const dispatch = useDispatch();
    const notifications = useSelector<RootState, Notification[]>((state) => state.notifications);

    return (
        <div className="flex flex-col gap-1 w-full h-full" onClick={() => dispatch(clearNotifications())}>
            {notifications.map(notification => {
                const backgroundColor = ((notificationType: NotificationType) => {
                    switch (notificationType) {
                        case NotificationType.Info:
                            return "bg-blue-600";
                        case NotificationType.Success:
                            return "bg-green-600";
                        case NotificationType.Warning:
                            return "bg-yellow-600";
                        case NotificationType.Error:
                            return "bg-red-600";
                    };
                })(notification.type);                

                return (
                    <div key={notification.id} className={classNames("p-2 shadow-lg rounded-full text-sm", backgroundColor)}> 
                        <p className="text-white">{notification.detail}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default memo(NotificationList);