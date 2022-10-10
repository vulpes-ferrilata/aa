import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from 'app/store'
import { Mutex } from 'async-mutex'

import authApi from 'features/auth/api'

type GameCreated = {
    id: string;
};

export type Game = {
    id: string;
    status: GameStatus;
    phase: GamePhase;
    turn: number;
    activePlayer: Player;
    players: Player[];
    dices: Dice[];
    achievements: Achievement[];
    resourceCards: ResourceCard[];
    developmentCards: DevelopmentCard[];
    terrains: Terrain[];
    lands: Land[];
    paths: Path[];
};

type GameStatus = "WAITING" | "STARTED" | "FINISHED";

type GamePhase = "RESOURCE_PRODUCTION" | "ROBBING" | "RESOURCE_CONSUMPTION";

export type Player = {
    id: string;
    userID: string;
    color: PlayerColor;
    turnOrder: number;
    isOffered: boolean;
    score: number;
    achievements: Achievement[];
    resourceCards: ResourceCard[];
    developmentCards: DevelopmentCard[];
    constructions: Construction[];
    roads: Road[];
};

export type PlayerColor = "RED" | "BLUE" | "GREEN" | "YELLOW";

export type Dice = {
    id: string;
    number: number;
};

type Achievement = {
    id: string;
    type: AchievementType;
};

export type AchievementType = "LONGEST_ROAD" | "LARGEST_ARMY";

export type ResourceCard = {
    id: string;
    type: ResourceCardType;
    isSelected: boolean;
};

export type ResourceCardType = "LUMBER" | "BRICK" | "WOOL" | "GRAIN" | "ORE" | "HIDDEN";

export type DevelopmentCard = {
    id: string;
    type: DevelopmentCardType;
    status: DevelopmentCardStatus;
};

export type DevelopmentCardType = "KNIGHT" | "MONOPOLY" | "ROAD_BUILDING" | "YEAR_OF_PLENTY" | "VICTORY_POINTS" | "HIDDEN";

type DevelopmentCardStatus = "ENABLE" | "DISABLE" | "USED";

export type Terrain = {
    id: string;
    q: number;
    r: number;
    number: number;
    type: TerrainType;
    harbor?: Harbor;
    robber?: Robber;
};

export type TerrainType = "FOREST" | "HILL" | "FIELD" | "PASTURE" | "MOUNTAIN" | "DESERT";

export type Harbor = {
    id: string;
    q: number;
    r: number;
    type: HarborType;
};

export type HarborType = "LUMBER" | "BRICK" | "WOOL" | "GRAIN" | "ORE" | "GENERAL";

export type Robber = {
    id: string;
};

export type Land = {
    id: string;
    q: number;
    r: number;
    location: LandLocation;
};

export type LandLocation = "TOP" | "BOTTOM";

export type Path = {
    id: string;
    q: number;
    r: number;
    location: PathLocation;
};

export type Construction = {
    id: string;
    type: ConstructionType;
    land?: Land;
};

export type ConstructionType = "SETTLEMENT" | "CITY";

type Road = {
    id: string;
    path?: Path;
};

export type PathLocation = "TOP_LEFT" | "MIDDLE_LEFT" | "BOTTOM_LEFT";

export class BuildSettlementAndRoad {
    gameID?: string;
    landID?: string;
    pathID?: string;

    constructor(gameID?: string, landID?: string, pathID?: string) {
        this.gameID = gameID;
        this.landID = landID;
        this.pathID = pathID;
    }
}

export class MoveRobber {
    gameID?: string;
    terrainID?: string;
    playerID?: string;

    constructor(gameID?: string, terrainID?: string, playerID?: string) {
        this.gameID = gameID;
        this.terrainID = terrainID;
        this.playerID = playerID;
    }
}

export class BuildSettlement {
    gameID?: string;
    landID?: string;

    constructor(gameID?: string, landID?: string) {
        this.gameID = gameID;
        this.landID = landID;
    }
}

export class BuildRoad {
    gameID?: string;
    pathID?: string;

    constructor(gameID?: string, pathID?: string) {
        this.gameID = gameID;
        this.pathID = pathID;
    }
}

export class UpgradeCity {
    gameID?: string;
    constructionID?: string;

    constructor(gameID?: string, constructionID?: string) {
        this.gameID = gameID;
        this.constructionID = constructionID;
    }
}

export class BuyDevelopmentCard {
    gameID?: string;

    constructor(gameID?: string) {
        this.gameID = gameID;
    }
}

export class ToggleResourceCards {
    gameID?: string;
    resourceCardIDs?: string[];

    constructor(gameID?: string, resourceCardIDs?: string[]) {
        this.gameID = gameID
        this.resourceCardIDs = resourceCardIDs
    }
}

export class MaritimeTrade {
    gameID?: string;
    resourceCardType?: ResourceCardType;

    constructor(gameID?: string, resourceCardType?: ResourceCardType) {
        this.gameID = gameID
        this.resourceCardType = resourceCardType
    }
}

export class OfferTrading {
    gameID?: string;
    playerID?: string;

    constructor(gameID?: string, playerID?: string) {
        this.gameID = gameID
        this.playerID = playerID
    }
}

export class PlayKnightCard {
    gameID?: string;
    developmentCardID?: string;
    terrainID?: string;
    playerID?: string;

    constructor(gameID?: string, developmentCardID?: string, terrainID?: string, playerID?: string) {
        this.gameID = gameID;
        this.developmentCardID = developmentCardID;
        this.terrainID = terrainID;
        this.playerID = playerID;
    }
}

export class PlayRoadBuildingCard {
    gameID?: string;
    developmentCardID?: string;
    pathIDs?: string[];

    constructor(gameID?: string, developmentCardID?: string, pathIDs?: string[]) {
        this.gameID = gameID;
        this.developmentCardID = developmentCardID;
        this.pathIDs = pathIDs;
    }
}

export class PlayYearOfPlentyCard {
    gameID?: string;
    developmentCardID?: string;
    resourceCardTypes?: ResourceCardType[];

    constructor(gameID?: string, developmentCardID?: string, resourceCardTypes?: ResourceCardType[]) {
        this.gameID = gameID;
        this.developmentCardID = developmentCardID;
        this.resourceCardTypes = resourceCardTypes;
    }
}

export class PlayMonopolyCard {
    gameID?: string;
    developmentCardID?: string;
    resourceCardType?: ResourceCardType;

    constructor(gameID?: string, developmentCardID?: string, resourceCardType?: ResourceCardType) {
        this.gameID = gameID;
        this.developmentCardID = developmentCardID;
        this.resourceCardType = resourceCardType;
    }
}

export type Action = BuildSettlementAndRoad | MoveRobber | BuildSettlement | BuildRoad | UpgradeCity | BuyDevelopmentCard | ToggleResourceCards | MaritimeTrade | OfferTrading | PlayKnightCard | PlayRoadBuildingCard | PlayYearOfPlentyCard | PlayMonopolyCard

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_GATEWAY_ENDPOINT || (window.location.origin + "/api-gateway")}/api/v1/catan`, 
    prepareHeaders: (headers, {getState}) => {
        const language = localStorage.getItem("i18nextLng");
        if (language) {
            headers.set("Accept-Language", language);   
        }

        const accessToken = (getState() as RootState).auth.accessToken;
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);   
        }
        
        return headers;
    },
});

const mutex = new Mutex();

const baseQueryWithReAuthentication: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async(args, api, extraOptions) => {
    await mutex.waitForUnlock();

    const result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        const state = api.getState() as RootState;
        if (!state.auth.refreshToken) {
            return result;
        }
        
        const release = await mutex.acquire();

        try {
            const refreshResult = await api.dispatch(authApi.endpoints.refresh.initiate(state.auth.refreshToken));

            if ("data" in refreshResult) {
                return baseQueryWithReAuthentication(args, api, extraOptions);
            } else {
                api.dispatch(authApi.endpoints.revoke.initiate(state.auth.refreshToken));
            }
        } finally {
            release();
        }
    }

    return result;
};

const api = createApi({
    reducerPath: "catanAPI",
    tagTypes: ["Games"],
    baseQuery: baseQueryWithReAuthentication,
    endpoints: builder => ({
        findAllGames: builder.query<Game[], void>({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: (games = []) => [
                "Games",
                ...games.map(game => ({type: "Games" as const, id: game.id})), 
            ]
        }),
        getGame: builder.query<Game, string>({
            query: (id: string) => ({
                url: `/${id}`,
                method: "GET",
            }),
            providesTags: (game, error, args) => [{type: "Games", id: args}]
        }),
        createGame: builder.mutation<GameCreated, void>({
            query: () => ({
                url: "",
                method: "POST",
            }),
            invalidatesTags: ["Games"]
        }),
        joinGame: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/join`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args}]
        }),
        startGame: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/start`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args}]
        }),
        buildSettlementAndRoad: builder.mutation<void, BuildSettlementAndRoad>({
            query: (buildSettlementAndRoad: BuildSettlementAndRoad) => ({
                url: `/${buildSettlementAndRoad.gameID}/build-settlement-and-road`,
                method: "POST",
                body: {
                    landID: buildSettlementAndRoad.landID,
                    pathID: buildSettlementAndRoad.pathID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        rollDices: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/roll-dices`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args}]
        }),
        moveRobber: builder.mutation<void, MoveRobber>({
            query: (moveRobber: MoveRobber) => ({
                url: `/${moveRobber.gameID}/move-robber`,
                method: "POST",
                body: {
                    terrainID: moveRobber.terrainID,
                    playerID: moveRobber.playerID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        endTurn: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/end-turn`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args}]
        }),
        buildSettlement: builder.mutation<void, BuildSettlement>({
            query: (buildSettlement: BuildSettlement) => ({
                url: `/${buildSettlement.gameID}/build-settlement`,
                method: "POST",
                body: {
                    landID: buildSettlement.landID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        buildRoad: builder.mutation<void, BuildRoad>({
            query: (buildRoad: BuildRoad) => ({
                url: `/${buildRoad.gameID}/build-road`,
                method: "POST",
                body: {
                    pathID: buildRoad.pathID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        upgradeCity: builder.mutation<void, UpgradeCity>({
            query: (upgradeCity: UpgradeCity) => ({
                url: `/${upgradeCity.gameID}/upgrade-city`,
                method: "POST",
                body: {
                    constructionID: upgradeCity.constructionID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        buyDevelopmentCard: builder.mutation<void, BuyDevelopmentCard>({
            query: (buyDevelopmentCard: BuyDevelopmentCard) => ({
                url: `/${buyDevelopmentCard.gameID}/buy-development-card`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        toggleResourceCards: builder.mutation<void, ToggleResourceCards>({
            query: (toggleResourceCards: ToggleResourceCards) => ({
                url: `/${toggleResourceCards.gameID}/toggle-resource-cards`,
                method: "POST",
                body: {
                    resourceCardIDs: toggleResourceCards.resourceCardIDs,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        maritimeTrade: builder.mutation<void, MaritimeTrade>({
            query: (maritimeTrade: MaritimeTrade) => ({
                url: `/${maritimeTrade.gameID}/maritime-trade`,
                method: "POST",
                body: {
                    resourceCardType: maritimeTrade.resourceCardType,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        sendTradeOffer: builder.mutation<void, OfferTrading>({
            query: (offerTrading: OfferTrading) => ({
                url: `/${offerTrading.gameID}/send-trade-offer`,
                method: "POST",
                body: {
                    playerID: offerTrading.playerID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        confirmTradeOffer: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/confirm-trade-offer`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args}]
        }),
        cancelTradeOffer: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/cancel-trade-offer`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args}]
        }),
        playKnightCard: builder.mutation<void, PlayKnightCard>({
            query: (playKnightCard: PlayKnightCard) => ({
                url: `/${playKnightCard.gameID}/play-knight-card`,
                method: "POST",
                body: {
                    terrainID: playKnightCard.terrainID,
                    playerID: playKnightCard.playerID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        playRoadBuildingCard: builder.mutation<void, PlayRoadBuildingCard>({
            query: (playRoadBuildingCard: PlayRoadBuildingCard) => ({
                url: `/${playRoadBuildingCard.gameID}/play-road-building-card`,
                method: "POST",
                body: {
                    pathIDs: playRoadBuildingCard.pathIDs,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        playYearOfPlentyCard: builder.mutation<void, PlayYearOfPlentyCard>({
            query: (playYearOfPlentyCard: PlayYearOfPlentyCard) => ({
                url: `/${playYearOfPlentyCard.gameID}/play-year-of-plenty-card`,
                method: "POST",
                body: {
                    resourceCardTypes: playYearOfPlentyCard.resourceCardTypes,
                }
            }),            
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
        playMonopolyCard: builder.mutation<void, PlayMonopolyCard>({
            query: (playMonopolyCard: PlayMonopolyCard) => ({
                url: `/${playMonopolyCard.gameID}/play-monopoly-card`,
                method: "POST",
                body: {
                    resourceCardType: playMonopolyCard.resourceCardType,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "Games", id: args.gameID}]
        }),
    })
});

export default api;

export const { 
    useFindAllGamesQuery,
    useGetGameQuery,
    useCreateGameMutation,
    useJoinGameMutation,
    useStartGameMutation,
    useBuildSettlementAndRoadMutation,
    useRollDicesMutation,
    useMoveRobberMutation,
    useEndTurnMutation,
    useBuildSettlementMutation,
    useBuildRoadMutation,
    useUpgradeCityMutation,
    useBuyDevelopmentCardMutation,
    useToggleResourceCardsMutation,
    useMaritimeTradeMutation,
    useSendTradeOfferMutation,
    useConfirmTradeOfferMutation,
    useCancelTradeOfferMutation,
    usePlayKnightCardMutation,
    usePlayRoadBuildingCardMutation,
    usePlayYearOfPlentyCardMutation,
    usePlayMonopolyCardMutation
} = api;