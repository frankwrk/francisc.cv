'use client';

import { useNotification } from '@/hooks/use-notification';

import * as Notification from '@/components/ui/notification';

const NotificationProvider = () => {
  const { notifications } = useNotification();

  return (
    <Notification.Provider data-oid='3__9r46'>
      {notifications.map(({ id, ...rest }) => {
        return <Notification.Root key={id} {...rest} data-oid='t5bqv:x' />;
      })}
      <Notification.Viewport data-oid='g_lqlvn' />
    </Notification.Provider>
  );
};

export { NotificationProvider };
