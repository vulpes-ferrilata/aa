import React, { FunctionComponent } from 'react';

import withAuthentication from 'shared/hoc/withAuthentication';
import Lobby from 'features/catan/lobby';

interface IProps {}

const GameLobbyPage: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <Lobby/>
    );
}

export default withAuthentication(GameLobbyPage);
