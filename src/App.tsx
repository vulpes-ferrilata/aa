import React, { useEffect, lazy, Suspense, FunctionComponent } from 'react';
import { Navigate, useRoutes,  } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { connectWebsocket } from 'features/websocket/actions';
import Loading from 'shared/components/loading';
import Layout from 'shared/components/layout';

const Toast = lazy(() => import('features/notification/toast'));
const Menu = lazy(() => import('shared/components/menu'));
const LoginPage = lazy(() => import('pages/login'));
const RegisterPage = lazy(() => import('pages/register'));
const LobbyPage = lazy(() => import('pages/catan/lobby'));
const GamePage = lazy(() => import('pages/catan/game'));

interface IProps {}

const App: FunctionComponent<IProps> = (props: IProps) => {
    const dispatch = useDispatch();

    const routes = useRoutes([
            {
                path: "/",
                element: <Navigate to={"/catan/games"} replace={true}/>,
            },
            {
                path:"/login", 
                element: <LoginPage/>,
            },
            {
                path: "/register", 
                element: <RegisterPage/>,
            },
            {
                path: "/catan/games",
                element: <LobbyPage/>,
            },
            {
                path: "/catan/games/:id",
                element: <GamePage/>,
            }
    ]);

    useEffect(() => {
        dispatch(connectWebsocket());
    }, [dispatch]);
    
    return (
        <Layout>
            <Suspense fallback={<Loading/>}>
                <Toast/>
                    <Menu>
                        {routes}
                    </Menu>
            </Suspense>
        </Layout>
    );
}

export default App;
