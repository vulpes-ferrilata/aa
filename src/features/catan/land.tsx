import React, { FunctionComponent, memo, useMemo } from 'react';
import classNames from 'classnames';

import {ReactComponent as SettlementIcon} from 'assets/svg/settlement.svg';
import {ReactComponent as CityIcon} from 'assets/svg/city.svg';
import Hex from 'features/catan/hex';
import { Action, Construction as ConstructionModel, ConstructionType, GameDetail, Land as LandModel, LandLocation, Player, PlayerColor } from 'features/catan/types';

interface IProps {
    game: GameDetail;
    me?: Player;
    land: LandModel;
    construction?: ConstructionModel;
    player?: Player;
    action?: Action;
    onClick?: () => void;
};

const Land: FunctionComponent<IProps> = (props: IProps) => {
    const position = useMemo(() => {
        switch(props.land.location) {
            case LandLocation.Top:
                return "top-0 -translate-y-1/2";
            case LandLocation.Bottom:
                return "bottom-0 translate-y-1/2";
        }
    }, [props.land.location]);

    const icon = useMemo(() => {
        switch (props.construction?.type) {
            case ConstructionType.Settlement:
                return <SettlementIcon/>;
            case ConstructionType.City:
                return <CityIcon/>;
        }
    }, [props.construction]);

    return (
        <Hex game={props.game} q={props.land.q} r={props.land.r}>
            <div className={classNames("group absolute left-1/2 h-1/4 aspect-square -translate-x-1/2 cursor-pointer pointer-events-auto", position)} onClick={props.onClick}>
                {
                    props.player && (!props.action || !("constructionID" in props.action) || props.action.constructionID !== props.construction?.id) &&
                        <div className={classNames(PlayerColor.toColor(props.player.color))}>
                            {icon}
                        </div>
                }

                {
                    props.me && props.action && "constructionID" in props.action && props.action.constructionID === props.construction?.id &&
                        <div className={classNames("animate-pulse", PlayerColor.toColor(props.me.color))}>
                            <CityIcon/>
                        </div>
                }

                {
                    props.me && props.action && "landID" in props.action && props.action.landID === props.land.id &&
                        <div className={classNames("animate-pulse", PlayerColor.toColor(props.me.color))}>
                            <SettlementIcon/>
                        </div>
                }
            </div>
 
        </Hex>
    );
}

export default memo(Land);