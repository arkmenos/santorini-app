import {  START,  Worker,  WORKERS,  BLOCKS,  DOMES,  TILES,  Tile,  MAX_DOMES,  MAX_L_BLOCKS,
  MAX_M_BLOCKS,  MAX_S_BLOCKS,  TileData,  Block,  Turn,  Move,  Building,  
  TILE_ADJACENCY,  VALID_MOVEMENTS,  Player,  PLAYERS,  GODIDENTIFIERS,
  GodIdentifier,
  } from "../../types/Types";
import Apollo from "./gods/Apollo";
import Ares from "./gods/Ares";
import Artemis from "./gods/Artemis";
import Athena from "./gods/Athena";
import Atlas from "./gods/Atlas";
import Chronus from "./gods/Chronus";
import Demeter from "./gods/Demeter";
import Hephaestus from "./gods/Hephaestus";
import Hermes from "./gods/Hermes";
import Minotaur from "./gods/Minotaur";
import Pan from "./gods/Pan";
import Prometheus from "./gods/Prometheus";
import Zeus from "./gods/Zeus";
import Mortal from "./Mortal";
import Restriction from "./restrictions/Restrictions";

class Santorini {
  private notation: string;
  private remainingLBlocks = 0;
  private remainingMBlocks = 0;
  private remainingSBlocks = 0;
  private remainingDomes = 0;
  private destroyedLBlocks = 0;
  private destroyedMBlocks = 0;
  private destroyedSBlocks = 0;
  private destroyedDomes = 0;
  private usedLBlocks = 0;
  private usedMBlocks = 0;
  private usedSBlocks = 0;
  private usedDomes = 0;
  private workerPositions: Tile[] = [];
  private workerPositionsMap: Map<Worker, Tile> = new Map();
  private tileData: TileData[] = this.getStartTileData();
  private turnCount = 1;
  private playerTurn:Player = "X"
  private playerCount = 2;
  private gameOverInd:boolean = false;
  private winner:Player | undefined;
  private players: Player[] = ['X','Y']
  private turns: Turn[] = []
  private playerPowers:Mortal[]  = []
  private isChronusInPlay:boolean = false;
  private restrictions:Restriction[] = []



  constructor(notation?: string, playerCount?: number) {
    this.notation = notation? notation?.trim() : START;
    if(playerCount) this.setPlayers(playerCount)
    this.validateNotation();
  }

  private setPlayers(numberOfPlayers:number){
    if(numberOfPlayers !== 2 && numberOfPlayers !== 3){
      throw new Error ("There can only be 2 or 3 players")
    }
    if(numberOfPlayers === 3) {
      this.players = [...PLAYERS] 
      this.playerCount = 3;
      this.notation += " 3"
    }else {
      this.players = ['X','Y']
      this.playerCount = 2
    }
  }

  public isGameOver():boolean{
    return this.gameOverInd;
  }

  public getPlayerTurn():Player {
    return this.playerTurn
  }

  public getWinner(): Player | string {
    return this.winner ? this.winner : "";
  }

  public getTurns(): Turn[] {
    return this.turns;
  }

  public getPlayerPowers():Mortal[] {
    return this.playerPowers
  }

  private reset() {
    this.remainingLBlocks = 0;
    this.remainingMBlocks = 0;
    this.remainingSBlocks = 0;
    this.remainingDomes = 0;
    this.destroyedLBlocks = 0;
    this.destroyedMBlocks = 0;
    this.destroyedSBlocks = 0;
    this.destroyedDomes = 0;
    this.usedLBlocks = 0;
    this.usedMBlocks = 0;
    this.usedSBlocks = 0;
    this.usedDomes = 0;
    this. workerPositions = [];
    this. workerPositionsMap = new Map();
    this. tileData = this.getStartTileData();
    // this. turnCount = 1;
  }

  public getSAN(): string {
    return this.notation;
  }

  private getStartTileData(): TileData[] {
    const result:TileData[] = []
    for(let i=0; i < 25; i++){
      result.push({buildings:"E"})
    }
    return result;
  }
  private setNextPlayerTurn(){
    if(this.playerCount === 2){
      if(this.playerTurn === "X"){
        this.playerTurn = "Y"
      }
      else{
        this.playerTurn ="X"
      }
    }else if(this.playerCount === 3){
      if(this.players.length === 3){
        if(this.playerTurn === "X"){
          this.playerTurn ="Y"
        }else  if(this.playerTurn === "Y"){
          this.playerTurn ="Z"
        }else{
          this.playerTurn ="X"
        }
      }else if(this.players.length === 2){
        if(this.playerTurn === this.players[0]) this.playerTurn = this.players[1]
        else this.playerTurn = this.players[0]
      }    
    }
      
  }

  public takeTurn(turn: Turn): Turn | null {
    if(turn === null) return null

    let tempTileData:TileData[] = JSON.parse(JSON.stringify(this.tileData))
    let tempWorkerPositionsMap = new Map(this.workerPositionsMap)
    let tempWorkerPositions = [...this.workerPositions];  

    if(this.turnCount >= 5){    
      console.log("Player Turn ", this.playerTurn)
      if(this.isTurnPossible()){
        console.log("YES TURN is POSSIBLE")
      }else {
        const playerNum = this.playerTurn.charCodeAt(0) - 87
        const opponents = [...this.players].filter( p => p !== this.playerTurn)
        console.log("NO, TURN NOT POSSIBLE")
        console.log("playerNum: ",playerNum, opponents)
        if(this.players.length === 2){
          this.gameOverInd = true
          this.winner = opponents[0]
          return turn
          // throw new Error(`Player ${playerNum} cannot move. Player ${opponents[0].charCodeAt(0) - 87} wins`)
        }
        else if(this.playerCount === 3){
          console.log("Remove the player")
          this.players.filter( p => p !== this.playerTurn)
          ++this.turnCount;
          tempTileData.forEach(ttd => {
            if(ttd.worker && this.playerTurn === ttd.worker.toUpperCase()) {
              ttd.worker = undefined
              if(!ttd.buildings) ttd.buildings = "E"
            }
          })
          tempWorkerPositionsMap.delete(this.playerTurn)
          tempWorkerPositionsMap.delete(this.playerTurn.toLowerCase() as Worker)
          // console.log("Update tile after removing player ", tempTileData, tempWorkerPositionsMap)
          if(this.playerPowers[this.playerTurn.charCodeAt(0) - 88] instanceof Chronus){
            this.isChronusInPlay = false;
          }
          const newSAN = this.createNewSAN(tempTileData, tempWorkerPositionsMap)
          this.load(newSAN)
          // console.log("Turn incremented: ", this.turnCount)
          // throw new Error(`Player ${playerNum} cannot move and has been removed from the game`)
          this.turns.push(turn)
          return turn;
        }        
      }
    }
    
    let mortal: Mortal;
    if(this.playerPowers.length === 1){
      mortal = this.playerPowers[0];
    }else{
      const playerIndex = this.playerTurn.charCodeAt(0) - 88
      mortal = this.playerPowers[playerIndex]
    }
    // console.log("Mortal taking turn ", mortal, this.playerPowers, this.playerTurn.charCodeAt(0) - 88)     
    const mAction = mortal.takeTurn(turn, tempTileData, tempWorkerPositionsMap, 
      tempWorkerPositions, this.playerTurn, this.turnCount, this.playerCount, this.restrictions);
 
    tempTileData = mAction.tileData;
    tempWorkerPositionsMap = mAction.workerPositionsMap
    tempWorkerPositions = mAction.workerPositions
 

    //Check primary win condition
    if(mAction.isPrimaryWinConditionMet){
      const tempMove = turn.gameActions[0] as Move
      this.gameOverInd = true;
      this.winner = tempMove.worker.toLocaleUpperCase() as Player
      ++this.turnCount;
      const newSAN = this.createNewSAN(tempTileData, tempWorkerPositionsMap)
      this.load(newSAN)
      this.turns.push(turn)
      return turn;
    }
  
    if(this.isChronusInPlay){
      const chIndex = this.playerPowers.findIndex(p => p.getIdentifier() === "XVI")     
      if((this.playerPowers[chIndex] instanceof Chronus) && 
        this.playerPowers[chIndex].isTertiaryWinConditionMet(turn, tempTileData)){
          this.gameOverInd = true;
          this.winner = String.fromCharCode(chIndex + 88).toLocaleUpperCase() as Player
      }
    }

    ++this.turnCount;
    const newSAN = this.createNewSAN(tempTileData, tempWorkerPositionsMap)
    this.load(newSAN)
    // console.log("Turn incremented: ", this.turnCount)
    this.turns.push(turn)
    

    return turn;
  }  

  private createNewSAN(data: TileData[], newWorkerPositionsMap:Map<Worker, Tile>): string{
    let result = ""
    let emptyTiles = 0
    let workers = ""
    let l_Blocks = 22
    let m_Blocks = 18
    let s_Blocks = 14
    let domes = 18

    for(let i = 0; i < 25; i++){
      if(data[i].buildings === "E"){        
        
        if(data[i].worker){
          if(emptyTiles !== 0) result += emptyTiles  
          result += data[i].worker
          emptyTiles = 0
          // workers += `${data[i].worker}${TILES[i]}/`
        }else{
          ++emptyTiles;
        }

        
      }
      else {
        if(data[i].buildings){
          if(emptyTiles !== 0) result += emptyTiles 
          result += data[i].buildings
          emptyTiles = 0
        }else if(data[i].worker){
          if(emptyTiles !== 0) result += emptyTiles
          result += data[i].worker
          emptyTiles = 0
          // workers += `${data[i].worker}${TILES[i]}/`
        }        

        switch (data[i].buildings){
          case 'L':
            l_Blocks--;
            break;
          case 'M':
            l_Blocks--;
            m_Blocks--;
            break;
          case 'S':
            l_Blocks--;
            m_Blocks--;
            s_Blocks--;
            break;
          case 'D':
            l_Blocks--;
            m_Blocks--;
            s_Blocks--;
            domes--;
            break;
          case 'F':
            l_Blocks--;
            domes--;
            break;
          case 'G':
            l_Blocks--;
            m_Blocks--;
            domes--;
            break;
          case 'H':
            domes--;
            break;
        }
      }
      if(i % 5 === 4){
        if(emptyTiles !== 0) result += emptyTiles      
        if(i !== 24) result += "/"    
        emptyTiles = 0
      }
    }
    this.setNextPlayerTurn()

    if(newWorkerPositionsMap.size === 0){
      workers += "-"
    }else {
      newWorkerPositionsMap.forEach((value, key) => {
        workers += `${key.toString()}${value.toString()}/`
      })
      workers = workers.substring(0, workers.length - 1)
    }
    // if(workers === "") workers = "-"
    // else {
    //   workers = workers.substring(0, workers.length - 1)
    // }
      
    
    let powers = "-";
    if(this.playerPowers.length !== 1){
      powers = "";
      this.playerPowers.forEach(p => {
        powers += `${p.getIdentifier()}/`
      })
      powers = powers.substring(0, powers.length - 1)
    }

    result += ` ${this.playerTurn} ${workers} ${powers} L${l_Blocks}/M${m_Blocks}/S${s_Blocks}/D${domes}`
    result += ` - - ${this.turnCount} ${this.playerCount}`
    // console.log("new san", result)
    return result;
  }

  public validateNotation(): boolean {
    // this.reset();
    if (!this.notation) {
      this.notation = START;
      // return true;
    }

    console.log("Validate this notation", this.notation);
    const tokens = this.notation.split(/\s+/);
    // console.log("length ", tokens.length)
    if (tokens.length !== 7 && tokens.length !== 8 && tokens.length !== 9) {
      // console.log(tokens.length)
      throw new Error(
        "Invalid notation: must contain 7 or 8 space-delimited fields",
      );
    }
    //validate recently moved workers --- use as turn count for testing
    // console.log("Update turnCount:", tokens[6], tokens[5] , tokens[7])
    if (tokens[6] !== "-") {
      // console.log("Validate recently moved workers")
      // console.log("Turn notation not here???")
      if(!isNaN(parseInt(tokens[6]))){
        this.turnCount = parseInt(tokens[6])
      } 
    } 

    //set turn
    if(tokens[7]){
      // console.log("Setting turn: ", tokens[7])
      const tempTurn = parseInt(tokens[7])
      if(!isNaN(tempTurn)){
        this.turnCount = tempTurn
      }
      else{
        throw new Error(`Invalid notation on Turn Field: ${tokens[7]}`);
      }
    }


    //set player count
    if(tokens[8]){
      // console.log("Setting player count: ", tokens[8])
      const playerCount = parseInt(tokens[8])
      if(!isNaN(playerCount)){
        if(playerCount !== 2 && playerCount !== 3){
          throw new Error(`There can only be 2 or 3 players`)
        }
        // console.log('Set player count', playerCount )
        this.playerCount = playerCount
      }
      else{
        throw new Error(`Invalid notation on Turn Field: ${playerCount}`);
      }
    }

    //Validate Tiles
    const tiles = tokens[0].split("/");
    if (tiles.length !== 5)
      throw new Error(`Invalid notation on Tiles Field: ${tiles}`);

   

    for (let i = 0; i < tiles.length; i++) {
      this.validateTile(tiles[i], i);
    }

    //Validate Player turn
    if (!WORKERS.includes(tokens[1])) {
      throw new Error(`Invalid notation on Player Turn Field: ${tokens[1]}`);
    } else {
      this.playerTurn = tokens[1] as Player
    }

 

    //Validate Worker Positions
    if (tokens[2] !== "-") {
      // console.log("Validate Token: ", tokens[2])
      const workers = tokens[2].split("/");
      workers.forEach((worker) => {
        const tempWorker = worker[0] as Worker;
        const tempWorkerPosition = worker.substring(1, 3) as Tile;
        if (!WORKERS.includes(worker[0])) {
          throw new Error(`Invalid notation on Worker Field: ${worker}`);
        }

        if (!TILES.includes(worker.substring(1, 3))) {
          throw new Error(
            `Invalid notation on Worker position: ${worker.substring(1, 3)}`,
          );
        } else {
            //  console.log("Stored workers", this.workerPositionsMap)
            //  console.log("Stored positions", this.workerPositions)
            //  console.log("tempWorker tempWorkerPosition", tempWorker, tempWorkerPosition)
          if (
            this.workerPositionsMap.has(tempWorker) &&
            this.workerPositionsMap.get(tempWorker) !== tempWorkerPosition
          ) {
            throw new Error(
              `Invalid notation on Worker Field: ${tempWorker}${tempWorkerPosition}`,
            );
          } else {
            this.workerPositionsMap.set(
              worker[0] as Worker,
              worker.substring(1, 3) as Tile,
            );
            this.tileData[TILES.indexOf(worker.substring(1))].worker = worker[0] as Worker
          }
        }
      });
    }
    // console.log("tileData", this.tileData)
    //validate Gods and their Tokens
    if (tokens[3] !== "-") {
      // console.log("Validate Powers field");
      if(!(this.playerPowers.length >= 1)){
        const identifiers = tokens[3].split("/")
        this.setPlayerPowers(identifiers);     
      }
    } 
    else {
      //All mortals
      this.playerPowers = [new Mortal()]
    }

    //update Remaining blocks
    const blocks = tokens[4].split("/");
    if (blocks.length === 4) {
      // console.log("validate remainig blocks")
      blocks.forEach((block) => {
        const tempBlock = block[0];
        let tempBlockNumber: string | number = block.substring(1);
        if (isNaN(parseInt(tempBlockNumber))) {
          throw new Error(
            `Invalid notation on Remaining Blocks Field ${block}`,
          );
        } else {
          tempBlockNumber = parseInt(tempBlockNumber);
        }

        switch (tempBlock) {
          case "L":
            this.remainingLBlocks = tempBlockNumber;
            break;
          case "M":
            this.remainingMBlocks = tempBlockNumber;
            break;
          case "S":
            this.remainingSBlocks = tempBlockNumber;
            break;
          case "D":
            this.remainingDomes = tempBlockNumber;
            break;
          default:
            console.log("Remaining blocks switch default case reached");
        }
      });
    } else {
      throw new Error(`Invalid notation on Remaining Blocks Field: ${blocks}`);
    }

    //Update destroyed pieces (workers, blocks and tokens)
    //Validate number of blocks and domes in play and destroyed
    if (tokens[5] !== "-") {
      const destroyedPiece = tokens[5].split("/");
      if (destroyedPiece.length === 4) {
        destroyedPiece.forEach((piece) => {
          const tempPiece = piece[0];
          let tempPieceNumber: string | number = piece.substring(1);
          if (isNaN(parseInt(tempPieceNumber))) {
            throw new Error(
              `Invalid notation on Destroyed Blocks Field ${piece}`,
            );
          } else {
            tempPieceNumber = parseInt(tempPieceNumber);
          }

          switch (tempPiece) {
            case "L":
              this.destroyedLBlocks = tempPieceNumber;
              break;
            case "M":
              this.destroyedMBlocks = tempPieceNumber;
              break;
            case "S":
              this.destroyedSBlocks = tempPieceNumber;
              break;
            case "D":
              this.destroyedDomes = tempPieceNumber;
              break;
            default:
              console.log("Remaining blocks switch default case reached");
          }
        });

        this.validateBlocks();
      } else {
        throw new Error(
          `Invalid notation on Destroyes Blocks Field: ${destroyedPiece}`,
        );
      }
    } else {
      this.validateBlocks();
    }

    //validate recently moved workers --- use as turn count for testing
    // if (tokens[6] !== "-") {
    //   if(!isNaN(parseInt(tokens[6]))) this.turnCount = parseInt(tokens[6])
    // } else {
    // }
    return true;
  }

  public load(notation: string) {
    this.reset()
    this.notation = notation.trim();
    this.validateNotation();
  }

  private validateBlocks() {
    if (
      MAX_DOMES !==
      this.destroyedDomes + this.remainingDomes + this.usedDomes
    ) {
      throw new Error(`Invalid total number of Domes in play`);
    }
    if (
      MAX_L_BLOCKS !==
      this.remainingLBlocks + this.destroyedLBlocks + this.usedLBlocks
    ) {
      throw new Error(`Invalid total number of L Blocks in play`);
    }
    if (
      MAX_M_BLOCKS !==
      this.remainingMBlocks + this.destroyedMBlocks + this.usedMBlocks
    ) {
      throw new Error(`Invalid total number of M Blocks in play`);
    }
    if (
      MAX_S_BLOCKS !==
      this.remainingSBlocks + this.destroyedSBlocks + this.usedSBlocks
    ) {
      throw new Error(`Invalid total number of S Blocks in play`);
    }
  }

  private validateTile(tile: string, row: number) {
    let sum = 0;

    for (let i = 0; i < tile.length; i++) {
      const num = parseInt(tile[i]);
      if (isNaN(num)) {
        //Check for workers, blocks and domes
        if (
          !WORKERS.includes(tile[i]) &&
          !BLOCKS.includes(tile[i]) &&
          !DOMES.includes(tile[i])
        ) {
          throw new Error(`Invalid notation on Tiles field: ${tile[i]}`);
        }
        const ind = sum + row * 5;
        switch (tile[i]) {
          case "L":
            this.usedLBlocks++;
            this.tileData[ind] = {buildings: "L" as Block};
            break;
          case "M":
            this.usedMBlocks++;
            this.usedLBlocks++;
            this.tileData[ind] = {buildings: "M" as Block};
            break;
          case "S":
            this.usedSBlocks++;
            this.usedMBlocks++;
            this.usedLBlocks++;
            this.tileData[ind] = {buildings: "S" as Block};
            break;
          case "D":
            this.usedDomes++;
            this.usedLBlocks++;
            this.usedMBlocks++;
            this.usedSBlocks++;
            this.tileData[ind] = {buildings: "D" as Block};          
            break;
          case "F":
            this.usedDomes++;
            this.usedLBlocks++;
            this.tileData[ind] = {buildings: "F" as Block};
            break;
          case "G":
            this.usedDomes++;
            this.usedLBlocks;
            this.usedMBlocks;
            this.tileData[ind] = {buildings: "G" as Block};
            break;
          case "H":
            this.usedDomes++;
            
            this.tileData[ind] = {buildings: "H" as Block}  ;          
            break;
          case "X":
          case "x":
          case "Y":
          case "y":
          case "Z":
          case "z":
            this.tileData[ind] = {worker: tile[i] as Worker};            
            try {
              
              this.workerPositions.push(TILES[ind] as Tile);
              this.workerPositionsMap.set(
                tile[i] as Worker,
                TILES[ind] as Tile,
              );             
              
            } catch (err) {
              // console.log("Error saving working positions", err.message)
              throw new Error(`Invalid notation on Tile field ${tile}`);
            }
            break;
          default:
            console.log("Tile validation switch default case reached");
        }
        sum++;
      } else {
        sum += num;
      }
      
    }
    if (sum !== 5) throw new Error(`Invalid notation on Tiles field: ${tile}`);
  }

  private setPlayerPowers(identifiers: string[]) {
    if(identifiers.length !== this.playerCount){
      throw new Error("All players must choose a god power")
    }
    this.playerPowers = [];
    const athena = new Athena()
    const athenaRestriction = athena.getRestriction()
    identifiers.forEach(id => {
      if(GODIDENTIFIERS.includes(id as GodIdentifier)){
        switch (id){
          case "-":
            this.playerPowers.push(new Mortal())
            break;
          case "I":
            this.playerPowers.push(new Apollo())
            break;
          case "II":            
            this.playerPowers.push( new Artemis())
            break;
          case "III":                    
            this.playerPowers.push( athena)
            this.restrictions.push(athenaRestriction)
            break;
          case "IV":            
            this.playerPowers.push( new Atlas())
            break;
          case "V":            
            this.playerPowers.push( new Demeter())
            break;
          case "VI":            
            this.playerPowers.push( new Hephaestus())
            break;
          case "VII":            
            this.playerPowers.push( new Hermes())
            break;
          case "VIII":            
            this.playerPowers.push( new Minotaur())
            break;          
          case "IX":
            this.playerPowers.push(new Pan())
            break;
          case "X":
            this.playerPowers.push( new Prometheus())
            break;
          case "XII":
            this.playerPowers.push( new Ares())
            break;
          case "XVI":
            this.playerPowers.push( new Chronus())
            this.isChronusInPlay = true;
            break;
          case "XXX":
            this.playerPowers.push(new Zeus())
            break;
        }
      }
      else throw new Error("Unknown or unsupported god power selected")
    })

  }

  private isTurnPossible():boolean {
    let result = false
    const workers = [this.playerTurn as Worker, this.playerTurn.toLowerCase() as Worker]

    workers.forEach(worker => {
      const workerTileIndex:number = this.tileData.findIndex(data => {
        return data.worker?.toString() === worker.toString();
      })
      if(workerTileIndex !== -1){
        const adjacentTiles = TILE_ADJACENCY[workerTileIndex]
        const fromBlockLevel = this.tileData[workerTileIndex].buildings ? 
          this.tileData[workerTileIndex].buildings as Building: "E" as Building
      
        adjacentTiles.forEach(adjTile => {         
          if(this.tileData[adjTile].worker === undefined){
            const toBlockLevel = this.tileData[adjTile].buildings ?
            this.tileData[adjTile].buildings as Building : "E" as Building
            if(VALID_MOVEMENTS.get(fromBlockLevel)?.includes(toBlockLevel)){
              //can worker build?
              const adjTileForBuilding = [...TILE_ADJACENCY[adjTile]]
              adjTileForBuilding.forEach(adtb => {
                if(this.tileData[adtb].worker === undefined && this.tileData[adtb].buildings !== "D"){                  
                  result = true;
                }
              })
            }
          }                 
        })
      }     
    })   
    return result;
  }
}

export default Santorini;
