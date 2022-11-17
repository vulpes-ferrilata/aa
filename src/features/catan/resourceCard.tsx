import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';

import { ResourceCardType } from 'features/catan/types';

interface IProps {
    type: ResourceCardType;
};

const ResourceCard: FunctionComponent<IProps> = (props: IProps) => {
    const [src, setSrc] = useState<string>();
    
    useEffect(() => {
        switch (props.type) {
            case ResourceCardType.Lumber:
                import('assets/images/lumber_resource_card.png').then(image => setSrc(image.default));
                break;
            case ResourceCardType.Brick:
                import('assets/images/brick_resource_card.png').then(image => setSrc(image.default));
                break;
            case ResourceCardType.Wool:
                import('assets/images/wool_resource_card.png').then(image => setSrc(image.default));
                break;
            case ResourceCardType.Grain:
                import('assets/images/grain_resource_card.png').then(image => setSrc(image.default));
                break;
            case ResourceCardType.Ore:
                import('assets/images/ore_resource_card.png').then(image => setSrc(image.default));
                break;
            case ResourceCardType.Hidden:
                import('assets/images/hidden_resource_card.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.type]);

    const alt = useMemo(() => {
        switch (props.type) {
            case ResourceCardType.Lumber:
                return "lumber resource card";
            case ResourceCardType.Brick:
                return "brick resource card";
            case ResourceCardType.Wool:
                return "wool resource card";
            case ResourceCardType.Grain:
                return "grain resource card";
            case ResourceCardType.Ore:
                return "ore resource card";
            case ResourceCardType.Hidden:
                return "hidden resource card";
        }
    }, [props.type]);

    return (
        <div className="h-full aspect-2/3">
            {
                src?
                    <img src={src} alt={alt} className="max-h-full"/>
                :
                    <div className="w-full h-full bg-slate-100 animate-pulse"/>
            }     
        </div>   
    );
}

export default memo(ResourceCard);