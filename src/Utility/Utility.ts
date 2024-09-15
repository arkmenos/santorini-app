import { Building, DOMES, Move, PLAYER_POS_FIRST_LEVEL, PLAYER_POS_GROUND, PLAYER_POS_SECOND_LEVEL, PLAYER_POS_THIRD_LEVEL, Tile, TileData, TILES } from "../types/Types";

export const getMinotaurPushDestinationTile = (fromTile: Tile | undefined, 
    toTile: Tile | undefined, tileData: TileData[]) =>{ 
    if (!fromTile || !toTile) return null;

    const xPushDirection = toTile.charCodeAt(0) - fromTile.charCodeAt(0)
    const yPushDirection = toTile.charCodeAt(1) - fromTile.charCodeAt(1)
    const destinationTile = String.fromCharCode(toTile.charCodeAt(0) + xPushDirection) + 
        String.fromCharCode(toTile.charCodeAt(1) + yPushDirection);
    
    if(TILES.includes(destinationTile)){
        const destTileData:TileData = tileData[TILES.indexOf(destinationTile)]
        // const destBuilding = destTileData.buildings ? 
        if(destTileData && !destTileData.worker && ((destTileData.buildings &&
            !DOMES.includes(destTileData.buildings)) || !destTileData.buildings))
            return destinationTile as Tile
    }

    return null
};

export const getStartTileData = (): TileData[] => {
    const result: TileData[] = [];
    for (let i = 0; i < 25; i++) {
        result.push({ buildings: "E" });
    }
    return result;
};
export function isMoveAscending(moveAction: Move, tileData: TileData[]): boolean {
    if (moveAction.from && moveAction.to) {
        const fromBlockLevel = tileData[TILES.indexOf(moveAction.from)].buildings ?
            tileData[TILES.indexOf(moveAction.from)].buildings : "E";
        const toBlockLevel = tileData[TILES.indexOf(moveAction.to)].buildings ?
            tileData[TILES.indexOf(moveAction.to)].buildings : "E";
        const isWorkerOnTile = (tileData[TILES.indexOf(moveAction.from)].worker &&
            tileData[TILES.indexOf(moveAction.from)].worker !== moveAction.worker) ? true : false;

        if (fromBlockLevel === "E" && toBlockLevel === "L" && !isWorkerOnTile) return true;
        if (fromBlockLevel === "L" && toBlockLevel === "M" && !isWorkerOnTile) return true;
        if (fromBlockLevel === "M" && toBlockLevel === "S" && !isWorkerOnTile) return true;
    }

    return false;
}export function isMoveDescending(moveAction: Move, tileData: TileData[]): boolean {
    if (moveAction.from && moveAction.to) {
        const fromBlockLevel = tileData[TILES.indexOf(moveAction.from)].buildings ?
            tileData[TILES.indexOf(moveAction.from)].buildings : "E";
        const toBlockLevel = tileData[TILES.indexOf(moveAction.from)].buildings ?
            tileData[TILES.indexOf(moveAction.from)].buildings : "E";
        const isWorkerOnTile = tileData[TILES.indexOf(moveAction.from)].worker ? true : false;

        if (fromBlockLevel === "L" && toBlockLevel === "E" && !isWorkerOnTile) return true;
        if (fromBlockLevel === "M" && (toBlockLevel === "L" || toBlockLevel === "E"))
            return true;
        if (fromBlockLevel === "S" && (toBlockLevel === "M" ||
            toBlockLevel === "L" || toBlockLevel === "E") && !isWorkerOnTile) return true;
    }
    return false;
}
export function isMoveSameLevel(moveAction: Move, tileData: TileData[]): boolean {
    if (moveAction.from && moveAction.to) {
        console.log("MoveAction fromBlockLevel toBlockLevel", moveAction, tileData,
            tileData[TILES.indexOf(moveAction.from)], tileData[TILES.indexOf(moveAction.to)]
        );
        const fromBlockLevel = tileData[TILES.indexOf(moveAction.from)].buildings ?
            tileData[TILES.indexOf(moveAction.from)].buildings : "E";
        const toBlockLevel = tileData[TILES.indexOf(moveAction.to)].buildings ?
            tileData[TILES.indexOf(moveAction.to)].buildings : "E";
        const isWorkerOnTile = (tileData[TILES.indexOf(moveAction.to)].worker &&
            tileData[TILES.indexOf(moveAction.to)].worker !== moveAction.worker) ? true : false;

        if (fromBlockLevel === "E" && toBlockLevel === "E" && !isWorkerOnTile) return true;
        if (fromBlockLevel === "L" && toBlockLevel === "L" && !isWorkerOnTile) return true;
        if (fromBlockLevel === "M" && toBlockLevel === "M" && !isWorkerOnTile) return true;
        if (fromBlockLevel === "S" && toBlockLevel === "S" && !isWorkerOnTile) return true;
        console.log("fromBlockLevel toBlockLevel isWorkerOntile", fromBlockLevel, toBlockLevel, isWorkerOnTile);
    }
    console.log("isMoveSameLevel failed");
    return false;
}
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}
export function createTurn(tileData: TileData[], previousTileData: TileData[]): string {
    let moves = "";
    let builds = "";
    tileData.forEach((data, index) => {
        if (data.buildings && data.buildings !== previousTileData[index]?.buildings) {
            builds += data.buildings + TILES[index] + "/";
        }
        if (data.worker && data.worker !== previousTileData[index]?.worker) {
            moves += data.worker + TILES[index] + "/";
        }
    });
    if (builds === "") {
        builds = "-";
    }
    else {
        builds = builds.substring(0, builds.length - 1);
    }

    const result = `${moves.substring(0, moves.length - 1)} ${builds}`;
    console.log("Created Turn: ", result);
    return result;
}
export function getWorkerYPositionIndicator(block: Building): number {
    let result = PLAYER_POS_GROUND;
    switch (block) {
        case "L":
            result = PLAYER_POS_FIRST_LEVEL;
            break;
        case "M":
            result = PLAYER_POS_SECOND_LEVEL;
            break;
        case "S":
            result = PLAYER_POS_THIRD_LEVEL;
            break;
        case "E":
            result = PLAYER_POS_GROUND;
            break;
    }

    return result;
}

