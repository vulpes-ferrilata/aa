import React, { useEffect, lazy, Suspense } from 'react';
import {useRoutes, Navigate } from 'react-router-dom';

import Loading from 'shared/components/loading';
import { useDispatch } from 'react-redux';
import { connectWebsocket } from 'app/middlewares/websocketMiddleware';
import withAuthentication from 'shared/hoc/withAuthentication';

const MessageList = lazy(() => import('features/messages/messageList'));
const Login = lazy(() => import('features/auth/login'));
const Register = lazy(() => import('features/auth/register'));

const Lobby = withAuthentication(lazy(() => import('features/catan/lobby')));
const Game = withAuthentication(lazy(() => import('features/catan/game')));

function App() {
  const dispatch = useDispatch();

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
      element: <Lobby/>,
    },
    {
      path: "/game/:id",
      element: <Game/>,
    }
  ]);

  useEffect(() => {
    dispatch(connectWebsocket());
  }, [])
  
  return (    
    <div className="flex w-full h-full select-none">
      {}
      <Suspense fallback={<Loading/>}>
        <div className="fixed left-1/2 -translate-x-1/2 z-50">
          <MessageList/>
        </div>
      
        {routes}
      </Suspense>
    </div>
  );
}



export default App;
