import { isMoveAscending, Move, TileData } from "../../../types/Types";
import Restriction from "./Restrictions";

class AthenaRestrictions extends Restriction {     
     constructor (inPlay:boolean, active:boolean){
        super(inPlay, active)
        this.setGodIdentifier("III")
     }

     public isMoveRestricted(move: Move, tileData: TileData[]): boolean {
         if(isMoveAscending(move, tileData)){
            throw new Error('Athena god power is active. Opponent Workers cannot move up this turn')
         }
        return false
    }
}

export default AthenaRestrictions