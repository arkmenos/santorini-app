import { Build, Move, Player, Tile, TileData, TILES, Turn, VALID_BUILDS, Worker } from "../../../types/Types";
import { isMoveAscending } from "../../../Utility/Utility";
import Mortal from "../Mortal";
import Restriction from "../restrictions/Restrictions";

class Prometheus extends Mortal {
    constructor(){
        super();
        this.setIdentifier("X");
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount: number, tileData:TileData[]): void {
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("If your Worker does not move up, it may build both before and after moving")
            }
            else{
                let firstAction, secondAction, thirdAction;
                if(numActions === 2){
                    firstAction = turn.gameActions[0] as Move
                    secondAction = turn.gameActions[1] as Build
                    if(!firstAction.worker || !secondAction.building){
                        throw new Error("If your Worker does not move up, it may build both before and after moving")
                    }
                }
                else if(numActions === 3){
                    firstAction = turn.gameActions[0] as Build
                    secondAction = turn.gameActions[1] as Move
                    thirdAction = turn.gameActions[2] as Build
                
                    if(!firstAction.building || !secondAction.worker || !thirdAction.building) 
                        throw new Error("If your Worker does not move up, it may build both before and after moving");
                    
                    //Update tileData for validation
                    const tempTileData = JSON.parse(JSON.stringify(tileData))
                    console.log("TileData before", tempTileData[TILES.indexOf(firstAction.tile)].buildings, tempTileData)
                    tempTileData[TILES.indexOf(firstAction.tile)].buildings =  firstAction.building
                    console.log("Prometheus firstAction", firstAction, tempTileData[TILES.indexOf(firstAction.tile)].buildings, tempTileData )
                    if(isMoveAscending(secondAction, tempTileData))
                        throw new Error("If your Worker does not move up, it may build both before and after moving");
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        let moveAction
        if(turn.gameActions.length === 2) moveAction = turn.gameActions[0] as Move;
        else if(turn.gameActions.length === 3) moveAction = turn.gameActions[1] as Move;
        
        if(moveAction && moveAction.worker) this.isValidMove(moveAction, tileData, playerTurn);
    }

    private performPrometheusMoveAction(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number){

            const numActions = turn.gameActions.length
            let isPrimaryWinConditionMet = false
            if(numActions === 2)
                return this.performMoveAction(turn, tileData, workerPositionsMap, workerPositions,
                    playerTurn, turnCount, playerCount);
            else if(numActions === 3){
                const moveAction = turn.gameActions[1] as Move
                tileData[TILES.indexOf(moveAction.to)].worker = moveAction.worker
                if(moveAction.from) {
                    if(!tileData[TILES.indexOf(moveAction.from)].buildings){
                        tileData[TILES.indexOf(moveAction.from)].buildings = "E"
                    }
                    delete tileData[TILES.indexOf(moveAction.from)].worker
                }
                workerPositionsMap.set(moveAction.worker, moveAction.to)
                workerPositions.push(moveAction.to)
                
                if(this.isPrimaryWinconditionMet(moveAction, tileData)) isPrimaryWinConditionMet =true;
            }         
            return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
                workerPositions:workerPositions, isPrimaryWinConditionMet:isPrimaryWinConditionMet}
    }

    private performPrometheusBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number){
            const numActions = turn.gameActions.length           
            if(numActions === 2)
                return this.performBuildAction(turn, tileData, workerPositionsMap, workerPositions, 
                turnCount, playerCount)
            else if(numActions === 3){
                this.validateBuildActions(turn, tileData, turnCount, playerCount)
                const firstBuild = turn.gameActions[0] as Build
                const secondBuild = turn.gameActions[2] as Build

                if(firstBuild.building)
                    tileData[TILES.indexOf(firstBuild.tile)].buildings = firstBuild.building
                if(secondBuild.building)
                    tileData[TILES.indexOf(secondBuild.tile)].buildings = secondBuild.building
                
            }

            return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
                workerPositions:workerPositions, isPrimaryWinConditionMet:false}
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            let moveAction, buildAction

            if(turn.gameActions.length === 2) {
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[1] as Build;
                if(buildAction.building && moveAction.worker){
                    this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
                }
                else{
                    throw new Error("You must move once and may build an additional time not on the same space this turn")
                }                
            }
            else if(turn.gameActions.length === 3) {
                buildAction = turn.gameActions[0] as Build;
                moveAction = turn.gameActions[1] as Move
                const secondBuildAction = turn.gameActions[2] as Build
                if(!secondBuildAction.building){
                    throw new Error("You must move once and may build an additional time not on the same space this turn")
                }
                if(buildAction.tile === secondBuildAction.tile){
                    if(!VALID_BUILDS.get(buildAction.building)?.includes(secondBuildAction.building)){
                        throw new Error (`Invalid build from ${buildAction.building} to ${secondBuildAction.building}`)
                    }
                }
                else{
                    this.isBuildValid(secondBuildAction, moveAction, tileData, turnCount, playerCount);
                }
            }            
        }
    }



    public takeTurn(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number,
        restrictions: Restriction[]){
        
        this.checkRestrictions(turn, tileData,restrictions)       

        this.validateActions(turn, turnCount, playerCount, tileData)
        let turnData = this.performPrometheusMoveAction(turn, tileData, workerPositionsMap, workerPositions,
            playerTurn, turnCount, playerCount)
        
        if(turnData.isPrimaryWinConditionMet){
            return turnData;
        }

        turnData = this.performPrometheusBuildAction(turn, turnData.tileData, turnData.workerPositionsMap,
            turnData.workerPositions, turnCount, playerCount);
        
        return turnData;
    }    
}

export default Prometheus