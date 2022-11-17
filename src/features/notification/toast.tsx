import React, { FunctionComponent, memo } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'app/store';
import { clearNotifications } from 'features/notification/slice';
import { Notification, NotificationType } from 'features/notification/types';

interface IProps {};

const Toast: FunctionComponent<IProps> = (props: IProps) => {
    const dispatch = useDispatch();
    const notifications = useSelector<RootState, Notification[]>((state) => state.notifications);

    return (
        <div className="fixed left-1/2 w-full -translate-x-1/2 z-50">
            <div className="flex flex-col gap-1" onClick={() => dispatch(clearNotifications())}>
                {notifications.map(notification => {
                    return (
                        <div key={notification.id} className={classNames("px-4 py-2 mx-auto rounded-full text-white text-sm", NotificationType.toBackgroundColor(notification.type))}> 
                            {notification.detail}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(Toast);