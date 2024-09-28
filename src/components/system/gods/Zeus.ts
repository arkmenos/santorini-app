import { Build, Building, Move, TILE_ADJACENCY, TileData, TILES, VALID_BUILDS} from "../../../types/Types";
import Mortal from "../Mortal";

class Zeus extends Mortal {
    constructor() {
        super();
        this.setIdentifier("XXX");        
    }

    protected isBuildValid(buildAction: Build, moveAction: Move, tileData: TileData[], 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _turnCount: number, _playerCount: number): boolean {
        
        if(buildAction.building && moveAction.to){
            const tempSingleTileData = tileData[TILES.indexOf(buildAction.tile)]
            const destinationBlock = tempSingleTileData.buildings ? tempSingleTileData.buildings : "E" as Building

            //Check if Building is adjacent to worker that moved  or on the same tile          
            if(!TILE_ADJACENCY[TILES.indexOf(moveAction.to)].includes(TILES.indexOf(buildAction.tile)) &&
                moveAction.to !== buildAction.tile){
                throw new Error(`Must build adjacent to worker that moved`)
            }

            if(!VALID_BUILDS.get(destinationBlock)?.includes(buildAction.building) && 
                tempSingleTileData.worker !== moveAction.worker){
            // console.log(`Valid Builds worker`,VALID_BUILDS.get(destinationBlock), tempSingleTileData.worker)
                throw new Error(`Invalid build from ${destinationBlock} to ${buildAction.building}`);          
            }  
            
            return true
        }
        else{
            throw new Error('You must move and build this turn')
        }
    }    
}

export default Zeus;