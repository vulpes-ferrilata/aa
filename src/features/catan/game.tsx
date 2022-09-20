import React, { lazy } from 'react';
import {useParams} from 'react-router-dom';

import { useGetGameQuery } from 'features/catan/api';
import Loading from 'shared/components/loading';

const GameWaiting = lazy(() => import('features/catan/gameWaiting'));
const GameStarted = lazy(() => import('features/catan/gameStarted'));
const GameFinished = lazy(() => import('features/catan/gameFinished'));

interface iProps {}

function Game(props: iProps) {
    const {id} = useParams();

    const {data} = useGetGameQuery(id || "");

    if (!data) {
        return <Loading/>
    } 
    
    switch (data.status) {
        case "WAITING":
            return <GameWaiting game={data}/>
        case "STARTED":
            return <GameStarted game={data}/>;
        case "FINISHED":
            return <GameFinished game={data}/>;
    }
}

export default Game;