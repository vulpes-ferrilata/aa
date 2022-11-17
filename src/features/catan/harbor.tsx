import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';

import { GameDetail, Harbor as HarborModel, HarborType, Terrain as TerrainModel } from 'features/catan/types';
import Hex from 'features/catan/hex';
import classNames from 'classnames';

interface IProps {
    game: GameDetail;
    harbor: HarborModel;
    terrain: TerrainModel;
};

const Harbor: FunctionComponent<IProps> = (props: IProps) => {
    const [src, setSrc] = useState<string>();

    useEffect(() => {
        switch (props.harbor.type) {
            case HarborType.Lumber:
                import('assets/images/lumber_harbor.png').then(image => setSrc(image.default));
                break;
            case HarborType.Brick:
                import('assets/images/brick_harbor.png').then(image => setSrc(image.default));
                break;
            case HarborType.Wool:
                import('assets/images/wool_harbor.png').then(image => setSrc(image.default));
                break;
            case HarborType.Grain:
                import('assets/images/grain_harbor.png').then(image => setSrc(image.default));
                break;
            case HarborType.Ore:
                import('assets/images/ore_harbor.png').then(image => setSrc(image.default));
                break;
            case HarborType.General:
                import('assets/images/general_harbor.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.harbor.type]);

    const alt = useMemo(() => {
        switch (props.harbor.type) {
            case HarborType.Lumber:
                return "lumber harbor";
            case HarborType.Brick:
                return "brick harbor";
            case HarborType.Wool:
                return "wool harbor";
            case HarborType.Grain:
                return "grain harbor";
            case HarborType.Ore:
                return "ore harbor";
            case HarborType.General:
                return "general harbor";
        }
    }, [props.harbor.type]);

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

    }, [props.harbor, props.terrain]);

    const beachRotation = useMemo(() => {
        const directionQ = props.terrain.q - props.harbor.q;
        const directionR = props.terrain.r - props.harbor.r;
        
        switch (true) {
            case (directionQ === 1 && directionR === -1):
                return "30deg";
            case (directionQ === 1 && directionR === 0):
                return "90deg";
            case (directionQ === 0 && directionR === 1):
                return "150deg";
            case (directionQ === -1 && directionR === 1):
                return "-150deg";
            case (directionQ === -1 && directionR === 0):
                return "-90deg";
            case (directionQ === 0 && directionR === -1):
                return "-30deg";
        }
    }, [props.harbor, props.terrain])

    return (
        <Hex game={props.game} q={props.harbor.q} r={props.harbor.r}>
            <div className="w-full h-full -rotate-120 overflow-hidden">
                <div className="w-full h-full rotate-60 overflow-hidden">
                    <div className="w-full h-full rotate-60" style={{background: `linear-gradient(${beachRotation}, transparent 60%, rgb(202, 138, 4))`}}>
                        <div className={classNames("flex w-full h-full", rotation)}>
                            {
                                src?
                                    <img src={src} alt={alt} className="h-1/2 m-auto"/>
                                :
                                    <div className="w-1/2 h-1/2 bg-slate-100 animate-pulse"/>
                            }                
                        </div>
                    </div>
                </div>
            </div>
        </Hex>
    );
}

export default memo(Harbor);