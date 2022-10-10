import React, {FormEvent, memo, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useFindAllGamesQuery, Game, useCreateGameMutation} from 'features/catan/api';
import { useTranslation } from 'react-i18next';
import withMenubar from 'shared/hoc/withMenubar';

interface IProps {};

function Lobby(props: IProps) {
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
    };

    const handleCreateGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        const data = await createGame().unwrap();
        
        navigate(`/game/${data.id}`)
    };

    const skeletonTableData = useMemo(() => {
        const data = []
        for (let i =1; i <= 10; i++) {
            data.push(
                <tr key={i} className="shadow animate-pulse dark:shadow-white/10">
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
    }, []);
    

    return (
            <div className="w-full h-full mx-auto p-4 md:w-2/3 dark:bg-slate-900 dark:text-white">
                <div className="flex m-2">
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
                                data?
                                    data.map((game) => {
                                        const allPlayers = [game.activePlayer, ...game.players];

                                        return (
                                            <tr key={game.id}
                                            className="shadow hover:bg-slate-200 active:bg-slate-100
                                            dark:shadow-white/10 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                                            onClick={() => spectateGame(game)}>
                                                <td className="px-2">
                                                    <label>{game.id}</label>
                                                </td>

                                                <td className="px-2 text-center">
                                                    <label>{allPlayers.length}</label>
                                                </td>

                                                <td className="px-2 text-center">
                                                    {
                                                        game.status === "STARTED"?
<                                                           div className="w-4 h-4 m-auto rounded-full bg-green-400 dark:bg-green-600"/>
                                                        :
                                                            null
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                :
                                    skeletonTableData
                            }
                            
                        </tbody>
                    </table>
                </div>                
            </div>   
    );
}

export default withMenubar(memo(Lobby));