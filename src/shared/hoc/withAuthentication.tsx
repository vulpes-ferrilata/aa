import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { RootState } from 'app/store';

function withAuthentication(WrappedComponent: React.ComponentType<any>) {
    return function() {
        const isLoggedIn = useSelector<RootState, boolean>(state => !!state.auth.accessToken);
        
        if (!isLoggedIn) {
            return <Navigate to={"/login"} replace={true}/>
        }
    
        return <WrappedComponent/>;
    }
}

export default withAuthentication;