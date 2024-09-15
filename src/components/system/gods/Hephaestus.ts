import { Build, Move, Tile, TileData, TILES, Turn, VALID_BUILDS, Worker } from "../../../types/Types";
import Mortal from "../Mortal";


class Hephaestus extends Mortal{
    constructor(){
        super();
        this.setIdentifier("VI");
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount:number){
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{ 
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("Your Worker may build one additional block (not dome) on top of your first block")
            }
            else {
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) 
                    throw new Error("Your Worker may build one additional block (not dome) on top of your first block");
                if(numActions >= 2)
                {
                    const secondAction = turn.gameActions[1] as Build
                        if(!secondAction.building) {
                            throw new Error("Your Worker may build one additional block (not dome) on top of your first block")
                        }
                    if(numActions === 3){
                        const thirdAction = turn.gameActions[2] as Build
                        
                        if(!thirdAction.building)  {
                            throw new Error("Your Worker may build one additional block (not dome) on top of your first block")
                        }
                        if(secondAction.tile !== thirdAction.tile ){                            
                            throw new Error("Your Worker may build one additional block (not dome) on top of your first block")
                        }
                    }
                }
            }
        }        
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount: number, playerCount: number): void {
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
                    if(secondBuildAction.building === "D"){
                        throw new Error("Your second build can't be a dome. Refer to god powers")
                    }
                    if(secondBuildAction.building && buildAction.tile !== secondBuildAction.tile){
                        throw new Error ("Your additional build cannot be on the same space as the first")
                    }

                    if(!VALID_BUILDS.get(buildAction.building)?.includes(secondBuildAction.building)){
                        throw new Error (`Your second building is not valid: ${buildAction.building} 
                            to ${secondBuildAction.building}` )
                    }
                    // this.isBuildValid(secondBuildAction, moveAction, tileData, turnCount, playerCount);
                }
            }
        }
    }

    protected performBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number){
        this.validateBuildActions(turn, tileData, turnCount, playerCount)
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            const firstBuilding = turn.gameActions[1] as Build
            if(firstBuilding.building){
                tileData[TILES.indexOf(firstBuilding.tile)].buildings = firstBuilding.building
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

export default Hephaestus