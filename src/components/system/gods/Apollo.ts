import { Build, Move, Player, Tile, TileData, TILES, Turn, Worker } from "../../../types/Types";
import Mortal from "../Mortal";

class Apollo extends Mortal {
    constructor() {
        super();
        this.setIdentifier("I")
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount:number){
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{ 
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("You may move into an opponent's Worker's space before building this turn")
            }
            else {
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) 
                    throw new Error("You may move into an opponent's Worker's space before building this turn");
                if(numActions >= 2)
                {
                    if(numActions === 3){
                        const secondAction = turn.gameActions[1] as Move
                        if(!secondAction.worker) {
                            throw new Error("You may move into an opponent's Worker's space before building this turn")
                        }
                        if(secondAction.worker.toUpperCase() === firstAction.worker.toUpperCase() || 
                            !(firstAction.to === secondAction.from && firstAction.from === secondAction.to)){
                            throw new Error("You may move into an opponent's Worker's space before building this turn")
                        }
                        if(!(turn.gameActions[2] as Build).building)  {
                            throw new Error("You may move into an opponent's Worker's space before building this turn")
                        }
                    }
                }
            }
        }        
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){ 
            let buildAction, moveAction  
            if(turn.gameActions.length === 2) {
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[1] as Build;
            }
            else if(turn.gameActions.length === 3) {
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[2] as Build
            }
            if(buildAction && buildAction.building && moveAction && moveAction.worker){
                this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
            }
            else{
                throw new Error("You may move into an opponent's Worker's space before building this turn")
            }
        }
    }

    protected performMoveAction(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player){
            
        this.validateMoveActions(turn, playerTurn, tileData);
        let isPrimaryWinConditionMet = false
        const firstMoveAction = turn.gameActions[0] as Move
        if(firstMoveAction.worker){
            tileData[TILES.indexOf(firstMoveAction.to)].worker = firstMoveAction.worker
            if(firstMoveAction.from) {
                if(!tileData[TILES.indexOf(firstMoveAction.from)].buildings){
                    tileData[TILES.indexOf(firstMoveAction.from)].buildings = "E"
                }            
            }
            workerPositionsMap.set(firstMoveAction.worker, firstMoveAction.to)
            workerPositions.push(firstMoveAction.to)
            
            if(this.isPrimaryWinconditionMet(firstMoveAction, tileData)){
                isPrimaryWinConditionMet = true;               
            } 

            if(turn.gameActions.length > 1){
                const secondMoveAction = turn.gameActions[1] as Move
                if(secondMoveAction.worker){
                    tileData[TILES.indexOf(secondMoveAction.to)].worker = secondMoveAction.worker
                    
                    workerPositionsMap.set(secondMoveAction.worker, secondMoveAction.to)
                    workerPositions.push(secondMoveAction.to)
                }
                else{
                    if(firstMoveAction.from) delete tileData[TILES.indexOf(firstMoveAction.from)].worker
                }
            }
            else{
                if(firstMoveAction.from) delete tileData[TILES.indexOf(firstMoveAction.from)].worker
            }
        }

        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:isPrimaryWinConditionMet}
    }

    protected performBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number){
            
        this.validateBuildActions(turn, tileData, turnCount, playerCount)
        if(!(turnCount <=2 || (turnCount === 3 && playerCount === 3))){ 
            let tempBuilding  
            if(turn.gameActions.length === 2) tempBuilding = turn.gameActions[1] as Build;
            else if(turn.gameActions.length === 3) tempBuilding = turn.gameActions[2] as Build
            if(tempBuilding && tempBuilding.building){
                tileData[TILES.indexOf(tempBuilding.tile)].buildings = tempBuilding.building
            }
        }

        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:false}
    }
}

export default Apollo