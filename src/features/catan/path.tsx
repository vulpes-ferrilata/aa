import React, { FunctionComponent, memo, useMemo } from 'react';

import { Action, GameDetail, Path as PathModel, PathLocation, Player, PlayerColor } from 'features/catan/types';

import Hex from './hex';
import classNames from 'classnames';

interface IProps {
    game: GameDetail;
    me?: Player;
    path: PathModel;
    player?: Player;
    action?: Action;
    onClick?: () => void;
};

const Path: FunctionComponent<IProps> = (props: IProps) => {
    const rotation = useMemo(() => {
        switch (props.path.location) {
            case PathLocation.TopLeft:
                return "rotate-[60deg]"
            case PathLocation.MiddleLeft:
                return ""
            case PathLocation.BottomLeft:
                return "rotate-[-60deg]"
        }
    }, [props.path]);

    return (
        <Hex game={props.game} q={props.path.q} r={props.path.r}>
            <div className={classNames("w-full h-full", rotation)}>
                <div className="absolute top-1/4 left-0 h-1/2 w-1/5 -translate-x-1/2 cursor-pointer pointer-events-auto" onClick={props.onClick}>
                    <div className="flex w-1/2 h-full mx-auto">
                        <div className="w-full h-3/4 m-auto">
                            {
                                props.player &&
                                    <div className={classNames("w-full h-full", PlayerColor.toBackgroundColor(props.player.color))}/>
                            }

                            {
                                props.me && props.action && "pathID" in props.action && props.action.pathID === props.path.id &&
                                    <div className={classNames("w-full h-full animate-pulse", PlayerColor.toBackgroundColor(props.me.color))}/>
                            }

                            {
                                props.me && props.action && "pathIDs" in props.action && props.action.pathIDs?.includes(props.path.id) &&
                                    <div className={classNames("w-full h-full animate-pulse", PlayerColor.toBackgroundColor(props.me.color))}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Hex>
    );
}

export default memo(Path);