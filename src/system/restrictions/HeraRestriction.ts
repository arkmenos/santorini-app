import { Turn, TileData, Player, Worker, Tile } from "../../types/Types";
import Mortal from "../Mortal";
import Restriction from "./Restriction";

class Hera extends Restriction {
    
    constructor(inPlay:boolean, active:boolean){
        super(inPlay, active)
        this.setGodIdentifier("XX")
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isMoveRestricted(_turn: Turn, _tileData: TileData[], _playerPowers?: Mortal[], 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _playerTurn?: Player, _workerPositionsMap?: Map<Worker, Tile>): boolean {
        return false
    }
}

export default Hera