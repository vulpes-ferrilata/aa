import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';

import { DevelopmentCardType } from 'features/catan/types';

export interface IProps {
    type: DevelopmentCardType;
};

const DevelopmentCard: FunctionComponent<IProps> = (props: IProps) => {
    const [src, setSrc] = useState<string>();
    
    useEffect(() => {
        switch (props.type) {
            case DevelopmentCardType.Knight:
                import('assets/images/knight_development_card.png').then(image => setSrc(image.default));
                break;
            case DevelopmentCardType.Monopoly:
                import('assets/images/monopoly_development_card.png').then(image => setSrc(image.default));
                break;
            case DevelopmentCardType.RoadBuiding:
                import('assets/images/road_building_development_card.png').then(image => setSrc(image.default));
                break;
            case DevelopmentCardType.YearOfPlenty:
                import('assets/images/year_of_plenty_development_card.png').then(image => setSrc(image.default));
                break;
            case DevelopmentCardType.VictoryPoint:
                import('assets/images/library_development_card.png').then(image => setSrc(image.default));
                break;
            case DevelopmentCardType.Hidden:
                import('assets/images/hidden_development_card.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.type])

    const alt = useMemo(() => {
        switch (props.type) {
            case DevelopmentCardType.Knight:
                return "knight development card";
            case DevelopmentCardType.Monopoly:
                return "monopoly development card";
            case DevelopmentCardType.RoadBuiding:
                return "road building development card";
            case DevelopmentCardType.YearOfPlenty:
                return "year of plenty development card";
            case DevelopmentCardType.VictoryPoint:
                return "victory point development card";
            case DevelopmentCardType.Hidden:
                return "hidden development card";
        }
    }, [props.type])

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

export default memo(DevelopmentCard);