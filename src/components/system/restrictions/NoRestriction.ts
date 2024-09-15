import { TileData, Turn } from "../../../types/Types";
import Restriction from "./Restrictions";

class NoRestriction extends Restriction{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isMoveRestricted(_turn: Turn, _tileData: TileData[]): boolean {
        return false
    }
    constructor(){
        super(false, false);
    }
}

export default NoRestriction