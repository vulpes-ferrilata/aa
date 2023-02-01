import React, { FunctionComponent } from 'react';

import Register from 'features/auth/register';

interface IProps {}

const RegisterPage: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <Register/>
    );
}

export default RegisterPage;
