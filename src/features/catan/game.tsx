import React, { lazy, useMemo } from 'react';
import {useParams} from 'react-router-dom';

import { useGetGameQuery } from 'features/catan/api';
import Loading from 'shared/components/loading';
import { useGetMeQuery } from 'features/user/api';

const GameWaiting = lazy(() => import('features/catan/gameWaiting'));
const GameStarted = lazy(() => import('features/catan/gameStarted'));
const GameFinished = lazy(() => import('features/catan/gameFinished'));

interface IProps {};

function Game(props: IProps) {
    const {id} = useParams();

    const {data: game} = useGetGameQuery(id || "");
    const {data: loggedInUser} = useGetMeQuery();

    const me = useMemo(() => game? [game.activePlayer, ...game.players].find(player => player.userID === loggedInUser?.id): undefined, [game, loggedInUser]);

    if (!game) {
        return <Loading/>
    } 
    
    switch (game.status) {
        case "WAITING":
            return <GameWaiting game={game} me={me}/>
        case "STARTED":
            return <GameStarted game={game} me={me}/>;
        case "FINISHED":
            return <GameFinished game={game} me={me}/>;
    }
}

export default Game;