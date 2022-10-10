import React, { memo, useMemo, useState } from 'react';
import classNames from 'classnames';

import { ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { ReactComponent as RoadIcon } from 'assets/svg/road.svg';
import { ReactComponent as SettlementIcon } from 'assets/svg/settlement.svg';
import { ReactComponent as CityIcon } from 'assets/svg/city.svg';
import {ReactComponent as StealIcon} from 'assets/svg/steal.svg';
import AchievementCard from './achievementCard';
import ResourceCard from './resourceCard';
import DevelopmentCard from './developmentCard';
import { Action, DevelopmentCard as DevelopmentCardModel, Game, MoveRobber, OfferTrading, Player, PlayKnightCard, ResourceCard as ResourceCardModel, ToggleResourceCards } from 'features/catan/api';
import DisplayName from 'features/user/displayName';

interface IProps{
    game: Game;
    me?: Player;
    player: Player;
    action?: Action;
    selectResourceCard?: (resourceCard: ResourceCardModel) => void;
    selectDevelopmentCard?: (developmentCard: DevelopmentCardModel) => void;
    selectPlayer?: () => void;    
};

const enum Tab {
    ResourceCard = "RESOURCE_CARD",
    DevelopmentCard = "DEVELOPMENT_CARD",
    UserInfo = "USER_INFO",
};

function Table(props: IProps) {
    const [tab, setTab] = useState<Tab>(Tab.ResourceCard);

    const playerColor = useMemo(() => {
        switch (props.player.color) {
            case "RED":
                return "text-red-600";
            case "BLUE":
                return "text-blue-600";
            case "GREEN":
                return "text-green-600";
            case "YELLOW":
                return "text-yellow-600";
        }
    }, [props.player]);

    return (
        <div className={classNames("flex flex-col-reverse w-full h-full sm-h-&-aspect-4/3:flex-row sm-h-&-aspect-4/3:rounded-xl sm-h-&-aspect-4/3:shadow-inner-lg dark:shadow-white/10", {
            "sm-h-&-aspect-4/3:shadow-green-300 dark:sm-h-&-aspect-4/3:shadow-green-700": props.player === props.game.activePlayer
        })}>
            {
                tab === Tab.ResourceCard?
                    <div className="flex-auto relative flex w-full p-2 overflow-y-hidden overflow-x-auto transition-all sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full" onClick={props.selectPlayer}>
                        {
                            (props.action instanceof MoveRobber || props.action instanceof PlayKnightCard) && props.action.playerID === props.player.id?
                                <div className="absolute flex w-full h-full backdrop-blur-sm z-50 animate-pulse">
                                    <StealIcon className="h-1/2 m-auto"/>
                                </div>
                            :
                                null
                        }

                        {
                            props.action instanceof OfferTrading && props.action.playerID === props.player.id?
                                <div className="absolute flex w-full h-full backdrop-blur-sm z-50 animate-pulse">
                                    <ArrowPathIcon className="h-1/2 m-auto"/>
                                </div>
                            :
                                null
                        }

                        {props.player.resourceCards.map(resourceCard => (
                            <div key={resourceCard.id} className="flex-content min-w-1/5 h-full z-0 last:flex-none sm-h-&-aspect-4/3:min-w-4" onClick={() => props.selectResourceCard && props.selectResourceCard(resourceCard)}>
                                <div className={`h-full ${resourceCard.isSelected? "-translate-y-2": ""} ${props.action instanceof ToggleResourceCards && props.action.resourceCardIDs?.includes(resourceCard.id)? "animate-pulse": ""}`}>
                                    <ResourceCard type={resourceCard.type}/>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                :
                    <div className="flex-none flex w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto transition-all sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full" onClick={() => setTab(Tab.ResourceCard)}>
                        <div className="flex w-max h-full mx-auto">
                            <ResourceCard type={'HIDDEN'}/>
                        </div>
                    </div>
            }

            
            <div className="flex-none w-full h-1 bg-slate-200 sm-h-&-aspect-4/3:w-1 sm-h-&-aspect-4/3:h-full dark:bg-slate-700"/>

            {
                tab === Tab.DevelopmentCard?
                    <div className="flex-auto flex w-full p-2 overflow-y-hidden overflow-x-auto transition-all sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full sm-h-&-aspect-4/3:min-w-4">
                            {props.player.developmentCards.map(developmentCard => (
                                <div key={developmentCard.id} className="relative flex-content min-w-1/5 h-full z-0 last:flex-none" onClick={() => props.selectDevelopmentCard && props.selectDevelopmentCard(developmentCard)}>
                                    <div className={classNames("absolute h-full aspect-2/3", {
                                        "backdrop-grayscale": developmentCard.status === "DISABLE",
                                        "bg-red-600/30": developmentCard.status === "USED"
                                    })}/>

                                    <div className={classNames("h-full", {
                                        "animate-pulse -translate-y-2": props.action && "developmentCardID" in props.action && props.action.developmentCardID === developmentCard.id
                                    })}>
                                        <DevelopmentCard type={developmentCard.type}/>
                                    </div>
                                </div>
                            ))}
                    </div>
                :
                    <div className="flex-none flex w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto transition-all sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full" onClick={() => setTab(Tab.DevelopmentCard)}>
                        <div className="flex w-max h-full mx-auto">
                            <DevelopmentCard type={'HIDDEN'}/>
                        </div>
                    </div>
            }

            <div className="flex-none w-full h-1 bg-slate-200 sm-h-&-aspect-4/3:w-1 sm-h-&-aspect-4/3:h-full dark:bg-slate-700"/>

            {
                tab === Tab.UserInfo?
                    <div className="flex-auto flex w-full p-2 overflow-y-hidden overflow-x-auto transition-all sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full">
                        <div className="flex flex-col w-full h-auto gap-4 sm-h-&-aspect-4/3:flex-row sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full">
                            <div className="grid grid-cols-6 gap-1 sm-h-&-aspect-4/3:grid-cols-2">
                                    <label className="m-auto">{props.player.roads.reduce<number>((quantity, road) => !road.path? quantity + 1: quantity, 0)}</label>

                                    <div className={`my-auto ${playerColor}`}>
                                        <RoadIcon/>
                                    </div>

                                    <label className="m-auto">{props.player.constructions.reduce<number>((quantity, construction) => !construction.land && construction.type === "SETTLEMENT"? quantity + 1: quantity, 0)}</label>

                                    <div className={`my-auto ${playerColor}`}>
                                        <SettlementIcon/>
                                    </div>

                                    <label className="m-auto">{props.player.constructions.reduce<number>((quantity, construction) => !construction.land && construction.type === "CITY"? quantity + 1: quantity, 0)}</label>

                                    <div className={`my-auto ${playerColor}`}>
                                        <CityIcon/>
                                    </div>
                            </div>

                            <div className="flex-auto flex">
                                {props.player.achievements.map(achievement => (
                                    <AchievementCard type={achievement.type}/>
                                ))}
                            </div>
                        </div>
                    </div>
                :
                    <div className="flex-none flex flex-col w-full h-1/4 aspect-square p-2 
                    overflow-y-hidden overflow-x-auto transition-all sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-full" 
                    onClick={() => setTab(Tab.UserInfo)}>
                        <UserCircleIcon className={`${playerColor}`}/>
                        
                        <div className="m-auto">
                            <DisplayName id={props.player.userID}/>
                        </div>                        
                    </div>
            }
        </div>
    );
}

export default memo(Table, (prevProps, nextProps) => {
    return prevProps.game === nextProps.game &&
    prevProps.me === nextProps.me &&
    prevProps.player === nextProps.player &&
    prevProps.action === nextProps.action;
});