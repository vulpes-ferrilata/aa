import React, { FunctionComponent, memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ReactComponent as RoadIcon } from 'assets/svg/road.svg';
import { ReactComponent as SettlementIcon } from 'assets/svg/settlement.svg';
import { ReactComponent as CityIcon } from 'assets/svg/city.svg';

import { AchievementType, DevelopmentCardType, Player, PlayerColor, ResourceCardType } from 'features/catan/types';
import ResourceCard from 'features/catan/resourceCard';
import DevelopmentCard from 'features/catan/developmentCard';
import AchievementCard from 'features/catan/achievementCard';


interface IProps {
    me?: Player;
    hideInstruction: () => void;
};

const enum Tab {
    BuildingCost,
    AchievementCards,
    DevelopmentCards,
    VictoryPoints,
};

const Instruction: FunctionComponent<IProps> = (props: IProps) => {
    const {t} = useTranslation("catan");

    const dialogContainerRef = useRef<HTMLDivElement>(null);

    const [tab, setTab] = useState<Tab>(Tab.BuildingCost);

    useEffect(() => {
        const hideInstruction = (event: MouseEvent) => {
            if (dialogContainerRef.current && !dialogContainerRef.current.contains(event.target as Node)) {
                props.hideInstruction();
            }
        };

        document.addEventListener("click", hideInstruction);
        
        return () => document.removeEventListener("click", hideInstruction);
    }, [props])

    return (
        <div className="absolute flex left-0 top-0 w-full h-full bg-black/10 z-30">
            <div ref={dialogContainerRef} className="flex flex-col max-w-full max-h-full m-auto p-8 rounded-md shadow-lg bg-white dark:bg-slate-900">
                <div className="rounded-md shadow-lg bg-white overflow-auto
                dark:bg-slate-800 dark:shadow-white/10">
                    <div className="p-2 shadow-inner-lg hover:bg-slate-200 active:bg-slate-100
                    dark:shadow-white/10 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                    onClick={() => setTab(Tab.BuildingCost)}>
                        <h1>{t("game.started.instruction-dialog.building-cost.title")}</h1>
                    </div>

                    <div className={classNames("max-h-screen overflow-auto transition-all ease-out delay-150", {
                        "!max-h-0 !ease-in !delay-0": tab !== Tab.BuildingCost,
                    })}>
                        <table className="w-full">
                            <tbody>
                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16 gap-2">
                                            <ResourceCard type={ResourceCardType.Lumber}/>
                                            <ResourceCard type={ResourceCardType.Brick}/>
                                        </div>
                                    </td>

                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <RoadIcon className={classNames("h-4 m-auto", PlayerColor.toColor(props.me?.color || PlayerColor.Red))}/>                                        
                                        </div>
                                    </td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16 gap-2">
                                            <ResourceCard type={ResourceCardType.Lumber}/>
                                            <ResourceCard type={ResourceCardType.Brick}/>
                                            <ResourceCard type={ResourceCardType.Grain}/>
                                            <ResourceCard type={ResourceCardType.Wool}/>
                                        </div>
                                    </td>

                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <SettlementIcon className={classNames("h-8 m-auto", PlayerColor.toColor(props.me?.color || PlayerColor.Red))}/>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16 gap-2">
                                            <ResourceCard type={ResourceCardType.Grain}/>
                                            <ResourceCard type={ResourceCardType.Grain}/>
                                            <ResourceCard type={ResourceCardType.Ore}/>
                                            <ResourceCard type={ResourceCardType.Ore}/>
                                            <ResourceCard type={ResourceCardType.Ore}/>
                                        </div>
                                    </td>

                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <CityIcon className={classNames("h-8 m-auto", PlayerColor.toColor(props.me?.color || PlayerColor.Red))}/>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16 gap-2">
                                            <ResourceCard type={ResourceCardType.Wool}/>
                                            <ResourceCard type={ResourceCardType.Grain}/>
                                            <ResourceCard type={ResourceCardType.Ore}/>
                                        </div>
                                    </td>

                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.Hidden}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-2 shadow-inner-lg hover:bg-slate-200 active:bg-slate-100
                    dark:shadow-white/10 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                    onClick={() => setTab(Tab.AchievementCards)}>
                        <h1>{t("game.started.instruction-dialog.achievement-cards.title")}</h1>
                    </div>

                    <div className={classNames("max-h-screen overflow-auto transition-all ease-out delay-150", {
                        "!max-h-0 !ease-in !delay-0": tab !== Tab.AchievementCards,
                    })}>
                        <table className="w-full">
                            <thead>
                            <tr className="shadow dark:shadow-white/10">
                                    <th>{t("game.started.instruction-dialog.achievement-cards.data-table.headers.card")}</th>
                                    <th>{t("game.started.instruction-dialog.achievement-cards.data-table.headers.description")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <AchievementCard type={AchievementType.LongestRoad}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.achievement-cards.data-table.contents.longest-road-achievement-description")}</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <AchievementCard type={AchievementType.LargestArmy}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.achievement-cards.data-table.contents.largest-army-achievement-description")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-2 shadow-inner-lg hover:bg-slate-200 active:bg-slate-100
                    dark:shadow-white/10 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                    onClick={() => setTab(Tab.DevelopmentCards)}>
                        <h1>{t("game.started.instruction-dialog.development-cards.title")}</h1>
                    </div>

                    <div className={classNames("max-h-screen overflow-auto transition-all ease-out delay-150", {
                        "!max-h-0 !ease-in !delay-0": tab !== Tab.DevelopmentCards,
                    })}>
                        <table className="w-full">
                            <thead>
                                <tr className="shadow dark:shadow-white/10">
                                    <th>{t("game.started.instruction-dialog.development-cards.data-table.headers.card")}</th>
                                    <th>{t("game.started.instruction-dialog.development-cards.data-table.headers.description")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.Knight}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.development-cards.data-table.contents.knight-card-description")}</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.RoadBuiding}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.development-cards.data-table.contents.road-building-card-description")}</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.YearOfPlenty}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.development-cards.data-table.contents.year-of-plenty-card-description")}</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.Monopoly}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.development-cards.data-table.contents.monopoly-card-description")}</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="flex gap-2 h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.Chapel}/>
                                                <DevelopmentCard type={DevelopmentCardType.GreatHall}/>
                                                <DevelopmentCard type={DevelopmentCardType.Library}/>
                                                <DevelopmentCard type={DevelopmentCardType.Market}/>
                                                <DevelopmentCard type={DevelopmentCardType.University}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2">{t("game.started.instruction-dialog.development-cards.data-table.contents.victory-points-card-description")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-2 shadow-inner-lg hover:bg-slate-200 active:bg-slate-100
                    dark:shadow-white/10 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                    onClick={() => setTab(Tab.VictoryPoints)}>
                        <h1>{t("game.started.instruction-dialog.victory-points.title")}</h1>
                    </div>

                    <div className={classNames("max-h-screen overflow-auto transition-all ease-out delay-150", {
                        "!max-h-0 !ease-in !delay-0": tab !== Tab.VictoryPoints,
                    })}>
                        <table className="w-full">
                            <thead>
                                <tr className="shadow dark:shadow-white/10">
                                    <th>{t("game.started.instruction-dialog.victory-points.data-table.source")}</th>
                                    <th>{t("game.started.instruction-dialog.victory-points.data-table.points")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <SettlementIcon className={classNames("h-8 m-auto", PlayerColor.toColor(props.me?.color || PlayerColor.Red))}/>
                                        </div>
                                    </td>

                                    <td className="px-2 text-center">1</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <CityIcon className={classNames("h-8 m-auto", PlayerColor.toColor(props.me?.color || PlayerColor.Red))}/>
                                        </div>
                                    </td>

                                    <td className="px-2 text-center">2</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <AchievementCard type={AchievementType.LongestRoad}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 text-center">2</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="h-16 m-auto">
                                                <AchievementCard type={AchievementType.LargestArmy}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 text-center">2</td>
                                </tr>

                                <tr className="shadow hover:bg-slate-200 active:bg-slate-100
                                dark:shadow-white/10 dark:hover:bg-slate-700">
                                    <td className="px-2">
                                        <div className="flex h-16">
                                            <div className="flex gap-2 h-16 m-auto">
                                                <DevelopmentCard type={DevelopmentCardType.Chapel}/>
                                                <DevelopmentCard type={DevelopmentCardType.GreatHall}/>
                                                <DevelopmentCard type={DevelopmentCardType.Library}/>
                                                <DevelopmentCard type={DevelopmentCardType.Market}/>
                                                <DevelopmentCard type={DevelopmentCardType.University}/>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-2 text-center">1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Instruction);