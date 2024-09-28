import { Build, Move, Player, Tile, TileData, TILES, Turn, Worker } from "../../../types/Types";
import Mortal from "../Mortal";

class Artemis extends Mortal {
    constructor(){
        super();
        this.setIdentifier("II");
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount:number){
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{ 
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("You may move once or twice before building this turn")
            }
            else {
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) throw new Error("You may move once or twice before building this turn");
                if(numActions >= 2)
                {
                    if(numActions === 3){
                        const secondMove = turn.gameActions[1] as Move
                        if(!secondMove.worker) {
                            throw new Error("You may move once or twice before building this turn");
                        }
                        if(!(turn.gameActions[2] as Build).building)  {
                            new Error("You may move once or twice before building this turn");
                        }
                        
                        if(firstAction.worker !== secondMove.worker){
                            throw new Error("Only one worker can move this turn")
                        }
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
            let buildAction, moveAction  
            if(turn.gameActions.length === 2) {
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[1] as Build;
            }
            else if(turn.gameActions.length === 3) {
                moveAction = turn.gameActions[1] as Move
                buildAction = turn.gameActions[2] as Build
            }
            if(buildAction && buildAction.building && moveAction && moveAction.worker){
                this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
            }
            else{
                throw new Error('You may move once or twice and build this turn')
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
            delete tileData[TILES.indexOf(firstMoveAction.from)].worker
            }
            workerPositionsMap.set(firstMoveAction.worker, firstMoveAction.to)
            workerPositions.push(firstMoveAction.to)
            
            if(this.isPrimaryWinconditionMet(firstMoveAction, tileData)){
                isPrimaryWinConditionMet = true;
                return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
                    workerPositions:workerPositions, isPrimaryWinConditionMet:isPrimaryWinConditionMet}
            } 

            if(turn.gameActions.length > 1){
                const secondMoveAction = turn.gameActions[1] as Move
                if(secondMoveAction.worker){
                    tileData[TILES.indexOf(secondMoveAction.to)].worker = secondMoveAction.worker
                    if(secondMoveAction.from) {
                        if(!tileData[TILES.indexOf(secondMoveAction.from)].buildings){
                            tileData[TILES.indexOf(secondMoveAction.from)].buildings = "E"
                        }
                        delete tileData[TILES.indexOf(secondMoveAction.from)].worker
                    }
                    workerPositionsMap.set(secondMoveAction.worker, secondMoveAction.to)
                    workerPositions.push(secondMoveAction.to)
                    if(this.isPrimaryWinconditionMet(secondMoveAction, tileData)) {
                        isPrimaryWinConditionMet = true;
                    }
                }
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

export default Artemis