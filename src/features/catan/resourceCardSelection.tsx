import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import React from 'react'
import { Action, Game, PlayMonopolyCard, PlayYearOfPlentyCard, ResourceCardType } from 'features/catan/api';
import ResourceCard from './resourceCard';

interface iProps {
    game: Game;
    action?: Action;
    selectResourceCard: (resourceCardType: ResourceCardType) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

function ResourceCardSelection(props: iProps) {
    return (
        <div className="absolute flex left-0 top-0 w-full h-full bg-black/10 z-50">
            <div className="flex flex-col max-w-full m-auto p-8 rounded-md shadow-lg bg-white">
                <div className="grid grid-cols-5 gap-2">
                    {(["LUMBER", "BRICK", "WOOL", "GRAIN", "ORE"] as ResourceCardType[]).map((resourceCardType, i) => (
                        <div key={i} className="flex flex-col h-full" onClick={() => props.selectResourceCard(resourceCardType)}>
                            <div className="flex h-1/6 mx-auto">
                                {
                                    props.action instanceof PlayMonopolyCard && props.action.resourceCardType === resourceCardType?
                                        <PaperAirplaneIcon className="h-full rotate-90"/>
                                    :
                                        null
                                }
                                {
                                    props.action instanceof PlayYearOfPlentyCard?
                                        props.action.resourceCardTypes?.map(selectedResourceCardType => {
                                            if (selectedResourceCardType === resourceCardType) {
                                                return <PaperAirplaneIcon className="h-full rotate-90"/>
                                            }
                                            return null;
                                        })
                                    :
                                        null
                                }
                            </div>

                            <div className="mx-auto overflow-hidden">
                                <ResourceCard type={resourceCardType}/>
                            </div>
                        </div>   
                    ))}
                </div>

                <div className="mx-auto mt-2">
                    <input type="button" className="px-2 py-1 rounded-md shadow-lg shadow-red-500/50 bg-red-500 text-white cursor-pointer hover:shadow-md hover:shadow-red-400/50 hover:bg-red-400 active:shadow-lg active:shadow-red-500/50 active:bg-red-500" value="Cancel" onClick={props.onCancel}/>
                    <input type="button" className="ml-2 px-2 py-1 rounded-md shadow-lg shadow-blue-500/50 bg-blue-500 text-white cursor-pointer hover:shadow-md hover:shadow-blue-400/50 hover:bg-blue-400 active:shadow-lg active:shadow-blue-500/50 active:bg-blue-500" value="Confirm" onClick={props.onConfirm}/>
                </div>
            </div>
        </div>
    )
}

export default ResourceCardSelection;