import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';

import Hex from 'features/catan/hex';
import { Action, GameDetail, Robber, Terrain as TerrainModel, TerrainType } from 'features/catan/types';

interface IProps {
    game: GameDetail;
    terrain: TerrainModel;
    robber?: Robber;
    action?: Action;
    onClick: () => void;
};

const Terrain: FunctionComponent<IProps> = (props: IProps) => {
    const [src, setSrc] = useState<string>();
    const [robberSrc, setRobberSrc] = useState<string>();

    useEffect(() => {
        switch (props.terrain.type) {
            case TerrainType.Forest:
                import('assets/images/forest_terrain.jpg').then(image => setSrc(image.default));
                break;
            case TerrainType.Hill:
                import('assets/images/hill_terrain.jpg').then(image => setSrc(image.default));
                break;
            case TerrainType.Pasture:
                import('assets/images/pasture_terrain.jpg').then(image => setSrc(image.default));
                break;
            case TerrainType.Field:
                import('assets/images/field_terrain.jpg').then(image => setSrc(image.default));
                break;
            case TerrainType.Mountain:
                import('assets/images/mountain_terrain.jpg').then(image => setSrc(image.default));
                break;
            case TerrainType.Desert:
                import('assets/images/desert_terrain.jpg').then(image => setSrc(image.default));
                break;
        }
    }, [props.terrain.type]);

    const alt = useMemo(() => {
        switch (props.terrain.type) {
            case TerrainType.Forest:
                return "forest terrain";
            case TerrainType.Hill:
                return "hill terrain";
            case TerrainType.Pasture:
                return "pasture terrain";
            case TerrainType.Field:
                return "field terrain";
            case TerrainType.Mountain:
                return "mountain terrain";
            case TerrainType.Desert:
                return "desert terrain";
        }
    }, [props.terrain.type]);

    useEffect(() => {
        import("assets/images/robber.png").then(image => setRobberSrc(image.default));
    }, []);

    return (
        <Hex game={props.game} q={props.terrain.q} r={props.terrain.r}>
            <div className="w-full h-full -rotate-120 overflow-hidden">
                <div className="w-full h-full rotate-60 overflow-hidden">
                    <div className="relative w-full h-full rotate-60 cursor-pointer pointer-events-auto" onClick={props.onClick}>
                        {
                            src?
                                <img src={src} alt={alt} className="max-h-full"/>
                            :
                                <div className="w-full h-full bg-slate-100 animate-pulse"/>
                        }

                        <div className="absolute flex h-1/2 top-1/2 left-1/2 aspect-square bg-white text-black rounded-full shadow-inner-lg shadow-black/50 -translate-x-1/2 -translate-y-1/2">
                            <div className="m-auto">
                                <span>{props.terrain.number}</span>
                            </div>
                        </div>

                        {
                            props.robber && (!props.action || !("terrainID" in props.action) || !props.action.terrainID) &&
                                <div className="absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <img src={robberSrc} alt="robber" className="max-h-full"/>
                                </div>
                        }

                        {
                            props.action && "terrainID" in props.action && props.action.terrainID === props.terrain.id &&
                                <div className="absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                                    <img src={robberSrc} alt="robber" className="max-h-full"/>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </Hex>
    );
}

export default memo(Terrain);