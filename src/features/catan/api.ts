import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from 'app/store';
import { Mutex } from 'async-mutex';

import authApi from 'features/auth/api';
import { BuildRoad, BuildSettlement, BuildSettlementAndRoad, BuyDevelopmentCard, DiscardResourceCards, EndTurn, FindGamesRequest, Game, GameCreated, GameDetail, MaritimeTrade, MoveRobber, Pagination, PlayKnightCard, PlayMonopolyCard, PlayRoadBuildingCard, PlayVictoryPointCard, PlayYearOfPlentyCard, RollDices, SendTradeOffer, ToggleResourceCards, UpgradeCity } from './types';

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL?? ""}/api/v1/catan/games`, 
    prepareHeaders: (headers, {getState}) => {
        const language = localStorage.getItem("i18nextLng");
        if (language) {
            headers.set("Accept-Language", language);   
        }

        const accessToken = (getState() as RootState).auth.accessToken;
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);   
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
    tagTypes: ["Game", "GameDetail"],
    baseQuery: baseQueryWithReAuthentication,
    endpoints: builder => ({
        findGames: builder.query<Pagination<Game>, FindGamesRequest>({
            query: (findGamesRequest: FindGamesRequest) => ({
                url: "",
                method: "GET",
                params: findGamesRequest,
            }),
            providesTags: (gamePagination) => gamePagination? 
                [
                    ...gamePagination.data.map(({id}) => ({type: "Game" as const, id: id})),
                    {type:"Game", id: "PARTIAL_LIST"},
                ]
            : 
                [
                    {type:"Game", id: "PARTIAL_LIST"},
                ]
        }),
        getGame: builder.query<GameDetail, string>({
            query: (id: string) => ({
                url: `/${id}`,
                method: "GET",
            }),
            providesTags: (game, error, args) => [{type: "GameDetail", id: args}]
        }),
        createGame: builder.mutation<GameCreated, void>({
            query: () => ({
                url: "",
                method: "POST",
            }),
            invalidatesTags: ["GameDetail"]
        }),
        joinGame: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/join`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args}]
        }),
        startGame: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/start`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args}]
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
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        rollDices: builder.mutation<void, RollDices>({
            query: (rollDices: RollDices) => ({
                url: `/${rollDices.gameID}/roll-dices`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        discardResourceCards: builder.mutation<void, DiscardResourceCards>({
            query: (discardResourceCards: DiscardResourceCards) => ({
                url: `/${discardResourceCards.gameID}/discard-resource-cards`,
                method: "POST",
                body: {
                    resourceCardIDs: discardResourceCards.resourceCardIDs,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
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
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        endTurn: builder.mutation<void, EndTurn>({
            query: (endTurn: EndTurn) => ({
                url: `/${endTurn.gameID}/end-turn`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        buildSettlement: builder.mutation<void, BuildSettlement>({
            query: (buildSettlement: BuildSettlement) => ({
                url: `/${buildSettlement.gameID}/build-settlement`,
                method: "POST",
                body: {
                    landID: buildSettlement.landID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        buildRoad: builder.mutation<void, BuildRoad>({
            query: (buildRoad: BuildRoad) => ({
                url: `/${buildRoad.gameID}/build-road`,
                method: "POST",
                body: {
                    pathID: buildRoad.pathID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        upgradeCity: builder.mutation<void, UpgradeCity>({
            query: (upgradeCity: UpgradeCity) => ({
                url: `/${upgradeCity.gameID}/upgrade-city`,
                method: "POST",
                body: {
                    constructionID: upgradeCity.constructionID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        buyDevelopmentCard: builder.mutation<void, BuyDevelopmentCard>({
            query: (buyDevelopmentCard: BuyDevelopmentCard) => ({
                url: `/${buyDevelopmentCard.gameID}/buy-development-card`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        toggleResourceCards: builder.mutation<void, ToggleResourceCards>({
            query: (toggleResourceCards: ToggleResourceCards) => ({
                url: `/${toggleResourceCards.gameID}/toggle-resource-cards`,
                method: "POST",
                body: {
                    resourceCardIDs: toggleResourceCards.resourceCardIDs,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        maritimeTrade: builder.mutation<void, MaritimeTrade>({
            query: (maritimeTrade: MaritimeTrade) => ({
                url: `/${maritimeTrade.gameID}/maritime-trade`,
                method: "POST",
                body: {
                    resourceCardType: maritimeTrade.resourceCardType,
                    demandingResourceCardType: maritimeTrade.demandingResourceCardType,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        sendTradeOffer: builder.mutation<void, SendTradeOffer>({
            query: (sendTradeOffer: SendTradeOffer) => ({
                url: `/${sendTradeOffer.gameID}/send-trade-offer`,
                method: "POST",
                body: {
                    playerID: sendTradeOffer.playerID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        confirmTradeOffer: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/confirm-trade-offer`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args}]
        }),
        cancelTradeOffer: builder.mutation<void, string>({
            query: (gameID: string) => ({
                url: `/${gameID}/cancel-trade-offer`,
                method: "POST",
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args}]
        }),
        playKnightCard: builder.mutation<void, PlayKnightCard>({
            query: (playKnightCard: PlayKnightCard) => ({
                url: `/${playKnightCard.gameID}/play-knight-card`,
                method: "POST",
                body: {
                    developmentCardID: playKnightCard.developmentCardID,
                    terrainID: playKnightCard.terrainID,
                    playerID: playKnightCard.playerID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        playRoadBuildingCard: builder.mutation<void, PlayRoadBuildingCard>({
            query: (playRoadBuildingCard: PlayRoadBuildingCard) => ({
                url: `/${playRoadBuildingCard.gameID}/play-road-building-card`,
                method: "POST",
                body: {
                    developmentCardID: playRoadBuildingCard.developmentCardID,
                    pathIDs: playRoadBuildingCard.pathIDs,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        playYearOfPlentyCard: builder.mutation<void, PlayYearOfPlentyCard>({
            query: (playYearOfPlentyCard: PlayYearOfPlentyCard) => ({
                url: `/${playYearOfPlentyCard.gameID}/play-year-of-plenty-card`,
                method: "POST",
                body: {
                    developmentCardID: playYearOfPlentyCard.developmentCardID,
                    demandingResourceCardTypes: playYearOfPlentyCard.demandingResourceCardTypes,
                }
            }),            
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        playMonopolyCard: builder.mutation<void, PlayMonopolyCard>({
            query: (playMonopolyCard: PlayMonopolyCard) => ({
                url: `/${playMonopolyCard.gameID}/play-monopoly-card`,
                method: "POST",
                body: {
                    developmentCardID: playMonopolyCard.developmentCardID,
                    demandingResourceCardType: playMonopolyCard.demandingResourceCardType,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
        playVictoryPointCard: builder.mutation<void, PlayVictoryPointCard>({
            query: (playVictoryPointCard: PlayVictoryPointCard) => ({
                url: `/${playVictoryPointCard.gameID}/play-victory-point-card`,
                method: "POST",
                body: {
                    developmentCardID: playVictoryPointCard.developmentCardID,
                }
            }),
            invalidatesTags: (data, error, args) => [{type: "GameDetail", id: args.gameID}]
        }),
    })
});

export default api;

export const { 
    useFindGamesQuery,
    useGetGameQuery,
    useCreateGameMutation,
    useJoinGameMutation,
    useStartGameMutation,
    useBuildSettlementAndRoadMutation,
    useRollDicesMutation,
    useDiscardResourceCardsMutation,
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
    usePlayMonopolyCardMutation,
    usePlayVictoryPointCardMutation,
} = api;