import React, { useEffect, useMemo, useState } from 'react';
import { DevelopmentCardType } from 'features/catan/api';

export interface IProps {
    type: DevelopmentCardType;
};

function ResourceCard(props: IProps) {
    const [src, setSrc] = useState<string>();
    
    useEffect(() => {
        switch (props.type) {
            case "KNIGHT":
                import('assets/images/development-knight.png').then(image => setSrc(image.default));
                break;
            case "MONOPOLY":
                import('assets/images/development-monopoly.png').then(image => setSrc(image.default));
                break;
            case "ROAD_BUILDING":
                import('assets/images/development-road-building.png').then(image => setSrc(image.default));
                break;
            case "YEAR_OF_PLENTY":
                import('assets/images/development-year-of-plenty.png').then(image => setSrc(image.default));
                break;
            case "VICTORY_POINTS":
                import('assets/images/development-library.png').then(image => setSrc(image.default));
                break;
            case "HIDDEN":
                import('assets/images/development-hidden.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.type])

    const alt = useMemo(() => {
        switch (props.type) {
            case "KNIGHT":
                return "knight development card";
            case "MONOPOLY":
                return "monopoly development card";
            case "ROAD_BUILDING":
                return "road building development card";
            case "YEAR_OF_PLENTY":
                return "year of plenty development card";
            case "VICTORY_POINTS":
                return "victory point development card";
            case "HIDDEN":
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

export default ResourceCard;