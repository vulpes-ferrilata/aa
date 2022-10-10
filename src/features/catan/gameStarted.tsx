import React, { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ChatBubbleLeftRightIcon, MapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { Action, BuildRoad, BuildSettlement, BuildSettlementAndRoad, BuyDevelopmentCard, Construction, Game, Land, MaritimeTrade, MoveRobber, OfferTrading, Path, Player, ResourceCard, ResourceCardType, Terrain, ToggleResourceCards, UpgradeCity, useBuildRoadMutation, useBuildSettlementAndRoadMutation, useBuildSettlementMutation, useBuyDevelopmentCardMutation, useConfirmTradeOfferMutation, useEndTurnMutation, useMaritimeTradeMutation, useMoveRobberMutation, useSendTradeOfferMutation, useRollDicesMutation, useToggleResourceCardsMutation, useUpgradeCityMutation, useCancelTradeOfferMutation, usePlayKnightCardMutation, usePlayRoadBuildingCardMutation, usePlayYearOfPlentyCardMutation, usePlayMonopolyCardMutation, PlayKnightCard, PlayRoadBuildingCard, PlayYearOfPlentyCard, PlayMonopolyCard, DevelopmentCard, PlayerColor } from 'features/catan/api';
import userAPI from 'features/user/api';
import Board from './board';
import ConfirmTradeOffer from './confirmTradeOffer';
import ResourceCardSelection from './resourceCardSelection';
import Table from './table';
import { AppDispatch } from 'app/store';
import DisplayName from 'features/user/displayName';
import MessageList from 'features/chat/messageList';
import { addNotification, NotificationType } from 'features/notification/slice';
import withMenubar from 'shared/hoc/withMenubar';

interface IProps {
    game: Game;
    me?: Player;
};

const enum Tab {
    Map = "MAP",
    Players = "PLAYERS",
    Chat = "CHAT",
};

function GameStarted(props: IProps) {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation(["catan", "notification"]);

    const [buildSettlementAndRoad] = useBuildSettlementAndRoadMutation();
    const [rollDices] = useRollDicesMutation();
    const [moveRobber] = useMoveRobberMutation();
    const [endTurn] = useEndTurnMutation();
    const [buildSettlement] = useBuildSettlementMutation();
    const [buildRoad] = useBuildRoadMutation();
    const [upgradeCity] = useUpgradeCityMutation();
    const [buyDevelopmentCard] = useBuyDevelopmentCardMutation();
    const [toggleResourceCards] = useToggleResourceCardsMutation();
    const [maritimeTrade] = useMaritimeTradeMutation();
    const [sendTradeOffer] = useSendTradeOfferMutation();
    const [confirmTradeOffer] = useConfirmTradeOfferMutation();
    const [cancelTradeOffer] = useCancelTradeOfferMutation();
    const [playKnightCard] = usePlayKnightCardMutation();
    const [playRoadBuildingCard] = usePlayRoadBuildingCardMutation();
    const [playYearOfPlentyCard] = usePlayYearOfPlentyCardMutation();
    const [playMonopolyCard] = usePlayMonopolyCardMutation();

    const [action, setAction] = useState<Action>();
    const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
    const [tab, setTab] = useState<Tab>(Tab.Map);
    const [selectedPlayerID, setSelectedPlayerID] = useState<string>(props.me?.id?? props.game.activePlayer.id);

    useEffect(() => {
        [props.game.activePlayer, ...props.game.players].forEach(async(player) => {
            if (player === props.me) {
                return;
            }

            let selectedResourceCards = player.resourceCards.filter(resourceCard => resourceCard.isSelected);

            if (selectedResourceCards.length > 0) {
                const translatedSelectedResourceCards = selectedResourceCards.map(selectedResourceCard => {
                    switch (selectedResourceCard.type) {
                        case "LUMBER":
                            return t("notification:lumber");
                        case "BRICK":
                            return t("notification:brick");
                        case "WOOL":
                            return t("notification:wool");
                        case "GRAIN":
                            return t("notification:grain");
                        case "ORE":
                            return t("notification:ore");
                    }
                });

                const result = await dispatch(userAPI.endpoints.getUser.initiate(player.userID));

                const translatedDetail = t("notification:player-is-offering-resource-cards", {
                    player: result.data?.displayName,
                    resourceCards: translatedSelectedResourceCards,
                });

                dispatch(
                    addNotification({
                        type: NotificationType.Info,
                        detail: translatedDetail,
                    })
                );
            }
        })
    }, [props.game, props.me]);

    const sortedPlayers = useMemo(() => {
        const allPlayers = [props.game.activePlayer, ...props.game.players];
        allPlayers.sort((a, b) => a.turnOrder - b.turnOrder);
        //move yourself to first index
        const myIdx = allPlayers.findIndex(player => player === props.me);
        allPlayers.push(...allPlayers.splice(0, myIdx));
        
        return allPlayers;
    }, [props.game, props.me]);

    const selectLand = (land: Land) => {
        setAction(action => {
            if (props.game.activePlayer !== props.me) {
                return action;
            }

            if (action instanceof BuildSettlementAndRoad) {
                return new BuildSettlementAndRoad(action.gameID, land.id, action.pathID);
            } else if (action instanceof BuildSettlement) {
                return new BuildSettlement(action.gameID, land.id);
            } else if (props.game.turn < 3) {
                return new BuildSettlementAndRoad(props.game.id, land.id);
            } else if (props.game.phase === "RESOURCE_CONSUMPTION") {
                return new BuildSettlement(props.game.id, land.id);
            }

            return action;
        });
    };

    const selectPath = (path: Path) => {
        setAction(action => {
            if (props.game.activePlayer !== props.me) {
                return action;
            }
            
            if (action instanceof BuildSettlementAndRoad) {
                return new BuildSettlementAndRoad(action.gameID, action.landID, path.id);
            } else if (action instanceof BuildRoad) {
                return new BuildRoad(action.gameID, path.id);
            } else if (action instanceof PlayRoadBuildingCard) {
                const pathIDSet = new Set(action.pathIDs);
                pathIDSet.add(path.id);
                return new PlayRoadBuildingCard(action.gameID, action.developmentCardID, Array.from(pathIDSet).slice(-2))
            } else if (props.game.turn < 3) {
                return new BuildSettlementAndRoad(props.game.id, undefined, path.id);
            } else if (props.game.phase === "RESOURCE_CONSUMPTION") {
                return new BuildRoad(props.game.id, path.id);
            }

            return action;
        });
    };

    const selectDices = async() => {
        await rollDices(props.game.id).unwrap();

        setAction(undefined);
    };

    const selectConstruction = (construction: Construction) => {
        setAction(action => {
            if (props.game.activePlayer !== props.me || !props.game.activePlayer.constructions.includes(construction)) {
                return action;
            }

            if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new UpgradeCity(props.game.id, construction.id);
            }

            return action;
        });
    };

    const selectTerrain = (terrain: Terrain) => {
        setAction(action => {
            if (props.game.activePlayer !== props.me) {
                return action;
            }

            if (action instanceof PlayKnightCard) {
                return new PlayKnightCard(action.gameID, action.developmentCardID, terrain.id, action.playerID);
            } else if (props.game.turn > 2 && props.game.phase === "ROBBING") {
                return new MoveRobber(props.game.id, terrain.id);
            } 

            return action;
        });
    };

    const selectPlayer = (player: Player) => {        
        setAction(action => {
            if (props.game.activePlayer !== props.me || player === props.me) {
                return action;
            }

            if (action instanceof MoveRobber) {
                setTab(Tab.Map);
                return new MoveRobber(action.gameID, action.terrainID, player.id);
            } else if (action instanceof PlayKnightCard) {
                setTab(Tab.Map);
                return new PlayKnightCard(action.gameID, action.developmentCardID, action.terrainID, player.id);
            } else if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                setTab(Tab.Map);
                return new OfferTrading(props.game.id, player.id);
            }

            return action;
        });
    };

    const selectDevelopmentCardOnTable = (developmentCard: DevelopmentCard) => {
        setAction(action => {
            if (props.game.activePlayer !== props.me) {
                return action;
            }

            if (props.game.turn > 2 && developmentCard.status === "ENABLE") {
                switch (developmentCard.type) {
                    case "KNIGHT":
                        if (action instanceof PlayKnightCard) {
                            return new PlayKnightCard(action.gameID, developmentCard.id, action.terrainID, action.playerID);
                        }
                        return new PlayKnightCard(props.game.id, developmentCard.id);
                    case "ROAD_BUILDING":
                        if (action instanceof PlayRoadBuildingCard) {
                            return new PlayRoadBuildingCard(action.gameID, developmentCard.id, action.pathIDs);
                        }
                        return new PlayRoadBuildingCard(props.game.id, developmentCard.id);
                    case "YEAR_OF_PLENTY":
                        if (action instanceof PlayYearOfPlentyCard) {
                            return new PlayYearOfPlentyCard(action.gameID, developmentCard.id, action.resourceCardTypes);
                        }
                        return new PlayYearOfPlentyCard(props.game.id, developmentCard.id);
                    case "MONOPOLY":
                        if (action instanceof PlayMonopolyCard) {
                            return new PlayMonopolyCard(action.gameID, developmentCard.id, action.resourceCardType);
                        }
                        return new PlayMonopolyCard(props.game.id, developmentCard.id);
                    default:
                        return action;
                }
            }

            return action;
        });
    };

    const selectDevelopmentCardOnBoard = () => {
        setAction(action => {
            if (props.game.activePlayer !== props.me) {
                return action;
            }

            if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new BuyDevelopmentCard(props.game.id);
            }

            return action;
        })
    };

    const selectResourceCardOnTable = (resourceCard: ResourceCard) => {
        setAction(action => {
            if (!props.me || !props.me.resourceCards.includes(resourceCard)) {
                return action;
            }

            if (action instanceof ToggleResourceCards) {
                const resourceCardIDSet = new Set(action.resourceCardIDs);
                if (resourceCardIDSet.has(resourceCard.id)) {
                    resourceCardIDSet.delete(resourceCard.id);
                } else {
                    resourceCardIDSet.add(resourceCard.id);
                }
                
                return new ToggleResourceCards(action.gameID, Array.from(resourceCardIDSet));
            } else if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new ToggleResourceCards(props.game.id, [resourceCard.id]);
            }

            return action;
        });
    };

    const selectResourceCardOnBoard = (resourceCardType: ResourceCardType) => {
        setAction(action => {
            if (props.game.activePlayer !== props.me) {
                return action;
            }

            if (action instanceof PlayYearOfPlentyCard) {
                return new PlayYearOfPlentyCard(action.gameID, action.developmentCardID, [...action.resourceCardTypes || [], resourceCardType].slice(-2));
            } else if (action instanceof PlayMonopolyCard) {
                return new PlayMonopolyCard(action.gameID, action.developmentCardID, resourceCardType);
            } else if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new MaritimeTrade(props.game.id, resourceCardType);
            }

            return action;
        });
    };

    const confirmAction = async() => {
        if (!action) {
            return;
        }

        switch (action.constructor) {
            case BuildSettlementAndRoad:
                await buildSettlementAndRoad(action).unwrap();
                break;
            case MoveRobber:
                await moveRobber(action).unwrap();
                break;
            case BuildSettlement:
                await buildSettlement(action).unwrap();
                break;
            case BuildRoad:
                await buildRoad(action).unwrap();
                break;
            case UpgradeCity:
                await upgradeCity(action).unwrap();                
                break;
            case BuyDevelopmentCard:
                await buyDevelopmentCard(action).unwrap();
                break;
            case ToggleResourceCards:
                await toggleResourceCards(action).unwrap();
                break;
            case MaritimeTrade:
                await maritimeTrade(action).unwrap();
                break;
            case OfferTrading:
                await sendTradeOffer(action).unwrap();
                break;
            case PlayKnightCard:
                await playKnightCard(action).unwrap();
                break;
            case PlayRoadBuildingCard:
                await playRoadBuildingCard(action).unwrap();
                break;
            case PlayYearOfPlentyCard:
                await playYearOfPlentyCard(action).unwrap();
                break;
            case PlayMonopolyCard:
                await playMonopolyCard(action).unwrap();
                break;
            default:
                break;
        }

        setAction(undefined);
    };

    const cancelAction = () => {
        setAction(undefined);
    };

    const handleEndTurn = async() => {
        if (props.game.activePlayer !== props.me){
            return;
        }

        await endTurn(props.game.id).unwrap();
        setAction(undefined);
    };

    const handleConfirmTradeOffer = async() => {
        if (!props.me){
            return;
        }

        await confirmTradeOffer(props.game.id).unwrap();
        setAction(undefined);
    };

    const handleCancelTradeOffer = async() => {
        if (!props.me){
            return;
        }

        await cancelTradeOffer(props.game.id).unwrap();
        setAction(undefined);
    };

    return (
        <div className="flex flex-col w-full h-full dark:text-white">
            <div className="relative flex w-full h-full">
                <div className={classNames("relative w-full h-full sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:m-auto sm-h-&-aspect-4/3:aspect-square", {
                    "hidden": tab === Tab.Chat
                })}>
                    {
                        props.me?.isOffered?
                            <ConfirmTradeOffer game={props.game} me={props.me} confirmTradeOffer={handleConfirmTradeOffer} cancelTradeOffer={handleCancelTradeOffer}/>
                        :
                            null
                    }

                    {
                        (action instanceof PlayYearOfPlentyCard || action instanceof PlayMonopolyCard)?
                            <ResourceCardSelection game={props.game} action={action} selectResourceCard={selectResourceCardOnBoard} cancelAction={cancelAction} confirmAction={confirmAction}/>
                        :
                            null
                    }

                    <div className={classNames("absolute w-full h-full transition-all sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-6/8 sm-h-&-aspect-4/3:h-6/8 sm-h-&-aspect-4/3:top-1/2 sm-h-&-aspect-4/3:left-1/2 sm-h-&-aspect-4/3:-translate-x-1/2 sm-h-&-aspect-4/3:-translate-y-1/2 sm-h-&-aspect-4/3:z-10", {
                        "sm-h-&-aspect-4/3:w-full sm-h-&-aspect-4/3:h-full": isMapExpanded, 
                        "hidden": tab !== Tab.Map
                    })}>
                        <Board game={props.game} 
                        me={props.me}
                        action={action} 
                        isMapExpanded={isMapExpanded}
                        selectLand={selectLand} 
                        selectPath={selectPath}
                        selectDices={selectDices}
                        selectConstruction={selectConstruction}
                        selectTerrain={selectTerrain}
                        selectDevelopmentCard={selectDevelopmentCardOnBoard}
                        selectResourceCard={selectResourceCardOnBoard}
                        confirmAction={confirmAction}
                        cancelAction={cancelAction}
                        endTurn={handleEndTurn}
                        toggleMapExpanded={() => setIsMapExpanded(isMapExpanded => !isMapExpanded)}/>
                    </div>

                    <div className={classNames("absolute flex flex-col w-full h-full top-0 left-0 sm-h-&-aspect-4/3:flex", {
                        "sm-h-&-aspect-4/3:hidden": isMapExpanded, 
                        "hidden": tab !== Tab.Players
                    })}>
                        <div className="flex-auto relative w-full">
                            {sortedPlayers.map((player, idx) => {
                                const tablePosition = ((idx: number) => {
                                    switch (idx) {
                                        case 0:
                                            return "sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-7/8 sm-h-&-aspect-4/3:h-1/8 sm-h-&-aspect-4/3:right-0 sm-h-&-aspect-4/3:bottom-0";
                                        case 1:
                                            return "sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-7/8 sm-h-&-aspect-4/3:h-1/8 sm-h-&-aspect-4/3:origin-bottom-left sm-h-&-aspect-4/3:rotate-90";
                                        case 2:
                                            return "sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-7/8 sm-h-&-aspect-4/3:h-1/8 sm-h-&-aspect-4/3:rotate-180";
                                        case 3:
                                            return "sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-7/8 sm-h-&-aspect-4/3:h-1/8 sm-h-&-aspect-4/3:right-0 sm-h-&-aspect-4/3:origin-bottom-right sm-h-&-aspect-4/3:-translate-y-full sm-h-&-aspect-4/3:-rotate-90";
                                    }
                                })(idx);                                

                                return (
                                    <div key={player.id} className={classNames("absolute w-full h-full dark:bg-slate-800", tablePosition, {
                                        "hidden": player.id !== selectedPlayerID
                                    })}>
                                        <Table game={props.game} me={props.me} player={player} action={action} selectPlayer={() => selectPlayer(player)} selectResourceCard={selectResourceCardOnTable} selectDevelopmentCard={selectDevelopmentCardOnTable}/>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex sm-h-&-aspect-4/3:hidden dark:bg-slate-900">
                            {sortedPlayers.map(player => {
                                const playerColor = ((playerColor: PlayerColor) => {
                                    switch(playerColor) {
                                        case "RED":
                                            return "text-red-600";
                                        case "BLUE":
                                            return "text-blue-600";                                            
                                        case "GREEN":
                                            return "text-green-600";                                            
                                        case "YELLOW":
                                            return "text-yellow-600";
                                    }
                                })(player.color)                      
                                
                                return (
                                    <div key={player.id} className={classNames("flex-auto flex p-2 border-t-2 border-slate-200 overflow-hidden shadow-inner-lg transition-all dark:border-slate-600", playerColor, {
                                        "shadow-green-500": player === props.game.activePlayer, 
                                        "!border-blue-400 dark:!border-blue-600": player.id === selectedPlayerID,
                                    })}
                                    onClick={() => setSelectedPlayerID(player.id)}>
                                        <DisplayName id={player.userID}/>
                                    </div>
                                )
                            })}                            
                        </div>
                    </div>
                </div>

                <div className={classNames("flex-auto absolute w-full h-full sm-h-&-aspect-4/3:static sm-h-&-aspect-4/3:block sm-h-&-aspect-4/3:w-auto sm-h-&-aspect-4/3:h-auto dark:bg-slate-900", {
                    "hidden": tab !== Tab.Chat
                })}>
                    <MessageList roomID={props.game.id}/>
                </div>
            </div>
            
            <div className="flex h-12 sm-h-&-aspect-4/3:hidden dark:bg-slate-900">
                <div className={classNames("flex-auto flex flex-col p-2 border-t-2 border-slate-200 overflow-hidden transition-all dark:border-slate-600", {
                    "!border-blue-400 dark:!border-blue-600": tab === Tab.Map
                })}
                onClick={() => setTab(Tab.Map)}>
                    <MapIcon className="mx-auto"/>
                </div>

                <div className={classNames("flex-auto flex flex-col p-2 border-t-2 border-slate-200 overflow-hidden transition-all dark:border-slate-600", {
                    "border-blue-400 dark:!border-blue-600": tab === Tab.Players, 
                    "text-green-600": props.me === props.game.activePlayer
                })} onClick={() => setTab(Tab.Players)}>
                    <UserGroupIcon className="mx-auto"/>
                </div>

                <div className={classNames("flex-auto flex flex-col p-2 border-t-2 border-slate-200 overflow-hidden transition-all dark:border-slate-600", {
                    "border-blue-400 dark:!border-blue-600": tab === Tab.Chat
                })}
                onClick={() => setTab(Tab.Chat)}>
                    <ChatBubbleLeftRightIcon className="mx-auto"/>
                </div>
            </div>
        </div>
    );
}

export default withMenubar<IProps>(memo(GameStarted, (prevProps, nextProps) => {
    return prevProps.game === nextProps.game &&
    prevProps.me === nextProps.me;
}));