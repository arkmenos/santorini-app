
import { Build, Building, GodIdentifier, Move, Player, Tile, TILE_ADJACENCY, TileData, TILES, Turn, VALID_BUILDS, VALID_MOVEMENTS, Worker } from "../../types/Types";
import NoRestriction from "./restrictions/NoRestriction";
import Restriction from "./restrictions/Restrictions";

class Mortal {

    private identifier: GodIdentifier | null = null;
    private restriction: Restriction = new NoRestriction();  
    
    constructor(){   
    }

    public getIdentifier() {
        return this.identifier;
    }

    protected setIdentifier(identifier: GodIdentifier){
        this.identifier = identifier
    }

    public getRestriction(){
        return this.restriction;
    }
    
    protected setRestriction(restriction: Restriction){
        this.restriction = restriction
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected validateActions(turn: Turn, turnCount: number, playerCount:number,
        _tileData?:TileData[], _workerPositionsMap?: Map<Worker, Tile>){             
       
        const moveAction = turn.gameActions[0] as Move
        //Worker Placement Phase
        if(turnCount <= 2 || (turnCount === 3 && playerCount === 3)){
            if(turn.gameActions.length !== 2) throw new Error("Must place 2 workers on board this turn")
            const seconedMoveAction = turn.gameActions[1] as Move
            if(!seconedMoveAction.worker) throw new Error("Must place 2 workers on board this turn");
            if(moveAction.to === seconedMoveAction.to) throw new Error("Must place workers on separate tiles")
            
        }else{    
            //Worker move and build phases            
            if(turn.gameActions.length !== 2 && turn.gameActions.length !== 1){
                throw new Error("Can move once and build once this turn")
            }
            if(turn.gameActions.length !== 1){
                const buildAction = turn.gameActions[1] as Build
                if(!moveAction.worker || !buildAction.building) throw new Error("Must move your worker first before building");
            }
        }
    }

    protected isValidMove(moveAction: Move, tileData: TileData[], playerTurn: Player){
        if(playerTurn !== moveAction.worker.toUpperCase()){
            throw new Error(`Cannot move ${moveAction.worker} on ${playerTurn}'s turn`)
        }
        if(moveAction.from){
            if(!TILE_ADJACENCY[TILES.indexOf(moveAction.from)].includes(TILES.indexOf(moveAction.to))){
                throw new Error(`Cannot move from ${moveAction.from} to ${moveAction.to}`);
            }
            else {
                //Tile level check
                const tempFromTile = tileData[TILES.indexOf(moveAction.from)]
                const tempToTile = tileData[TILES.indexOf(moveAction.to)]
                const fromBlockLevel = tempFromTile.buildings ? tempFromTile.buildings : "E" as Building
                const toBlockLevel = tempToTile.buildings ? tempToTile.buildings  : 'E' as Building

                console.log("Temp Data Tiles : ", tileData, tempFromTile, tempToTile)
                console.log("fromBlockLevel toBlockLevel tempToTile.worker", 
                    fromBlockLevel, toBlockLevel, tempToTile.worker)
                if(!VALID_MOVEMENTS.get(fromBlockLevel)?.includes(toBlockLevel) || tempToTile.worker){                
                    throw new Error(`Invalid move ${moveAction.worker} from ${moveAction.from} to ${moveAction.to}`);             
                } 
            }
            return true
        }
        else {
            const tileToPlaceWorker = tileData[TILES.indexOf(moveAction.to)]
            if(tileToPlaceWorker){
              if((tileToPlaceWorker.buildings && tileToPlaceWorker.buildings !== "E") ||
                tileToPlaceWorker.worker){
                  throw new Error(`Invalid worker placement to ${moveAction.to}`);
              }
              return true
            }
        }
        return false
    }

    protected validateMoveActions(turn: Turn, playerTurn: Player, tileData: TileData[]){
        const moveAction = turn.gameActions[0] as Move
        this.isValidMove(moveAction, tileData, playerTurn) 
    }

    protected isBuildValid(buildAction: Build, moveAction: Move, tileData: TileData[], 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _turnCount:number, _playerCount: number){

        // if(turnCount <=2 || (turnCount === 3 && playerCount ===3)) return false
         
        if(buildAction.building && moveAction.to){
            const tempSingleTileData = tileData[TILES.indexOf(buildAction.tile)]
            const destinationBlock = tempSingleTileData.buildings ? tempSingleTileData.buildings : "E" as Building

            //Check if Building is adjacent to worker that moved            
            if(!TILE_ADJACENCY[TILES.indexOf(moveAction.to)].includes(TILES.indexOf(buildAction.tile))){
                throw new Error(`Must build adjacent to worker that moved`)
            }

            if(!VALID_BUILDS.get(destinationBlock)?.includes(buildAction.building) || tempSingleTileData.worker){
            // console.log(`Valid Builds worker`,VALID_BUILDS.get(destinationBlock), tempSingleTileData.worker)
                throw new Error(`Invalid build from ${destinationBlock} to ${buildAction.building}`);          
            }  
            
            return true
        }
        else{
            throw new Error('You must move and build this turn')
        }
    }
    
    protected validateBuildActions(turn: Turn, tileData: TileData[], turnCount:number, playerCount: number){
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){ 
            const moveAction = turn.gameActions[0] as Move
            const buildAction = turn.gameActions[1] as Build
            this.isBuildValid(buildAction, moveAction, tileData, turnCount, playerCount)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isSecondaryWinConditionMet(_turn?: Turn, _tileData?: TileData[], 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _workerPositionsMap?:Map<Worker,Tile>, _playerTurn?:Player): boolean {    
        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isTertiaryWinConditionMet(_turn?: Turn, _tileData?: TileData[]): boolean {    
        return false
    }

    protected performMoveAction(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number){
        this.validateMoveActions(turn, playerTurn, tileData);
        const firstMove = turn.gameActions[0] as Move
        // console.log(`Move ${firstMove.worker} to ${firstMove.to} index ${TILES.indexOf(firstMove.to)}`)
        tileData[TILES.indexOf(firstMove.to)].worker = firstMove.worker
        if(firstMove.from) {
            if(!tileData[TILES.indexOf(firstMove.from)].buildings){
                tileData[TILES.indexOf(firstMove.from)].buildings = "E"
            }
            delete tileData[TILES.indexOf(firstMove.from)].worker
        }
        workerPositionsMap.set(firstMove.worker, firstMove.to)
        workerPositions.push(firstMove.to)
        let isPrimaryWinConditionMet = false
        if(this.isPrimaryWinconditionMet(firstMove, tileData)) isPrimaryWinConditionMet =true;

        if(turnCount <=2 || (turnCount === 3 && playerCount === 3)){
            const secondMove = turn.gameActions[1] as Move
            // console.log(`Move ${secondMove.worker} to ${secondMove.to} index ${TILES.indexOf(secondMove.to)}`, tileData)
            tileData[TILES.indexOf(secondMove.to)].worker = secondMove.worker
            if(secondMove.from) {
              if(!tileData[TILES.indexOf(secondMove.from)].buildings){
                tileData[TILES.indexOf(secondMove.from)].buildings = "E"
              }
              delete tileData[TILES.indexOf(secondMove.from)].worker
            }
            workerPositionsMap.set(secondMove.worker, secondMove.to)
            workerPositions.push(secondMove.to)
        }

        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:isPrimaryWinConditionMet}
    }

    protected isPrimaryWinconditionMet(moveAction: Move, tileData: TileData[]): boolean {
        if((moveAction.from && tileData[TILES.indexOf(moveAction.from)].buildings === "M" && 
        tileData[TILES.indexOf(moveAction.to)].buildings === "S") ){
            return true
        }
        return false;
    }

    protected performBuildAction(turn: Turn, tileData: TileData [], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[],turnCount:number, playerCount:number){
        this.validateBuildActions(turn, tileData, turnCount, playerCount)
        if(!(turnCount <=2 || (turnCount === 3 && playerCount ===3))){            
            const tempBuilding = turn.gameActions[1] as Build
            if(tempBuilding.building){
                tileData[TILES.indexOf(tempBuilding.tile)].buildings = tempBuilding.building
            }
        }
        return {tileData:tileData, workerPositionsMap:workerPositionsMap, 
            workerPositions:workerPositions, isPrimaryWinConditionMet:false}
    }

    public takeTurn(turn: Turn, tileData: TileData[], workerPositionsMap: Map<Worker, Tile>, 
        workerPositions: Tile[], playerTurn: Player, turnCount: number, playerCount: number){
        
        // this.checkRestrictions(turn, tileData,restrictions)        

        this.validateActions(turn, turnCount, playerCount, tileData)
        let turnData = this.performMoveAction(turn, tileData, workerPositionsMap, workerPositions,
            playerTurn, turnCount, playerCount)
        
        if(turnData.isPrimaryWinConditionMet){
            return turnData;
        }

        turnData = this.performBuildAction(turn, turnData.tileData, turnData.workerPositionsMap,
            turnData.workerPositions, turnCount, playerCount);

        if(this.isSecondaryWinConditionMet(turn, tileData, workerPositionsMap, playerTurn)){
            const newTurnData = {...turnData, isSecondaryWinConditionMet: true}

            return newTurnData
        }
        
        return turnData;
    }    

    // protected checkRestrictions(turn: Turn, tileData: TileData[], restrictions: Restriction[]){
    //     restrictions.forEach(res => {
    //         if(res.getGodIdentifier() !== this.getIdentifier() && res.getActive()){               
    //             res.isMoveRestricted(turn, tileData);
    //             res.isBuildRestricted(turn, tileData)
    //         }
    //     })
    // }
  
}

export default Mortal