import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BoardState, Build, Move, Tile, TileDataUpdator, TILES, WorkerPostion } from "../types/Types"

const initialState = {
    moveIndicator: {
        tiles: [],
        worker: undefined,        
    },
    previousMoveIndicator: {
        tiles: [],
        worker: undefined,        
    },
    tileData: [],
    workerPositions: [],
    workerSelected: undefined,
    canBuild: false,   
    previousTileData: [],
    previousWorkerPositions: [], 
    turnCount: 1,
    playerTurn: "X",
    playerCount: 2,
    workerCount: 1,
    currentBuilds: [],
    currentMoves: [],
} as BoardState

const boardState = createSlice({
    name: 'boardState',
    initialState,
    reducers: {
        setIndicators(state, action){
            state.moveIndicator.tiles = action.payload
        },
        clearIndicators(state){
            state.moveIndicator.tiles = [];
            state.moveIndicator.worker = undefined;    
        },
        setPlayer(state, action){
            state.moveIndicator.worker = action.payload
        },
        setTileData(state, action){
            state.tileData = [...action.payload]
            state.previousTileData = [...action.payload]
        },
        updateTileData(state, action:PayloadAction<TileDataUpdator>){
            state.tileData[action.payload.index] = action.payload.data
        },
        setWorkerPositions(state, action){
            state.workerPositions = action.payload
            state.previousWorkerPositions = action.payload
        },
        addWorkerPosition(state, action:PayloadAction<WorkerPostion>){
            state.workerPositions = [...state.workerPositions, action.payload]
            state.moveIndicator.tiles = state.moveIndicator.tiles.filter(tile => tile !== action.payload.tile)
            state.tileData[TILES.indexOf(action.payload.tile as string)].worker = action.payload.worker
        },

        setWorkerPosition(state, action:PayloadAction<WorkerPostion>){
            let previousTile 
            state.workerPositions.filter((workerPos) => {
                if(workerPos.worker === action.payload.worker){
                    workerPos.position =action.payload.position
                    previousTile = workerPos.tile
                    workerPos.tile = action.payload.tile
                }                    
            })
            state.tileData[TILES.indexOf(action.payload.tile as string)].worker = action.payload.worker
            if(previousTile) state.tileData[TILES.indexOf(previousTile)].worker = undefined
        },
        setWorkerSelected(state, action){
            state.workerSelected = action.payload
        },
        clearWorkerSelected(state){
            state.workerSelected = undefined
        },
        setCanBuild(state, action){
            state.canBuild = action.payload
        },
        setPreviousTileData(state, action){
            state.previousTileData = action.payload
        },
        setTurnCount(state, action){
            state.turnCount = action.payload
        },
        setPlayerTurn(state, action){
            state.playerTurn = action.payload
        },
        setBoardState(state, action){
            state.tileData = action.payload.tileData
            state.previousTileData = action.payload.tileData
            state.workerPositions = action.payload.workerPositions
            state.previousWorkerPositions = action.payload.workerPositions
            state.playerTurn = action.payload.playerTurn
            state.turnCount = action.payload.turnCount
            state.playerCount = action.payload.playerCount

            //Adjust parameters
            if(state.workerPositions.length > 4){
                if(state.playerCount === 2) state.playerCount = 3
                if(state.turnCount <= 2) state.turnCount = 3
            }
            else if(state.workerPositions.length > 2){
                if(state.turnCount === 1) state.turnCount = 2
            }

            //set indicators for placement phase
            if(state.turnCount === 1 || state.turnCount === 2 || (state.playerCount === 3 && state.turnCount ===3)){
                state.canBuild = false;
                state.tileData.forEach((tile, index) => {
                    if(!tile.worker) state.moveIndicator.tiles=[...state.moveIndicator.tiles,(TILES[index] as Tile)]
                })
                state.workerPositions.forEach(workPos => {
                    state.moveIndicator.tiles = state.moveIndicator.tiles.filter(tile => tile !== workPos.tile)
                })

            }else{
                state.moveIndicator.tiles = []                
            }
            state.previousMoveIndicator.tiles = [...state.moveIndicator.tiles]
        },
        incrementWorkerCount(state){
            state.workerCount = state.workerCount + 1
        },
        undoTurn(state){
            state.tileData = [...state.previousTileData]
            state.workerPositions = [...state.previousWorkerPositions]
            state.moveIndicator.tiles = [...state.previousMoveIndicator.tiles]
            state.workerCount = state.workerPositions.length + 1
            state.currentBuilds = []
            state.currentMoves = []
            state.canBuild = false;
        },
        clearCurrentTurnData(state){
            state.currentBuilds = []
            state.currentMoves = []
            state.canBuild = false;
        },
        addCurrentMove(state, action:PayloadAction<Move>){
            state.currentMoves = [...state.currentMoves, action.payload]
        },
        addCurrentBuild(state, action:PayloadAction<Build>){
            state.currentBuilds = [...state.currentBuilds, action.payload]
        }

    }
})

export const { clearIndicators, setIndicators, setPlayer, setTileData, setWorkerPosition, 
    setWorkerPositions, setWorkerSelected, clearWorkerSelected, setCanBuild, updateTileData,
    setPlayerTurn, setTurnCount, setBoardState, addWorkerPosition, incrementWorkerCount, 
    undoTurn, addCurrentBuild, addCurrentMove, clearCurrentTurnData } = boardState.actions;
export default boardState.reducer;