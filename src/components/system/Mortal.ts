import { GodIdentifier, Player, TileData, Move, TILE_ADJACENCY, TILES, Building, VALID_MOVEMENTS, Build, VALID_BUILDS, Turn } from "../../types/Types";

class Mortal {

    private name: string;
    private flavorText: string;
    private description: string;
    private identifier: GodIdentifier | null; 
    
    constructor(){
        this.name = ""
        this.flavorText = ""
        this.description = ""
        this.identifier = null        
    }

    public getName(){
        return this.name;
    } 

    public getFlavorText(){
        return this.flavorText;
    }

    public getDescription(){
        return this.description;
    }

    public getIdentifier() {
        return this.identifier;
    }

    public validateActions(turn: Turn, turnCount: number, playerCount:number){             
       
        const moveAction = turn.gameActions[0] as Move
        //Worker Placement Phase
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{    
            //Worker move and build phases            
            if(turn.gameActions.length !== 2 && turn.gameActions.length !== 1){
                throw new Error("Can only move once and build once")
            }
            if(turn.gameActions.length !== 1){
                const buildAction = turn.gameActions[1] as Build
                if(!moveAction.worker || !buildAction.building) throw new Error("Must move your worker first before building");
            }
        }
    }

    public validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        const moveAction = turn.gameActions[0] as Move
        if(moveAction.worker){
            if(playerTurn !== moveAction.worker.toUpperCase()){
                throw new Error(`Cannot move ${moveAction.worker} on ${playerTurn}'s turn`)
            }
            if(moveAction.from){
                if(!TILE_ADJACENCY[TILES.indexOf(moveAction.from)].includes(TILES.indexOf(moveAction.to))){
                    throw new Error(`Cannot move from ${moveAction.from} to ${moveAction.to}`);
                }
                else {
                    //Tile level check
                    const tempFromTile = tileData[TILES.indexOf(moveAction.from)]
                    const tempToTile = tileData[TILES.indexOf(moveAction.to)]
                    const fromBlockLevel = tempFromTile.buildings ? tempFromTile.buildings : "E" as Building
                    const toBlockLevel = tempToTile.buildings ? tempToTile.buildings  : 'E' as Building

                    // console.log("Temp Data Tiles : ", tempTileData, tempFromTile, tempToTile)
                    // console.log("fromBlockLevel toBlockLevel", fromBlockLevel, toBlockLevel)
                    if(!VALID_MOVEMENTS.get(fromBlockLevel)?.includes(toBlockLevel) || tempToTile.worker){                
                        throw new Error(`Invalid move ${moveAction.worker} from ${moveAction.from} to ${moveAction.to}`);             
                    } 
                }
            }
            else {
                const tileToPlaceWorker = tileData[TILES.indexOf(moveAction.to)]
                if(tileToPlaceWorker){
                  if((tileToPlaceWorker.buildings && tileToPlaceWorker.buildings !== "E") ||
                    tileToPlaceWorker.worker){
                      throw new Error(`Invalid worker placement to ${moveAction.to}`);
                  }
                }
            }
        }        
    }

    public validateBuildActions(turn: Turn, tileData: TileData[]){
        const moveAction = turn.gameActions[0] as Move
        const buildAction = turn.gameActions[1] as Build
        if(buildAction.building && moveAction.to){
            const tempSingleTileData = tileData[TILES.indexOf(buildAction.tile)]
            const destinationBlock = tempSingleTileData.buildings ? tempSingleTileData.buildings : "E" as Building

            //Check if Building is adjacent to worker that moved            
            if(!TILE_ADJACENCY[TILES.indexOf(moveAction.to)].includes(TILES.indexOf(buildAction.tile))){
                throw new Error(`Must build adjacent to worker that moved`)
            }

            if(!VALID_BUILDS.get(destinationBlock)?.includes(buildAction.building) || tempSingleTileData.worker){
            // console.log(`Valid Builds worker`,VALID_BUILDS.get(destinationBlock), tempSingleTileData.worker)
                throw new Error(`Invalid build from ${destinationBlock} to ${buildAction.building}`);          
            }        
        }
    }

    public isSecondaryWinConditionMet(turn: Turn): boolean {
        console.log(turn)
        return false
    }
    
}

export default Mortal