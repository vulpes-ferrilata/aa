import React, { FunctionComponent, memo, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { ResourceCardType } from 'features/catan/types';
import LumberResourceCard from 'assets/images/lumber_resource_card.jpg';
import LumberResourceCardPlaceholder from 'assets/images/lumber_resource_card_placeholder.jpg';
import BrickResourceCard from 'assets/images/brick_resource_card.jpg';
import BrickResourceCardPlaceholder from 'assets/images/brick_resource_card_placeholder.jpg';
import WoolResourceCard from 'assets/images/wool_resource_card.jpg';
import WoolResourceCardPlaceholder from 'assets/images/wool_resource_card_placeholder.jpg';
import GrainResourceCard from 'assets/images/grain_resource_card.jpg';
import GrainResourceCardPlaceholder from 'assets/images/grain_resource_card_placeholder.jpg';
import OreResourceCard from 'assets/images/ore_resource_card.jpg';
import OreResourceCardPlaceholder from 'assets/images/ore_resource_card_placeholder.jpg';
import HiddenResourceCard from 'assets/images/hidden_resource_card.jpg';
import HiddenResourceCardPlaceholder from 'assets/images/hidden_resource_card_placeholder.jpg';


interface IProps {
    type: ResourceCardType;
};

const ResourceCard: FunctionComponent<IProps> = (props: IProps) => {
    const image = useMemo(() => {
        switch (props.type) {
            case ResourceCardType.Lumber:
                return (
                    <LazyLoadImage
                    src={LumberResourceCard}
                    placeholderSrc={LumberResourceCardPlaceholder}
                    alt="lumber resource card"/>
                );
            case ResourceCardType.Brick:
                return (
                    <LazyLoadImage
                    src={BrickResourceCard}
                    placeholderSrc={BrickResourceCardPlaceholder}
                    alt="brick resource card"/>
                );
            case ResourceCardType.Wool:
                return (
                    <LazyLoadImage
                    src={WoolResourceCard}
                    placeholderSrc={WoolResourceCardPlaceholder}
                    alt="wool resource card"/>
                );
            case ResourceCardType.Grain:
                return (
                    <LazyLoadImage
                    src={GrainResourceCard}
                    placeholderSrc={GrainResourceCardPlaceholder}
                    alt="grain resource card"/>
                );
            case ResourceCardType.Ore:
                return (
                    <LazyLoadImage
                    src={OreResourceCard}
                    placeholderSrc={OreResourceCardPlaceholder}
                    alt="ore resource card"/>
                );
            case ResourceCardType.Hidden:
                return (
                    <LazyLoadImage
                    src={HiddenResourceCard}
                    placeholderSrc={HiddenResourceCardPlaceholder}
                    alt="hidden resource card"/>
                );
        }
    }, [props.type])

    return (
        <div className="h-full aspect-2/3">
            {image}
        </div>   
    );
}

export default memo(ResourceCard);