import React, { FunctionComponent, memo } from 'react'
import { useTranslation } from 'react-i18next';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

import { Action, GameDetail, PlayMonopolyCard, PlayYearOfPlentyCard, ResourceCardType } from 'features/catan/types';
import ResourceCard from 'features/catan/resourceCard';

interface IProps {
    game: GameDetail;
    action?: Action;
    selectResourceCard: (resourceCardType: ResourceCardType) => void;
    cancelAction: () => void;
    confirmAction: () => void;
};

const ResourceCardSelectionDialog: FunctionComponent<IProps> = (props: IProps) => {
    const {t} = useTranslation("catan");

    return (
        <div className="absolute flex left-0 top-0 w-full h-full bg-black/10 z-30">
            <div className="flex flex-col max-w-full m-auto p-8 rounded-md shadow-lg bg-white gap-4 dark:bg-slate-900">
                <div className="grid grid-cols-5 gap-2">
                    {Object.values(ResourceCardType).filter(resourceCardType => resourceCardType !== ResourceCardType.Hidden).map((resourceCardType, i) => (
                        <div key={i} className="flex flex-col h-full" onClick={() => props.selectResourceCard(resourceCardType)}>
                            <div className="flex h-1/6 mx-auto">
                                {
                                    props.action instanceof PlayMonopolyCard && props.action.resourceCardType === resourceCardType &&
                                        <PaperAirplaneIcon className="h-full rotate-90"/>
                                }
                                {
                                    props.action instanceof PlayYearOfPlentyCard &&
                                        props.action.resourceCardTypes?.map(selectedResourceCardType => {
                                            return selectedResourceCardType === resourceCardType && <PaperAirplaneIcon className="h-full rotate-90"/>
                                        })
                                }
                            </div>

                            <div className="mx-auto overflow-hidden">
                                <ResourceCard type={resourceCardType}/>
                            </div>
                        </div>   
                    ))}
                </div>

                <div className="flex mx-auto gap-4">
                    <input 
                    type="button" 
                    className="px-2 py-1 rounded-md shadow-md bg-red-500 text-white cursor-pointer 
                    hover:shadow-lg hover:bg-red-400 active:shadow-md active:bg-red-500 
                    dark:bg-red-900 dark:hover:bg-red-800 dark:active:bg-red-900"
                    value={t("game.started.resource-card-selection-dialog.cancel-button")}
                    onClick={() => props.cancelAction()}/>
                    
                    <input 
                    type="button" 
                    className="px-2 py-1 rounded-md shadow-md bg-green-500 text-white cursor-pointer 
                    hover:shadow-lg hover:bg-green-400 active:shadow-md active:bg-green-500 
                    dark:bg-green-900 dark:hover:bg-green-800 dark:active:bg-green-900"
                    value={t("game.started.resource-card-selection-dialog.confirm-button")}
                    onClick={() => props.confirmAction()}/>
                </div>
            </div>
        </div>
    )
};

export default memo(ResourceCardSelectionDialog);