import React, { memo, useMemo } from 'react';
import classNames from 'classnames';

import { Dice as DiceModel, Game } from 'features/catan/api';

interface IProps {
    game: Game;
    dice: DiceModel;
};

function Dice(props: IProps) {
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

    const backgroundColor = useMemo(() => {
        switch (props.game.activePlayer.color) {
            case "RED":
                return "bg-red-600";
            case "BLUE":
                return "bg-blue-600";
            case "GREEN":
                return "bg-green-600";
            case "YELLOW":
                return "bg-yellow-600";
        }
    }, [props.game])

    return (
        <div className="h-full aspect-square" style={{perspective: "99px"}}>
            <div className="relative w-full h-full text-white transition-all duration-1000" style={{transformStyle: "preserve-3d", transform: transform}}>
                <div className={classNames("absolute flex w-full h-full rounded-md", backgroundColor)} style={{transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)"}}>
                    <label className="m-auto">1</label>
                </div>
                <div className={classNames("absolute flex w-full h-full rounded-md", backgroundColor)} style={{transform: "rotateY(90deg) translateX(50%) rotateY(90deg)"}}>
                    <label className="m-auto">6</label>
                </div>
                <div className={classNames("absolute flex w-full h-full rounded-md", backgroundColor)} style={{transform: "translateX(50%) rotateY(90deg)"}}>
                    <label className="m-auto">4 </label>
                </div>
                <div className={classNames("absolute flex w-full h-full rounded-md", backgroundColor)} style={{transform: "translateX(-50%) rotateY(-90deg)"}}>
                    <label className="m-auto">3</label>
                </div>
                <div className={classNames("absolute flex w-full h-full rounded-md", backgroundColor)} style={{transform: "translateY(-50%) rotateX(90deg)"}}>
                    <label className="m-auto">2</label>
                </div>
                <div className={classNames("absolute flex w-full h-full rounded-md", backgroundColor)} style={{transform: "translateY(50%) rotateX(-90deg)"}}>
                    <label className="m-auto">5</label>
                </div>
            </div>
        </div>
    );
}

export default memo(Dice);