import { TileData, Turn } from "../../../types/Types";
import Mortal from "../Mortal";

class Chronus extends Mortal {
    constructor(){
        super();
        this.setIdentifier("XVI");
    }

    public isTertiaryWinConditionMet(_turn: Turn, tileData: TileData[]): boolean {    
        console.log("isSecondaryWinConditionMet in Chronus")
        let completeTowerCount = 0;

        tileData.forEach(td => {
            if(td.buildings === "D"){
                ++completeTowerCount;
            }
        })
        if(completeTowerCount >= 5) return true;

        return false;
    }
}

export default Chronus