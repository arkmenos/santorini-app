import { Build, isMoveAscending, Move, Player, TileData, Turn } from "../../../types/Types";
import Mortal from "../Mortal";

class Prometheus extends Mortal {
    constructor(){
        super();
        this.setIdentifier("X");
    }

    protected validateActions(turn: Turn, turnCount: number, playerCount: number, tileData:TileData[]): void {
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn")
        }else{
            const numActions = turn.gameActions.length
            if(numActions < 1 || numActions > 3){
                throw new Error("If your Worker does not move up, it may build both before and after moving")
            }
            else{
                let firstAction, secondAction, thirdAction;
                if(numActions === 2){
                    firstAction = turn.gameActions[0] as Move
                    secondAction = turn.gameActions[1] as Build
                    if(!firstAction.worker || !secondAction.building){
                        throw new Error("If your Worker does not move up, it may build both before and after moving")
                    }
                }
                else if(numActions === 3){
                    firstAction = turn.gameActions[0] as Build
                    secondAction = turn.gameActions[1] as Move
                    thirdAction = turn.gameActions[2] as Build
                
                    if(!firstAction.building || !secondAction.worker || !thirdAction.building) 
                        throw new Error("If your Worker does not move up, it may build both before and after moving");

                    if(isMoveAscending(secondAction, tileData))
                        throw new Error("If your Worker does not move up, it may build both before and after moving");
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        let moveAction
        if(turn.gameActions.length === 2) moveAction = turn.gameActions[0] as Move;
        else if(turn.gameActions.length === 3) moveAction = turn.gameActions[1] as Move;
        
        if(moveAction && moveAction.worker) this.isValidMove(moveAction, tileData, playerTurn);
    }

    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            let moveAction, buildAction

            if(turn.gameActions.length === 2) {
                moveAction = turn.gameActions[0] as Move
                buildAction = turn.gameActions[1] as Build;
                if(buildAction.building && moveAction.worker){
                    this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
                }
                else{
                    throw new Error("You must move once and may build an additional time not on the same space this turn")
                }                
            }
            else if(turn.gameActions.length === 3) {
                buildAction = turn.gameActions[0] as Build;
                moveAction = turn.gameActions[1] as Move
                const secondBuildAction = turn.gameActions[2] as Build
                if(!secondBuildAction.building){
                    throw new Error("You must move once and may build an additional time not on the same space this turn")
                }
                if(secondBuildAction.building && buildAction.tile === secondBuildAction.tile){
                    throw new Error ("Your additional build cannot be on the same space as the first")
                }
                this.isBuildValid(secondBuildAction, moveAction, tileData, turnCount, playerCount);
            }            
        }
    }
}

export default Prometheus