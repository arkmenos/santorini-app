
export type Block = 'L' | 'M' | 'S' | 'E';
export type Dome = 'D' | 'F' | 'G' | 'H';
export type Player = 'X' | 'Y' | 'Z' ;
export type Worker = 'X' | 'x' | 'Y' | 'y' | 'Z' | 'z';
export type GodIdentifier = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'X'
    | 'XI' | 'XII' | 'XIII' | 'XIV' | 'XV' | 'XVI' | 'XVII' | 'XVIII' | 'XIX' | 'XX'
    | 'XXI' | 'XXII' | 'XXIII' | 'XXIV' | 'XXV' | 'XXVI' | 'XXVII' | 'XXVIII' | 'XXIX' | 'XXX';
export type GodToken = 'W' | 'P' | 'p' | 'C' | 'T' | 'E' | 'e' | 'R' | 'S' | 'A' | 'O';
export type Tile = 'a5'|'b5'|'c5'| 'd5'| 'e5'|'a4'|'b4'|'c4'| 'd4'| 'e4'|'a3'|'b3'|'c3'| 'd3'| 'e3'|'a2'|'b2'|'c2'| 'd2'| 'e2'|'a1'|'b1'|'c1'| 'd1'| 'e1';

export const TILES = ['a5','b5','c5', 'd5', 'e5','a4','b4','c4', 'd4', 'e4','a3','b3','c3', 'd3', 'e3','a2','b2','c2', 'd2', 'e2','a1','b1','c1', 'd1', 'e1']
export const PERIMETER_TILES = ['a5', 'b5','c5', 'd5', 'e5', 'a4', 'a3','a2', 'a1', 'b1', 'c1', 'd1', 'e1', 'e2', 'e3', 'e4']

export const START = "5/5/5/5/5 X - - L22/M18/S14/D18 - - 1";
export const BLOCKS = ['L', 'M', 'S'];
export const DOMES = ['D', 'F', 'G', 'H'];
export const PLAYERS: Player[] = ['X', 'Y', 'Z'];
export const WORKERS = ['X' , 'x' , 'Y' , 'y' , 'Z' , 'z'];
export const GODS = ['I' , 'II' , 'III' , 'IV' , 'V' , 'VI' , 'VII' , 'VIII' , 'IX' , 'X'];
export const GODTOKENS = ['W' , 'P' , 'p' , 'C' , 'T', 'G', 'g'  , 'R' , 'S' , 'A' , 'O'];
export const GODIDENTIFIERS = ['I' , 'II' , 'III' , 'IV' , 'V' , 'VI' , 'VII' , 'VIII' , 'IX' , 'X'
    , 'XI' , 'XII' , 'XIII' , 'XIV' , 'XV' , 'XVI' , 'XVII' , 'XVIII' , 'XIX' , 'XX'
    , 'XXI' , 'XXII' , 'XXIII' , 'XXIV' , 'XXV' , 'XXVI' , 'XXVII' , 'XXVIII' , 'XXIX' , 'XXX', '-'];
export const TWOPLAYERONLY = ['XI', 'XVI', 'XVII'];
export const UNAVAILABLE_POWERS = ['XIV', 'XXV'];
export const AVAILABLE_POWERS = ['IX', 'XVI'];
export const SIMPLE_GOD_POWERS:GodIdentifier[] = ['I' , 'II' , 'III' , 'IV' , 'V' , 'VI' , 'VII' , 'VIII' , 'IX' , 'X']

export const MAX_L_BLOCKS = 22;
export const MAX_M_BLOCKS = 18;
export const MAX_S_BLOCKS = 14;
export const MAX_DOMES = 18;

export const L_BLOCK_LENGTH = 1;
export const L_BLOCK_Y_POS = 0.625;
export const L_BLOCK_WIDTH = 1;
export const M_BLOCK_LENGTH = 1;
export const M_BLOCK_Y_POS = 1.125;
export const M_BLOCK_WIDTH = 1;
export const S_BLOCK_LENGTH = 1;
export const S_BLOCK_Y_POS = 1.555;
export const S_BLOCK_WIDTH = 1;
export const DOME_LENGTH = 1;
export const DOME_Y_POS = 1.725;
export const DOME_Y_POS_GROUND = 0.37;
export const DOME_Y_POS_FIRST = 0.8750;
export const DOME_Y_POS_SECOND = 1.375;
export const DOME_WIDTH = 1;
export const PLAYER_POS_GROUND = 0.37;
export const PLAYER_POS_FIRST_LEVEL = 0.8750;
export const PLAYER_POS_SECOND_LEVEL = 1.375;
export const PLAYER_POS_THIRD_LEVEL = 1.725;

export type Building = Block | Dome;

export type TileData = {
    buildings?: Building,
    worker?: Worker | undefined,
    godToken?: GodToken | undefined,
}
export type TileDataUpdator ={
    index:number,
    data : TileData
}
export type Move = {
    from: Tile | undefined,
    to:  Tile,
    worker: Worker
}

export type Build = {
    building: Building,
    tile: Tile 
}
export type Turn = {
    gameActions: GameAction[]
}

export type GameAction = Move | Build

export type GamePlayer = Player | 'S'

export interface PlayerInfo {
    name: string,
    roomId: string,
    type?: GamePlayer,
    identifier: GodIdentifier | null;
}

export interface GameProp{
    playerInfo:PlayerInfo,
    opponents: PlayerInfo[],
}

export type PlayMode =  "No Powers" | "Pick Powers" | "Random Powers";
export const PLAY_MODES = ["No Powers", "Pick Powers", "Random Powers"]

export type GameStartPhase = "CreateRoom" | "JoinRoom" | "WaitingRoom" | "PickPowers" | "StartGame";

export const TILE_ADJACENCY: number[][] = new Array<number[]>();
TILE_ADJACENCY[0] = [1,5,6];
TILE_ADJACENCY[1] = [0,2,5,6,7];
TILE_ADJACENCY[2] = [1,3,6,7,8];
TILE_ADJACENCY[3] = [2,4,7,8,9];
TILE_ADJACENCY[4] = [3,8,9];
TILE_ADJACENCY[5] = [0,1,6,10,11];
TILE_ADJACENCY[6] = [0,1,2,5,7,10,11,12];
TILE_ADJACENCY[7] = [1,2,3,6,8,11,12,13];
TILE_ADJACENCY[8] = [2,3,4,7,9,12,13,14];
TILE_ADJACENCY[9] = [3,4,8,13,14];
TILE_ADJACENCY[10] = [5,6,11,15,16];
TILE_ADJACENCY[11] = [5,6,7,10,12,15,16,17];
TILE_ADJACENCY[12] = [6,7,8,11,13,16,17,18];
TILE_ADJACENCY[13] = [7,8,9,12,14,17,18,19];
TILE_ADJACENCY[14] = [8,9,13,18,19];
TILE_ADJACENCY[15] = [10,11,16,20,21];
TILE_ADJACENCY[16] = [10,11,12,15,17,20,21,22];
TILE_ADJACENCY[17] = [11,12,13,16,18,21,22,23];
TILE_ADJACENCY[18] = [12,13,14,17,19,22,23,24];
TILE_ADJACENCY[19] = [13,14,18,23,24];
TILE_ADJACENCY[20] = [15,16,21];
TILE_ADJACENCY[21] = [15,16,17,20,22];
TILE_ADJACENCY[22] = [16,17,18,21,23];
TILE_ADJACENCY[23] = [17,18,19,22,24];
TILE_ADJACENCY[24] = [18,19,23];

export const VALID_MOVEMENTS: Map<Building,Building[]> = new Map();
const tileE: Block = "E";
const tileL: Block = "L";
const tileM: Block = "M";
const tileS: Block = "S";
VALID_MOVEMENTS.set(tileE,[tileE, tileL]);
VALID_MOVEMENTS.set(tileL, [tileE, tileL, tileM])
VALID_MOVEMENTS.set(tileM, [tileE, tileL, tileM, tileS])
VALID_MOVEMENTS.set(tileS, [tileE, tileL, tileM, tileS])

export const VALID_BUILDS: Map<Building,Building> = new Map();
const domeD:Dome = "D";
VALID_BUILDS.set(tileE, tileL)
VALID_BUILDS.set(tileL, tileM)
VALID_BUILDS.set(tileM, tileS)
VALID_BUILDS.set(tileS, domeD)

export const ATLAS_VALID_BUILDS: Map<Building,Building[]> = new Map();
const domeL:Dome = "F";
const domeM:Dome = "G";
const domeE:Dome = "H";
ATLAS_VALID_BUILDS.set(tileE, [tileL, domeE]);
ATLAS_VALID_BUILDS.set(tileL, [tileM, domeL]);
ATLAS_VALID_BUILDS.set(tileM, [tileS, domeM]);
ATLAS_VALID_BUILDS.set(tileS, [domeD])

export  const POSITIONS: number[][] = new Array<number[]>();
let x = 0;
let z = 2;

for(let row = 4; row >= 0; row--){
    x = 2;        
    for(let col = 4; col >= 0; col--){
        const position = [x-col,0.25,z-row]    
        POSITIONS.push(position)
    }
    z=2
}

export type BoardState = {
    // moveIndicator: {tiles: Tile[], worker: Worker | undefined},
    // previousMoveIndicator: {tiles: Tile[], worker: Worker | undefined},
    tileData: TileData[],
    workerPositions: WorkerPostion[],
    workerSelected: Worker | undefined,
    canBuild: boolean,
    previousTileData: TileData[],
    previousWorkerPositions: WorkerPostion[],
    turnCount: number,
    playerTurn: Player,
    playerCount: number,
    workerCount: number,
    currentGameActions: GameAction[],
    playerPowers:GodIdentifier[],
    // canUseAtlasPower: boolean,
    canPlaceBlock: boolean,
    moveWorkers: WorkerPostion[],
}

export type MoveIndicators = {
    tiles: Tile[],
    // worker: Worker | undefined
}

export type WorkerPostion = {
    worker?: Worker,
    position?: number[],
    tile?: Tile
}
export type BoardData = {
    workerSelected?: Worker | undefined;
    turnCount?: number,
    gameState?: string,
    playerTurn?: Player,
    numberOfPlayers?: number,
    tileData?: TileData[],
    workerPositions: WorkerPostion[],
    moveIndicatorTiles?: Tile[]
    unusedLBlocks?: number,
    unusedMBlocks?: number,
    unusedSBlocks?: number,
    unusedDomes?: number,
    
}

export interface BlockProp {
    position:[x:number, y:number,z:number],
    size?:[width:number, height:number,depth:number],
    color?: string
}

export type GodCardInfo = {
    name: string;
    description: string ;
    flavorText: string;
    identifier: GodIdentifier | null; 
}
export interface PopUpProp {
    index: string,
    selectedIndex: string,
    setSelectedIndex:(arg0:string) => void
}

