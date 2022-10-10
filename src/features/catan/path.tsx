import React, { memo, useMemo } from 'react';
import { Action, Game, Path as PathModel, Player } from 'features/catan/api';

import Hex from './hex';
import classNames from 'classnames';

interface IProps {
    game: Game;
    me?: Player;
    path: PathModel;
    player?: Player;
    action?: Action;
    onClick?: () => void;
};

function Path(props: IProps) {
    const pathRotation = useMemo(() => {
        switch (props.path.location) {
            case "TOP_LEFT":
                return "rotate-[60deg]"
            case "MIDDLE_LEFT":
                return ""
            case "BOTTOM_LEFT":
                return "rotate-[-60deg]"
        }
    }, [props.path]);

    const playerBackgroundColor = useMemo(() => {
        switch(props.player?.color) {
            case "RED":
                return "bg-red-600";
            case "BLUE":
                return "bg-blue-600";
            case "GREEN":
                return "bg-green-600";
            case "YELLOW":
                return "bg-yellow-600";
        }
    }, [props.player]);

    const myBackgroundColor = useMemo(() => {
        switch(props.me?.color) {
            case "RED":
                return "bg-red-600";
            case "BLUE":
                return "bg-blue-600";
            case "GREEN":
                return "bg-green-600";
            case "YELLOW":
                return "bg-yellow-600";
        }
    }, [props.me]);

    return (
        <Hex game={props.game} q={props.path.q} r={props.path.r}>
            <div className={classNames("w-full h-full", pathRotation)}>
                <div className="absolute top-1/4 left-0 h-1/2 w-1/5 -translate-x-1/2 pointer-events-auto" onClick={props.onClick}>
                    <div className="flex w-1/2 h-full mx-auto">
                        <div className="w-full h-3/4 m-auto">
                            {
                                props.player?
                                    <div className={classNames("w-full h-full", playerBackgroundColor)}/>
                                :
                                    null
                            }

                            {
                                props.me && props.action && "pathID" in props.action && props.action.pathID === props.path.id?
                                    <div className={classNames("w-full h-full animate-pulse", myBackgroundColor)}/>
                                :
                                    null
                            }

                            {
                                props.me && props.action && "pathIDs" in props.action && props.action.pathIDs?.includes(props.path.id)?
                                    <div className={classNames("w-full h-full animate-pulse", myBackgroundColor)}/>
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

export default memo(Path, (prevProps, nextProps) => {
    return prevProps.game === nextProps.game && 
    prevProps.me === nextProps.me && 
    prevProps.path === nextProps.path && 
    prevProps.player === nextProps.player &&
    prevProps.action === nextProps.action;
});