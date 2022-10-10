import React, { useEffect, lazy, Suspense } from 'react';
import {useRoutes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'app/store';
import Loading from 'shared/components/loading';
import { connectWebsocket } from 'app/middlewares/websocketMiddleware';
import withAuthentication from 'shared/hoc/withAuthentication';
import { ColorScheme } from 'features/colorScheme/slice';

const NotificationList = lazy(() => import('features/notification/notificationList'));
const Login = lazy(() => import('features/auth/login'));
const Register = lazy(() => import('features/auth/register'));

const LobbyWithAuthentication = withAuthentication(lazy(() => import('features/catan/lobby')));
const GameWithAuthentication = withAuthentication(lazy(() => import('features/catan/game')));

function App() {
  const dispatch = useDispatch();
  const colorScheme = useSelector<RootState, ColorScheme>(state => state.colorScheme);

  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to={"/lobby"} replace={true}/>,
    },
    {
      path:"/login", 
      element: <Login/>,
    },
    {
      path: "/register", 
      element: <Register/>,
    },
    {
      path: "/lobby",
      element: <LobbyWithAuthentication/>,
    },
    {
      path: "/game/:id",
      element: <GameWithAuthentication/>,
    }
  ]);

  useEffect(() => {
    dispatch(connectWebsocket());
  }, []);
  
  return (    
    <div className={classNames("w-full h-full", {
      "dark": colorScheme === ColorScheme.Dark
    })}>
      <div className="flex w-full h-full dark:bg-black dark:text-white dark:shadow-white/10">
        <Suspense fallback={<Loading/>}>
          <div className="fixed left-1/2 -translate-x-1/2 z-50">
            <NotificationList/>
          </div>
        
          {routes}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
