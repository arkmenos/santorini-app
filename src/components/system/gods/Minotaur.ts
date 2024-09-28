import { Build, DOMES, Move, Player, Tile, TileData, TILES, Turn, Worker } from "../../../types/Types";
import { getMinotaurPushDestinationTile } from "../../../Utility/Utility";
import Mortal from "../Mortal";

class Minotaur extends Mortal {
    constructor(){
        super();
        this.setIdentifier("VIII")
    }
 
    private isValidPushMove(turn: Turn, tileData: TileData[]):boolean{
        if(turn.gameActions.length === 3){
            const firstMoveAction = turn.gameActions[0] as Move
            const secondMoveAction = turn.gameActions[1] as Move

            if(firstMoveAction.worker && secondMoveAction.worker){
                if(firstMoveAction.to !== secondMoveAction.from) return false;
               
                if(firstMoveAction.from && tileData[TILES.indexOf(secondMoveAction.to)]){

                    const pushedDestTile = getMinotaurPushDestinationTile(firstMoveAction.from, 
                        firstMoveAction.to, tileData)
                    
                    if(secondMoveAction.to !== pushedDestTile)
                        throw new Error('Pushed oppenent must be pushed in the same direction as the move action. Refer to God Power')
                    const destBuilding = tileData[TILES.indexOf(secondMoveAction.to)].buildings
                    if(destBuilding && DOMES.includes(destBuilding)){
                        throw new Error('Pushed opponent must be pushed onto a non domed building.')
                    }
                    return true
                }
            }
        }

        return false
    }
    
    protected validateActions(turn: Turn, turnCount: number, playerCount:number, tileData:TileData[]){
        //Worker Placement Phase
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{    
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("You may move into an opponent's Worker's space before building this turn. Refer to God Power")
            }
            else {
                const firstAction = turn.gameActions[0] as Move
                if(!firstAction.worker) 
                    throw new Error("You may move into an opponent's Worker's space before building this turn. Refer to God Power");
                if(numActions >= 2)
                {
                    if(numActions === 3){
                        const secondAction = turn.gameActions[1] as Move
                        if(!secondAction.worker) {
                            throw new Error("You may move into an opponent's Worker's space before building this turn. Refer to God Power")
                        }
                        if(secondAction.worker.toUpperCase() === firstAction.worker.toUpperCase() ||
                            !this.isValidPushMove(turn, tileData)){
                            throw new Error("You may move into an opponent's Worker's space before building this turn. Refer to God Power")
                        }
                        
                        if(!(turn.gameActions[2] as Build).building)  {
                            throw new Error("You may move into an opponent's Worker's space before building this turn. Refer to God Power")
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

    
    // protected isValidMove(moveAction: Move, tileData: TileData[], playerTurn: Player){
    //     if(playerTurn !== moveAction.worker.toUpperCase()){
    //         throw new Error(`Cannot move ${moveAction.worker} on ${playerTurn}'s turn`)
    //     }
    //     if(moveAction.from){
    //         if(!TILE_ADJACENCY[TILES.indexOf(moveAction.from)].includes(TILES.indexOf(moveAction.to))){
    //             throw new Error(`Cannot move from ${moveAction.from} to ${moveAction.to}`);
    //         }
    //         else {
    //             //Tile level check
    //             const tempFromTile = tileData[TILES.indexOf(moveAction.from)]
    //             const tempToTile = tileData[TILES.indexOf(moveAction.to)]
    //             const fromBlockLevel = tempFromTile.buildings ? tempFromTile.buildings : "E" as Building
    //             const toBlockLevel = tempToTile.buildings ? tempToTile.buildings  : 'E' as Building

    //             // console.log("Temp Data Tiles : ", tempTileData, tempFromTile, tempToTile)
    //             // console.log("fromBlockLevel toBlockLevel", fromBlockLevel, toBlockLevel)
    //             if(!VALID_MOVEMENTS.get(fromBlockLevel)?.includes(toBlockLevel) || 
    //                 (tempToTile.worker?.toUpperCase() === playerTurn) && !this.canPush(moveAction,tileData)){                
    //                 throw new Error(`Invalid move ${moveAction.worker} from ${moveAction.from} to ${moveAction.to}`);             
    //             } 
    //         }
    //         return true
    //     }
    //     else {
    //         const tileToPlaceWorker = tileData[TILES.indexOf(moveAction.to)]
    //         if(tileToPlaceWorker){
    //           if((tileToPlaceWorker.buildings && tileToPlaceWorker.buildings !== "E") ||
    //             tileToPlaceWorker.worker){
    //               throw new Error(`Invalid worker placement to ${moveAction.to}`);
    //           }
    //           return true
    //         }
    //     }
    //     return false
    // }

    // protected validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
    //     // const moveAction = turn.gameActions[0] as Move
    //     // this.isValidMove(moveAction, tileData, playerTurn) 
    // }


    protected performMoveAction(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], _playerTurn: Player){
            
        // this.validateMoveActions(turn, playerTurn, tileData);
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
            } 

            if(turn.gameActions.length > 1){
                const secondMoveAction = turn.gameActions[1] as Move
                if(secondMoveAction.worker){
                    tileData[TILES.indexOf(secondMoveAction.to)].worker = secondMoveAction.worker
                    
                    workerPositionsMap.set(secondMoveAction.worker, secondMoveAction.to)
                    workerPositions.push(secondMoveAction.to)
                } else{
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

export default Minotaur