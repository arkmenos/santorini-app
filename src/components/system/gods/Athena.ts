import { Move, Player, Tile, TileData, Turn, Worker } from "../../../types/Types";
import { isMoveAscending } from "../../../Utility/Utility";
import Mortal from "../Mortal";
import AthenaRestrictions from "../restrictions/AthenaRestrictions";
import Restriction from "../restrictions/Restrictions";

class Athena extends Mortal{
    constructor(){
        super();
        this.setIdentifier("III");
        this.setRestriction(new AthenaRestrictions(true, false));
    }
    
    public takeTurn(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number,
        restrictions: Restriction[]){
        
        this.checkRestrictions(turn, tileData,restrictions)           
        
        this.validateActions(turn, turnCount, playerCount, tileData)
        let turnData = this.performMoveAction(turn, tileData, workerPositionsMap, workerPositions,
            playerTurn, turnCount, playerCount)
        
        if(turnData.isPrimaryWinConditionMet){
            return turnData;
        }
       
        console.log("Athena setActive", turn.gameActions[0])
        this.getRestriction()?.setActive(isMoveAscending(turn.gameActions[0] as Move, tileData ));        

        turnData = this.performBuildAction(turn, turnData.tileData, turnData.workerPositionsMap,
            turnData.workerPositions, turnCount, playerCount);
        
        return turnData;
    }    
}

export default Athena;