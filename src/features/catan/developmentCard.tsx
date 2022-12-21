import React, { FunctionComponent, memo, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { DevelopmentCardType } from 'features/catan/types';
import KnightDevelopmentCard from 'assets/images/knight_development_card.jpg';
import KnightDevelopmentCardPlaceholder from 'assets/images/knight_development_card_placeholder.jpg';
import MonopolyDevelopmentCard from 'assets/images/monopoly_development_card.jpg';
import MonopolyDevelopmentCardPlaceholder from 'assets/images/monopoly_development_card_placeholder.jpg';
import RoadBuildingDevelopmentCard from 'assets/images/road_building_development_card.jpg';
import RoadBuildingDevelopmentCardPlaceholder from 'assets/images/road_building_development_card_placeholder.jpg';
import YearOfPlentyDevelopmentCard from 'assets/images/year_of_plenty_development_card.jpg';
import YearOfPlentyDevelopmentCardPlaceholder from 'assets/images/year_of_plenty_development_card_placeholder.jpg';
import ChapelDevelopmentCard from 'assets/images/chapel_development_card.jpg';
import ChapelDevelopmentCardPlaceholder from 'assets/images/chapel_development_card_placeholder.jpg';
import GreatHallDevelopmentCard from 'assets/images/great_hall_development_card.jpg';
import GreatHallDevelopmentCardPlaceholder from 'assets/images/great_hall_development_card_placeholder.jpg';
import LibraryDevelopmentCard from 'assets/images/library_development_card.jpg';
import LibraryDevelopmentCardPlaceholder from 'assets/images/library_development_card_placeholder.jpg';
import MarketDevelopmentCard from 'assets/images/market_development_card.jpg';
import MarketDevelopmentCardPlaceholder from 'assets/images/market_development_card_placeholder.jpg';
import UniversityDevelopmentCard from 'assets/images/university_development_card.jpg';
import UniversityDevelopmentCardPlaceholder from 'assets/images/university_development_card_placeholder.jpg';
import HiddenDevelopmentCard from 'assets/images/hidden_development_card.jpg';
import HiddenDevelopmentCardPlaceholder from 'assets/images/hidden_development_card_placeholder.jpg';

export interface IProps {
    type: DevelopmentCardType;
};

const DevelopmentCard: FunctionComponent<IProps> = (props: IProps) => {
    const image = useMemo(() => {
        switch (props.type) {
            case DevelopmentCardType.Knight:
                return (
                    <LazyLoadImage
                    src={KnightDevelopmentCard}
                    placeholderSrc={KnightDevelopmentCardPlaceholder}
                    alt="knight development card"/>
                );
            case DevelopmentCardType.Monopoly:
                return (
                    <LazyLoadImage
                    src={MonopolyDevelopmentCard}
                    placeholderSrc={MonopolyDevelopmentCardPlaceholder}
                    alt="monopoly development card"/>
                );
            case DevelopmentCardType.RoadBuiding:
                return (
                    <LazyLoadImage
                    src={RoadBuildingDevelopmentCard}
                    placeholderSrc={RoadBuildingDevelopmentCardPlaceholder}
                    alt="road building development card"/>
                );
            case DevelopmentCardType.YearOfPlenty:
                return (
                    <LazyLoadImage
                    src={YearOfPlentyDevelopmentCard}
                    placeholderSrc={YearOfPlentyDevelopmentCardPlaceholder}
                    alt="year of plenty development card"/>
                );
            case DevelopmentCardType.Chapel:
                return (
                    <LazyLoadImage
                    src={ChapelDevelopmentCard}
                    placeholderSrc={ChapelDevelopmentCardPlaceholder}
                    alt="chapel development card"/>
                );
            case DevelopmentCardType.GreatHall:
                return (
                    <LazyLoadImage
                    src={GreatHallDevelopmentCard}
                    placeholderSrc={GreatHallDevelopmentCardPlaceholder}
                    alt="great hall development card"/>
                );
            case DevelopmentCardType.Library:
                return (
                    <LazyLoadImage
                    src={LibraryDevelopmentCard}
                    placeholderSrc={LibraryDevelopmentCardPlaceholder}
                    alt="library development card"/>
                );
            case DevelopmentCardType.Market:
                return (
                    <LazyLoadImage
                    src={MarketDevelopmentCard}
                    placeholderSrc={MarketDevelopmentCardPlaceholder}
                    alt="market development card"/>
                );
            case DevelopmentCardType.University:
                return (
                    <LazyLoadImage
                    src={UniversityDevelopmentCard}
                    placeholderSrc={UniversityDevelopmentCardPlaceholder}
                    alt="university development card"/>
                );
            case DevelopmentCardType.Hidden:
                return (
                    <LazyLoadImage
                    src={HiddenDevelopmentCard}
                    placeholderSrc={HiddenDevelopmentCardPlaceholder}
                    alt="hidden development card"/>
                );
        }
    }, [props.type]);

    return (
        <div className="h-full aspect-2/3">
            {image}     
        </div>
    );
}

export default memo(DevelopmentCard);