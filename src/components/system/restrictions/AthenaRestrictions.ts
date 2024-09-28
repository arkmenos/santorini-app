import { Move, TileData, Turn } from "../../../types/Types";
import { isMoveAscending } from "../../../Utility/Utility";
import Restriction from "./Restrictions";

class AthenaRestrictions extends Restriction {     
     constructor (inPlay:boolean, active:boolean){
        super(inPlay, active)
        this.setGodIdentifier("III")
     }

     public isMoveRestricted(turn: Turn, tileData: TileData[]): boolean {
         turn.gameActions.forEach(action => {
            if((action as Move).worker){
               if(isMoveAscending(action as Move, tileData)){
                  throw new Error('Athena god power is active. Opponent Workers cannot move up this turn')
               }
            }
         })
         
        return false
    }
}

export default AthenaRestrictions