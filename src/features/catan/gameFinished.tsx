import React, { FunctionComponent, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AcademicCapIcon } from '@heroicons/react/24/outline';

import { GameDetail, Player } from 'features/catan/types';
import DisplayName from 'features/user/displayName';
import MessageList from 'features/chat/messageList';
import classNames from 'classnames';

interface IProps {
    game: GameDetail;
    me?: Player;
};

const GameFinished: FunctionComponent<IProps> = (props: IProps) => {
    const {t} = useTranslation("catan");
    const navigate = useNavigate();

    const handleLeaveGame = useCallback(() => {
        navigate("/catan/games")
    }, [navigate]);

    return (
        <div className="relative flex flex-col w-full mx-auto p-4 gap-2 md:w-1/2 
        dark:bg-slate-900">
            <div className="flex">
                <h1 className="my-auto">{t("game.finished.title")}</h1>
                
                <input 
                type="button" 
                className="ml-auto px-2 py-1 rounded-md shadow-md bg-red-500 text-white cursor-pointer 
                hover:shadow-lg hover:bg-red-400 
                active:shadow-md active:bg-red-500 
                dark:shadow-white/10 dark:bg-red-900 
                dark:hover:shadow-white/10 dark:hover:bg-red-800
                dark:active:shadow-white/10 dark:active:bg-red-900"
                value={t("game.finished.leave-game-button")}
                onClick={handleLeaveGame}/>
            </div>
            
            <div className="rounded-md shadow-lg overflow-hidden
            dark:bg-slate-800 dark:shadow-white/10">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-400 text-white uppercase dark:bg-blue-900">
                            <th className="text-center"></th>
                            <th className="text-center">{t("game.finished.data-table.display-name")}</th>
                            <th className="text-center">{t("game.finished.data-table.score")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[props.game.activePlayer, ...props.game.players].map(player => (
                            <tr key={player.id} className="shadow dark:shadow-white/10">
                                <td className="px-2 text-center">{player.score >= 10 && <AcademicCapIcon className="w-6 m-auto"/>}</td>
                                
                                <td className={classNames("px-2 text-center", {
                                    "text-blue-600": player === props.me
                                })}>
                                    <DisplayName id={player.userID}/>
                                </td>

                                <td className="px-2 text-center">{player.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="relative flex-auto rounded-md shadow-inner-lg
            dark:bg-slate-800 dark:shadow-white/10">
                <div className="absolute w-full h-full">
                    <MessageList roomID={props.game.id}/>
                </div>
            </div>              
        </div>
    );
}

export default memo(GameFinished);