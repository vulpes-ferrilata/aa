import { MapIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import DisplayName from 'features/user/displayName';
import React, { useMemo, useState } from 'react';

import { Action, BuildRoad, BuildSettlement, BuildSettlementAndRoad, BuyDevelopmentCard, Construction, Game, Land, MaritimeTrade, MoveRobber, OfferTrading, Path, Player, ResourceCard, ResourceCardType, RollDices, Terrain, ToggleResourceCards, UpgradeCity, useBuildRoadMutation, useBuildSettlementAndRoadMutation, useBuildSettlementMutation, useBuyDevelopmentCardMutation, useConfirmTradingMutation, useEndTurnMutation, useMaritimeTradeMutation, useMoveRobberMutation, useOfferTradingMutation, useRollDicesMutation, useToggleResourceCardsMutation, useUpgradeCityMutation, useCancelTradingMutation, usePlayKnightCardMutation, usePlayRoadBuildingCardMutation, usePlayYearOfPlentyCardMutation, usePlayMonopolyCardMutation, PlayKnightCard, PlayRoadBuildingCard, PlayYearOfPlentyCard, PlayMonopolyCard, DevelopmentCard, PlayerColor } from 'features/catan/api';
import Board from './board';
import ConfirmTrading from './confirmTrading';
import ResourceCardSelection from './resourceCardSelection';
import Table from './table';

interface iProps {
    game: Game;
}

type Tab = "MAP" | "PLAYERS"

function GameStarted(props: iProps) {
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
    const [offerTrading] = useOfferTradingMutation();
    const [confirmTrading] = useConfirmTradingMutation();
    const [cancelTrading] = useCancelTradingMutation();
    const [playKnightCard] = usePlayKnightCardMutation();
    const [playRoadBuildingCard] = usePlayRoadBuildingCardMutation();
    const [playYearOfPlentyCard] = usePlayYearOfPlentyCardMutation();
    const [playMonopolyCard] = usePlayMonopolyCardMutation();

    const [action, setAction] = useState<Action>();
    const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
    const [tab, setTab] = useState<Tab>("MAP");

    const player1 = useMemo(() => props.game.me?? props.game.players.find(player => player.turnOrder === 1), [props.game.me, props.game.players])
    const player2 = useMemo(() => props.game.me? props.game.players.find(player => props.game.me && player.turnOrder === props.game.me.turnOrder+1)?? props.game.players.find(player => props.game.me && player.turnOrder === props.game.me.turnOrder-3): props.game.players.find(player => player.turnOrder === 2), [props.game.me, props.game.players])
    const player3 = useMemo(() => props.game.me? props.game.players.find(player => props.game.me && player.turnOrder === props.game.me.turnOrder+2)?? props.game.players.find(player => props.game.me && player.turnOrder === props.game.me.turnOrder-2): props.game.players.find(player => player.turnOrder === 3), [props.game.me, props.game.players])
    const player4 = useMemo(() => props.game.me? props.game.players.find(player => props.game.me && player.turnOrder === props.game.me.turnOrder+3)?? props.game.players.find(player => props.game.me && player.turnOrder === props.game.me.turnOrder-1): props.game.players.find(player => player.turnOrder === 4), [props.game.me, props.game.players])

    const [selectedPlayerID, setSelectedPlayerID] = useState<string | undefined>(player1?.id);

    const selectLand = (land: Land) => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
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
            if (!props.game.me || !props.game.me.isActive) {
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

    const selectDices = () => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
                return action;
            }

            if (props.game.turn > 2 && props.game.phase === "RESOURCE_PRODUCTION") {
                return new RollDices(props.game.id);
            }
            
            return action;
        });
    }

    const selectConstruction = (construction: Construction) => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
                return action;
            }

            if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new UpgradeCity(props.game.id, construction.id);
            }

            return action
        });
    }

    const selectTerrain = (terrain: Terrain) => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
                return action;
            }

            if (action instanceof PlayKnightCard) {
                return new PlayKnightCard(action.gameID, action.developmentCardID, terrain.id, action.playerID);
            } else if (props.game.turn > 2 && props.game.phase === "ROBBING") {
                return new MoveRobber(props.game.id, terrain.id);
            } 

            return action;
        });
    }

    const selectPlayer = (player: Player) => {        
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive || player.id === props.game.me.id) {
                return action;
            }

            if (action instanceof MoveRobber) {
                return new MoveRobber(action.gameID, action.terrainID, player.id);
            } else if (action instanceof PlayKnightCard) {
                return new PlayKnightCard(action.gameID, action.developmentCardID, action.terrainID, player.id);
            } else if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new OfferTrading(props.game.id, player.id);
            }

            return action;
        });
    }

    const selectDevelopmentCardOnTable = (developmentCard: DevelopmentCard) => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
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
    }

    const selectDevelopmentCardOnBoard = () => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
                return action;
            }

            if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new BuyDevelopmentCard(props.game.id);
            }

            return action;
        })
    }

    const selectResourceCardOnTable = (resourceCard: ResourceCard) => {
        setAction(action => {
            if (!props.game.me || !props.game.me.resourceCards.includes(resourceCard)) {
                return action;
            }

            if (action instanceof ToggleResourceCards) {
                const resourceCardIDSet = new Set(action.resourceCardIDs);
                resourceCardIDSet.add(resourceCard.id);
                return new ToggleResourceCards(action.gameID, Array.from(resourceCardIDSet));
            } else if (props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION") {
                return new ToggleResourceCards(props.game.id, [resourceCard.id]);
            }

            return action;
        });
    }

    const selectResourceCardOnBoard = (resourceCardType: ResourceCardType) => {
        setAction(action => {
            if (!props.game.me || !props.game.me.isActive) {
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
    }

    const confirmAction = async() => {
        if (!action) {
            return;
        }

        switch (action.constructor) {
            case BuildSettlementAndRoad:
                await buildSettlementAndRoad(action).unwrap();
                break;
            case RollDices:
                await rollDices(action).unwrap();
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
                await offerTrading(action).unwrap();
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
    }

    const cancelAction = () => {
        setAction(undefined);
    }

    const handleEndTurn = async() => {
        if (!props.game.me || !props.game.me.isActive){
            return;
        }

        await endTurn(props.game.id).unwrap();
        setAction(undefined);
    }

    const handleConfirmTrading = async() => {
        if (!props.game.me){
            return;
        }

        await confirmTrading(props.game.id).unwrap();
        setAction(undefined);
    }

    const handleCancelTrading = async() => {
        if (!props.game.me){
            return;
        }

        await cancelTrading(props.game.id).unwrap();
        setAction(undefined);
    }

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
    }

    return (
        <div className="flex flex-col w-full h-full sm:w-auto sm:m-auto sm:aspect-square">
            <div className="flex-auto relative">
                {
                    props.game.me?.isOffered?
                        <ConfirmTrading game={props.game} onConfirm={handleConfirmTrading} onCancel={handleCancelTrading}/>
                    :
                        null
                }

                {
                    (action instanceof PlayYearOfPlentyCard || action instanceof PlayMonopolyCard)?
                        <ResourceCardSelection game={props.game} action={action} selectResourceCard={selectResourceCardOnBoard} onConfirm={confirmAction} onCancel={cancelAction}/>
                    :
                        null
                } 

                <div className={`absolute w-full h-full transition-all sm:block sm:w-6/8 sm:h-6/8 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:z-10 ${isMapExpanded? "sm:w-full sm:h-full" : ""} ${tab === "MAP"? "": "hidden"}`}>
                    <Board game={props.game} 
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

                <div className={`absolute flex flex-col w-full h-full top-0 left-0 bg-white sm:flex sm:bg-transparent ${isMapExpanded? "sm:hidden" : ""} ${tab === "PLAYERS"? "": "hidden"}`}>
                    <div className="flex border-b border-gray-200 gap-4 sm:hidden">
                        {([player1, player2, player3, player4] as Player[]).map(player => {
                            if (!player) {
                                return null;
                            }
                            
                            return (
                                <div key={player.id} className={`flex w-1/4 p-2 border-b-2 overflow-hidden ${getPlayerColor(player.color)} ${player.isActive? "shadow-inner-lg shadow-green-500": ""} ${selectedPlayerID === player.id? "border-blue-400": "border-transparent"}`} onClick={() => setSelectedPlayerID(player.id)}>
                                    <DisplayName id={player.userID}/>
                                </div>
                            )
                        })}                            
                    </div>

                    <div className="flex-auto relative w-full">
                        {([player1, player2, player3, player4] as Player[]).map(player => {
                            if (!player) {
                                return null;
                            }

                            let className;

                            switch (player) {
                                case player1:
                                    className = "sm:block sm:w-7/8 sm:h-1/8 sm:right-0 sm:bottom-0";
                                    break;
                                case player2:
                                    className = "sm:block sm:w-7/8 sm:h-1/8 sm:origin-bottom-left sm:rotate-90";
                                    break;
                                case player3:
                                    className = "sm:block sm:w-7/8 sm:h-1/8 sm:rotate-180";
                                    break;
                                case player4:
                                    className = "sm:block sm:w-7/8 sm:h-1/8 sm:right-0 sm:origin-bottom-right sm:-translate-y-full sm:-rotate-90";
                                    break;
                            }

                            return (
                                <div key={player.id} className={`absolute w-full h-full ${className} ${selectedPlayerID !== player.id? "hidden": ""}`}>
                                    <Table game={props.game} player={player} action={action} selectPlayer={() => selectPlayer(player)} selectResourceCard={selectResourceCardOnTable} selectDevelopmentCard={selectDevelopmentCardOnTable}/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <div className="flex h-12 border-t border-gray-200 gap-4 sm:hidden">
                <div className={`flex w-1/2 p-2 border-t-2 border-transparent text-gray-500 overflow-hidden ${tab === "MAP"? "!border-blue-400": ""}`} onClick={() => setTab("MAP")}>
                    <MapIcon className="mx-auto"/>
                </div>

                <div className={`flex w-1/2 p-2 border-t-2 overflow-hidden ${tab === "PLAYERS"? "border-blue-400": "border-transparent"} ${props.game.me?.isActive? "text-green-500": "text-gray-500"}`} onClick={() => setTab("PLAYERS")}>
                    <UserGroupIcon className="mx-auto"/>
                </div>
            </div>
        </div>  
    );
}

export default GameStarted;