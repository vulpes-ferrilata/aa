import React, { FunctionComponent, memo } from 'react';
import Dice from './dice';

interface IProps {};

const Loading: FunctionComponent<IProps> = (props: IProps) => {
    return (
        <div className="fixed flex left-0 top-0 w-screen h-screen dark:bg-slate-900">
            <div className="flex m-auto h-8 gap-4">
                {Array.from({length: 3}).map((_, i) => (
                    <Dice key={i}/>
                ))}
            </div>
        </div>
    );
}

export default memo(Loading);

