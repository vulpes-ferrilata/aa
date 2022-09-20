import React, { useMemo } from 'react';

import { Dice as DiceModel } from 'features/catan/api'

interface iProps {
    dice: DiceModel;
}

function Dice(props: iProps) {
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
    }, [props.dice.number])

    return (
        <div className="h-full aspect-square" style={{perspective: "99px"}}>
            <div className="relative w-full h-full transition-all duration-1000" style={{transformStyle: "preserve-3d", transform: transform}}>
                <div className="absolute flex w-full h-full bg-red-600/90 text-white" style={{transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)"}}>
                    <label className="m-auto">1</label>
                </div>
                <div className="absolute flex w-full h-full bg-red-600/90 text-white" style={{transform: "rotateY(90deg) translateX(50%) rotateY(90deg)"}}>
                    <label className="m-auto">6</label>
                </div>
                <div className="absolute flex w-full h-full bg-red-600/90 text-white" style={{transform: "translateX(50%) rotateY(90deg)"}}>
                    <label className="m-auto">4 </label>
                </div>
                <div className="absolute flex w-full h-full bg-red-600/90 text-white" style={{transform: "translateX(-50%) rotateY(-90deg)"}}>
                    <label className="m-auto">3</label>
                </div>
                <div className="absolute flex w-full h-full bg-red-600/90 text-white" style={{transform: "translateY(-50%) rotateX(90deg)"}}>
                    <label className="m-auto">2</label>
                </div>
                <div className="absolute flex w-full h-full bg-red-600/90 text-white" style={{transform: "translateY(50%) rotateX(-90deg)"}}>
                    <label className="m-auto">5</label>
                </div>
            </div>
        </div>
    );
}

export default Dice;