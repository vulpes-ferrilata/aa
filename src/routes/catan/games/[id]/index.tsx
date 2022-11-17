import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

import withAuthentication from 'shared/hoc/withAuthentication';
import Game from 'features/catan/game';

interface IProps {}

const GamePage: FunctionComponent<IProps> = (props: IProps) => {
    const {id} = useParams();

    if (!id) {
        return null;
    }

    return (
        <Game id={id}/>
    );
}

export default withAuthentication(GamePage);
