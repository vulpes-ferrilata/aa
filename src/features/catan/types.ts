export type FindGamesRequest = {
    limit?: number;
    offset?: number;
};

export type GameCreated = {
    id: string;
};

export type Pagination<T> = {
    total: number;
    data: T[];
}

export type Game = {
    id: string;
    playerQuantity: number;
    status: GameStatus;
}

export type GameDetail = {
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

export const enum GameStatus {
    Waiting = "Waiting",
    Started = "Started",
    Finished = "Finished",
};

export const enum GamePhase {
    Setup = "Setup",
    ResourceProduction = "ResourceProduction",
    ResourceDiscard = "ResourceDiscard",
    Robbing = "Robbing",
    ResourceConsumption = "ResourceConsumption",
};

export type Player = {
    id: string;
    userID: string;
    color: PlayerColor;
    turnOrder: number;
    receivedOffer: boolean;
    discardedResources: boolean;
    score: number;
    achievements: Achievement[];
    resourceCards: ResourceCard[];
    developmentCards: DevelopmentCard[];
    constructions: Construction[];
    roads: Road[];
};

export enum PlayerColor {
    Red = "Red",
    Blue = "Blue",
    Green = "Green",
    Yellow = "Yellow",
};

export namespace PlayerColor {
    export function toColor(playerColor: PlayerColor): string {
        switch(playerColor) {
            case PlayerColor.Red:
                return "text-red-600";
            case PlayerColor.Blue:
                return "text-blue-600";                                            
            case PlayerColor.Green:
                return "text-green-600";                                            
            case PlayerColor.Yellow:
                return "text-yellow-600";
        }
    }

    export function toBackgroundColor(playerColor: PlayerColor): string {
        switch (playerColor) {
            case PlayerColor.Red:
                return "bg-red-600";
            case PlayerColor.Blue:
                return "bg-blue-600";
            case PlayerColor.Green:
                return "bg-green-600";
            case PlayerColor.Yellow:
                return "bg-yellow-600";
        }
    }
}

export type Dice = {
    id: string;
    number: number;
};

type Achievement = {
    id: string;
    type: AchievementType;
};

export const enum AchievementType {
    LongestRoad = "LongestRoad",
    LargestArmy = "LargestArmy",
};

export type ResourceCard = {
    id: string;
    type: ResourceCardType;
    offering: boolean;
};

export enum ResourceCardType {
    Lumber = "Lumber",
    Brick = "Brick",
    Wool = "Wool",
    Grain = "Grain",
    Ore = "Ore",
    Hidden = "Hidden",
};

export type DevelopmentCard = {
    id: string;
    type: DevelopmentCardType;
    status: DevelopmentCardStatus;
};

export const enum DevelopmentCardType {
    Knight = "Knight",
    RoadBuiding = "RoadBuilding",
    YearOfPlenty = "YearOfPlenty",
    Monopoly = "Monopoly",
    VictoryPoint = "VictoryPoint",
    Hidden = "Hidden",
};

export const enum DevelopmentCardStatus {
    Enable = "Enable",
    Disable = "Disable",
    Used = "Used",
};

export type Terrain = {
    id: string;
    q: number;
    r: number;
    number: number;
    type: TerrainType;
    harbor?: Harbor;
    robber?: Robber;
};

export const enum TerrainType {
    Forest = "Forest",
    Hill = "Hill",
    Field = "Field",
    Pasture = "Pasture",
    Mountain = "Mountain",
    Desert = "Desert",
};

export type Harbor = {
    id: string;
    q: number;
    r: number;
    type: HarborType;
};

export const enum HarborType {
    Lumber = "Lumber",
    Brick = "Brick",
    Wool = "Wool",
    Grain = "Grain",
    Ore = "Ore",
    General = "General",
};

export type Robber = {
    id: string;
};

export type Land = {
    id: string;
    q: number;
    r: number;
    location: LandLocation;
};

export const enum LandLocation {
    Top = "Top",
    Bottom = "Bottom",
};

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

export const enum ConstructionType {
    Settlement = "Settlement",
    City = "City",
};

type Road = {
    id: string;
    path?: Path;
};

export const enum PathLocation {
    TopLeft = "TopLeft",
    MiddleLeft = "MiddleLeft",
    BottomLeft = "BottomLeft",
};

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

export class DiscardResourceCards {
    gameID?: string;
    resourceCardIDs?: string[];

    constructor(gameID?: string, resourceCardIDs?: string[]) {
        this.gameID = gameID
        this.resourceCardIDs = resourceCardIDs
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

export class SendTradeOffer {
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

export type Action = BuildSettlementAndRoad | DiscardResourceCards | MoveRobber | BuildSettlement | BuildRoad | UpgradeCity | BuyDevelopmentCard | ToggleResourceCards | MaritimeTrade | SendTradeOffer | PlayKnightCard | PlayRoadBuildingCard | PlayYearOfPlentyCard | PlayMonopolyCard;