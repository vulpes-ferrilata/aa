import { AnyAction, createAction, Dispatch, isAnyOf, ThunkDispatch } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import {dial, NSConn, Message, OnNamespaceConnected, OnNamespaceDisconnect, Conn, OnRoomJoined, OnRoomLeft, Options} from 'neffos';

import catanAPI from 'features/catan/api';
import { addMessage } from 'features/messages/slice';
import i18n from 'i18next'

const connectWebsocket = createAction<undefined>("websocket/connect");

const websocketMiddleware: Middleware<{}, any, Dispatch<AnyAction> & ThunkDispatch<any, undefined, AnyAction>> = api => {
    let catanNSConn: NSConn;
    return next => action => {
        if (connectWebsocket.match(action)) {
            const options: Options = {
                reconnect: 1000,
            }

            dial(`${process.env.REACT_APP_GATEWAY_ENDPOINT || (window.location.origin + "/api-gateway")}/`.replace("http", "ws"), {
                "catan": {
                    [OnNamespaceConnected]: (nsConn: NSConn, message: Message) => {
                        if (nsConn.conn.wasReconnected()) {
                            i18n.loadNamespaces("websocket", () => {
                                api.dispatch(
                                    addMessage({
                                        type: "SUCCESS",
                                        detail: i18n.t("websocket:reconnected-to-namespace", {namespace: message.Namespace})
                                    })
                                )
                            });                            
                        } else {
                            i18n.loadNamespaces("websocket", () => {
                                api.dispatch(
                                    addMessage({
                                        type: "SUCCESS",
                                        detail: i18n.t("websocket:connected-to-namespace", {namespace: message.Namespace})
                                    })
                                )
                            });
                        }
                        catanNSConn = nsConn
                    },
                    [OnNamespaceDisconnect]: (nsConn: NSConn, message: Message) => {
                        i18n.loadNamespaces("websocket", () => {
                            api.dispatch(
                                addMessage({
                                    type: "ERROR",
                                    detail: i18n.t("websocket:disconnected-from-namespace", {namespace: message.Namespace})
                                })
                            )
                        });
                    },
                    [OnRoomJoined]: (nsConn: NSConn, message: Message) => {
                        i18n.loadNamespaces("websocket", () => {
                            api.dispatch(
                                addMessage({
                                    type: "SUCCESS",
                                    detail: i18n.t("websocket:joined-to-room", {room: message.Room})
                                })
                            )
                        });
                    },
                    [OnRoomLeft]: (nsConn: NSConn, message: Message) => {
                        i18n.loadNamespaces("websocket", () => {
                            api.dispatch(
                                addMessage({
                                    type: "SUCCESS",
                                    detail: i18n.t("websocket:left-from-room", {room: message.Room})
                                })
                            )
                        });
                    },
                    "game:created": (nsConn: NSConn, message: Message) => {
                        api.dispatch(catanAPI.util.invalidateTags(["Games"]));
                    },
                    "game:updated": (nsConn: NSConn, message: Message) => {
                        api.dispatch(catanAPI.util.invalidateTags([{type: "Games", id:message.Room}]));
                    }
                }
            }, options).then((conn: Conn) => {
                conn.connect("catan")
            })
        }

        if (catanNSConn && isAnyOf(catanAPI.endpoints.getGame.matchPending, catanAPI.endpoints.getGame.matchRejected)(action)) {
            if ("condition" in action.meta && !action.meta.condition) {
                catanNSConn.rooms.forEach(room => room.leave())
            }
            catanNSConn.joinRoom(action.meta.arg.originalArgs)
        }
        

        if (catanNSConn && isAnyOf(catanAPI.endpoints.findAllGames.matchPending, catanAPI.endpoints.findAllGames.matchRejected)(action)) {
            catanNSConn.rooms.forEach(room => room.leave())
        }

        return next(action)
    }
}

export default websocketMiddleware

export {connectWebsocket}