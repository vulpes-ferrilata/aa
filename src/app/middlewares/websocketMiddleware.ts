import { AnyAction, createAction, Dispatch, isAnyOf, ThunkDispatch } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import {dial, NSConn, Message, Conn, Options, OnAnyEvent, isSystemEvent} from 'neffos';

import userAPI from 'features/user/api';
import catanAPI from 'features/catan/api';
import chatAPI, { Message as ChatMessage } from 'features/chat/api';
import { addNotification, NotificationType } from 'features/notification/slice';
import i18n from 'i18next'

export const connectWebsocket = createAction<undefined>("websocket/connect");

const enum Namespace {
    Catan = "catan",
    Chat = "chat",
};

const websocketMiddleware: Middleware<{}, any, Dispatch<AnyAction> & ThunkDispatch<any, undefined, AnyAction>> = api => {
    let websocketConn: Conn;
    let roomID: string = "";

    return next => action => {
        if (connectWebsocket.match(action)) {
            (async() => {
                const options: Options = {
                    reconnect: 1000,
                };

                websocketConn = await dial(`${process.env.REACT_APP_GATEWAY_ENDPOINT || (window.location.origin + "/api-gateway")}/`.replace("http", "ws"), {
                    "catan": {
                        [OnAnyEvent]: (nsConn: NSConn, message: Message) => {
                            if (isSystemEvent(message.Event || "")) {
                                return null;
                            }
    
                            switch (message.Event) {
                                case "player-created-game":
                                    api.dispatch(catanAPI.util.invalidateTags(["Games"]));
                                    break;
                                default:
                                    api.dispatch(catanAPI.util.invalidateTags([{type: "Games", id: message.Room}]));
                                    break;
                            }

                            (async() => {
                                await i18n.loadNamespaces("notification");
                            
                                const result = await api.dispatch(userAPI.endpoints.getUser.initiate(message.Body || ""));
        
                                const translatedDetail = ((event?: string, playerName?: string) => {
                                    switch (event) {
                                        case "player-created-game":
                                            return i18n.t("notification:player-created-game", {player: playerName});
                                        case "player-joined-game":
                                            return i18n.t("notification:player-joined-game", {player: playerName});
                                        case "player-started-game":
                                            return i18n.t("notification:player-started-game", {player: playerName});
                                        case "player-built-settlement-and-road":
                                            return i18n.t("notification:player-built-settlement-and-road", {player: playerName});
                                        case "player-rolled-dices":
                                            return i18n.t("notification:player-rolled-dices", {player: playerName});
                                        case "player-moved-robber":
                                            return i18n.t("notification:player-moved-robber", {player: playerName});
                                        case "player-ended-turn":
                                            return i18n.t("notification:player-ended-turn", {player: playerName});
                                        case "player-built-settlement":
                                            return i18n.t("notification:player-built-settlement", {player: playerName});
                                        case "player-built-road":
                                            return i18n.t("notification:player-built-road", {player: playerName});
                                        case "player-upgraded-city":
                                            return i18n.t("notification:player-upgraded-city", {player: playerName});
                                        case "player-bought-development-card":
                                            return i18n.t("notification:player-bought-development-card", {player: playerName});
                                        case "player-toggled-resource-cards":
                                            return i18n.t("notification:player-toggled-resource-cards", {player: playerName});
                                        case "player-traded-with-maritime":
                                            return i18n.t("notification:player-traded-with-maritime", {player: playerName});
                                        case "player-sent-trade-offer":
                                            return i18n.t("notification:player-sent-trade-offer", {player: playerName});
                                        case "player-confirmed-trade-offer":
                                            return i18n.t("notification:player-confirmed-trade-offer", {player: playerName});
                                        case "player-cancelled-trade-offer":
                                            return i18n.t("notification:player-cancelled-trade-offer", {player: playerName});
                                        case "player-played-knight-card":
                                            return i18n.t("notification:player-played-knight-card", {player: playerName});
                                        case "player-played-road-building-card":
                                            return i18n.t("notification:player-played-road-building-card", {player: playerName});
                                        case "player-played-year-of-plenty-card":
                                            return i18n.t("notification:player-played-year-of-plenty-card", {player: playerName});
                                        case "player-played-monopoly-card":
                                            return i18n.t("notification:player-played-monopoly-card", {player: playerName});
                                    }
        
                                    return event?? "but why?";
                                })(message.Event, result.data?.displayName)
        
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Info,
                                        detail: translatedDetail,
                                    })
                                );
                            })()
                        },
                    },
                    "chat": {
                        "message-created": (nsConn: NSConn, message: Message) => {
                            const chatMessage: ChatMessage = message.unmarshal();
    
                            api.dispatch(chatAPI.util.updateQueryData("findMessages", message.Room || "", draft => {
                                draft.push({
                                    id: chatMessage.id,
                                    userID: chatMessage.userID,
                                    detail: chatMessage.detail,
                                })
                            }))
                        }
                    }
                }, options);
    
                await websocketConn.connect(Namespace.Catan);
                roomID && websocketConn.namespace(Namespace.Catan)?.joinRoom(roomID);
    
                await websocketConn.connect(Namespace.Chat);
                roomID && websocketConn.namespace(Namespace.Chat)?.joinRoom(roomID);
            })()
            
            return;
        }

        if (isAnyOf(catanAPI.endpoints.getGame.matchPending, catanAPI.endpoints.getGame.matchRejected)(action)) {
            if ("condition" in action.meta && !action.meta.condition) {
                websocketConn && websocketConn.connectedNamespaces.forEach(connectedNamespace => connectedNamespace.rooms?.forEach(room => room.leave()));
            } else {
                websocketConn && websocketConn.connectedNamespaces.forEach(connectedNamespace => connectedNamespace.joinRoom(action.meta.arg.originalArgs));
                roomID = action.meta.arg.originalArgs;
            }
        }
        

        if (isAnyOf(catanAPI.endpoints.findAllGames.matchPending, catanAPI.endpoints.findAllGames.matchRejected)(action)) {
            websocketConn && websocketConn.connectedNamespaces.forEach(connectedNamespace => connectedNamespace.rooms?.forEach(room => room.leave()));
        }

        return next(action);
    }
};

export default websocketMiddleware;