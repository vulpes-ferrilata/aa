import React, { FormEvent, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Game, Player, PlayerColor, useJoinGameMutation, useStartGameMutation } from 'features/catan/api';
import { KeyIcon } from '@heroicons/react/24/outline';
import DisplayName from 'features/user/displayName';
import MessageList from 'features/chat/messageList';
import withMenubar from 'shared/hoc/withMenubar';
import classNames from 'classnames';

interface IProps {
    game: Game;
    me?: Player;
};

function GameWaiting(props: IProps) {
    const {t} = useTranslation("catan");

    const [joinGame]= useJoinGameMutation();
    const [startGame]= useStartGameMutation();

    const handleJoinGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        await joinGame(props.game.id);
    };

    const handleStartGame = async (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        await startGame(props.game.id);
    };

    return (
        <div className="relative flex flex-col w-full mx-auto p-4 gap-2 md:w-2/3
        dark:bg-slate-900">
            <div className="flex">
                <h1 className="my-auto">{t("game.waiting.title")}</h1>

                {
                    props.game.activePlayer === props.me?
                        <input 
                        type="button" 
                        className="ml-auto px-2 py-1 rounded-md shadow-md bg-blue-500 text-white cursor-pointer 
                        hover:shadow-lg hover:bg-blue-400 
                        active:shadow-md active:bg-blue-500 
                        dark:shadow-white/10 dark:bg-blue-900 
                        dark:hover:shadow-white/10 dark:hover:bg-blue-800
                        dark:active:shadow-white/10 dark:active:bg-blue-900"
                        value={t("game.waiting.start-game-button")}
                        onClick={handleStartGame}/>
                    :
                        null
                }

                {
                    !props.me?
                        <input 
                        type="button" 
                        className="ml-auto px-2 py-1 rounded-md shadow-md bg-green-500 text-white cursor-pointer 
                        hover:shadow-lg hover:bg-green-400 
                        active:shadow-md active:bg-green-500 
                        dark:shadow-white/10 dark:bg-green-900 
                        dark:hover:shadow-white/10 dark:hover:bg-green-800
                        dark:active:shadow-white/10 dark:active:bg-green-900"
                        value={t("game.waiting.join-game-button")}
                        onClick={handleJoinGame}/>
                    :
                        null
                }
            </div>
            
            <div className="rounded-md shadow-lg overflow-hidden
            dark:bg-slate-800 dark:shadow-white/10">
                <table className="w-full">
                    <thead>
                        <tr className="bg-blue-400 text-white uppercase dark:bg-blue-900">
                            <th className="text-center"></th>
                            <th className="text-center">{t("game.waiting.data-table.display-name")}</th>
                            <th className="text-center">{t("game.waiting.data-table.color")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[props.game.activePlayer, ...props.game.players].map(player => {
                            const playerBackgroundColor = ((playerColor: PlayerColor) => {
                                switch (playerColor) {
                                    case "RED":
                                        return "bg-red-600";
                                    case "BLUE":
                                        return "bg-blue-600";
                                    case "GREEN":
                                        return "bg-green-600";
                                    case "YELLOW":
                                        return "bg-yellow-600";
                                }
                            })(player.color);

                            return (
                                <tr key={player.id} className="shadow dark:shadow-white/10">
                                    <td className="px-2 text-center">{player === props.game.activePlayer? <KeyIcon className="w-6 m-auto"/>: null}</td>
                                    <td className={`px-2 text-center ${player === props.me? "text-blue-600": ""}`}><DisplayName id={player.userID}/></td>
                                    <td className="px-2 text-center"><div className={classNames("w-20 h-5 m-auto rounded-full", playerBackgroundColor)}/></td>
                                </tr>
                            )
                        })}
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

export default withMenubar<IProps>(memo(GameWaiting, (prevProps, nextProps) => {
    return prevProps.game === nextProps.game &&
    prevProps.me === nextProps.me;
}));