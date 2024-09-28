import { ATLAS_VALID_BUILDS, Build, Building, Move, TILE_ADJACENCY, TileData, TILES } from "../../../types/Types";
import Mortal from "../Mortal";


class Atlas extends Mortal{
    constructor(){
        super();
        this.setIdentifier("IV");
    }

    protected isBuildValid(buildAction: Build, moveAction: Move, tileData: TileData[], 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _turnCount:number, _playerCount: number){

        // if(turnCount <=2 || (turnCount === 3 && playerCount ===3)) return false
         
        if(buildAction.building && moveAction.to){
            const tempSingleTileData = tileData[TILES.indexOf(buildAction.tile)]
            const destinationBlock = tempSingleTileData.buildings ? tempSingleTileData.buildings : "E" as Building

            //Check if Building is adjacent to worker that moved            
            if(!TILE_ADJACENCY[TILES.indexOf(moveAction.to)].includes(TILES.indexOf(buildAction.tile))){
                throw new Error(`Must build adjacent to worker that moved`)
            }
            
            if(!ATLAS_VALID_BUILDS.get(destinationBlock)?.includes(buildAction.building) || tempSingleTileData.worker){
            // console.log(`Valid Builds worker`,VALID_BUILDS.get(destinationBlock), tempSingleTileData.worker)
                throw new Error(`Invalid build from ${destinationBlock} to ${buildAction.building}`);          
            }  
            
            return true
        }       

        return false;
    }
}

export default Atlas