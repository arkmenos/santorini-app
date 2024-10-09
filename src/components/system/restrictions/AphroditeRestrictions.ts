import { Turn, TileData, Move, Player, Worker, Tile, TILE_ADJACENCY, TILES } from "../../../types/Types";
import Mortal from "../Mortal";
import Restriction from "./Restrictions";


class AphroditeRestrictions extends Restriction {
    constructor(inPlay: boolean, active:boolean){
        super(inPlay, active)
        this.setGodIdentifier("XI")
    }

    public isMoveRestricted(turn: Turn, _tileData: TileData[], playerPowers: Mortal[], 
        playerTurn:Player, workerPositionsMap:Map<Worker,Tile>): boolean {
        // let lastMoveAction:Move
        let powerIndex 
        playerPowers.map((p, index)=> {
            if(p.getIdentifier() === this.getGodIdentifier()) powerIndex = index;
        })

        const playerWorkers = [playerTurn as Worker, playerTurn.toLowerCase() as Worker]
        const finalDest:Map<Worker, Tile> = new Map();
        //find final destination of player worker movements
        for(let i=turn.gameActions.length - 1; i >= 0; i--){
            const action = turn.gameActions[i] as Move
            if(action.worker && action.to && !finalDest.has(action.worker)){
                finalDest.set(action.worker, action.to)
            }
        }

        if(powerIndex){
            const aphroditeWorkers = [String.fromCharCode(powerIndex + 88) as Worker, 
                String.fromCharCode(powerIndex + 88).toLowerCase() as Worker]
            const aphroditeWorkerTiles:Tile[] = []
            aphroditeWorkers.forEach( a => {
                const tempTile = workerPositionsMap.get(a)
                if(tempTile)  aphroditeWorkerTiles.push(tempTile)                
            })
            playerWorkers.forEach(w => {
                if(workerPositionsMap.has(w) && finalDest.has(w)){
                    const wTile = workerPositionsMap.get(w)
                    //player started adjacent to aphrodite workers
                    aphroditeWorkers.forEach(a => {
                        const aTile = workerPositionsMap.get(a)
                        if(workerPositionsMap.has(a) && aTile && wTile){
                            if(TILE_ADJACENCY[TILES.indexOf(aTile)].includes(TILES.indexOf(wTile))){
                                const dTile = finalDest.get(w)
                                if(dTile){
                                    if(!TILE_ADJACENCY[TILES.indexOf(aTile)].includes(TILES.indexOf(dTile))){
                                        throw new Error(`Aphrodite god power is active.
                                            Opponent workers that start neighbouring an Aphrodite worker
                                            must end their turn neighbouring one of Aphrodite's workers`)
                                    }
                                }
                            }
                        }
                    })
                }
            })
        }



        


        return false
    }
}

export default AphroditeRestrictions