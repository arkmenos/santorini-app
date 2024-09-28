import { Move, TileData, TILES, Turn } from "../../../types/Types";
import Mortal from "../Mortal";

class Pan extends Mortal {
    constructor(){
        super();
        this.setIdentifier("IX")
    }

    public isSecondaryWinConditionMet(turn: Turn, tileData: TileData[]): boolean {    
        console.log("isSecondaryWinConditionMet in Pan")
        const moveAction = turn.gameActions[0] as Move
        if(moveAction.from && moveAction.to){
            const fromBlockLevel = tileData[TILES.indexOf(moveAction.from)].buildings
            const toBlockLevel = tileData[TILES.indexOf(moveAction.to)].buildings
            if((fromBlockLevel === "M" && toBlockLevel === "E") || (fromBlockLevel === "S" 
                && (toBlockLevel === "L" || toBlockLevel === "E"))){
                    return true
            }
        }
        
        return false
    }
}

export default Pan