import { Build, Building, Move, Player, Tile, TILE_ADJACENCY, TileData, TILES, Turn, VALID_BUILDS, Worker } from "../../../types/Types";
import { isMoveSameLevel } from "../../../Utility/Utility";
import Mortal from "../Mortal";
import Restriction from "../restrictions/Restrictions";

class Hermes extends Mortal {
    constructor(){
        super();
        this.setIdentifier("VII");
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount:number, tileData:TileData[]){
        console.log("Validating Hermes Actions")
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{ 
            const numActions = turn.gameActions.length                     
            
            if(numActions === 2){
                if(!((turn.gameActions[0] as Move).worker)) 
                    throw new Error("You may move before building this turn. Refer to God Power");
                if(!((turn.gameActions[1] as Build).building)) 
                    throw new Error("You may move before building this turn. Refer to God Power");                    
            }
            if(numActions >= 3){
                
                turn.gameActions.forEach((action, index) => {
                    if(index !== numActions - 1){
                        
                        if(!(action as Move).worker)
                            throw new Error("Must complete all move actions before building. Refer to God Power")
                        if(!isMoveSameLevel(action as Move, tileData)){
                            throw new Error("To move multiple times, all move action must be on the same level. Refer to God Power")
                        }
                    }
                })
                if(!(turn.gameActions[numActions - 1 ] as Build).building)
                    throw new Error("You must build this turn. Refer to God Power");
            }
        }        
    }

    protected validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        const numActions = turn.gameActions.length 
        const firstAction = turn.gameActions[0] as Move
        if(numActions === 1 || numActions === 2){
            if(firstAction.worker) this.isValidMove(firstAction, tileData, playerTurn);
        }
    }

    protected isHermesBuildValid(buildAction: Build,  tileData: TileData[], playerTurn: Player){

        // if(turnCount <=2 || (turnCount === 3 && playerCount ===3)) return false
        const firstWorkerTile = tileData.findIndex(data => data.worker === playerTurn)
        const secondWorkerTile = tileData.findIndex(data => data.worker === playerTurn.toLowerCase())
         
        if(buildAction.building){
            const tempSingleTileData = tileData[TILES.indexOf(buildAction.tile)]
            const destinationBlock = tempSingleTileData.buildings ? tempSingleTileData.buildings : "E" as Building

            //Check if Building is adjacent to your workers   
            console.log("worker location", firstWorkerTile, secondWorkerTile)         
            if((firstWorkerTile && 
                !TILE_ADJACENCY[firstWorkerTile].includes(TILES.indexOf(buildAction.tile))) &&
                (secondWorkerTile &&!TILE_ADJACENCY[secondWorkerTile].includes(TILES.indexOf(buildAction.tile)))){
                throw new Error(`Must build adjacent to one of your workers`)
            }

            if(!VALID_BUILDS.get(destinationBlock)?.includes(buildAction.building) || tempSingleTileData.worker){
            // console.log(`Valid Builds worker`,VALID_BUILDS.get(destinationBlock), tempSingleTileData.worker)
                throw new Error(`Invalid build from ${destinationBlock} to ${buildAction.building}`);          
            }  
            
            return true
        }

        return false;
    }

    protected validateHermesBuildActions(turn: Turn, tileData: TileData[], turnCount: number, playerCount: number, playerTurn: Player): void {
        if(!(turnCount <= 2 || (turnCount === 3 && playerCount ===3))){ 
            let buildAction, moveAction
            const numActions = turn.gameActions.length 
            console.log("Turn", turn)
            if(numActions === 1){
                buildAction = turn.gameActions[0] as Build
                
                if(!(buildAction.building && this.isHermesBuildValid(buildAction, tileData, playerTurn))){
                    throw new Error('Must build adjacent to one of your Workers')
                }
            }
            else if(numActions === 2) {
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[1] as Build;
                if(buildAction && buildAction.building && moveAction && moveAction.worker){
                    this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
                }
            }
            else if(numActions >= 3) {                
                buildAction = turn.gameActions[numActions - 1] as Build
                if(!(buildAction.building && this.isHermesBuildValid(buildAction, tileData, playerTurn))){
                    throw new Error('Must build adjacent to one of your Workers')
                }
            }          
        }
    }

    protected performMoveAction(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], _: Player, turnCount: number, playerCount: number){               
        let isPrimaryWinConditionMet = false
        if(turnCount <=2 || (turnCount === 3 && playerCount === 3)){
            const firstMove = turn.gameActions[0] as Move
            // console.log(`Move ${firstMove.worker} to ${firstMove.to} index ${TILES.indexOf(firstMove.to)}`)
            tileData[TILES.indexOf(firstMove.to)].worker = firstMove.worker
            if(firstMove.from) {
            if(!tileData[TILES.indexOf(firstMove.from)].buildings){
                tileData[TILES.indexOf(firstMove.from)].buildings = "E"
            }
            delete tileData[TILES.indexOf(firstMove.from)].worker
            }
            workerPositionsMap.set(firstMove.worker, firstMove.to)
            workerPositions.push(firstMove.to)

            const secondMove = turn.gameActions[1] as Move
            tileData[TILES.indexOf(secondMove.to)].worker = secondMove.worker
            if(secondMove.from) {
              if(!tileData[TILES.indexOf(secondMove.from)].buildings){
                tileData[TILES.indexOf(secondMove.from)].buildings = "E"
              }
              delete tileData[TILES.indexOf(secondMove.from)].worker
            }
            workerPositionsMap.set(secondMove.worker, secondMove.to)
            workerPositions.push(secondMove.to)
        }
        else {
            const numActions = turn.gameActions.length            
            const firstMove = turn.gameActions[0] as Move
            if(numActions === 1){
                if((turn.gameActions[0] as Move).worker){
                    tileData[TILES.indexOf(firstMove.to)].worker = firstMove.worker
                    if(firstMove.from) {
                        if(!tileData[TILES.indexOf(firstMove.from)].buildings){
                            tileData[TILES.indexOf(firstMove.from)].buildings = "E"
                        }
                        delete tileData[TILES.indexOf(firstMove.from)].worker
                    }
                    workerPositionsMap.set(firstMove.worker, firstMove.to)
                    workerPositions.push(firstMove.to)
                    
                    if(this.isPrimaryWinconditionMet(firstMove, tileData)) isPrimaryWinConditionMet =true;
                    if(!isPrimaryWinConditionMet)
                        throw new Error('You must build this turn. Refer to God Power')
                }
            }
            else if(numActions === 2){
                if((turn.gameActions[0] as Move).worker){
                    tileData[TILES.indexOf(firstMove.to)].worker = firstMove.worker
                    if(firstMove.from) {
                    if(!tileData[TILES.indexOf(firstMove.from)].buildings){
                        tileData[TILES.indexOf(firstMove.from)].buildings = "E"
                    }
                    delete tileData[TILES.indexOf(firstMove.from)].worker
                    }
                    workerPositionsMap.set(firstMove.worker, firstMove.to)
                    
                    isPrimaryWinConditionMet = false
                   
                    if(this.isPrimaryWinconditionMet(firstMove, tileData)) isPrimaryWinConditionMet = true;
                }   
            }
            else {
                turn.gameActions.forEach((action, index) => {
                    if(index !== numActions - 1){
                        const moveAction = action as Move
                        if(moveAction.worker){
                            tileData[TILES.indexOf(moveAction.to)].worker = moveAction.worker
                            if(moveAction.from){
                                if(!tileData[TILES.indexOf(moveAction.from)].buildings){
                                    tileData[TILES.indexOf(moveAction.from)].buildings = "E"
                                }
                                delete tileData[TILES.indexOf(moveAction.from)].worker
                            }
                            workerPositionsMap.set(moveAction.worker, moveAction.to)
                        }
                    }                    
                })
            }
        }

        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:isPrimaryWinConditionMet}
    }

    protected performHermesBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number, playerTurn: Player){
        // this.validateBuildActions(turn, tileData, turnCount, playerCount)
        this.validateHermesBuildActions(turn, tileData, turnCount, playerCount, playerTurn)
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){   
            const numActions = turn.gameActions.length 
            const buildAction = turn.gameActions[numActions - 1] as Build
           
            if(buildAction.building){
                tileData[TILES.indexOf(buildAction.tile)].buildings = buildAction.building
            }
            else{
                throw new Error('You must build this turn. Refer to God Power')
            }
         
        }
        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:false}
    }

    public takeTurn(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number,
        restrictions: Restriction[]){
        
        this.checkRestrictions(turn, tileData,restrictions)           
        
        this.validateActions(turn, turnCount, playerCount, tileData)

        let turnData = this.performMoveAction(turn, tileData, workerPositionsMap, workerPositions,
            playerTurn, turnCount, playerCount)
        
        if(turnData.isPrimaryWinConditionMet){
            return turnData;
        }

        turnData = this.performHermesBuildAction(turn, turnData.tileData, turnData.workerPositionsMap,
            turnData.workerPositions, turnCount, playerCount, playerTurn);
        
        return turnData;
    }    
}

export default Hermes