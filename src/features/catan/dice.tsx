import React, { FunctionComponent, memo, useMemo } from 'react';
import classNames from 'classnames';

import { Dice as DiceModel, GameDetail, PlayerColor } from 'features/catan/types';

interface IProps {
    game: GameDetail;
    dice: DiceModel;
};

const Dice: FunctionComponent<IProps> = (props: IProps) => {
    const transform = useMemo(() => {
        switch (props.dice.number) {
            case 1:
                return "rotateX(0deg) rotateY(0deg)";
            case 2:
                return "rotateX(-90deg) rotateY(0deg)";
            case 3:
                return "rotateX(0deg) rotateY(90deg)";
            case 4:
                return "rotateX(0deg) rotateY(-90deg)";
            case 5:
                return "rotateX(90deg) rotateY(0deg)";
            case 6:
                return "rotateX(0deg) rotateY(180deg)";
        }
    }, [props.dice.number]);

    return (
        <div className="h-full aspect-square" style={{perspective: "99px"}}>
            <div className="relative w-full h-full text-white transition-all duration-1000" style={{transformStyle: "preserve-3d", transform: transform}}>
                <div className={classNames("absolute flex w-full h-full rounded-md", PlayerColor.toBackgroundColor(props.game.activePlayer.color))} style={{transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)"}}>
                    <span className="m-auto">1</span>
                </div>

                <div className={classNames("absolute flex w-full h-full rounded-md", PlayerColor.toBackgroundColor(props.game.activePlayer.color))} style={{transform: "translateY(-50%) rotateX(90deg)"}}>
                    <span className="m-auto">2</span>
                </div>
                
                <div className={classNames("absolute flex w-full h-full rounded-md", PlayerColor.toBackgroundColor(props.game.activePlayer.color))} style={{transform: "translateX(-50%) rotateY(-90deg)"}}>
                    <span className="m-auto">3</span>
                </div>

                <div className={classNames("absolute flex w-full h-full rounded-md", PlayerColor.toBackgroundColor(props.game.activePlayer.color))} style={{transform: "translateX(50%) rotateY(90deg)"}}>
                    <span className="m-auto">4 </span>
                </div>

                <div className={classNames("absolute flex w-full h-full rounded-md", PlayerColor.toBackgroundColor(props.game.activePlayer.color))} style={{transform: "translateY(50%) rotateX(-90deg)"}}>
                    <span className="m-auto">5</span>
                </div>
                
                <div className={classNames("absolute flex w-full h-full rounded-md", PlayerColor.toBackgroundColor(props.game.activePlayer.color))} style={{transform: "rotateY(90deg) translateX(50%) rotateY(90deg)"}}>
                    <span className="m-auto">6</span>
                </div>
            </div>
        </div>
    );
}

export default memo(Dice);