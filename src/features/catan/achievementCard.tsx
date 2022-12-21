import React, { FunctionComponent, memo, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AchievementType } from 'features/catan/types';
import LongestRoadAchievementCard from 'assets/images/longest_road_achievement_card.jpg';
import LongestRoadAchievementCardPlaceHolder from 'assets/images/longest_road_achievement_card_placeholder.jpg';
import LargestArmyAchievementCard from 'assets/images/largest_army_achievement_card.jpg';
import LargestArmyAchievementCardPlaceHolder from 'assets/images/largest_army_achievement_card_placeholder.jpg';

interface IProps {
    type: AchievementType;
};

const AchievementCard: FunctionComponent<IProps> = (props: IProps) => {
    const image = useMemo(() => {
        switch (props.type) {
            case AchievementType.LongestRoad:
                return (
                    <LazyLoadImage 
                    src={LongestRoadAchievementCard} 
                    placeholderSrc={LongestRoadAchievementCardPlaceHolder} 
                    alt="longest road achievement card"/>
                );
            case AchievementType.LargestArmy:
                return (
                    <LazyLoadImage 
                    src={LargestArmyAchievementCard} 
                    placeholderSrc={LargestArmyAchievementCardPlaceHolder} 
                    alt="largest army achievement card"/>
                );
        }
    }, [props.type])

    return (
        <div className="h-full aspect-5/6">
            {image}
        </div>        
    );
}

export default memo(AchievementCard);