import React, { useEffect, useMemo, useState } from 'react';

import Hex, { IProps as IHexProps } from './hex';

import { Action, Robber, Terrain as TerrainModel } from 'features/catan/api';

interface iProps {
    terrain: TerrainModel;
    robber?: Robber;
    action?: Action;
    onClick: () => void;
}

function Terrain(props: iProps & IHexProps) {
    const [src, setSrc] = useState<string>();
    const [robberSrc, setRobberSrc] = useState<string>();

    useEffect(() => {
        switch (props.terrain.type) {
            case "FOREST":
                import('assets/images/terrain-forest.jpg').then(image => setSrc(image.default));
                break;
            case "HILL":
                import('assets/images/terrain-hill.jpg').then(image => setSrc(image.default));
                break;
            case "PASTURE":
                import('assets/images/terrain-pasture.jpg').then(image => setSrc(image.default));
                break;
            case "FIELD":
                import('assets/images/terrain-field.jpg').then(image => setSrc(image.default));
                break;
            case "MOUNTAIN":
                import('assets/images/terrain-mountain.jpg').then(image => setSrc(image.default));
                break;
            case "DESERT":
                import('assets/images/terrain-desert.jpg').then(image => setSrc(image.default));
                break;
        }
    }, [props.terrain.type]);

    const alt = useMemo(() => {
        switch (props.terrain.type) {
            case "FOREST":
                return "forest terrain";
            case "HILL":
                return "hill terrain";
            case "PASTURE":
                return "pasture terrain";
            case "FIELD":
                return "field terrain";
            case "MOUNTAIN":
                return "mountain terrain";
            case "DESERT":
                return "desert terrain";
        }
    }, [props.terrain.type]);

    useEffect(() => {
        import("assets/images/robber.webp").then(image => setRobberSrc(image.default));
    }, [])

    const robberAlt = useMemo(() => {
        return "robber"
    }, []);

    return (
        <Hex game={props.game} q={props.terrain.q} r={props.terrain.r}>
            <div className="w-full h-full rotate-[240deg] overflow-hidden">
                <div className="w-full h-full rotate-[60deg] overflow-hidden">
                    <div className="relative w-full h-full rotate-[60deg] pointer-events-auto" onClick={props.onClick}>
                        {
                            src?
                                <img src={src} alt={alt} className="max-h-full"/>
                            :
                                <div className="w-full h-full bg-slate-100 animate-pulse"/>
                        }

                        <div className="absolute flex h-1/2 top-1/2 left-1/2 aspect-square bg-white rounded-full shadow-inner-lg -translate-x-1/2 -translate-y-1/2">
                            <div className="m-auto">
                                <label>{props.terrain.number}</label>
                            </div>
                        </div>

                        {
                            props.robber && (!props.action || !("terrainID" in props.action) || !props.action.terrainID)?
                                <div className="absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <img src={robberSrc} alt={robberAlt} className="max-h-full"/>
                                </div>                                
                            :
                                null
                        }

                        {
                            props.action && "terrainID" in props.action && props.action.terrainID === props.terrain.id?
                                <div className="absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                                    <img src={robberSrc} alt={robberAlt} className="max-h-full"/>
                                </div>                                
                            :
                                null
                        }
                    </div>
                </div>
            </div>
        </Hex>
    );
}

export default Terrain;