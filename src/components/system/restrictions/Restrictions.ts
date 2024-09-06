import { GodIdentifier, Move, TileData, Turn } from "../../../types/Types";

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
    public abstract isMoveRestricted(move: Move, tileData: TileData[]): boolean;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isBuildRestricted(_: Turn, __: TileData[]): boolean {
        return false;
    }

    public setActive(active: boolean){
        this.active = active
    }
}

export default Restriction