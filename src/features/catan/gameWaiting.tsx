import React, { FormEvent, useMemo } from 'react';

import { Game, useJoinGameMutation, useStartGameMutation } from 'features/catan/api';
import { KeyIcon } from '@heroicons/react/24/outline';
import DisplayName from 'features/user/displayName';
import { useTranslation } from 'react-i18next';

interface iProps {
    game: Game;
}

function GameWaiting(props: iProps) {
    const {t} = useTranslation("catan");

    const [joinGame]= useJoinGameMutation();
    const [startGame]= useStartGameMutation();

    const tableData = useMemo(() => {
        const allPlayers = []

        if (props.game.me) {
            allPlayers.push(props.game.me)
        }

        allPlayers.push(...props.game.players)

        return allPlayers.map(player => {
            let color;
            switch (player.color) {
                case "RED":
                    color = "bg-red-600 ";
                    break;
                case "BLUE":
                    color = "bg-blue-600";
                    break;
                case "GREEN":
                    color = "bg-green-600";
                    break;
                case "YELLOW":
                    color = "bg-yellow-600";
                    break;
            }

            return (
                <tr key={player.id} className="shadow">
                    <td className="px-2 text-center">{player.isActive? <KeyIcon className="w-6 m-auto"/>: null}</td>
                    <td className="px-2"><DisplayName id={player.userID}/></td>
                    <td className="px-2 text-center"><div className={`w-20 h-5 m-auto rounded-full ${color}`}/></td>
                </tr>
            )
        })
    }, [props.game])

    const skeletonTableData = useMemo(() => {
        const data = []
        for (let i =1; i <= 4 - tableData.length; i++) {
            data.push(
                <tr key={i} className="shadow animate-pulse">
                    <td className="px-2">
                        <div className="h-5 mx-auto my-1 rounded-full bg-slate-100"/>
                    </td>
                    <td className="px-2 text-center">
                        <div className="h-5 mx-auto my-1 rounded-full bg-slate-100"/>
                    </td>
                    <td className="px-2 text-center">
                        <div className="w-20 h-5 mx-auto my-1 rounded-full bg-slate-100"/>
                    </td>
                </tr>
            )
        }

        return data;
    }, [tableData])

    const handleJoinGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        await joinGame(props.game.id);
    }

    const handleStartGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        await startGame(props.game.id);
    }

    return (
        <div className="relative w-full mx-auto my-10 sm:w-1/2">
            <div className="flex m-2">
                <h1 className="my-auto">{t("game.waiting.title")}</h1>

                {
                    props.game.me?.isActive?
                        <input type="button" className="ml-auto my-auto px-2 py-1 rounded-md shadow-lg shadow-blue-500/50 bg-blue-500 text-white cursor-pointer hover:shadow-md hover:shadow-blue-400/50 hover:bg-blue-400 active:shadow-lg active:shadow-blue-500/50 active:bg-blue-500" value={t("game.waiting.start-game-button")} onClick={handleStartGame}/>
                    :
                        null
                }

                {
                    !props.game.me?
                        <input type="button" className="ml-auto my-auto px-2 py-1 rounded-md shadow-lg shadow-green-500/50 bg-green-500 text-white cursor-pointer hover:shadow-md hover:shadow-green-400/50 hover:bg-green-400 active:shadow-lg active:shadow-green-500/50 active:bg-green-500" value={t("game.waiting.join-game-button")} onClick={handleJoinGame}/>
                    :
                        null
                }
            </div>
            
            <div className="rounded-md shadow-lg bg-white overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-400 text-white uppercase">
                            <th className="text-center"></th>
                            <th className="text-center">{t("game.waiting.data-table.display-name")}</th>
                            <th className="text-center">{t("game.waiting.data-table.color")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                        {skeletonTableData}
                    </tbody>
                </table>
            </div>                
        </div>
    );
}

export default GameWaiting;