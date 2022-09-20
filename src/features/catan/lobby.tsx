import React, {FormEvent, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useFindAllGamesQuery, Game, useCreateGameMutation} from 'features/catan/api';
import { useTranslation } from 'react-i18next';

interface iProps {}

function Lobby(props: iProps) {
    const {t} = useTranslation("catan");
    const navigate = useNavigate();

    const {data} = useFindAllGamesQuery();
    const [createGame] = useCreateGameMutation();

    const [selectedGame, setSelectedGame]= useState<Game>();

    const spectateGame = (game: Game) => {
        if (!selectedGame) {
            setSelectedGame(game);
            setTimeout(() => setSelectedGame(undefined), 250);
            return;
        }

        if (selectedGame && selectedGame === game) {
            navigate(`/game/${game.id}`);
        }
    }

    const handleCreateGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        const data = await createGame().unwrap();
        
        navigate(`/game/${data.id}`)
    }

    const skeletonTableData = useMemo(() => {
        const data = []
        for (let i =1; i <= 10; i++) {
            data.push(
                <tr key={i} className="shadow animate-pulse">
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
            )
        }

        return data;
    }, [])
    

    return (
        <>
            <div className="w-full mx-auto my-10 sm:w-1/2">
                <div className="flex m-2">
                    <h1 className="my-auto">{t("lobby.title")}</h1>

                    <input type="button" className="ml-auto my-auto px-2 py-1 rounded-md shadow-lg shadow-green-500/50 bg-green-500 text-white cursor-pointer hover:shadow-md hover:shadow-green-400/50 hover:bg-green-400 active:shadow-lg active:shadow-green-500/50 active:bg-green-500" value={t("lobby.create-game-button")} onClick={handleCreateGame}/>
                </div>
                
                <div className="rounded-md shadow-lg bg-white overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-400 text-white uppercase">
                                <th className="text-center">{t("lobby.data-table.id")}</th>
                                <th className="text-center">{t("lobby.data-table.players")}</th>
                                <th className="text-center">{t("lobby.data-table.status")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?
                                    data.map((game) => (
                                        <tr key={game.id} className="shadow hover:bg-slate-200 active:bg-slate-100" onClick={() => spectateGame(game)}>
                                            <td className="px-2">
                                                <label>{game.id}</label>
                                            </td>

                                            <td className="px-2 text-center">
                                                <label>{game.players.length + (game.me? 1: 0)}</label>
                                            </td>

                                            <td className="px-2 text-center">
                                                <label>{game.status}</label>
                                            </td>
                                        </tr>
                                    ))
                                :
                                    skeletonTableData
                            }
                            
                        </tbody>
                    </table>
                </div>                
            </div>
        </>        
    );
}

export default Lobby;