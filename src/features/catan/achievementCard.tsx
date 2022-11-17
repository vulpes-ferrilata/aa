import React, { FunctionComponent, memo, useEffect, useMemo, useState } from 'react';

import { AchievementType } from 'features/catan/types';

interface IProps {
    type: AchievementType;
};

const AchievementCard: FunctionComponent<IProps> = (props: IProps) => {
    const [src, setSrc] = useState<string>();
    
    useEffect(() => {
        switch (props.type) {
            case AchievementType.LongestRoad:
                import('assets/images/longest_road_achievement_card.png').then(image => setSrc(image.default));
                break;
            case AchievementType.LargestArmy:
                import('assets/images/largest_army_achievement_card.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.type])

    const alt = useMemo(() => {
        switch (props.type) {
            case AchievementType.LongestRoad:
                return "longest road achievement card";
            case AchievementType.LargestArmy:
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

export default memo(AchievementCard);