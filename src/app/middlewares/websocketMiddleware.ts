import { createAction, isAnyOf } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import {dial, NSConn, Message, OnNamespaceConnected, OnNamespaceDisconnect, Conn, OnRoomJoined, OnRoomLeft, Options} from 'neffos'

import catanAPI from 'features/catan/api'
import { RootState } from 'app/store';

const connectWebsocket = createAction<undefined>("websocket/connect");

const websocketMiddleware: Middleware = api => {
    let catanNSConn: NSConn;
    return next => action => {
        if (connectWebsocket.match(action)) {
            const options: Options = {
                reconnect: 1000,
            }

            dial(`${process.env.GATEWAY_ENDPOINT || (window.location.origin + "/api-gateway")}/`.replace("http", "ws"), {
                "catan": {
                    [OnNamespaceConnected]: (nsConn: NSConn, message: Message) => {
                        if (nsConn.conn.wasReconnected()) {
                            console.log("reconnected to namespace: " + message.Namespace);
                        } else {
                            console.log("connected to namespace: " + message.Namespace);
                        }
                        catanNSConn = nsConn
                    },
                    [OnNamespaceDisconnect]: (nsConn: NSConn, message: Message) => {
                        console.log("disconnected from namespace: " + message.Namespace);
                    },
                    [OnRoomJoined]: (nsConn: NSConn, message: Message) => {
                        console.log("joined to room: " + message.Room);
                    },
                    [OnRoomLeft]: (nsConn: NSConn, message: Message) => {
                        console.log("left from room: " + message.Room);
                    },
                    "game:created": (nsConn: NSConn, message: Message) => {
                        api.dispatch(catanAPI.util.invalidateTags(["Games"]));
                    },
                    "game:updated": (nsConn: NSConn, message: Message) => {
                        const room = message.Room;
                        if (!!room) {
                            api.dispatch(catanAPI.util.invalidateTags([{type: "Games", id:room}]));
                        }
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