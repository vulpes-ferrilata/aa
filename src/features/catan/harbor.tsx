import React, { useEffect, useMemo, useState } from 'react';

import Hex, { IProps as IHexProps } from './hex';

import { Harbor as HarborModel, Terrain as TerrainModel } from 'features/catan/api';

interface iProps {
    harbor: HarborModel;
    terrain: TerrainModel;
}

function Harbor(props: iProps & IHexProps) {
    const [src, setSrc] = useState<string>();

    useEffect(() => {
        switch (props.harbor.type) {
            case "LUMBER":
                import('assets/images/harbor-lumber.png').then(image => setSrc(image.default));
                break;
            case "BRICK":
                import('assets/images/harbor-brick.png').then(image => setSrc(image.default));
                break;
            case "WOOL":
                import('assets/images/harbor-wool.png').then(image => setSrc(image.default));
                break;
            case "GRAIN":
                import('assets/images/harbor-grain.png').then(image => setSrc(image.default));
                break;
            case "ORE":
                import('assets/images/harbor-ore.png').then(image => setSrc(image.default));
                break;
            case "GENERAL":
                import('assets/images/harbor-general.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.harbor.type]);

    const alt = useMemo(() => {
        switch (props.harbor.type) {
            case "LUMBER":
                return "lumber harbor";
            case "BRICK":
                return "brick harbor";
            case "WOOL":
                return "wool harbor";
            case "GRAIN":
                return "grain harbor";
            case "ORE":
                return "ore harbor";
            case "GENERAL":
                return "general harbor";
        }
    }, [props.harbor.type])

    const rotation = useMemo(() => {
        const directionQ = props.terrain.q - props.harbor.q;
        const directionR = props.terrain.r - props.harbor.r;
        
        switch (true) {
            case (directionQ === 1 && directionR === -1):
                return "rotate-[30deg]";
            case (directionQ === 1 && directionR === 0):
                return "rotate-[90deg]";
            case (directionQ === 0 && directionR === 1):
                return "rotate-[150deg]";
            case (directionQ === -1 && directionR === 1):
                return "-rotate-[150deg]";
            case (directionQ === -1 && directionR === 0):
                return "-rotate-[90deg]";
            case (directionQ === 0 && directionR === -1):
                return "-rotate-[30deg]";
        }

    }, [props.harbor, props.terrain])

    return (
        <Hex game={props.game} q={props.harbor.q} r={props.harbor.r}>
            <div className={`flex w-full h-full ${rotation}`}>
                {
                    src?
                        <img src={src} alt={alt} className="h-1/2 m-auto"/>
                    :
                        <div className="w-1/2 h-1/2 bg-slate-100 animate-pulse"/>
                }                
            </div>
        </Hex>
    );
}

export default Harbor;