import React, {FormEvent, FunctionComponent, memo, useMemo, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { useCreateGameMutation, useFindGamesQuery } from 'features/catan/api';
import { Game, GameStatus } from 'features/catan/types';

const pageSize = 20;

interface IProps {};

const Lobby: FunctionComponent<IProps> = (props: IProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const {t} = useTranslation("catan");
    const navigate = useNavigate();

    const {data: gamePagination} = useFindGamesQuery({
        limit: pageSize, 
        offset: (page - 1) * pageSize,
    });
    const [createGame] = useCreateGameMutation();

    const [selectedGame, setSelectedGame]= useState<Game>();

    const spectateGame = (game: Game) => {
        if (!selectedGame) {
            setSelectedGame(game);
            setTimeout(() => setSelectedGame(undefined), 250);
            return;
        }

        if (selectedGame && selectedGame === game) {
            navigate(`/catan/games/${game.id}`);
        }
    };

    const handleCreateGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        const data = await createGame().unwrap();
        
        navigate(`/catan/games/${data.id}`);
    };

    const totalPage = useMemo(() => {
        if (!gamePagination) {
            return 1;
        }

        const totalPage =  Math.ceil(gamePagination.total / pageSize);

        return Math.max(totalPage, 1);
    }, [gamePagination]);

    const elidedPageRange = useMemo(() => {
        let minSibling = Math.min(page - 3, totalPage - 6);
        minSibling = Math.max(minSibling, 1);
        let maxSibling = Math.max(page + 3, 7);
        maxSibling = Math.min(maxSibling, totalPage);

        return Array.from({length: (maxSibling - minSibling + 1)}, (_, idx) => {
            return minSibling + idx;
        }).map((elidedPage, idx, elidedPageRange) => {
            if (idx === 0 && elidedPage !== 1) {
                return 1;
            }
            if (idx === 1 && elidedPage !== 2) {
                return "...";
            }
            if (idx === elidedPageRange.length - 1 && elidedPage !== totalPage) {
                return totalPage; 
            }
            if (idx === elidedPageRange.length - 2 && elidedPage !== totalPage - 1) {
                return "...";
            }

            return elidedPage;
        });
    }, [page, totalPage]);
    
    const setPage = (page: number) => {
        if (page < 1 || page > totalPage) {
            return;
        }

        searchParams.set("page", page.toString());

        setSearchParams(searchParams);
    };

    return (
            <div className="relative flex flex-col w-full mx-auto p-4 gap-2 md:w-2/3
            dark:bg-slate-900">
                <div className="flex">
                    <h1 className="my-auto">{t("lobby.title")}</h1>

                    <input 
                    type="button" 
                    className="ml-auto px-2 py-1 rounded-md shadow-md bg-green-500 text-white cursor-pointer 
                    hover:shadow-lg hover:bg-green-400 
                    active:shadow-md active:bg-green-500 
                    dark:shadow-white/10 dark:bg-green-900 
                    dark:hover:shadow-white/10 dark:hover:bg-green-800
                    dark:active:shadow-white/10 dark:active:bg-green-900"
                    value={t("lobby.create-game-button")}
                    onClick={handleCreateGame}/>
                </div>
                
                <div className="rounded-md shadow-lg bg-white overflow-hidden
                dark:bg-slate-800 dark:shadow-white/10">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-400 text-white uppercase dark:bg-blue-900">
                                <th className="text-center">{t("lobby.data-table.id")}</th>
                                <th className="text-center">{t("lobby.data-table.players")}</th>
                                <th className="min-w-16 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                gamePagination?
                                    gamePagination.data.map(game => {
                                        return (
                                            <tr key={game.id}
                                            className="shadow hover:bg-slate-200 active:bg-slate-100
                                            dark:shadow-white/10 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                                            onClick={() => spectateGame(game)}>
                                                <td className="px-2">{game.id}</td>

                                                <td className="px-2 text-center">{game.playerQuantity}</td>

                                                <td className="px-2 text-center">
                                                    {
                                                        game.status === GameStatus.Started?
<                                                           div className="w-4 h-4 m-auto rounded-full bg-green-400 dark:bg-green-600"/>
                                                        :
                                                            null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                :
                                    Array.from({length: 10}, (_, idx) => (
                                        <tr key={idx} className="shadow animate-pulse dark:shadow-white/10">
                                            <td className="px-2">
                                                <div className="h-5 mx-auto my-1 rounded-full bg-slate-100"/>
                                            </td>
                                            <td className="px-2 text-center">
                                                <div className="h-5 mx-auto my-1 rounded-full bg-slate-100"/>
                                            </td>
                                            <td className="px-2 text-center">
                                                <div className="h-5 mx-auto my-1 rounded-full bg-slate-100"/>
                                            </td>
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                <div className="flex w-full">
                    <ul className="flex m-auto gap-2">
                        <li className="flex w-8 h-8 rounded-full cursor-pointer hover:bg-slate-400 active:bg-slate-300 dark:hover:bg-slate-600 dark:active:bg-slate-500" onClick={() => setPage(page - 1)}>
                            <ChevronLeftIcon className="w-5 h-5 m-auto"/>
                        </li>

                        {elidedPageRange.map((elidedPage, idx) => (
                            <li key={idx} className={classNames("flex w-8 h-8 rounded-full text-center", {
                                "bg-slate-400 dark:bg-slate-600": elidedPage === page,
                                "cursor-pointer hover:bg-slate-400 active:bg-slate-300 dark:hover:bg-slate-600 dark:active:bg-slate-500": typeof elidedPage === "number" && elidedPage !== page,
                            })}
                            onClick={() => typeof elidedPage === "number" && elidedPage !== page && setPage(elidedPage)}>
                                <span className="m-auto">{elidedPage}</span>
                            </li>
                        ))}

                        <li className="flex w-8 h-8 rounded-full cursor-pointer hover:bg-slate-400 active:bg-slate-300 dark:hover:bg-slate-600 dark:active:bg-slate-500" onClick={() => setPage(page + 1)}>
                            <ChevronRightIcon className="w-5 h-5 m-auto"/>
                        </li>
                    </ul>
                </div>             
            </div>   
    );
}

export default memo(Lobby);