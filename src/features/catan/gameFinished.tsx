import React, { useMemo } from 'react';

import { Game } from 'features/catan/api';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import DisplayName from 'features/user/displayName';
import { useTranslation } from 'react-i18next';

interface iProps {
    game: Game;
}

function GameFinished(props: iProps) {
    const {t} = useTranslation("catan");
    const navigate = useNavigate();

    const tableData = useMemo(() => {
        const allPlayers = []

        if (props.game.me) {
            allPlayers.push(props.game.me)
        }

        allPlayers.push(...props.game.players)

        return allPlayers.map(player => {
            return (
                <tr key={player.id} className="shadow">
                    <td className="px-2 text-center">{player.score >= 10? <AcademicCapIcon className="w-6 m-auto"/>: null}</td>
                    <td className="px-2"><DisplayName id={player.userID}/></td>
                    <td className="px-2 text-center"><label>{player.score}</label></td>
                </tr>
            )
        })
    }, [props.game])

    const handleLeaveGame = () => {
        navigate("/")
    }

    return (
        <div className="relative w-full mx-auto my-10 sm:w-1/2">
            <div className="flex m-2">
                <h1 className="my-auto">{t("game.finished.title")}</h1>
                
                <input type="button" className="ml-auto my-auto px-2 py-1 rounded-md shadow-lg shadow-red-500/50 bg-red-500 text-white cursor-pointer hover:shadow-md hover:shadow-red-400/50 hover:bg-red-400 active:shadow-lg active:shadow-red-500/50 active:bg-red-500" value={t("game.finished.leave-game-button")} onClick={handleLeaveGame}/>
            </div>
            
            <div className="rounded-md shadow-lg bg-white overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-400 text-white uppercase">
                            <th className="text-center"></th>
                            <th className="text-center">{t("game.finished.data-table.display-name")}</th>
                            <th className="text-center">{t("game.finished.data-table.score")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
            </div>                
        </div>
    );
}

export default GameFinished;