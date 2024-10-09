import { Build, Move, Player, RemoveWorker, Tile, TileData, TILES, Turn, Worker } from "../../../types/Types";
import { getNextTileInSameDirection } from "../../../Utility/Utility";
import Mortal from "../Mortal";


class Bia extends Mortal {
    constructor(){
        super();
        this.setIdentifier("XIII")
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
                throw new Error("You must move your worker once and build once")
            }
            else {
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) 
                    throw new Error("You must move your worker once and build once")                
                if(numActions >= 2){
                    const secondAction = turn.gameActions[1] as Build
                    console.log("secondAction turn", secondAction, turn)
                    if(!secondAction.building && numActions === 2) {
                        throw new Error("You must move your worker once and build once");                        }
                    if(numActions === 3){
                        const buildAction = turn.gameActions[2] as Build
                        if(!buildAction.building){
                            throw new Error("You must move your worker once and build once");    
                        }
                        const secondAction2 = turn.gameActions[1] as RemoveWorker
                        if(!secondAction2.tile || !secondAction2.worker)  {
                            throw new Error(`Cannot remove worker. Refer to god power`)
                        }

                        if(workerPositionsMap.get(secondAction2.worker) !== secondAction2.tile){
                            throw new Error(`Cannot remove worker ${secondAction2.worker} on tile
                                ${secondAction2.tile}. Refer to god power`)
                        }
                        if(secondAction2.tile !== getNextTileInSameDirection(firstAction.from, 
                            firstAction.to, tileData) || secondAction2.worker !== 
                            tileData[TILES.indexOf(secondAction2.tile)].worker){
                                throw new Error(`Cannot remove worker ${secondAction2.worker} on tile
                                    ${secondAction2.tile}. Refer to god power`)
                        }                                                
                        return true
                    }
                }
            }
        }
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){ 
            const moveAction = turn.gameActions[0] as Move
            let buildAction 
            if(turn.gameActions.length === 2) buildAction = turn.gameActions[1] as Build
            else buildAction = turn.gameActions[2] as Build
            
            this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
        }
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

    private performRemoveWorkerAction(turn: Turn, tileData: TileData[], workerPositionsMap:Map<Worker,Tile>){
        const removeWorker = turn.gameActions[1] as RemoveWorker
        console.log("Bia remove worker")
        delete tileData[TILES.indexOf(removeWorker.tile)].worker
        console.log("Before remove", workerPositionsMap)
        workerPositionsMap.delete(removeWorker.worker)
        console.log("After remove", workerPositionsMap)
        return {tileData:tileData, workerPositionsMap:workerPositionsMap}
    }

    public isSecondaryWinConditionMet(_turn?: Turn, _tileData?: TileData[],       
        workerPositionsMap?:Map<Worker,Tile>, playerTurn?:Player): boolean {    
        
        let isConditionMet = true

        workerPositionsMap?.forEach((_t, k) => {
            if(k.toUpperCase() !== playerTurn) isConditionMet = false
        })

        return isConditionMet
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

        if(turn.gameActions.length === 3) {
            const result = this.performRemoveWorkerAction(turn, tileData, workerPositionsMap);
            turnData.tileData = result.tileData
            turnData.workerPositionsMap = result.workerPositionsMap
            const newTurnData = {...turnData, isSecondaryWinConditionMet:this.isSecondaryWinConditionMet(turn, 
                tileData, workerPositionsMap, playerTurn)}
            return newTurnData
        }
        console.log("tileData after remove worker", tileData, turn.gameActions.length)
        
        return turnData;
    } 

}

export default Bia