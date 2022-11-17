import React, { FunctionComponent, memo, useMemo } from 'react';

import { GameDetail } from 'features/catan/types';

interface IProps {
    game: GameDetail;
    q: number;
    r: number;
    children: JSX.Element | JSX.Element[] | null;
};

type HexModel = {
    q: number;
    r: number;
};

const Hex: FunctionComponent<IProps> = (props: IProps) => {
    const hexes = useMemo(() => {
        const hexes: HexModel[] = [];
        for (let terrain of props.game.terrains) {
            hexes.push({q: terrain.q, r: terrain.r});
            terrain.harbor && hexes.push({q: terrain.harbor.q, r: terrain.harbor.r});
        }
        return hexes;
    }, [props.game]);

    const x = useMemo(() => {
        const minX = Math.min(...hexes.map(hex => 100 * hex.q + 50 * hex.r));
        return 100 * props.q + 50 * props.r - minX;
    }, [hexes, props.q, props.r]);

    const y = useMemo(() => {
        const minY =  Math.min(...hexes.map(hex => 75 * hex.r));
        return 75 * props.r - minY;
    }, [hexes, props.r]);

    return (
        <div className="absolute h-1/6 aspect-hex pointer-events-none" style={{transform: `translate(${x}%, ${y}%)`}}>
            {props.children}
        </div>
    );
}

export default memo(Hex);