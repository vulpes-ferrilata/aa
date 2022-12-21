import React, { FunctionComponent, memo, useState } from 'react';
import classNames from 'classnames';

import { UserCircleIcon } from '@heroicons/react/24/outline';

import { ReactComponent as RoadIcon } from 'assets/svg/road.svg';
import { ReactComponent as SettlementIcon } from 'assets/svg/settlement.svg';
import { ReactComponent as CityIcon } from 'assets/svg/city.svg';
import {ReactComponent as StealIcon} from 'assets/svg/steal.svg';
import {ReactComponent as TradeIcon} from 'assets/svg/trade.svg';
import AchievementCard from 'features/catan/achievementCard';
import ResourceCard from 'features/catan/resourceCard';
import DevelopmentCard from 'features/catan/developmentCard';
import { Action, ConstructionType, DevelopmentCard as DevelopmentCardModel, DevelopmentCardStatus, DevelopmentCardType, GameDetail, MoveRobber, Player, PlayerColor, PlayKnightCard, ResourceCard as ResourceCardModel, ResourceCardType, SendTradeOffer } from 'features/catan/types';
import DisplayName from 'features/user/displayName';

interface IProps{
    game: GameDetail;
    me?: Player;
    player: Player;
    action?: Action;
    selectResourceCard?: (resourceCard: ResourceCardModel) => void;
    selectDevelopmentCard?: (developmentCard: DevelopmentCardModel) => void;
    selectPlayer?: () => void;    
};

const enum Tab {
    ResourceCard,
    DevelopmentCard,
    UserInfo,
};

const Table: FunctionComponent<IProps> = (props: IProps) => {
    const [tab, setTab] = useState<Tab>(Tab.ResourceCard);

    return (
        <div className={classNames("flex flex-col w-full h-full sm-h-and-aspect-4/3:flex-row sm-h-and-aspect-4/3:rounded-xl sm-h-and-aspect-4/3:shadow-inner-lg dark:shadow-white/10", {
            "sm-h-and-aspect-4/3:shadow-green-300 dark:sm-h-and-aspect-4/3:shadow-green-700": props.player === props.game.activePlayer
        })}>
            {
                tab === Tab.ResourceCard?
                    <div className="flex-auto relative flex p-2 overflow-y-hidden overflow-x-auto transition-flex-grow" onClick={props.selectPlayer}>
                        {
                            (props.action instanceof MoveRobber || props.action instanceof PlayKnightCard) && props.action.playerID === props.player.id?
                                <div className="absolute flex w-full h-full backdrop-blur-sm z-50 animate-pulse">
                                    <StealIcon className="h-1/2 m-auto"/>
                                </div>
                            :
                                null
                        }

                        {
                            props.action instanceof SendTradeOffer && props.action.playerID === props.player.id?
                                <div className="absolute flex w-full h-full backdrop-blur-sm z-50 animate-pulse">
                                    <TradeIcon className="h-1/2 m-auto"/>
                                </div>
                            :
                                null
                        }

                        {props.player.resourceCards.map(resourceCard => (
                            <div key={resourceCard.id} className="flex-content min-w-16 h-full z-0 last:flex-none sm-h-and-aspect-4/3:min-w-4" onClick={() => props.selectResourceCard && props.selectResourceCard(resourceCard)}>
                                <div className={classNames("h-full", {
                                    "-translate-y-2": props.action && "resourceCardIDs" in props.action && props.action.resourceCardIDs?.includes(resourceCard.id)? !resourceCard.offering: resourceCard.offering,
                                    })}>
                                    <ResourceCard type={resourceCard.type}/>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                :
                    <div className="flex-none flex flex-col w-full h-1/4 aspect-square p-2 overflow-hidden transition-flex-grow cursor-pointer sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:h-full" onClick={() => setTab(Tab.ResourceCard)}>
                        <div className="flex-auto flex mx-auto aspect-2/3 overflow-hidden">
                            <ResourceCard type={ResourceCardType.Hidden}/>
                        </div>

                        <span className="m-auto">{props.player.resourceCards.length}</span>
                    </div>
            }
            
            <div className="flex-none w-full h-1 bg-slate-200 sm-h-and-aspect-4/3:w-1 sm-h-and-aspect-4/3:h-full dark:bg-slate-700"/>

            {
                tab === Tab.DevelopmentCard?
                    <div className="flex-auto flex p-2 overflow-y-hidden overflow-x-auto transition-flex-grow">
                            {props.player.developmentCards.map(developmentCard => (
                                <div key={developmentCard.id} className="flex-content min-w-16 h-full z-0 last:flex-none sm-h-and-aspect-4/3:min-w-4" onClick={() => props.selectDevelopmentCard && props.selectDevelopmentCard(developmentCard)}>
                                    <div className={classNames("relative h-full", {
                                        "-translate-y-2": props.action && "developmentCardID" in props.action && props.action.developmentCardID === developmentCard.id,
                                    })}>
                                        <div className={classNames("absolute h-full aspect-2/3", {
                                            "backdrop-grayscale": developmentCard.status === DevelopmentCardStatus.Disable,
                                            "bg-red-600/30": developmentCard.status === DevelopmentCardStatus.Used,
                                        })}/>

                                        <DevelopmentCard type={developmentCard.type}/>
                                    </div>
                                </div>
                            ))}
                    </div>
                :
                    <div className="flex-none flex flex-col w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto transition-flex-grow cursor-pointer sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:h-full" onClick={() => setTab(Tab.DevelopmentCard)}>
                        <div className="flex-auto flex mx-auto aspect-2/3 overflow-hidden">
                            <DevelopmentCard type={DevelopmentCardType.Hidden}/>
                        </div>

                        <span className="m-auto">{props.player.developmentCards.length}</span>
                    </div>
            }

            <div className="flex-none w-full h-1 bg-slate-200 sm-h-and-aspect-4/3:w-1 sm-h-and-aspect-4/3:h-full dark:bg-slate-700"/>

            {
                tab === Tab.UserInfo?
                    <div className="flex-auto flex w-full p-2 overflow-y-hidden overflow-x-auto transition-flex-grow sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:h-full">
                        <div className="flex flex-col w-full h-auto gap-4 sm-h-and-aspect-4/3:flex-row sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:h-full">
                            <div className="grid grid-cols-6 gap-1 sm-h-and-aspect-4/3:grid-cols-2">
                                    <span className="m-auto">{props.player.roads.reduce<number>((quantity, road) => !road.path? quantity + 1: quantity, 0)}</span>

                                    <div className={classNames("my-auto", PlayerColor.toColor(props.player.color))}>
                                        <RoadIcon className="w-6 h-6"/>
                                    </div>

                                    <span className="m-auto">{props.player.constructions.reduce<number>((quantity, construction) => !construction.land && construction.type === ConstructionType.Settlement? quantity + 1: quantity, 0)}</span>

                                    <div className={classNames("my-auto", PlayerColor.toColor(props.player.color))}>
                                        <SettlementIcon className="w-6 h-6"/>
                                    </div>

                                    <span className="m-auto">{props.player.constructions.reduce<number>((quantity, construction) => !construction.land && construction.type === ConstructionType.City? quantity + 1: quantity, 0)}</span>

                                    <div className={classNames("my-auto", PlayerColor.toColor(props.player.color))}>
                                        <CityIcon className="w-6 h-6"/>
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
                    <div className="flex-none flex flex-col w-full h-1/4 aspect-square p-2 overflow-y-hidden overflow-x-auto transition-flex-grow cursor-pointer
                    sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:h-full" 
                    onClick={() => setTab(Tab.UserInfo)}>
                        <UserCircleIcon className={classNames(PlayerColor.toColor(props.player.color))}/>
                        
                        <div className="m-auto">
                            <DisplayName id={props.player.userID}/>
                        </div>

                        <div className="m-auto">
                            {props.player.score}
                        </div>
                    </div>
            }
        </div>
    );
}

export default memo(Table);