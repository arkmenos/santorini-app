import { Build, Move, Player, Tile, TileData, TILES, Turn, Worker } from "../../../types/Types";
import Mortal from "../Mortal";

class Demeter extends Mortal{
    constructor(){
        super();
        this.setIdentifier("V");
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount: number): void {
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("You must move once and may build an additional time not on the same space this turn")
            }
            else{
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) 
                    throw new Error("You must move once and may build an additional time not on the same space this turn");
                if(numActions >= 2)
                {
                    if(!(turn.gameActions[1] as Build).building)
                        throw new Error("You must move once and may build an additional time not on the same space this turn")
                    if(numActions === 3){
                        if(!(turn.gameActions[2] as Build).building)
                            throw new Error("You must move once and may build an additional time not on the same space this turn")
                    }
                }
            }
        }
    }

    protected validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        const firstMoveAction = turn.gameActions[0] as Move
        if(firstMoveAction.worker){
            this.isValidMove(firstMoveAction, tileData, playerTurn)
            if(turn.gameActions.length > 1){
                const secondMoveAction = turn.gameActions[1] as Move
                if(secondMoveAction.worker){
                    this.isValidMove(secondMoveAction, tileData, playerTurn)
                }
            }
        }
        else {
            throw new Error("Must move a worker before building")
        }
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            if(turn.gameActions.length >= 2) {
                const moveAction = turn.gameActions[0] as Move
                const buildAction = turn.gameActions[1] as Build;
                if(buildAction.building && moveAction.worker){
                    this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
                }
                else{
                    throw new Error("You must move once and may build an additional time not on the same space this turn")
                }                

                if(turn.gameActions.length === 3) {
                    const secondBuildAction = turn.gameActions[2] as Build
                    if(!secondBuildAction.building){
                        throw new Error("You must move once and may build an additional time not on the same space this turn")
                    }
                    if(secondBuildAction.building && buildAction.tile === secondBuildAction.tile){
                        throw new Error ("Your additional build cannot be on the same space as the first")
                    }
                    this.isBuildValid(secondBuildAction, moveAction, tileData, turnCount, playerCount);
                }
            }
        }
    }

    protected performBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number){
        this.validateBuildActions(turn, tileData, turnCount, playerCount)
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            const tempBuilding = turn.gameActions[1] as Build
            if(tempBuilding.building){
                tileData[TILES.indexOf(tempBuilding.tile)].buildings = tempBuilding.building
            }
            if(turn.gameActions.length === 3){
                const secondBuilding = turn.gameActions[2] as Build
                if(secondBuilding.building){
                    tileData[TILES.indexOf(secondBuilding.tile)].buildings = secondBuilding.building
                }
            }
        }
        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:false}
    }
}

export default Demeter