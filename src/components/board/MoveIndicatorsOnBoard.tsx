import { v4 as uuidv4 } from "uuid";
import { getWorkerYPositionIndicator, L_BLOCK_Y_POS, M_BLOCK_Y_POS, 
    POSITIONS, S_BLOCK_Y_POS, Tile, TILES, Worker, WorkerPostion } from "../../types/Types"
import MoveIndicator from "../indicators/MoveIndicator"
import { addCurrentMove, addWorkerPosition, clearIndicators, clearWorkerSelected, incrementWorkerCount, setCanBuild, setWorkerPosition } from "../../feature/boardstate-slice"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ThreeEvent } from "@react-three/fiber";
import { Message, useToaster } from "rsuite";

interface IndicatorProp{
    areWorkersMoveable:boolean
}
function MoveIndicatorOnBoard ({areWorkersMoveable}:IndicatorProp){
    const toaster = useToaster()
        
    const tileData = useAppSelector((state) => state.boardState.tileData) 
    const workerSelected = useAppSelector((state) => state.boardState.workerSelected)
    const workerPositions = useAppSelector((state) => state.boardState.workerPositions)
    const moveIndicator = useAppSelector((state) => state.boardState.moveIndicator)
    const playerCount = useAppSelector((state) => state.boardState.playerCount)
    const turnCount = useAppSelector((state) => state.boardState.turnCount)
    const workerCount = useAppSelector((state) => state.boardState.workerCount)
    const dispatch = useAppDispatch();

    function getColor(){
        let color = ""
        if(turnCount === 1){
            color = "red"
        }
        else if(turnCount === 2){
            color = "blue"
        }
        else if(turnCount === 3 && playerCount === 3){
            color = "yellow"
        }
        else {
            switch (workerSelected){
                case "X":
                case "x":
                    color = "red"
                    break;
                case "Y":
                case "y":
                    color = "blue"
                    break;
                case "Z":
                case "z":
                    color = "yellow"
                    break;
            }
        }      
        return color;
    }   

    function handleClick(e: ThreeEvent<MouseEvent>, position: number[], tile: Tile){
        e.stopPropagation()
        // console.log("Clicked on a move indicator", areWorkersMoveable)
        if(!areWorkersMoveable) {
            // console.log("Not your turn")
            toaster.push(<Message>Not your turn</Message>, {placement: 'topCenter', duration:2500})
             return
        }
        // worker placements
        const newPos = [...position]
        newPos[1] = getWorkerYPositionIndicator("E")
        const workerPos: WorkerPostion = {position: newPos, tile: tile }
        // console.log("workerCount ", workerCount)
        if(turnCount === 1){
            if(workerCount === 1) {
                workerPos.worker = "X" as Worker 
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentMove({from: undefined, to: tile, worker:workerPos.worker}))
            }           
            else if(workerCount === 2){
                workerPos.worker = "x" as Worker
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentMove({from: undefined, to: tile, worker:workerPos.worker}))
            } 
            
            return;
        }else if(turnCount === 2){
            if(workerCount === 1){
                workerPos.worker = "Y" as Worker            
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentMove({from: undefined, to: tile, worker:workerPos.worker}))
            } 
            else if(workerCount === 2) {
                workerPos.worker = "y" as Worker
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentMove({from: undefined, to: tile, worker:workerPos.worker}))
            }
            return;
        }else if(turnCount === 3 && playerCount === 3){
            if(workerCount === 1) {
                workerPos.worker = "Z" as Worker   
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentMove({from: undefined, to: tile, worker:workerPos.worker}))         
            }
            else if(workerCount === 2){
                workerPos.worker = "z" as Worker
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentMove({from: undefined, to: tile, worker:workerPos.worker}))
            } 
            
            return;
        }
           
        //worker movements
        workerPositions.forEach(pos => {
            if(pos.worker === moveIndicator.worker){
                // console.log("update player position", pos, moveIndicator, position)
                const previousPos = JSON.parse(JSON.stringify(pos))
                const newPos = [...position]
                const toTileBlock = tileData[TILES.indexOf(tile)].buildings
                if(toTileBlock) newPos[1] = getWorkerYPositionIndicator(toTileBlock)
                if(pos.worker) dispatch(addCurrentMove({from: previousPos.tile, to: tile, worker:pos.worker}))
                dispatch(setWorkerPosition({worker:pos.worker, position:newPos, tile: tile}))
                dispatch(clearIndicators())
                dispatch(clearWorkerSelected())
                dispatch(setCanBuild(true))
            }
        })
        // e.stopPropagation()
        // console.log("BOARD DATA ", boardData)
    }


    return(
        <>
        {            
            moveIndicator && moveIndicator.tiles.map(tile => {
                const pos = POSITIONS[TILES.indexOf(tile)]
                const block = tileData[TILES.indexOf(tile)].buildings
                let  blockLevel = 0
                // console.log("construct indicator on  block ", block, tile, pos)
                switch(block){
                    case "L":
                        blockLevel = L_BLOCK_Y_POS + 0.3
                        break;
                    case "M":
                        blockLevel = M_BLOCK_Y_POS + 0.3
                        break;
                    case "S":
                        blockLevel = S_BLOCK_Y_POS + 0.235
                        break;
                    case "E":
                        blockLevel = L_BLOCK_Y_POS - 0.24
                        break;
                    default:
                        break;
                }
                const position = [pos[0],blockLevel,pos[2]]
                // console.log("position of indicator: ", position)
            
                return <MoveIndicator position={position} key={uuidv4()} tile={tile} 
                    onClick={(e: ThreeEvent<MouseEvent>)=>handleClick(e,position, tile)} color={getColor()} />
            })

        }
        </>
    )
}

export default MoveIndicatorOnBoard