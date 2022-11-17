import React, { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';

interface IProps {}

const IndexPage: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <Navigate to={"/catan/games"} replace={true}/>
    );
}

export default IndexPage;
