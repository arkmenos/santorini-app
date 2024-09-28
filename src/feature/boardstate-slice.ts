import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BoardState, GameAction, GodIdentifier, TileDataUpdator, TILES, WorkerPostion } from "../types/Types"

const initialState = {
    // moveIndicator: {
    //     tiles: [],
    //     worker: undefined,        
    // },
    // previousMoveIndicator: {
    //     tiles: [],
    //     worker: undefined,        
    // },
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
    currentGameActions: [],
    playerPowers: [],
    // canUseAtlasPower: false,
    canPlaceBlock: false,
    moveWorkers: []
} as BoardState

const boardState = createSlice({
    name: 'boardState',
    initialState,
    reducers: {
        // setIndicators(state, action){
        //     // Object.assign(state, action.payload)
        //     // console.log('Update moveIndicator', action.payload)
        //     // state.moveIndicator = {tiles:[...action.payload.tiles], worker:action.payload.worker}
        //     return {...state, moveIndicator: {tiles: [...action.payload.moveIndicator.tiles],
        //         worker:action.payload.moveIndicator.worker}}
        //     // console.log('updated moveIndicator in boardState', state.moveIndicator)
        // },
        // clearIndicators(state){
        //     // state.moveIndicator.tiles = [];
        //     // state.moveIndicator.worker = undefined;    
        //     state.moveWorkers = []
        // },
        // setPlayer(state, action){
        //     state.moveIndicator.worker = action.payload
        // },
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
            // state.moveIndicator.tiles = state.moveIndicator.tiles.filter(tile => tile !== action.payload.tile)
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
        // setCanUseAtlasPower(state, action){
        //     state.canUseAtlasPower = action.payload
        // },
        setCanPlaceBlock(state, action){
            state.canPlaceBlock = action.payload
        },
        setPreviousTileData(state, action){
            state.previousTileData = [...action.payload]
        },
        setTurnCount(state, action){
            state.turnCount = action.payload
        },
        setPlayerTurn(state, action){
            state.playerTurn = action.payload
        },
        setMoveWorkers(state, action){
            state.moveWorkers = [...action.payload]
        },
        setBoardState(state, action){
            state.tileData = action.payload.tileData
            state.previousTileData = action.payload.tileData
            state.workerPositions = action.payload.workerPositions
            state.previousWorkerPositions = action.payload.workerPositions
            state.playerTurn = action.payload.playerTurn
            state.turnCount = action.payload.turnCount
            state.playerCount = action.payload.playerCount
            state.playerPowers = [...action.payload.playerPowers]

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
                // state.canUseAtlasPower = false;
                state.canPlaceBlock = false;
                // state.tileData.forEach((tile, index) => {
                //     if(!tile.worker) state.moveIndicator.tiles=[...state.moveIndicator.tiles,(TILES[index] as Tile)]
                // })
                // state.workerPositions.forEach(workPos => {
                //     state.moveIndicator.tiles = state.moveIndicator.tiles.filter(tile => tile !== workPos.tile)
                // })

            }else{
                // state.moveIndicator.tiles = []    
                let power:GodIdentifier | null = null            
                if(state.playerTurn === "X") power = state.playerPowers[0]
                if(state.playerTurn === "Y") power = state.playerPowers[1]
                if(state.playerTurn === "Z") power = state.playerPowers[2]
                
                if(power === "X") {
                    state.canBuild = true;
                    state.canPlaceBlock = true;
                }
            }
            // state.previousMoveIndicator.tiles = [...state.moveIndicator.tiles]
        },
        incrementWorkerCount(state){
            state.workerCount = state.workerCount + 1
        },
        undoTurn(state){
            state.tileData = [...state.previousTileData]
            state.workerPositions = [...state.previousWorkerPositions]
            // state.moveIndicator.tiles = [...state.previousMoveIndicator.tiles]
            state.workerCount = state.workerPositions.length + 1
            state.currentGameActions = []
            state.canBuild = false;
            // state.canUseAtlasPower = false;
            state.canPlaceBlock = false;
        },
        clearCurrentTurnData(state){
            state.currentGameActions = []

            let power:GodIdentifier | null = null            
                if(state.playerTurn === "X") power = state.playerPowers[0]
                if(state.playerTurn === "Y") power = state.playerPowers[1]
                if(state.playerTurn === "Z") power = state.playerPowers[2]
                
                if(power === "X") {
                    state.canBuild = true;
                    state.canPlaceBlock = true;
                }
                else {
                    state.canBuild = false;
                    // state.canUseAtlasPower = false;
                }
        },
        addCurrentGameAction(state, action:PayloadAction<GameAction>){
            state.currentGameActions = [...state.currentGameActions, action.payload]
        },
        // addCurrentMove(state, action:PayloadAction<Move>){
        //     state.currentMoves = [...state.currentMoves, action.payload]
        // },
        // addCurrentBuild(state, action:PayloadAction<Build>){
        //     state.currentBuilds = [...state.currentBuilds, action.payload]
        // }

    }
})

export const {  setTileData, 
    setWorkerPosition, setWorkerPositions, setWorkerSelected, clearWorkerSelected, 
    setCanBuild, setCanPlaceBlock,updateTileData, setPlayerTurn, setTurnCount, 
    setBoardState, addWorkerPosition, incrementWorkerCount, undoTurn, 
    addCurrentGameAction, clearCurrentTurnData,setPreviousTileData,setMoveWorkers 
} = boardState.actions;

export default boardState.reducer;