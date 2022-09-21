import React, { useMemo, useState } from 'react';

import AchievementCard from './achievementCard';
import ResourceCard from './resourceCard';
import DevelopmentCard from './developmentCard';

import { ArrowPathIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ReactComponent as RoadIcon } from 'assets/svg/road.svg';
import { ReactComponent as SettlementIcon } from 'assets/svg/settlement.svg';
import { ReactComponent as CityIcon } from 'assets/svg/city.svg';
import {ReactComponent as StealIcon} from 'assets/svg/steal.svg';

import { Action, DevelopmentCard as DevelopmentCardModel, Game, MoveRobber, OfferTrading, Player, PlayKnightCard, ResourceCard as ResourceCardModel, ToggleResourceCards } from 'features/catan/api';
import DisplayName from 'features/user/displayName';

interface iProps{
    game: Game;
    player: Player;
    action?: Action;
    selectResourceCard?: (resourceCard: ResourceCardModel) => void;
    selectDevelopmentCard?: (developmentCard: DevelopmentCardModel) => void;
    selectPlayer?: () => void;    
}

type Tab = "RESOURCE_CARD" | "DEVELOPMENT_CARD" | "USER_INFO"

function Table(props: iProps) {
    const [tab, setTab] = useState<Tab>("RESOURCE_CARD");

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
    }, [props.player])

    return (
        <div className={`flex flex-col w-full h-full sm:flex-row sm:rounded-xl sm:shadow-inner-lg ${props.player.isActive? "sm:shadow-green-300": ""}`}>
            {
                tab === "RESOURCE_CARD"?
                    <div className={`flex-auto relative flex w-full p-2 overflow-y-hidden overflow-x-auto sm:w-auto sm:h-full ${props.action && "playerID" in props.action && props.action.playerID === props.player.id? "animate-pulse": ""}`} onClick={props.selectPlayer}>
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
                            <div key={resourceCard.id} className="flex-content min-w-1/5 h-full z-0 last:flex-none sm:min-w-4" onClick={() => props.selectResourceCard && props.selectResourceCard(resourceCard)}>
                                <div className={`h-full ${resourceCard.isSelected? "-translate-y-2": ""} ${props.action instanceof ToggleResourceCards && props.action.resourceCardIDs?.includes(resourceCard.id)? "animate-pulse": ""}`}>
                                    <ResourceCard type={resourceCard.type}/>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                :
                    <div className="flex-none flex w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto sm:w-auto sm:h-full" onClick={() => setTab("RESOURCE_CARD")}>
                        <div className="flex mx-auto">
                            <ResourceCard type={'HIDDEN'}/>
                        </div>
                    </div>
            }

            
            <div className="flex-none w-full h-1 bg-slate-200 sm:w-1 sm:h-full"/>

            {
                tab === "DEVELOPMENT_CARD"?
                    <div className="flex-auto flex w-full p-2 overflow-y-hidden overflow-x-auto sm:w-auto sm:h-full sm:min-w-4">
                            {props.player.developmentCards.map(developmentCard => (
                                <div key={developmentCard.id} className="relative flex-content min-w-1/5 h-full z-0 last:flex-none" onClick={() => props.selectDevelopmentCard && props.selectDevelopmentCard(developmentCard)}>
                                    {
                                        props.player === props.game.me?
                                            <div className={`absolute h-full aspect-2/3 ${developmentCard.status === "DISABLE"? "backdrop-grayscale": ""} ${developmentCard.status === "USED"? "bg-red-600/30": ""}`}/>
                                        :
                                            null
                                    }

                                    <div className={`h-full ${props.action && "developmentCardID" in props.action && props.action.developmentCardID === developmentCard.id? "animate-pulse -translate-y-2": ""}`}>
                                        <DevelopmentCard type={developmentCard.type}/>
                                    </div>
                                </div>
                            ))}
                    </div>
                :
                    <div className="flex-none flex w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto sm:w-auto sm:h-full" onClick={() => setTab("DEVELOPMENT_CARD")}>
                        <div className="flex mx-auto">
                            <DevelopmentCard type={'HIDDEN'}/>
                        </div>
                    </div>
            }

            <div className="flex-none w-full h-1 bg-slate-200 sm:w-1 sm:h-full"/>

            {
                tab === "USER_INFO"?
                    <div className="flex-auto flex w-full p-2 overflow-y-hidden overflow-x-auto sm:w-auto sm:h-full">
                        <div className="flex flex-col w-full h-auto gap-4 sm:flex-row sm:w-auto sm:h-full">
                            <div className="grid grid-cols-6 gap-1 sm:grid-cols-2">
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
                    <div className="flex-none flex flex-col w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto sm:w-auto sm:h-full" onClick={() => setTab("USER_INFO")}>
                        <UserCircleIcon className={`${playerColor}`}/>
                        
                        <div className="m-auto">
                            <DisplayName id={props.player.userID}/>
                        </div>                        
                    </div>
            }
            
        </div>
    );
}

export default Table;