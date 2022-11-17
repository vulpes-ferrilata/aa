import React, { FunctionComponent, memo } from 'react';

interface IProps {};

const Dice: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <div className="h-full aspect-square" style={{perspective: "99px"}}>
            <div className="relative w-full h-full text-white animate-roll" style={{transformStyle: "preserve-3d"}}>
                <div className="absolute flex w-full h-full rounded-md bg-red-600" style={{transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)"}}>
                    <span className="m-auto">1</span>
                </div>

                <div className="absolute flex w-full h-full rounded-md bg-red-600" style={{transform: "translateY(-50%) rotateX(90deg)"}}>
                    <span className="m-auto">2</span>
                </div>

                <div className="absolute flex w-full h-full rounded-md bg-red-600" style={{transform: "translateX(-50%) rotateY(-90deg)"}}>
                    <span className="m-auto">3</span>
                </div>

                <div className="absolute flex w-full h-full rounded-md bg-red-600" style={{transform: "translateX(50%) rotateY(90deg)"}}>
                    <span className="m-auto">4 </span>
                </div>

                <div className="absolute flex w-full h-full rounded-md bg-red-600" style={{transform: "translateY(50%) rotateX(-90deg)"}}>
                    <span className="m-auto">5</span>
                </div>
                
                <div className="absolute flex w-full h-full rounded-md bg-red-600" style={{transform: "rotateY(90deg) translateX(50%) rotateY(90deg)"}}>
                    <span className="m-auto">6</span>
                </div>
            </div>
        </div>
    );
}

export default memo(Dice);