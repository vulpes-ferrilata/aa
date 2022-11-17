import React, { FunctionComponent, lazy, memo, useMemo } from 'react';

import { useGetGameQuery } from 'features/catan/api';
import { GameStatus } from 'features/catan/types';
import Loading from 'shared/components/loading';
import { useGetMeQuery } from 'features/user/api';

const GameWaiting = lazy(() => import('features/catan/gameWaiting'));
const GameStarted = lazy(() => import('features/catan/gameStarted'));
const GameFinished = lazy(() => import('features/catan/gameFinished'));

interface IProps {
    id: string;
};

const Game: FunctionComponent<IProps> = (props: IProps) => {
    const {data: game} = useGetGameQuery(props.id);
    const {data: loggedInUser} = useGetMeQuery();

    const me = useMemo(() => game? [game.activePlayer, ...game.players].find(player => player.userID === loggedInUser?.id): undefined, [game, loggedInUser]);

    if (!game) {
        return <Loading/>
    } 
    
    switch (game.status) {
        case GameStatus.Waiting:
            return <GameWaiting game={game} me={me}/>
        case GameStatus.Started:
            return <GameStarted game={game} me={me}/>;
        case GameStatus.Finished:
            return <GameFinished game={game} me={me}/>;
    }
}

export default memo(Game);