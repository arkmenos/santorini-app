import {
  BLOCKS,
  DOMES,
  getStartTileData,
  GodIdentifier,
  Player,
  PLAYER_POS_FIRST_LEVEL,
  PLAYER_POS_GROUND,
  PLAYER_POS_SECOND_LEVEL,
  PLAYER_POS_THIRD_LEVEL,
  PLAYERS,
  POSITIONS,
  Tile,
  TILES,
  Worker,
  WorkerPostion,
  WORKERS,
} from "../../types/Types.js";

export const GenerateBoardData = (SAN: string) => {
  const tileData = getStartTileData();
  let playerTurn = ""
  let turnCount = 1;
  let playerCount = 2;
  const workerPositions:WorkerPostion[] = []
  let playerPowers:GodIdentifier[] = []
  
  
  // console.log("validate SAN")
  const tokens = SAN.trim().split(/\s+/);
  if (tokens.length !== 7 && tokens.length !== 8 && tokens.length !== 9) {
    // console.log(tokens, tokens.length)
    throw new Error("Invalid notation: must contain 7 or 8 space-delimited fields");
  }

  //set Player Powers
  if(tokens[3] !== "-"){
    const identifiers = tokens[3].split("/")
    if(identifiers.length > 0){
      playerPowers = [...identifiers as GodIdentifier[]]      
    }
  }
  //set turn count
  if(tokens[7]){
    const tempTurn = parseInt(tokens[7])
    if(!isNaN(tempTurn)){
      turnCount = tempTurn
    }
    else{
      throw new Error(`Invalid notation on Turn Field: ${tempTurn}`);
    }
  }

  //set player count
  if(tokens[8]){
    const tempPlayerCount = parseInt(tokens[8])
    if(!isNaN(tempPlayerCount)){
      playerCount = tempPlayerCount
    }
    else{
      throw new Error(`Invalid notation on Turn Field: ${tempPlayerCount}`);
    }
  }

  //set player turn
  if(PLAYERS.includes(tokens[1] as Player)){
    playerTurn = tokens[1]
  }
  else{
    throw new Error(`Invalid notation on Player turn Field: ${tokens[1]}`);
  }

  //Generate Tiles
  const tiles = tokens[0].split("/");
  if (tiles.length !== 5)
    throw new Error(`Invalid notation on Tiles Field: ${tiles}`);

  for (let row = 0; row < tiles.length; row++) {
    let sum = 0;

    const tile = tiles[row];
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
        const index = sum + row * 5;
        switch (tile[i]) {
          case "L":
            tileData[index] = {
              buildings: "L",
              godToken: undefined,
              worker: undefined,
            };

            break;
          case "M":
            tileData[index] = {
              buildings: "M",
              godToken: undefined,
              worker: undefined,
            };

            break;
          case "S":
            tileData[index] = {
              buildings: "S",
              godToken: undefined,
              worker: undefined,
            };

            break;
          case "D":
            tileData[index] = {
              buildings: "D",
              godToken: undefined,
              worker: undefined,
            };

            break;
          case "F":
            // tileBlocks[index] =[]
            // tileBlocks[index].push (<Large position={[POSITIONS[index][0],L_BLOCK_Y_POS,POSITIONS[index][2]]} />)
            // tileBlocks[index].push (<Dome position={[POSITIONS[index][0],DOME_HEIGHT_Y_POS,POSITIONS[index][2]]} />)
            // tileData[index] = {buildings: 'F', godToken: undefined, worker: undefined}

            break;
          case "G":
            // tileBlocks[index] =[]
            // tileBlocks[index].push (<Large position={[POSITIONS[index][0],L_BLOCK_Y_POS,POSITIONS[index][2]]} />)
            // tileBlocks[index].push (<Medium position={[POSITIONS[index][0],M_BLOCK_Y_POS,POSITIONS[index][2]]} />)
            // tileBlocks[index].push (<Dome position={[POSITIONS[index][0],DOME_HEIGHT_Y_POS,POSITIONS[index][2]]} />)
            // tileData[index] = {buildings: 'G', godToken: undefined, worker: undefined}

            break;
          case "H":
             // tileBlocks[index] =[]
            // tileBlocks[index].push (<Dome position={[POSITIONS[index][0],DOME_HEIGHT_Y_POS,POSITIONS[index][2]]} />)
            // tileData[index] = {buildings: 'H', godToken: undefined, worker: undefined}

            break;
          case "X":
          case "x":
          case "Y":
          case "y":
          case "Z":
          case "z":
          case "V":
          case "v":
            tileData[index].worker = tile[i] as Worker

            break;
          default:
            console.log("Tile validation switch default case reached");
        }
        sum++;
      } else {
        sum += num;
      }
    }
    // console.log("sum",sum)
    if (sum !== 5) throw new Error(`Invalid notation on Tiles field: ${tile}`);
  }
  // console.log("tileBlocks", tileBlocks);

  //Generate workers
  const workerTokens = tokens[2].split("/");
  // console.log("workerTokens", workerTokens);
  if(workerTokens[0] !== "-" ){ 
    workerTokens.forEach((workerToken) => {
      const tempWorker = workerToken[0];
      const tempTile = workerToken.substring(1)
      const index = TILES.indexOf(tempTile)
      const player_position = [...POSITIONS[index]];
      if(index === -1) throw new Error(`Invalid notation on Worker field: ${workerToken}`)
      if(tileData[index].buildings){
          // console.log("tileBlocks index", index, tileData)
          if(tileData[index].buildings === "L"){
            player_position[1] = PLAYER_POS_FIRST_LEVEL
          }else if(tileData[index].buildings === "M"){
            player_position[1] = PLAYER_POS_SECOND_LEVEL
          }else if(tileData[index].buildings === "S"){
            player_position[1] = PLAYER_POS_THIRD_LEVEL
          }else if(tileData[index].buildings === "E"){
            player_position[1] = PLAYER_POS_GROUND
          }            
      }
      else{
          player_position[1] = PLAYER_POS_GROUND;
      }
        
      if(!tileData[index]) tileData[index] = {}
      if (!WORKERS.includes(tempWorker))
        throw new Error(`Invalid notation on Worker Field: ${workerToken}`);
      tileData[TILES.indexOf(tempTile)].worker = tempWorker as Worker
      
      const tempWorkerAsWorker: Worker = tempWorker as Worker
      workerPositions.push({worker:tempWorkerAsWorker, position:player_position, tile:tempTile as Tile})

    });
  }

  // console.log("workers", workers);

  return { tileData, workerPositions, turnCount, playerTurn, playerCount, playerPowers};
};
