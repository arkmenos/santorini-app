import { v4 as uuidv4 } from "uuid";
import { Building, L_BLOCK_Y_POS, M_BLOCK_Y_POS, 
    Move, 
    PlayerInfo, 
    POSITIONS, RemoveWorker, S_BLOCK_Y_POS, Tile, TILES, Worker, WorkerPostion } from "../../types/Types"
import { getWorkerYPositionIndicator } from "../../Utility/Utility";
import MoveIndicator from "../indicators/MoveIndicator"
import { addCurrentGameAction, addWorkerPosition, clearWorkerSelected, incrementWorkerCount, removeWorker, setCanBuild, setWorkerPosition } from "../../feature/boardstate-slice"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ThreeEvent } from "@react-three/fiber";
import { Message, useToaster } from "rsuite";
import { getNextTileInSameDirection } from "../../Utility/Utility";

interface IndicatorProp{
    isTurn:boolean,
    player:PlayerInfo,
    moveIndicators:Tile[],
    moveWorkerIndicators: WorkerPostion[],
    selectedWorker: Worker | null,
    setMoveIndicators: (mIndicators:Tile[]) => void,
    setMoveWorkerIndicators:(workerPositions:WorkerPostion[]) =>void,
    setSelectedWorker:(worker:Worker|null) =>void,
}
function MoveIndicatorOnBoard ({isTurn, player, moveIndicators, moveWorkerIndicators,
    selectedWorker, setMoveIndicators, setMoveWorkerIndicators, setSelectedWorker}:IndicatorProp){
    const toaster = useToaster()
        
    const tileData = useAppSelector((state) => state.boardState.tileData) 
    // const workerSelected = useAppSelector((state) => state.boardState.workerSelected)
    const workerPositions = useAppSelector((state) => state.boardState.workerPositions)
    // const moveIndicator = useAppSelector((state) => state.boardState.moveIndicator)
    // const mIndicators = useAppSelector((state) => state.moveIndicator)
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
            switch (selectedWorker){
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
        if(!isTurn) {
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
            if(tileData[TILES.indexOf(tile)].worker) return;
            if(workerCount === 1) {
                workerPos.worker = "X" as Worker 
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentGameAction(({from: undefined, to: tile, worker:workerPos.worker}) as Move))
            }           
            else if(workerCount === 2){
                workerPos.worker = "x" as Worker
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentGameAction(({from: undefined, to: tile, worker:workerPos.worker}) as Move))
            } 
            
            return;
        }else if(turnCount === 2){
            if(tileData[TILES.indexOf(tile)].worker) return;
            if(workerCount === 1){
                workerPos.worker = "Y" as Worker            
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentGameAction(({from: undefined, to: tile, worker:workerPos.worker}) as Move))
            } 
            else if(workerCount === 2) {
                workerPos.worker = "y" as Worker
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentGameAction(({from: undefined, to: tile, worker:workerPos.worker}) as Move))
            }
            return;
        }else if(turnCount === 3 && playerCount === 3){
            if(tileData[TILES.indexOf(tile)].worker) return;
            if(workerCount === 1) {
                workerPos.worker = "Z" as Worker   
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentGameAction(({from: undefined, to: tile, worker:workerPos.worker}) as Move))         
            }
            else if(workerCount === 2){
                workerPos.worker = "z" as Worker
                dispatch(incrementWorkerCount())
                dispatch(addWorkerPosition(workerPos))
                dispatch(addCurrentGameAction(({from: undefined, to: tile, worker:workerPos.worker}) as Move))
            } 
            
            return;
        }
           
        //worker movements
        const selectedWorkerPos = workerPositions.find(w => { return w.worker === selectedWorker});
        
        if(selectedWorkerPos){
            // console.log("update player position", pos, moveIndicator, position)
            const previousPos = JSON.parse(JSON.stringify(selectedWorkerPos))
            const newPos = [...position]
            const toTileBlock = tileData[TILES.indexOf(tile)].buildings
            if(toTileBlock) newPos[1] = getWorkerYPositionIndicator(toTileBlock)
            if(selectedWorkerPos.worker) dispatch(addCurrentGameAction((
                {from: previousPos.tile, to: tile, worker:selectedWorkerPos.worker}) as Move))
            dispatch(setWorkerPosition({worker:selectedWorkerPos.worker, position:newPos, tile: tile}))

            const workerBeingSwapped = moveWorkerIndicators.find (w => {return w.tile === tile})           
            if(player.identifier === "I" && workerBeingSwapped){
                //Atlas worker swap
                console.log("Can Swap")
                dispatch(addCurrentGameAction((
                    {from: workerBeingSwapped.tile, to: selectedWorkerPos.tile, worker:workerBeingSwapped.worker}) as Move))
                dispatch(setWorkerPosition({worker:workerBeingSwapped.worker, position:selectedWorkerPos.position, 
                    tile: selectedWorkerPos.tile}))
            }
            else if(player.identifier === "VIII" && workerBeingSwapped){
                //Minotaur push
                const pushDestinationTile = getNextTileInSameDirection(selectedWorkerPos.tile,
                    workerBeingSwapped.tile, tileData);
                
                if(pushDestinationTile){
                    const destPosition = [...POSITIONS[TILES.indexOf(pushDestinationTile)]]
                    const destBuilding = tileData[TILES.indexOf(pushDestinationTile)].buildings ?? "E" as Building
                    destPosition[1] = getWorkerYPositionIndicator(destBuilding)
                    dispatch(addCurrentGameAction((
                        {from: workerBeingSwapped.tile, to: pushDestinationTile, worker:workerBeingSwapped.worker}) as Move))
                    dispatch(setWorkerPosition({worker:workerBeingSwapped.worker, position:destPosition, 
                        tile: pushDestinationTile}))               
                }
            }
            else if(player.identifier === "XIII"){
                //Bia Auto Remove Player
                console.log("selectedWorker toTile", selectedWorkerPos, tile)
                const removePlayerTile = getNextTileInSameDirection(selectedWorkerPos.tile, tile, tileData)
                const workerToRemove = removePlayerTile && tileData[TILES.indexOf(removePlayerTile)].worker
                console.log("removePlayerTile workerToRemove", removePlayerTile, workerToRemove)
                if(removePlayerTile && workerToRemove && 
                    selectedWorker?.toUpperCase() !== workerToRemove.toUpperCase()){
                        dispatch(addCurrentGameAction((
                            {tile:removePlayerTile, worker:workerToRemove} as RemoveWorker)));
                        const workerPos = workerPositions.find(w => w.worker === workerToRemove )
                        workerPos && dispatch(removeWorker(workerPos))
                }
            }
            // dispatch(clearIndicators())
            setMoveIndicators([])
            setMoveWorkerIndicators([])
            setSelectedWorker(null)
            dispatch(clearWorkerSelected())
            dispatch(setCanBuild(true))
        }
       
        // e.stopPropagation()
        // console.log("BOARD DATA ", boardData)
    }

    

    return(
        <>
        {            
            moveIndicators && moveIndicators.map(tile => {
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