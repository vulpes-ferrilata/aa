import React, { Fragment, FunctionComponent, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ArrowsPointingInIcon, ArrowsPointingOutIcon, BanknotesIcon, Cog6ToothIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

import { Action, GameDetail, Land as LandModel, Path as PathModel, Construction as ConstructionModel, Terrain as TerrainModel, BuyDevelopmentCard, ResourceCardType, Player, GamePhase, DevelopmentCardType, MaritimeTrade } from 'features/catan/types';
import AchievementCard from './achievementCard';
import ResourceCard from './resourceCard';
import DevelopmentCard from './developmentCard';
import Terrain from './terrain';
import Land from './land';
import Path from './path';
import Harbor from './harbor';
import Dice from './dice';
import classNames from 'classnames';

interface IProps {
    game: GameDetail;
    me?: Player;
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
    showInstruction: () => void;
};

const enum Tab {
    Bank,
    Config,
};

const Board: FunctionComponent<IProps> = (props: IProps) => {
    const {t} = useTranslation("catan");

    const [tab, setTab] = useState<Tab>(Tab.Bank);
    const [mapScale, setMapScale] = useState<number>(1);

    const setScale = useCallback((value: number) => {
        setMapScale(prevScale => {
            if (value >= 0.5 && value <= 2 && value !== prevScale) {
                return value;
            }

            return prevScale;
        })
    }, []);

    const zoomIn = useCallback(() => {
        setMapScale(prevMapScale => {
            if (prevMapScale < 2) {
                return prevMapScale + 0.1;
            }

            return prevMapScale;
        })
    }, []);

    const zoomOut = useCallback(() => {
        setMapScale(prevMapScale => {
            if (prevMapScale > 1) {
                return prevMapScale - 0.1;
            }

            return prevMapScale;
        })
    }, []);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex h-1/6 rounded-md shadow-lg dark:bg-slate-800">
                {
                    tab === Tab.Bank?
                        <div className="flex-auto flex h-full p-2 overflow-y-hidden overflow-x-auto gap-4 transition-all">
                            {Object.values(ResourceCardType).filter(resourceCardType => resourceCardType !== ResourceCardType.Hidden).map((resourceCardType, i) => (
                                <div key={i} className={classNames("relative flex w-max h-full cursor-pointer", {
                                    "animate-pulse": props.action instanceof MaritimeTrade && props.action.resourceCardType === resourceCardType,
                                })}
                                onClick={() => props.selectResourceCard(resourceCardType)}>
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl">{props.game.resourceCards.reduce<number>((quantity, resourceCard) => resourceCard.type === resourceCardType? quantity + 1: quantity, 0)}</span>

                                    <div className="h-full mx-auto overflow-hidden aspect-2/3">
                                        <ResourceCard type={resourceCardType}/>
                                    </div>
                                </div>
                            ))}

                            <div className={classNames("relative flex w-max h-full cursor-pointer", {
                                "animate-pulse":  props.action instanceof BuyDevelopmentCard,
                            })}
                            onClick={() => props.selectDevelopmentCard()}>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl">{props.game.developmentCards.length}</span>

                                <div className="h-full mx-auto overflow-hidden aspect-2/3">
                                    <DevelopmentCard type={DevelopmentCardType.Hidden}/>
                                </div>
                            </div>

                            {props.game.achievements.map(achievement => (
                                <div key={achievement.id} className="h-full aspect-5/6">
                                    <AchievementCard type={achievement.type}/>
                                </div>
                            ))}
                        </div>
                    :
                        <div className="flex flex-col h-full aspect-square p-2 overflow-y-hidden overflow-x-auto transition-all cursor-pointer" onClick={() => setTab(Tab.Bank)}>
                            <BanknotesIcon/>
                        </div>
                }

                <div className="w-1 h-full bg-slate-200 dark:bg-slate-700"/>
                
                {
                    tab === Tab.Config?
                        <div className="flex-auto flex h-full p-2 overflow-y-hidden overflow-x-auto transition-all">
                            <div className="flex items-center justify-between w-full h-2/3 m-auto gap-4">
                                <div className="flex items-center h-full">
                                    <MagnifyingGlassMinusIcon className="h-full cursor-pointer" onClick={() => zoomOut()}/>

                                    <input type="range"
                                    min="0.5" value={mapScale} max="2" step="0.1"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    onChange={(e) => setScale(parseFloat(e.target.value))}/>
                                    
                                    <MagnifyingGlassPlusIcon className="h-full cursor-pointer" onClick={() => zoomIn()}/>
                                </div>

                                {
                                    props.isMapExpanded?
                                        <ArrowsPointingInIcon className="hidden h-full cursor-pointer sm-h-and-aspect-4/3:block" onClick={props.toggleMapExpanded}/>
                                    :
                                        <ArrowsPointingOutIcon className="hidden h-full cursor-pointer sm-h-and-aspect-4/3:block" onClick={props.toggleMapExpanded}/>
                                }
                            </div>
                        </div>
                    :
                        <div className="flex-none flex flex-col h-full aspect-square p-2 overflow-y-hidden overflow-x-auto transition-all cursor-pointer" onClick={() => setTab(Tab.Config)}>
                            <Cog6ToothIcon/>
                        </div>
                }
            </div>

            <div className="relative flex-auto overflow-auto">
                <div className="w-full h-full origin-top-left" style={{transform: `scale(${mapScale})`}}>
                    <div className="sticky"/> {/* fix broken display - overflow hidden of terrains not working - on ios when parent display scroll*/}
                    
                    {props.game.terrains.map(terrain => (
                        <Fragment key={terrain.id}>
                            <Terrain game={props.game} terrain={terrain} robber={terrain.robber} action={props.action} onClick={() => props.selectTerrain(terrain)}/>
                            {terrain.harbor && <Harbor game={props.game} harbor={terrain.harbor} terrain={terrain}/>}
                        </Fragment>
                    ))}

                    {props.game.paths.map(path => (
                        <Path key={path.id} game={props.game} me={props.me} path={path} action={props.action} onClick={() => props.selectPath(path)}/>
                    ))}

                    {[props.game.activePlayer, ...props.game.players].map(player => player.roads.map(road => {
                        return road.path && <Path key={road.path.id} game={props.game} me={props.me} path={road.path} player={player}/>;
                    }))}

                    {props.game.lands.map(land => (
                        <Land key={land.id} game={props.game} me={props.me} land={land} action={props.action} onClick={() => props.selectLand(land)}/>
                    ))}

                    {[props.game.activePlayer, ...props.game.players].map(player => player.constructions.map(construction => {
                        return construction.land && <Land key={construction.land.id} game={props.game} me={props.me} land={construction.land} construction={construction} player={player} action={props.action} onClick={() => props.selectConstruction(construction)}/>;
                    }
                    ))}
                </div>
            </div>

            <div className="flex justify-between h-12 p-2">
                <div className="flex gap-4 h-full w-fit cursor-pointer" onClick={() => props.selectDices()}>
                    {props.game.dices.map(dice => (
                        <div key={dice.id} className="h-full aspect-square">
                            <Dice game={props.game} dice={dice}/>
                        </div>
                    ))}
                </div>

                <input 
                type="button" 
                className="px-2 py-1 rounded-md shadow-md bg-blue-500 text-white cursor-pointer 
                hover:shadow-lg hover:bg-blue-400 active:shadow-md active:bg-blue-500 
                dark:bg-blue-900 dark:hover:bg-blue-800 dark:active:bg-blue-900"
                value={t("game.started.instruction-button")}
                onClick={() => props.showInstruction()}/>

                <div className="flex gap-2">
                    {
                            props.action?
                                <>
                                    <input 
                                    type="button" 
                                    className="px-2 py-1 rounded-md shadow-md bg-red-500 text-white cursor-pointer 
                                    hover:shadow-lg hover:bg-red-400 active:shadow-md active:bg-red-500 
                                    dark:bg-red-900 dark:hover:bg-red-800 dark:active:bg-red-900"
                                    value={t("game.started.cancel-button")}
                                    onClick={() => props.cancelAction()}/>
                                    
                                    <input 
                                    type="button" 
                                    className="px-2 py-1 rounded-md shadow-md bg-green-500 text-white cursor-pointer 
                                    hover:shadow-lg hover:bg-green-400 active:shadow-md active:bg-green-500 
                                    dark:bg-green-900 dark:hover:bg-green-800 dark:active:bg-green-900"
                                    value={t("game.started.confirm-button")}
                                    onClick={() => props.confirmAction()}/>                                    
                                </> 
                        :
                            props.game.activePlayer === props.me && props.game.phase === GamePhase.ResourceConsumption &&
                                <input 
                                type="button" 
                                className="ml-auto px-2 py-1 rounded-md shadow-md bg-red-500 text-white cursor-pointer 
                                hover:shadow-lg hover:bg-red-400 active:shadow-md active:bg-red-500 
                                dark:bg-red-900 dark:hover:bg-red-800 dark:active:bg-red-900"
                                value={t("game.started.end-turn-button")}
                                onClick={() => props.endTurn()}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default memo(Board, (prevProps, nextProps) => {
    return prevProps.game === nextProps.game &&
    prevProps.me === nextProps.me &&
    prevProps.action === nextProps.action &&
    prevProps.isMapExpanded === nextProps.isMapExpanded;
});