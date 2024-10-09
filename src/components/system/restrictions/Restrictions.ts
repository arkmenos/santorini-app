import { GodIdentifier, Player, Tile, TileData, Turn, Worker } from "../../../types/Types";
import Mortal from "../Mortal";

abstract class Restriction {
    inPlay:boolean;
    active: boolean;
    godIdentifier: GodIdentifier| null = null

    constructor( inPlay: boolean, active:boolean){
        this.inPlay = inPlay;
        this.active = active;
    }

    protected setGodIdentifier( identifier: GodIdentifier):void{
        this.godIdentifier = identifier
    }
    public getGodIdentifier():GodIdentifier|null{
        return this.godIdentifier
    }
    public abstract isMoveRestricted(turn: Turn, tileData: TileData[], 
        playerPowers?:Mortal[], playerTurn?:Player, workerPositionsMap?:Map<Worker, Tile>): boolean;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isBuildRestricted(_: Turn, __: TileData[]): boolean {
        return false;
    }

    public setActive(active: boolean){
        this.active = active
    }

    public getActive():boolean {
        return this.active
    }
}

export default Restriction