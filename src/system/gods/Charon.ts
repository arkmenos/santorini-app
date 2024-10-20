import { Build, DOMES, ForcedMove, Move, Player, Tile, TileData, TILES, Turn, Worker } from "../../types/Types";
import { getNextTileInSameDirection, isTileAdjacentTo } from "../../Utility/Utility";
import Mortal from "../Mortal";

class Charon extends Mortal{
    constructor(){
        super();
        this.setIdentifier("XV");    
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount:number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tileData: TileData[], _workerPositionsMap?: Map<Worker, Tile>){
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{ 
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("You must move your worker once and build once and may use power. Refer to god power")
            }
            if(numActions === 2){
                if(!(turn.gameActions[0] as Move).worker || !(turn.gameActions[1] as Build).building){
                    throw new Error("You must move your worker once and build once and may use power. Refer to god power")
                }
            }
            else if (numActions === 3){
                const forcedMoveAction = turn.gameActions[0] as ForcedMove
                const moveAction = turn.gameActions[1] as Move
                const buildAction = turn.gameActions[2] as Build

                if(!forcedMoveAction.destination || !moveAction.worker || !buildAction.building){
                    throw new Error("You must move your worker once and build once and may use power. Refer to god power")
                }
                if(moveAction.from){
                    if(!isTileAdjacentTo(forcedMoveAction.origin, moveAction.from) || 
                        !isTileAdjacentTo(forcedMoveAction.destination, moveAction.from)){
                        throw new Error("Forced opponent movement must begin with a neighbouring opponent worker. Refer to god power")
                    }
                }
                const destTile = getNextTileInSameDirection(forcedMoveAction.origin, moveAction.from, tileData)
                if(destTile !== forcedMoveAction.destination){
                    throw new Error("Destination of forced opponent movement must be a space directly on the other side of your worker. Refer to god power")
                }
                const tileInfo = tileData[TILES.indexOf(forcedMoveAction.destination)]
                if(tileInfo.buildings){
                    if(DOMES.includes(tileInfo.buildings)){
                        throw new Error("Cannot move an opponent worker to a dome. Refer to god power")
                    }
                }
                if(tileInfo.worker){
                    throw new Error("May move a worker to an unoccupied tile. Refer to god power")
                }
            }
        }
    }

    protected validateCharonMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        const moveAction = turn.gameActions[1] as Move
        this.isValidMove(moveAction, tileData, playerTurn) 
    }

    protected performCharonMoveAction(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number){
        
        if(turn.gameActions.length === 2){
            return this.performMoveAction(turn, tileData, workerPositionsMap, workerPositions, playerTurn,
                turnCount, playerCount);
        }       

        const forcedMove = turn.gameActions[0] as ForcedMove
        tileData[TILES.indexOf(forcedMove.destination)].worker = forcedMove.worker
        delete tileData[TILES.indexOf(forcedMove.origin)].worker 
        workerPositionsMap.set(forcedMove.worker, forcedMove.destination)
        workerPositions.push(forcedMove.destination)

        this.validateCharonMoveActions(turn, playerTurn, tileData);
        const firstMove = turn.gameActions[1] as Move
        // console.log(`Move ${firstMove.worker} to ${firstMove.to} index ${TILES.indexOf(firstMove.to)}`)
        tileData[TILES.indexOf(firstMove.to)].worker = firstMove.worker
        if(firstMove.from) {
            if(!tileData[TILES.indexOf(firstMove.from)].buildings){
                tileData[TILES.indexOf(firstMove.from)].buildings = "E"
            }
            delete tileData[TILES.indexOf(firstMove.from)].worker
        }
        workerPositionsMap.set(firstMove.worker, firstMove.to)
        workerPositions = workerPositions.filter(p => p !== firstMove.from)
        workerPositions.push(firstMove.to)
        let isPrimaryWinConditionMet = false
        if(this.isPrimaryWinconditionMet(firstMove, tileData)) isPrimaryWinConditionMet =true;

        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:isPrimaryWinConditionMet}
    }

    protected performBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number){
        this.validateBuildActions(turn, tileData, turnCount, playerCount)
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            let tempBuilding 
            if(turn.gameActions.length === 2) tempBuilding = turn.gameActions[1] as Build;
            else tempBuilding = turn.gameActions[2] as Build;
            if(tempBuilding.building){
                tileData[TILES.indexOf(tempBuilding.tile)].buildings = tempBuilding.building
            }
        }
        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:false}
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount === 3))){ 
            let buildAction, moveAction
            console.log("Attempting to build with Charon")
            if(turn.gameActions.length === 2){
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[1] as Build                
            }else{
                moveAction = turn.gameActions[1] as Move
                buildAction = turn.gameActions[2] as Build
            }
            this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
        }
    }

    public takeTurn(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, workerPositions: Tile[], playerTurn: Player, 
        turnCount: number, playerCount: number): { tileData: TileData[]; workerPositionsMap: Map<Worker, Tile>; workerPositions: Tile[]; 
            isPrimaryWinConditionMet: boolean; } {
        
            this.validateActions(turn, turnCount,playerCount,tileData,workerPositionsMap)
            
            let turnData = this.performCharonMoveAction(turn, tileData, workerPositionsMap, workerPositions,
                playerTurn, turnCount, playerCount)

            if(turnData.isPrimaryWinConditionMet){
                return turnData;
            }

            turnData = this.performBuildAction(turn, turnData.tileData, turnData.workerPositionsMap,
                turnData.workerPositions, turnCount, playerCount);
            
            return turnData
    }
}

export default Charon