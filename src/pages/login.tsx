import React, { FunctionComponent } from 'react';

import Login from 'features/auth/login';

interface IProps {}

const LoginPage: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <Login/>
    );
}

export default LoginPage;
