import React, { useMemo } from 'react'
import { Game } from 'features/catan/api';
import ResourceCard from './resourceCard';

import { ArrowDownIcon } from '@heroicons/react/24/outline';

interface iProps {
    game: Game;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmTrading(props: iProps) {
    const mySelectedResourceCards = useMemo(() => {
        return props.game.me?.resourceCards.filter(resourceCard => resourceCard.isSelected);
    }, [props.game])

    const activePlayerResourceCards = useMemo(() => {
        return props.game.players.find(player => player.isActive)?.resourceCards.filter(resourceCard => resourceCard.isSelected);
    }, [props.game])

    return (
        <div className="absolute flex left-0 top-0 w-full h-full bg-black/10 z-50">
            <div className="flex flex-col max-w-full m-auto p-8 rounded-md shadow-lg bg-white">
                <div className="mx-auto">Active player want to trade with you</div>

                <div className="flex max-w-full mx-auto my-2">
                    {mySelectedResourceCards?.map(resourceCard => (
                        <div key={resourceCard.id} className="flex-content min-w-4 h-24 last:flex-none">
                            <ResourceCard type={resourceCard.type}/>
                        </div>
                    ))}
                </div>

                <ArrowDownIcon className="h-12 mx-auto"/>

                <div className="flex max-w-full mx-auto my-2">
                    {activePlayerResourceCards?.map(resourceCard => (
                        <div key={resourceCard.id} className="flex-content min-w-4 h-24 last:flex-none">
                            <ResourceCard type={resourceCard.type}/>
                        </div>
                    ))}
                </div>

                <div className="mx-auto">
                    <input type="button" className="px-2 py-1 rounded-md shadow-lg shadow-red-500/50 bg-red-500 text-white cursor-pointer hover:shadow-md hover:shadow-red-400/50 hover:bg-red-400 active:shadow-lg active:shadow-red-500/50 active:bg-red-500" value="Cancel" onClick={props.onCancel}/>
                    <input type="button" className="ml-2 px-2 py-1 rounded-md shadow-lg shadow-blue-500/50 bg-blue-500 text-white cursor-pointer hover:shadow-md hover:shadow-blue-400/50 hover:bg-blue-400 active:shadow-lg active:shadow-blue-500/50 active:bg-blue-500" value="Confirm" onClick={props.onConfirm}/>
                </div>
            </div>
        </div>
    )
}

export default ConfirmTrading;