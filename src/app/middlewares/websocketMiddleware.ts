import { AnyAction, Dispatch, isAnyOf, ThunkDispatch } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import {dial, NSConn, Message, Conn, Options, OnAnyEvent, isSystemEvent, OnNamespaceConnected, OnNamespaceDisconnect, OnNamespaceConnect} from 'neffos';
import i18n from 'i18next';

import userAPI from 'features/user/api';
import catanAPI from 'features/catan/api';
import chatAPI from 'features/chat/api';
import { Message as ChatMessage } from 'features/chat/types';
import { addNotification } from 'features/notification/slice';
import { NotificationType } from 'features/notification/types';
import { connectWebsocket } from 'features/websocket/actions';

const enum Namespace {
    Catan = "Catan",
    Chat = "Chat",
};

type CatanMessage = {
    userID: string;
}

const websocketMiddleware: Middleware<{}, any, Dispatch<AnyAction> & ThunkDispatch<any, undefined, AnyAction>> = api => {
    let websocketConn: Conn;
    let roomID: string = "";

    return next => action => {
        if (connectWebsocket.match(action)) {
            (async() => {
                const options: Options = {
                    reconnect: 1000,
                };

                websocketConn = await dial(`${process.env.REACT_APP_API_URL?? ""}/websocket/`, {
                    [Namespace.Catan]: {
                        [OnNamespaceConnect]: () => {
                            (async() => {
                                await i18n.loadNamespaces("notification");

                                const translatedDetail = i18n.t("notification:connecting-to-namespace", {namespace: Namespace.Catan});
    
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Info,
                                        detail: translatedDetail,
                                    })
                                );
                            })()
                        },
                        [OnNamespaceConnected]: (nsConn: NSConn) => {
                            (async() => {
                                await i18n.loadNamespaces("notification");

                                let translatedDetail = "";
                                if (nsConn.conn.wasReconnected()) {
                                    translatedDetail = i18n.t("notification:reconnected-to-namespace", {namespace: Namespace.Catan});
                                } else {
                                    translatedDetail = i18n.t("notification:connected-to-namespace", {namespace: Namespace.Catan});
                                }
    
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Success,
                                        detail: translatedDetail,
                                    })
                                );
                            })();                            
                        },
                        [OnNamespaceDisconnect]: () => {
                            (async() => {
                                await i18n.loadNamespaces("notification");

                                const translatedDetail = i18n.t("notification:disconnected-from-namespace", {namespace: Namespace.Catan});
    
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Error,
                                        detail: translatedDetail,
                                    })
                                );
                            })();
                        },
                        [OnAnyEvent]: (nsConn: NSConn, message: Message) => {
                            if (isSystemEvent(message.Event || "")) {
                                return null;
                            }

                            const catanMessage: CatanMessage = message.unmarshal();
    
                            switch (message.Event) {
                                case "GameCreated":
                                    api.dispatch(catanAPI.util.invalidateTags(["Game"]));
                                    break;
                                default:
                                    api.dispatch(catanAPI.util.invalidateTags([{type: "GameDetail", id: message.Room}]));
                                    break;
                            }

                            (async() => {
                                await i18n.loadNamespaces("notification");
                            
                                const result = await api.dispatch(userAPI.endpoints.getUser.initiate(catanMessage.userID));
        
                                const translatedDetail = ((event?: string, playerName?: string) => {
                                    switch (event) {
                                        case "GameCreated":
                                            return i18n.t("notification:player-created-game", {player: playerName});
                                        case "GameJoined":
                                            return i18n.t("notification:player-joined-game", {player: playerName});
                                        case "GameStarted":
                                            return i18n.t("notification:player-started-game", {player: playerName});
                                        case "SettlementAndRoadBuilt":
                                            return i18n.t("notification:player-built-settlement-and-road", {player: playerName});
                                        case "DicesRolled":
                                            return i18n.t("notification:player-rolled-dices", {player: playerName});
                                        case "ResourceCardsDiscarded":
                                                return i18n.t("notification:player-discarded-resource-cards", {player: playerName});
                                        case "RobberMoved":
                                            return i18n.t("notification:player-moved-robber", {player: playerName});
                                        case "TurnEnded":
                                            return i18n.t("notification:player-ended-turn", {player: playerName});
                                        case "SettlementBuilt":
                                            return i18n.t("notification:player-built-settlement", {player: playerName});
                                        case "RoadBuilt":
                                            return i18n.t("notification:player-built-road", {player: playerName});
                                        case "CityUpgraded":
                                            return i18n.t("notification:player-upgraded-city", {player: playerName});
                                        case "DevelopmentCardBought":
                                            return i18n.t("notification:player-bought-development-card", {player: playerName});
                                        case "ResourceCardsToggled":
                                            return i18n.t("notification:player-toggled-resource-cards", {player: playerName});
                                        case "MaritimeTraded":
                                            return i18n.t("notification:player-traded-with-maritime", {player: playerName});
                                        case "TradeOfferSent":
                                            return i18n.t("notification:player-sent-trade-offer", {player: playerName});
                                        case "TradeOfferConfirmed":
                                            return i18n.t("notification:player-confirmed-trade-offer", {player: playerName});
                                        case "TradeOfferCancelled":
                                            return i18n.t("notification:player-cancelled-trade-offer", {player: playerName});
                                        case "KnightCardPlayed":
                                            return i18n.t("notification:player-played-knight-card", {player: playerName});
                                        case "RoadBuildingCardPlayed":
                                            return i18n.t("notification:player-played-road-building-card", {player: playerName});
                                        case "YearOfPlentyCardPlayed":
                                            return i18n.t("notification:player-played-year-of-plenty-card", {player: playerName});
                                        case "MonopolyCardPlayed":
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
                    [Namespace.Chat]: {
                        [OnNamespaceConnect]: () => {
                            (async() => {
                                await i18n.loadNamespaces("notification");

                                const translatedDetail = i18n.t("notification:connecting-to-namespace", {namespace: Namespace.Chat});
    
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Info,
                                        detail: translatedDetail,
                                    })
                                );
                            })()
                        },
                        [OnNamespaceConnected]: (nsConn: NSConn) => {
                            (async() => {
                                await i18n.loadNamespaces("notification");

                                let translatedDetail = "";
                                if (nsConn.conn.wasReconnected()) {
                                    translatedDetail = i18n.t("notification:reconnected-to-namespace", {namespace: Namespace.Chat});
                                } else {
                                    translatedDetail = i18n.t("notification:connected-to-namespace", {namespace: Namespace.Chat});
                                }
    
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Success,
                                        detail: translatedDetail,
                                    })
                                );
                            })();                            
                        },
                        [OnNamespaceDisconnect]: () => {
                            (async() => {
                                await i18n.loadNamespaces("notification");

                                const translatedDetail = i18n.t("notification:disconnected-from-namespace", {namespace: Namespace.Chat});
    
                                api.dispatch( 
                                    addNotification({
                                        type: NotificationType.Error,
                                        detail: translatedDetail,
                                    })
                                );
                            })();
                        },
                        "MessageCreated": (nsConn: NSConn, message: Message) => {
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

        if (isAnyOf(catanAPI.endpoints.findGames.matchPending, catanAPI.endpoints.findGames.matchRejected)(action)) {
            websocketConn && websocketConn.connectedNamespaces.forEach(connectedNamespace => connectedNamespace.rooms?.forEach(room => room.leave()));
        }

        return next(action);
    }
};

export default websocketMiddleware;