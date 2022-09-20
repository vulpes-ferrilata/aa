import React, { useState } from 'react'

import { Action, Game, Land as LandModel, Path as PathModel, Construction as ConstructionModel, Terrain as TerrainModel, BuyDevelopmentCard, RollDices, ResourceCardType } from 'features/catan/api'

import AchievementCard from './achievementCard'
import ResourceCard from './resourceCard'
import DevelopmentCard from './developmentCard'
import Terrain from './terrain'
import Land from './land'
import Path from './path'
import Harbor from './harbor'
import Dice from './dice'
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, BanknotesIcon, Cog6ToothIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

interface iProps {
    game: Game;
    action?: Action;
    isMapExpanded: boolean;
    selectLand: (land: LandModel) => void;
    selectPath: (path: PathModel) => void;
    selectDices: () => void;
    selectConstruction: (construction: ConstructionModel) => void;
    selectTerrain: (terrain: TerrainModel) => void;
    selectDevelopmentCard: () => void;
    selectResourceCard: (resourceCardType: ResourceCardType) => void;
    confirmAction: () => void;
    cancelAction: () => void;
    endTurn: () => void;
    toggleMapExpanded: () => void;
}

type Tab = "BANK" | "CONFIG"

function Board(props: iProps) {
    const {t} = useTranslation("catan");

    const [tab, setTab] = useState<Tab>("BANK");
    const [mapScale, setMapScale] = useState<number>(1);

    const zoomIn = () => {
        setMapScale(mapScale => {
            if (mapScale < 2) {
                return mapScale + 0.1;
            }
            return mapScale;
        })
    }

    const zoomOut = () => {
        setMapScale(mapScale => {
            if (mapScale > 1) {
                return mapScale - 0.1;
            }
            return mapScale;
        })
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex h-1/6 rounded-md shadow-lg">
                {
                    tab === "BANK"?
                        <div className="flex-auto flex h-full p-2 overflow-y-hidden overflow-x-auto">
                            <div className="flex h-full mx-auto">
                                {(["LUMBER", "BRICK", "WOOL", "GRAIN", "ORE"] as ResourceCardType[]).map((resourceCardType, i) => (
                                    <div key={i} className={`flex flex-col h-full mx-2 text-center ${props.action && "resourceCardType" in props.action && props.action.resourceCardType === resourceCardType? "animate-pulse": ""} ${props.game.me?.isActive && (!props.action || !("resourceCardType" in props.action) || props.action.resourceCardType !== resourceCardType) && props.game.turn > 2 && props.game.phase === "RESOURCE_CONSUMPTION"? "hover:animate-pulse": ""}`} onClick={() => props.selectResourceCard(resourceCardType)}>
                                        <label>{props.game.resourceCards.reduce<number>((quantity, resourceCard) => resourceCard.type === resourceCardType? quantity + 1: quantity, 0)}</label>

                                        <div className="h-full mx-auto overflow-hidden">
                                            <ResourceCard type={resourceCardType}/>
                                        </div>                    
                                    </div>
                                ))}

                                <div className={`flex flex-col h-full mx-2 text-center ${props.action instanceof BuyDevelopmentCard? "animate-pulse": ""}`} onClick={() => props.selectDevelopmentCard()}>
                                    <label>{props.game.developmentCards.length}</label>

                                    <div className="h-full mx-auto overflow-hidden">
                                        <DevelopmentCard type={"HIDDEN"}/>
                                    </div>
                                </div>

                                {props.game.achievements.map(achievement => (
                                    <div key={achievement.id} className="flex h-full mx-2">
                                        <div className="h-full m-auto text-center">
                                            <div className="h-full">
                                                <AchievementCard type={achievement.type}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    :
                        <div className="flex flex-col h-full aspect-square p-2 overflow-y-hidden overflow-x-auto" onClick={() => setTab("BANK")}>
                            <BanknotesIcon/>
                        </div>
                }

                <div className="w-1 h-full bg-slate-200"/>
                
                {
                    tab === "CONFIG"?
                        <div className="flex-auto flex h-full p-2 overflow-y-hidden overflow-x-auto">
                            <div className="flex h-1/2 m-auto gap-4">
                                <MagnifyingGlassMinusIcon className="h-full" onClick={zoomOut}/>
                                <MagnifyingGlassPlusIcon className="h-full" onClick={zoomIn}/>
                                {
                                    props.isMapExpanded?
                                        <ArrowsPointingInIcon className="h-full" onClick={props.toggleMapExpanded}/>
                                    :
                                        <ArrowsPointingOutIcon className="h-full" onClick={props.toggleMapExpanded}/>
                                }
                            </div>
                        </div>
                    :
                        <div className="flex-none flex flex-col h-full aspect-square p-2 overflow-y-hidden overflow-x-auto" onClick={() => setTab("CONFIG")}>
                            <Cog6ToothIcon/>
                        </div>
                }
            </div>

            <div className="relative flex-auto overflow-auto">
                <div className="w-full h-full origin-top-left" style={{transform: `scale(${mapScale})`}}>
                    {props.game.terrains.map(terrain => {
                        let jsxes = []
                        jsxes.push(<Terrain key={terrain.id} game={props.game} terrain={terrain} robber={terrain.robber} action={props.action} onClick={() => props.selectTerrain(terrain)}/>);
                        terrain.harbor && jsxes.push(<Harbor key={terrain.harbor.id} game={props.game} harbor={terrain.harbor} terrain={terrain}/>)
                        return jsxes;
                    })}

                    {props.game.paths.map(path => (
                        <Path key={path.id} game={props.game} path={path} action={props.action} onClick={() => props.selectPath(path)}/>
                    ))}

                    {props.game.me?.roads.map(road => {
                        if (road.path) {
                            return <Path key={road.path.id} game={props.game} path={road.path} player={props.game.me}/>; 
                        }
                        return null;
                    })}

                    {props.game.players.map(player => player.roads.map(road => {
                        if (road.path) {
                            return <Path key={road.path.id} game={props.game} path={road.path} player={player}/>;
                        }
                        return null;
                    }
                    ))}

                    {props.game.lands.map(land => (
                        <Land key={land.id} game={props.game} land={land} action={props.action} onClick={() => props.selectLand(land)}/>
                    ))}

                    {props.game.me?.constructions.map(construction => {
                        if (construction.land) {
                            return <Land key={construction.land.id} game={props.game} land={construction.land} construction={construction} player={props.game.me} action={props.action} onClick={() => props.selectConstruction(construction)}/>;
                        }
                        return null;
                    })}

                    {props.game.players.map(player => player.constructions.map(construction => {
                        if (construction.land) {
                            return <Land key={construction.land.id} game={props.game} land={construction.land} construction={construction} player={player} action={props.action}/>;
                        }
                        return null;
                    }
                    ))}
                </div>
            </div>

            <div className="flex h-12 p-2">
                <div className={`flex gap-4 h-full ${props.action instanceof RollDices? "animate-pulse": ""} ${!props.action && props.game.turn > 2 && props.game.phase === "RESOURCE_PRODUCTION"? "hover:animate-pulse": ""}`} onClick={() => props.selectDices()}>
                    {props.game.dices.map(dice => (
                        <div key={dice.id} className="h-full aspect-square">
                            <Dice dice={dice}/>
                        </div>
                    ))}
                </div>

                <div className="ml-auto">
                    {
                            props.action?
                                <>
                                    <input type="button" className="px-2 py-1 rounded-md shadow-lg shadow-red-500/50 bg-red-500 text-white cursor-pointer hover:shadow-md hover:shadow-red-400/50 hover:bg-red-400 active:shadow-lg active:shadow-red-500/50 active:bg-red-500" value={t("game.started.cancel-button")} onClick={() => props.cancelAction()}/>
                                    <input type="button" className="ml-2 px-2 py-1 rounded-md shadow-lg shadow-green-500/50 bg-green-500 text-white cursor-pointer hover:shadow-md hover:shadow-green-400/50 hover:bg-green-400 active:shadow-lg active:shadow-green-500/50 active:bg-green-500" value={t("game.started.confirm-button")} onClick={() => props.confirmAction()}/>
                                </> 
                        :
                            null
                    }

                    {
                        props.game.me?.isActive && !props.action?
                            <input type="button" className="px-2 py-1 rounded-md shadow-lg shadow-red-500/50 bg-red-500 text-white cursor-pointer hover:shadow-md hover:shadow-red-400/50 hover:bg-red-400 active:shadow-lg active:shadow-red-500/50 active:bg-red-500" value={t("game.started.end-turn-button")} onClick={() => props.endTurn()}/>
                        :
                            null 
                    }
                </div>
            </div>
        </div>
    );
}

export default Board;