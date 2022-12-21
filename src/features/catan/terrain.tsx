import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Hex from 'features/catan/hex';
import { Action, GameDetail, Robber as RobberModel, Terrain as TerrainModel, TerrainType } from 'features/catan/types';
import ForestTerrain from 'assets/images/forest_terrain.jpg';
import ForestTerrainPlaceholder from 'assets/images/forest_terrain_placeholder.jpg';
import HillTerrain from 'assets/images/hill_terrain.jpg';
import HillTerrainPlaceholder from 'assets/images/hill_terrain_placeholder.jpg';
import PastureTerrain from 'assets/images/pasture_terrain.jpg';
import PastureTerrainPlaceholder from 'assets/images/pasture_terrain_placeholder.jpg';
import FieldTerrain from 'assets/images/field_terrain.jpg';
import FieldTerrainPlaceholder from 'assets/images/field_terrain_placeholder.jpg';
import MountainTerrain from 'assets/images/mountain_terrain.jpg';
import MountainTerrainPlaceholder from 'assets/images/mountain_terrain_placeholder.jpg';
import DesertTerrain from 'assets/images/desert_terrain.jpg';
import DesertTerrainPlaceholder from 'assets/images/desert_terrain_placeholder.jpg';
import Robber from 'assets/images/robber.png';

interface IProps {
    game: GameDetail;
    terrain: TerrainModel;
    robber?: RobberModel;
    action?: Action;
    onClick: () => void;
};

const Terrain: FunctionComponent<IProps> = (props: IProps) => {
    const terrainImage = useMemo(() => {
        switch (props.terrain.type) {
            case TerrainType.Forest:
                return (
                    <LazyLoadImage
                    src={ForestTerrain}
                    placeholderSrc={ForestTerrainPlaceholder}
                    alt="forest terrain"/>
                );
            case TerrainType.Hill:
                return (
                    <LazyLoadImage
                    src={HillTerrain}
                    placeholderSrc={HillTerrainPlaceholder}
                    alt="hill terrain"/>
                );
            case TerrainType.Pasture:
                return (
                    <LazyLoadImage
                    src={PastureTerrain}
                    placeholderSrc={PastureTerrainPlaceholder}
                    alt="pasture terrain"/>
                );
            case TerrainType.Field:
                return (
                    <LazyLoadImage
                    src={FieldTerrain}
                    placeholderSrc={FieldTerrainPlaceholder}
                    alt="field terrain"/>
                );
            case TerrainType.Mountain:
                return (
                    <LazyLoadImage
                    src={MountainTerrain}
                    placeholderSrc={MountainTerrainPlaceholder}
                    alt="mountain terrain"/>
                );
            case TerrainType.Desert:
                return (
                    <LazyLoadImage
                    src={DesertTerrain}
                    placeholderSrc={DesertTerrainPlaceholder}
                    alt="desert terrain"/>
                );
        }
    }, [props.terrain.type]);

    return (
        <Hex game={props.game} q={props.terrain.q} r={props.terrain.r}>
            <div className="w-full h-full -rotate-120 overflow-hidden">
                <div className="w-full h-full rotate-60 overflow-hidden">
                    <div className="relative w-full h-full rotate-60 cursor-pointer pointer-events-auto" onClick={props.onClick}>
                        {terrainImage}

                        <div className="absolute flex h-1/2 top-1/2 left-1/2 aspect-square bg-white text-black rounded-full shadow-inner-lg shadow-black/50 -translate-x-1/2 -translate-y-1/2">
                            <div className="m-auto">
                                <span>{props.terrain.number}</span>
                            </div>
                        </div>

                        {
                            props.robber && (!props.action || !("terrainID" in props.action) || !props.action.terrainID) &&
                                <div className="absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <LazyLoadImage
                                    className="max-h-full"
                                    src={Robber}
                                    alt="robber"/>
                                </div>
                        }

                        {
                            props.action && "terrainID" in props.action && props.action.terrainID === props.terrain.id &&
                                <div className="absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                                    <LazyLoadImage
                                    className="max-h-full"
                                    src={Robber}
                                    alt="robber"/>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </Hex>
    );
}

export default memo(Terrain);