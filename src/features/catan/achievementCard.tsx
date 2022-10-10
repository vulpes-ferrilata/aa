import React, { useEffect, useMemo, useState } from 'react';
import { AchievementType } from 'features/catan/api';

interface IProps {
    type: AchievementType;
};

function ResourceCard(props: IProps) {
    const [src, setSrc] = useState<string>();
    
    useEffect(() => {
        switch (props.type) {
            case "LONGEST_ROAD":
                import('assets/images/achievement-longest-road.png').then(image => setSrc(image.default));
                break;
            case "LARGEST_ARMY":
                import('assets/images/achievement-largest-army.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.type])

    const alt = useMemo(() => {
        switch (props.type) {
            case "LONGEST_ROAD":
                return "longest road achievement card";
            case "LARGEST_ARMY":
                return "largest army achievement card";
        }
    }, [props.type])

    return (
        <div className="h-full aspect-5/6">
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