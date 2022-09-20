import React, { useMemo } from 'react';
import { Action, Path as PathModel, Player, PlayerColor } from 'features/catan/api';

import Hex, {IProps as IHexProps} from './hex';

interface iProps {
    path: PathModel;
    player?: Player;
    action?: Action;
    onClick?: () => void;
}

function Path(props: iProps & IHexProps) {
    const className = useMemo(() => {
        switch (props.path.location) {
            case "TOP_LEFT":
                return "rotate-[60deg]"
            case "MIDDLE_LEFT":
                return ""
            case "BOTTOM_LEFT":
                return "rotate-[-60deg]"
        }
    }, [props.path.location])

    const getPlayerColor = (color: PlayerColor) => {
        switch(color) {
            case "RED":
                return "bg-red-600";
            case "BLUE":
                return "bg-blue-600";
            case "GREEN":
                return "bg-green-600";
            case "YELLOW":
                return "bg-yellow-600";
        }
    }

    return (
        <Hex game={props.game} q={props.path.q} r={props.path.r}>
            <div className={`w-full h-full ${className}`}>
                <div className="absolute top-1/4 left-0 h-1/2 w-1/5 -translate-x-1/2 pointer-events-auto" onClick={props.onClick}>
                    <div className="flex w-1/2 h-full mx-auto">
                        {/* <div className={`w-full h-1/2 m-auto ${playerColor} ${props.player? "": "animate-pulse"} ${props.player || (props.action instanceof BuildSettlementAndRoad && props.action.pathID === props.path.id) || (props.action instanceof BuildRoad && props.action.pathID === props.path.id)? "block": "hidden"} ${!props.player && props.game.me?.isActive && (!props.action || (props.action instanceof BuildSettlementAndRoad && !props.action.pathID))? "group-hover:block": ""}`}/> */}
                        <div className="w-full h-1/2 m-auto">
                            {
                                props.player?
                                    <div className={`w-full h-full ${getPlayerColor(props.player.color)}`}/>
                                :
                                    null
                            }

                            {
                                props.game.me?.isActive && props.action && "pathID" in props.action && props.action.pathID === props.path.id?
                                    <div className={`w-full h-full ${getPlayerColor(props.game.me.color)} animate-pulse`}/>
                                :
                                    null
                            }

                            {
                                props.game.me?.isActive && props.action && "pathIDs" in props.action && props.action.pathIDs?.includes(props.path.id)?
                                    <div className={`w-full h-full ${getPlayerColor(props.game.me.color)} animate-pulse`}/>
                                :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Hex>
    );
}

export default Path;