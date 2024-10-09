import { ARES_VALID_REMOVE, Build, DOMES, Move, Player, RemoveBuilding, Tile, TILE_ADJACENCY, TileData, TILES, Turn, Worker } from "../../../types/Types";
import Mortal from "../Mortal";

class Ares extends Mortal {
    constructor() {
        super();
        this.setIdentifier("XII")
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount:number,
        tileData: TileData[], workerPositionsMap: Map<Worker, Tile>){
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{ 
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("You must move your worker once and build once and may use god power once this turn")
            }
            else {
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) 
                    throw new Error("You must move your worker once and build once and may use god power once this turn")                
                if(numActions >= 2)
                {
                    const secondAction = turn.gameActions[1] as Build
                        if(!secondAction.building) {
                            throw new Error("You must move your worker once and build once and may use god power once this turn")                        }
                    if(numActions === 3){
                        const thirdAction = turn.gameActions[2]
                        
                        if((thirdAction as Build).building)  {
                            throw new Error("Your last action this turn can be used to remove a block. Refer to god Power")
                        }
                        if((thirdAction as Move).worker)  {
                            throw new Error("Your last action this turn can be used to remove a block. Refer to god Power")
                        }  
                        
                        const unMovedWorker: Worker = firstAction.worker === firstAction.worker.toUpperCase() ?
                            firstAction.worker.toLowerCase() as Worker: firstAction.worker.toUpperCase() as Worker;
                        
                        //update tiledata
                        const tempTileData = JSON.parse(JSON.stringify(tileData));
                        tempTileData[TILES.indexOf(firstAction.to)].worker = firstAction.worker
                        if(firstAction.from){
                            if(!tempTileData[TILES.indexOf(firstAction.from)].buildings){
                                tempTileData[TILES.indexOf(firstAction.from)].buildings = "E"
                            }
                            delete tempTileData[TILES.indexOf(firstAction.from)].worker
                        }
                        tempTileData[TILES.indexOf(secondAction.tile)].buildings = secondAction.building
                        const unMovedWorkerTile = workerPositionsMap.get(unMovedWorker)
                        const tileToRemoveBuilding = (thirdAction as RemoveBuilding).tile
                        const tempTile = tempTileData[TILES.indexOf(tileToRemoveBuilding)]

                        if(tempTile.worker || (tempTile.buildings && 
                            ((tempTile.buildings === "E" && tileToRemoveBuilding !== secondAction.tile)
                            || DOMES.includes(tempTile.buildings)))){
                            throw new Error("Cannot remove a dome nor remove a block with a worker on it")
                        }
                        if (tileToRemoveBuilding && unMovedWorkerTile){
                            if(!TILE_ADJACENCY[TILES.indexOf(unMovedWorkerTile)].includes(TILES.indexOf(tileToRemoveBuilding))){
                                throw new Error(`Removed block must be neighbouring unmoved worker`);
                            }
                        }                      
                    }
                }
            }
        }        
    }


    private performRemoveBlockAction (turn: Turn, tileData: TileData[]){
        const tile = (turn.gameActions[2] as RemoveBuilding).tile
        const building = tileData[TILES.indexOf(tile)].buildings
        if(building){
            tileData[TILES.indexOf(tile)].buildings = ARES_VALID_REMOVE.get(building)
        }

        return tileData
    }
    
    public takeTurn(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number){              

        this.validateActions(turn, turnCount, playerCount, tileData, workerPositionsMap)
        let turnData = this.performMoveAction(turn, tileData, workerPositionsMap, workerPositions,
            playerTurn, turnCount, playerCount)
        
        if(turnData.isPrimaryWinConditionMet){
            return turnData;
        }

        turnData = this.performBuildAction(turn, turnData.tileData, turnData.workerPositionsMap,
            turnData.workerPositions, turnCount, playerCount);

        if(turn.gameActions.length === 3)  tileData = this.performRemoveBlockAction(turn, tileData);
        
        return turnData;
    }    
}

export default Ares;