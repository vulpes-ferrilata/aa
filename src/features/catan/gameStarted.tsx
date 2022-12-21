import React, { FunctionComponent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ChatBubbleLeftRightIcon, MapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { useBuildRoadMutation, useBuildSettlementAndRoadMutation, useBuildSettlementMutation, useBuyDevelopmentCardMutation, useConfirmTradeOfferMutation, useEndTurnMutation, useMaritimeTradeMutation, useMoveRobberMutation, useSendTradeOfferMutation, useRollDicesMutation, useToggleResourceCardsMutation, useUpgradeCityMutation, useCancelTradeOfferMutation, usePlayKnightCardMutation, usePlayRoadBuildingCardMutation, usePlayYearOfPlentyCardMutation, usePlayMonopolyCardMutation, useDiscardResourceCardsMutation, usePlayVictoryPointCardMutation } from 'features/catan/api';
import { Action, BuildRoad, BuildSettlement, BuildSettlementAndRoad, BuyDevelopmentCard, Construction, GameDetail, Land, MaritimeTrade, MoveRobber, Path, Player, ResourceCard, ResourceCardType, Terrain, ToggleResourceCards, UpgradeCity, PlayKnightCard, PlayRoadBuildingCard, PlayYearOfPlentyCard, PlayMonopolyCard, DevelopmentCard, PlayerColor, SendTradeOffer, DiscardResourceCards, GamePhase, DevelopmentCardType, RollDices, EndTurn, PlayVictoryPointCard } from 'features/catan/types';
import userAPI from 'features/user/api';
import Board from 'features/catan/board';
import ConfirmTradeOfferDialog from 'features/catan/confirmTradeOfferDialog';
import Table from 'features/catan/table';
import { AppDispatch } from 'app/store';
import DisplayName from 'features/user/displayName';
import MessageList from 'features/chat/messageList';
import { addNotification } from 'features/notification/slice';
import { NotificationType } from 'features/notification/types';
import Instruction from 'features/catan/instruction';

interface IProps {
    game: GameDetail;
    me?: Player;
};

const enum Tab {
    Map,
    Players,
    Chat,
};

const GameStarted: FunctionComponent<IProps> = (props: IProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation(["catan", "notification"]);

    const [buildSettlementAndRoad] = useBuildSettlementAndRoadMutation();
    const [rollDices] = useRollDicesMutation();
    const [discardResourceCards] = useDiscardResourceCardsMutation();
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
    const [playVictoryPointCard] = usePlayVictoryPointCardMutation();

    const [action, setAction] = useState<Action>();
    const [isMapExpanded, setMapExpanded] = useState<boolean>(false);
    const [isInstructionShow, setInstructionShow] = useState<boolean>(false);
    const [tab, setTab] = useState<Tab>(Tab.Map);
    const [selectedPlayerID, setSelectedPlayerID] = useState<string>(props.me?.id?? props.game.activePlayer.id);

    // show notifications
    useEffect(() => {
        [props.game.activePlayer, ...props.game.players].filter(player => player !== props.me).forEach(async(player) => {
            const offeringResourceCards = player.resourceCards.filter(resourceCard => resourceCard.offering);

            if (offeringResourceCards.length > 0) {
                const translatedOfferingResources = offeringResourceCards.map(selectedResourceCard => {
                    switch (selectedResourceCard.type) {
                        case ResourceCardType.Lumber:
                            return t("notification:lumber");
                        case ResourceCardType.Brick:
                            return t("notification:brick");
                        case ResourceCardType.Wool:
                            return t("notification:wool");
                        case ResourceCardType.Grain:
                            return t("notification:grain");
                        case ResourceCardType.Ore:
                            return t("notification:ore");
                        default:
                            return "";
                    }
                });

                const result = await dispatch(userAPI.endpoints.getUser.initiate(player.userID));

                const translatedDetail = t("notification:player-is-offering-resources", {
                    player: result.data?.displayName,
                    resources: translatedOfferingResources,
                });

                dispatch(
                    addNotification({
                        type: NotificationType.Info,
                        detail: translatedDetail,
                    })
                );
            }
        });

        (async() => {
            if (props.game.phase === GamePhase.ResourceDiscard && props.me && props.me.resourceCards.length >= 8) {
                const translatedDetail = t("notification:you-must-discard-resource-cards", {
                    count: Math.floor(props.me.resourceCards.length / 2),
                });

                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: translatedDetail,
                    })
                );
            }
        })();
    }, [dispatch, t, props.game, props.me]);

    const sortedPlayers = useMemo(() => {
        const allPlayers = [props.game.activePlayer, ...props.game.players];
        allPlayers.sort((a, b) => a.turnOrder - b.turnOrder);
        //move yourself to first index
        const myIdx = allPlayers.findIndex(player => player === props.me);
        allPlayers.push(...allPlayers.splice(0, myIdx));
        
        return allPlayers;
    }, [props.game, props.me]);

    const selectLand = useCallback((land: Land) => {
        setAction(action => {
            if (!props.me) {
                return action;
            }

            if (action instanceof BuildSettlementAndRoad) {
                return new BuildSettlementAndRoad(props.game.id, land.id, action.pathID);
            } else if (action instanceof BuildSettlement) {
                return new BuildSettlement(props.game.id, land.id);
            } else if (props.game.phase === GamePhase.Setup) {
                return new BuildSettlementAndRoad(props.game.id, land.id);
            } else {
                return new BuildSettlement(props.game.id, land.id);
            }
        });
    }, [props.game, props.me]);

    const selectPath = useCallback((path: Path) => {
        setAction(action => {
            if (!props.me) {
                return action;
            }
            
            if (action instanceof BuildSettlementAndRoad) {
                return new BuildSettlementAndRoad(props.game.id, action.landID, path.id);
            } else if (action instanceof BuildRoad) {
                return new BuildRoad(props.game.id, path.id);
            } else if (action instanceof PlayRoadBuildingCard) {
                const pathIDSet = new Set(action.pathIDs);
                pathIDSet.add(path.id);
                return new PlayRoadBuildingCard(props.game.id, action.developmentCardID, Array.from(pathIDSet).slice(-2))
            } else if (props.game.phase === GamePhase.Setup) {
                return new BuildSettlementAndRoad(props.game.id, undefined, path.id);
            } else {
                return new BuildRoad(props.game.id, path.id);
            }
        });
    }, [props.game, props.me]);

    const selectDices = useCallback(() => {
        setAction(action => {
            if (!props.me) {
                return action;
            }

            return new RollDices(props.game.id);
        })
    }, [props.game, props.me]);

    const selectConstruction = useCallback((construction: Construction) => {
        setAction(action => {
            if (!props.me || !props.me.constructions.includes(construction)) {
                return action;
            }

            return new UpgradeCity(props.game.id, construction.id);
        });
    }, [props.game, props.me]);

    const selectTerrain = useCallback((terrain: Terrain) => {
        setAction(action => {
            if (!props.me) {
                return action;
            }

            if (action instanceof PlayKnightCard) {
                return new PlayKnightCard(props.game.id, action.developmentCardID, terrain.id, action.playerID);
            } else if (action instanceof MoveRobber) {
                return new MoveRobber(props.game.id, terrain.id, action.playerID);
            } else {
                return new MoveRobber(props.game.id, terrain.id);
            }
        });
    }, [props.game, props.me]);

    const selectPlayer = useCallback((player: Player) => {        
        setAction(action => {
            if (!props.me || props.me === player) {
                return action;
            }

            if (action instanceof MoveRobber) {
                return new MoveRobber(props.game.id, action.terrainID, player.id);
            } else if (action instanceof PlayKnightCard) {
                return new PlayKnightCard(props.game.id, action.developmentCardID, action.terrainID, player.id);
            } else {
                return new SendTradeOffer(props.game.id, player.id);
            }
        });
    }, [props.game, props.me]);

    const selectDevelopmentCardOnTable = useCallback((developmentCard: DevelopmentCard) => {
        setAction(action => {
            if (!props.me || !props.me.developmentCards.includes(developmentCard)) {
                return action;
            }

            switch (developmentCard.type) {
                case DevelopmentCardType.Knight:
                    if (action instanceof PlayKnightCard) {
                        return new PlayKnightCard(props.game.id, developmentCard.id, action.terrainID, action.playerID);
                    }
                    return new PlayKnightCard(props.game.id, developmentCard.id);
                case DevelopmentCardType.RoadBuiding:
                    if (action instanceof PlayRoadBuildingCard) {
                        return new PlayRoadBuildingCard(props.game.id, developmentCard.id, action.pathIDs);
                    }
                    return new PlayRoadBuildingCard(props.game.id, developmentCard.id);
                case DevelopmentCardType.YearOfPlenty:
                    if (action instanceof PlayYearOfPlentyCard) {
                        return new PlayYearOfPlentyCard(props.game.id, developmentCard.id, action.demandingResourceCardTypes);
                    }
                    return new PlayYearOfPlentyCard(props.game.id, developmentCard.id);
                case DevelopmentCardType.Monopoly:
                    if (action instanceof PlayMonopolyCard) {
                        return new PlayMonopolyCard(props.game.id, developmentCard.id, action.demandingResourceCardType);
                    }
                    return new PlayMonopolyCard(props.game.id, developmentCard.id);
                case DevelopmentCardType.Chapel:
                case DevelopmentCardType.GreatHall:
                case DevelopmentCardType.Library:
                case DevelopmentCardType.Market:
                case DevelopmentCardType.University:
                    if (action instanceof PlayVictoryPointCard) {
                        return new PlayVictoryPointCard(props.game.id, developmentCard.id);
                    }
                    return new PlayVictoryPointCard(props.game.id, developmentCard.id);
            }
        });
    }, [props.game, props.me]);

    const selectDevelopmentCardOnBoard = useCallback(() => {
        setAction(action => {
            if (!props.me) {
                return action;
            }

            return new BuyDevelopmentCard(props.game.id);
        })
    }, [props.game, props.me]);

    const selectResourceCardOnTable = useCallback((resourceCard: ResourceCard) => {
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
                
                return new ToggleResourceCards(props.game.id, Array.from(resourceCardIDSet));
            } else if (action instanceof DiscardResourceCards) {
                const resourceCardIDSet = new Set(action.resourceCardIDs);
                if (resourceCardIDSet.has(resourceCard.id)) {
                    resourceCardIDSet.delete(resourceCard.id);
                } else {
                    resourceCardIDSet.add(resourceCard.id);
                }

                return new DiscardResourceCards(props.game.id, Array.from(resourceCardIDSet))
            } else if (props.game.phase === GamePhase.ResourceDiscard) {
                return new DiscardResourceCards(props.game.id, [resourceCard.id]);
            } else {
                return new ToggleResourceCards(props.game.id, [resourceCard.id]);
            }
        });
    }, [props.game, props.me]);

    const selectDemandingResourceCardType = useCallback((demandingResourceCardType: ResourceCardType) => {
        setAction(action => {
            if (!props.me) {
                return action;
            }

            if (action instanceof PlayYearOfPlentyCard) {
                return new PlayYearOfPlentyCard(props.game.id, action.developmentCardID, [...action.demandingResourceCardTypes || [], demandingResourceCardType].slice(-2));
            } else if (action instanceof PlayMonopolyCard) {
                return new PlayMonopolyCard(props.game.id, action.developmentCardID, demandingResourceCardType);
            }else if (action instanceof MaritimeTrade) {
                return new MaritimeTrade(props.game.id, action.resourceCardType, demandingResourceCardType);
            } else {
                return new MaritimeTrade(props.game.id, undefined, demandingResourceCardType);
            }
        });
    }, [props.game, props.me]);

    const selectResourceCardType = useCallback((resourceCardType: ResourceCardType) => {
        setAction(action => {
            if (!props.me) {
                return action;
            }

            if (action instanceof MaritimeTrade) {
                return new MaritimeTrade(props.game.id, resourceCardType, action.demandingResourceCardType);
            } else {
                return new MaritimeTrade(props.game.id, resourceCardType);
            }
        });
    }, [props.game, props.me]);

    const validateAction = useCallback((): boolean => {
        if (!action) {
            return false;
        }

        if (action instanceof BuildSettlementAndRoad) {
            if (!action.landID) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-land-you-want-to-build-settlement"),
                    })
                )
                return false;
            }

            if (!action.pathID) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-path-you-want-to-build-road"),
                    })
                )

                return false;
            }
        }

        if (action instanceof MaritimeTrade) {
            if (!action.demandingResourceCardType) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-resource-card-you-want-to-trade"),
                    })
                )

                return false;
            }

            if (!action.resourceCardType) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-resource-card-you-want-to-offer"),
                    })
                )

                return false;
            }
        }

        if (action instanceof PlayKnightCard) {
            if (!action.terrainID) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-terrain-which-robber-will-move-on"),
                    })
                )

                return false;
            }
        }

        if (action instanceof PlayRoadBuildingCard) {
            if (!action.pathIDs) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-at-least-one-path-you-want-to-build-road"),
                    })
                )

                return false;
            }
        }

        if (action instanceof PlayYearOfPlentyCard) {
            if (!action.demandingResourceCardTypes) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-at-least-one-resource-card-you-want-to-draw"),
                    })
                )

                return false;
            }
        }

        if (action instanceof PlayMonopolyCard) {
            if (!action.demandingResourceCardType) {
                dispatch(
                    addNotification({
                        type: NotificationType.Warning,
                        detail: t("notification:please-select-one-resource-card-you-want-to-gather-from-other-players"),
                    })
                )

                return false;
            }
        }

        return true;
    }, [action, dispatch, t])

    const confirmAction = useCallback(async() => {
        if (!action) {
            return;
        }

        if (!validateAction()) {
            return;
        };

        switch (action.constructor) {
            case BuildSettlementAndRoad:
                await buildSettlementAndRoad(action).unwrap();
                break;
            case RollDices:
                await rollDices(action).unwrap();
                break;
            case EndTurn:
                await endTurn(action).unwrap();
                break;
            case DiscardResourceCards:
                await discardResourceCards(action).unwrap();
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
            case SendTradeOffer:
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
            case PlayVictoryPointCard:
                await playVictoryPointCard(action).unwrap();
                break;
        }

        setAction(undefined);
    }, [action, validateAction, buildSettlementAndRoad, rollDices, endTurn, discardResourceCards, moveRobber, buildSettlement, buildRoad, upgradeCity, buyDevelopmentCard, toggleResourceCards, maritimeTrade, sendTradeOffer, playKnightCard, playRoadBuildingCard, playYearOfPlentyCard, playMonopolyCard, playVictoryPointCard]);

    const cancelAction = useCallback(() => {
        setAction(undefined);
    }, []);

    const handleEndTurn = useCallback(async() => {
        if (!props.me){
            return;
        }

        setAction(action => {
            return new EndTurn(props.game.id);
        });
    }, [props.game, props.me]);

    const handleConfirmTradeOffer = useCallback(async() => {
        if (!props.me){
            return;
        }

        await confirmTradeOffer(props.game.id).unwrap();

        setAction(undefined);
    }, [confirmTradeOffer, props.game, props.me]);

    const handleCancelTradeOffer = useCallback(async() => {
        if (!props.me){
            return;
        }

        await cancelTradeOffer(props.game.id).unwrap();
        
        setAction(undefined);
    }, [cancelTradeOffer, props.game, props.me]);

    return (
        <div className="flex flex-col w-full h-full dark:text-white">
            <div className="relative flex w-full h-full">
                <div className={classNames("relative w-full h-full sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:m-auto sm-h-and-aspect-4/3:aspect-square", {
                    "hidden": tab === Tab.Chat
                })}>
                    {
                        isInstructionShow &&
                            <Instruction me={props.me} hideInstruction={() => setInstructionShow(false)}/>
                    }

                    {
                        props.me?.receivedOffer &&
                            <ConfirmTradeOfferDialog game={props.game} me={props.me} confirmTradeOffer={handleConfirmTradeOffer} cancelTradeOffer={handleCancelTradeOffer}/>
                    }

                    <div className={classNames("absolute w-full h-full sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-6/8 sm-h-and-aspect-4/3:h-6/8 sm-h-and-aspect-4/3:top-1/2 sm-h-and-aspect-4/3:left-1/2 sm-h-and-aspect-4/3:-translate-x-1/2 sm-h-and-aspect-4/3:-translate-y-1/2 sm-h-and-aspect-4/3:z-10", {
                        "sm-h-and-aspect-4/3:w-full sm-h-and-aspect-4/3:h-full": isMapExpanded, 
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
                        selectDemandingResourceCardType={selectDemandingResourceCardType}
                        selectResourceCardType={selectResourceCardType}
                        confirmAction={confirmAction}
                        cancelAction={cancelAction}
                        endTurn={handleEndTurn}
                        toggleMapExpanded={() => setMapExpanded(isMapExpanded => !isMapExpanded)}
                        showInstruction={() => setInstructionShow(true)}/>
                    </div>

                    <div className={classNames("absolute flex flex-col w-full h-full top-0 left-0 sm-h-and-aspect-4/3:flex", {
                        "sm-h-and-aspect-4/3:hidden": isMapExpanded, 
                        "hidden": tab !== Tab.Players
                    })}>
                        <div className="flex sm-h-and-aspect-4/3:hidden dark:bg-slate-900">
                            {sortedPlayers.map(player => {
                                return (
                                    <div key={player.id} className={classNames("flex-auto flex p-2 border-t-2 border-slate-200 overflow-hidden shadow-inner-lg cursor-pointer dark:border-slate-600", PlayerColor.toColor(player.color), {
                                        "shadow-green-500": player === props.game.activePlayer,
                                        "!border-blue-400 dark:!border-blue-600": player.id === selectedPlayerID,
                                    })}
                                    onClick={() => setSelectedPlayerID(player.id)}>
                                        <DisplayName id={player.userID}/>
                                    </div>
                                )
                            })}                            
                        </div>
                        
                        <div className="flex-auto relative w-full">
                            {sortedPlayers.map((player, idx) => {
                                const tablePosition = ((idx: number) => {
                                    switch (idx) {
                                        case 0:
                                            return "sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-7/8 sm-h-and-aspect-4/3:h-1/8 sm-h-and-aspect-4/3:right-0 sm-h-and-aspect-4/3:bottom-0";
                                        case 1:
                                            return "sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-7/8 sm-h-and-aspect-4/3:h-1/8 sm-h-and-aspect-4/3:origin-bottom-left sm-h-and-aspect-4/3:rotate-90";
                                        case 2:
                                            return "sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-7/8 sm-h-and-aspect-4/3:h-1/8 sm-h-and-aspect-4/3:rotate-180";
                                        case 3:
                                            return "sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-7/8 sm-h-and-aspect-4/3:h-1/8 sm-h-and-aspect-4/3:right-0 sm-h-and-aspect-4/3:origin-bottom-right sm-h-and-aspect-4/3:-translate-y-full sm-h-and-aspect-4/3:-rotate-90";
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
                    </div>
                </div>

                <div className={classNames("flex-auto absolute w-full h-full sm-h-and-aspect-4/3:static sm-h-and-aspect-4/3:block sm-h-and-aspect-4/3:w-auto sm-h-and-aspect-4/3:h-auto dark:bg-slate-900", {
                    "hidden": tab !== Tab.Chat
                })}>
                    <MessageList roomID={props.game.id}/>
                </div>
            </div>
            
            <div className="flex h-12 sm-h-and-aspect-4/3:hidden dark:bg-slate-900">
                <div className={classNames("flex-auto flex flex-col p-2 border-t-2 border-slate-200 overflow-hidden cursor-pointer dark:border-slate-600", {
                    "!border-blue-400 dark:!border-blue-600": tab === Tab.Map
                })}
                onClick={() => setTab(Tab.Map)}>
                    <MapIcon className="mx-auto"/>
                </div>

                <div className={classNames("flex-auto flex flex-col p-2 border-t-2 border-slate-200 overflow-hidden cursor-pointer dark:border-slate-600", {
                    "border-blue-400 dark:!border-blue-600": tab === Tab.Players, 
                    "text-green-600": props.me === props.game.activePlayer
                })} onClick={() => setTab(Tab.Players)}>
                    <UserGroupIcon className="mx-auto"/>
                </div>

                <div className={classNames("flex-auto flex flex-col p-2 border-t-2 border-slate-200 overflow-hidden cursor-pointer dark:border-slate-600", {
                    "border-blue-400 dark:!border-blue-600": tab === Tab.Chat
                })}
                onClick={() => setTab(Tab.Chat)}>
                    <ChatBubbleLeftRightIcon className="mx-auto"/>
                </div>
            </div>
        </div>
    );
}

export default memo(GameStarted);