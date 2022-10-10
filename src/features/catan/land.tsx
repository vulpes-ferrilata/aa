import React, { memo, useMemo } from 'react';

import Hex from './hex';

import {ReactComponent as SettlementIcon} from 'assets/svg/settlement.svg';
import {ReactComponent as CityIcon} from 'assets/svg/city.svg';
import { Action, Construction as ConstructionModel, Game, Land as LandModel, Player, PlayerColor } from 'features/catan/api';

interface IProps {
    game: Game;
    me?: Player;
    land: LandModel;
    construction?: ConstructionModel;
    player?: Player;
    action?: Action;
    onClick?: () => void;
};

function Land(props: IProps) {
    const className = useMemo(() => {
        switch(props.land.location) {
            case "TOP":
                return "top-0 -translate-y-1/2"
            case "BOTTOM":
                return "bottom-0 translate-y-1/2"
        }
    }, [props.land.location]);

    const constructionIcon = useMemo(() => {
        switch (props.construction?.type) {
            case "SETTLEMENT":
                return <SettlementIcon/>;
            case "CITY":
                return <CityIcon/>;
        }
    }, [props.construction]);

    const getPlayerColor = (color: PlayerColor) => {
        switch(color) {
            case "RED":
                return "text-red-600";
            case "BLUE":
                return "text-blue-600";
            case "GREEN":
                return "text-green-600";
            case "YELLOW":
                return "text-yellow-600";
        }
    };

    return (
        <Hex game={props.game} q={props.land.q} r={props.land.r}>
            <div className={`group absolute left-1/2 h-1/4 aspect-square -translate-x-1/2 pointer-events-auto ${className}`} onClick={props.onClick}>
                {
                    props.player && (!props.action || !("constructionID" in props.action) || props.action.constructionID !== props.construction?.id) ?
                        <div className={`${getPlayerColor(props.player.color)}`}>
                            {constructionIcon}
                        </div>
                    :
                        null
                }

                {
                    props.me && props.action && "constructionID" in props.action && props.action.constructionID === props.construction?.id?
                        <div className={`${getPlayerColor(props.me.color)} animate-pulse`}>
                            <CityIcon/>
                        </div>
                    :
                        null
                }

                {
                    props.me && props.action && "landID" in props.action && props.action.landID === props.land.id?
                        <div className={`${getPlayerColor(props.me.color)} animate-pulse`}>
                            <SettlementIcon/>
                        </div>
                    :
                        null
                }
            </div>
 
        </Hex>
    );
}

export default memo(Land, (prevProps, nextProps) => {
    return prevProps.game === nextProps.game && 
    prevProps.me === nextProps.me && 
    prevProps.land === nextProps.land && 
    prevProps.construction === nextProps.construction &&
    prevProps.player === nextProps.player &&
    prevProps.action === nextProps.action;
});