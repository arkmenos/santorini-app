import { v4 as uuidv4 } from "uuid";
import { FemaleBlue } from "../worker/FemaleBlue.js";
import { MaleBlue } from "../worker/MaleBlue.js";
import { FemaleRed } from "../worker/FemaleRed.js";
import { MaleRed } from "../worker/MaleRed.js";
import { FemaleYellow } from "../worker/FemaleYellow.js";
import { MaleYellow } from "../worker/MaleYellow.js";
import { Building, Move, PlayerInfo, POSITIONS, Tile, TILE_ADJACENCY, TILES, VALID_MOVEMENTS, Worker, WorkerPostion } from "../../types/Types.js";
import { getWorkerYPositionIndicator } from "../../Utility/Utility.js";
import { addCurrentGameAction, setCanBuild,  setWorkerPosition } from "../../feature/boardstate-slice.js";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { Message, useToaster } from "rsuite";
import { ThreeEvent } from "@react-three/fiber";
import { getMinotaurPushDestinationTile } from "../../Utility/Utility.js";

interface WorkersProp {
    areWorkersMoveable:boolean,
    player:PlayerInfo,
    moveIndicators:Tile[],
    moveWorkerIndicators: WorkerPostion[],
    selectedWorker: Worker | null,
    setMoveIndicators: (mIndicators:Tile[]) => void,
    setMoveWorkerIndicators:(workerPositions:WorkerPostion[]) =>void,
    setSelectedWorker:(worker:Worker|null) =>void,
}

const WorkersOnBoard = ({areWorkersMoveable, player, moveIndicators,moveWorkerIndicators, 
    selectedWorker, setMoveIndicators, setMoveWorkerIndicators, setSelectedWorker}:WorkersProp) => {
    
    const toaster = useToaster()
    const workerPositions = useAppSelector((state) => state.boardState.workerPositions)
    const turnCount = useAppSelector((state) => state.boardState.turnCount)
    const playerCount = useAppSelector((state) => state.boardState.playerCount)
    const tileData = useAppSelector((state) => state.boardState.tileData)
    // const moveIndicators = useAppSelector((state) => state.boardState.moveIndicator)
    // const mIndicators  = useAppSelector((state) => state.moveIndicator)
    // const moveWorkers = useAppSelector((state) => state.boardState.moveWorkers)
    // const workerSelected = useAppSelector((state) => state.boardState.workerSelected)
    // const state = useAppSelector((state)=>state.boardState)
    const dispatch = useAppDispatch();
    let allWorkers
    let positions
    
    [allWorkers, positions]= useMemo(() => {
        const workers:JSX.Element[] = []
        const positions: number[][] = []
        workerPositions.forEach(workerPos => {
            if(!workerPos.position) return
            positions.push(workerPos.position)
            switch(workerPos.worker){
                case "X":
                    workers.push(<FemaleRed position={workerPos.position} key={uuidv4()} 
                    workerPosition={workerPos} onClick={(e: ThreeEvent<MouseEvent>) => handleClick(e,workerPos)} />)
                    break;
                case "x":
                    workers.push(<MaleRed position={workerPos.position} key={uuidv4()}
                    workerPosition={workerPos} onClick={(e: ThreeEvent<MouseEvent>) => handleClick(e,workerPos)} />)
                    break;
                case "Y":
                    workers.push(<FemaleBlue position={workerPos.position} key={uuidv4()}
                    workerPosition={workerPos} onClick={(e: ThreeEvent<MouseEvent>) => handleClick(e,workerPos)} />)
                    break;
                case "y":
                    workers.push(<MaleBlue position={workerPos.position} key={uuidv4()}
                    workerPosition={workerPos} onClick={(e: ThreeEvent<MouseEvent>) => handleClick(e,workerPos)} />)
                    break;
                case "Z":
                    workers.push(<FemaleYellow position={workerPos.position} key={uuidv4()}
                    workerPosition={workerPos} onClick={(e: ThreeEvent<MouseEvent>) => handleClick(e,workerPos)} />)
                    break;
                case "z":
                    workers.push(<MaleYellow position={workerPos.position} key={uuidv4()}
                    workerPosition={workerPos} onClick={(e: ThreeEvent<MouseEvent>) => handleClick(e,workerPos)} />)
                    break;
            }
        })
        return [workers, positions];
    }, [allWorkers, positions, workerPositions])
    
    const handleClick = (e: ThreeEvent<MouseEvent>, workerPos: WorkerPostion) => {
        e.stopPropagation()
        if(!areWorkersMoveable) {
            // console.log("Not your turn")
            toaster.push(<Message>Not your turn</Message>, {placement: 'topCenter', duration:2500})
             return
        }
        if(areWorkersMoveable && ((turnCount > 2 && playerCount === 2) || (playerCount === 3 && turnCount > 3))){        
            if(!workerPos.tile) return

            console.log("MoveIndicator old new", moveIndicators, moveWorkerIndicators)
            const workerBeingSwapped = moveWorkerIndicators.find(w => {return w.worker === workerPos.worker})
            const selectedWorkerToSwap = workerPositions.find(w => {return w.worker === selectedWorker})
            // Apollo worker Swap
            if(player.identifier ==="I" && workerBeingSwapped && selectedWorkerToSwap){
                console.log("Can swap")
                dispatch(addCurrentGameAction(({from:selectedWorkerToSwap.tile, to:workerBeingSwapped.tile, 
                    worker:selectedWorkerToSwap.worker}) as Move))
                dispatch(addCurrentGameAction(({from:workerBeingSwapped.tile, to:selectedWorkerToSwap.tile, 
                    worker:workerPos.worker}) as Move))
                dispatch(setWorkerPosition({worker:selectedWorkerToSwap.worker, position:workerBeingSwapped.position, 
                    tile:workerPos.tile}))
                dispatch(setWorkerPosition({worker:workerBeingSwapped.worker, position:selectedWorkerToSwap.position, 
                    tile:selectedWorkerToSwap.tile}))
                setMoveIndicators([])
                setMoveWorkerIndicators([])
                setSelectedWorker(null)
                // dispatch(clearWorkerSelected())
                dispatch(setCanBuild(true))
                
                return
            }
            else if(player.identifier === "VIII" && workerBeingSwapped && selectedWorkerToSwap){
                const pushDestinationTile = getMinotaurPushDestinationTile(selectedWorkerToSwap.tile,
                    workerBeingSwapped.tile, tileData);
                
                if(pushDestinationTile){
                    const destPosition = [...POSITIONS[TILES.indexOf(pushDestinationTile)]]
                    const destBuilding = tileData[TILES.indexOf(pushDestinationTile)].buildings ?? "E" as Building
                    destPosition[1] = getWorkerYPositionIndicator(destBuilding)
                    dispatch(addCurrentGameAction(({from:selectedWorkerToSwap.tile, to:workerBeingSwapped.tile, 
                        worker:selectedWorkerToSwap.worker}) as Move))
                    dispatch(addCurrentGameAction(({from:workerBeingSwapped.tile, to:pushDestinationTile, 
                        worker:workerPos.worker}) as Move))
                    dispatch(setWorkerPosition({worker:selectedWorkerToSwap.worker, position:workerBeingSwapped.position, 
                        tile:workerPos.tile}))
                    dispatch(setWorkerPosition({worker:workerBeingSwapped.worker, position:destPosition, 
                        tile:pushDestinationTile}))
                    setMoveIndicators([])
                    setMoveWorkerIndicators([])
                    setSelectedWorker(null)
                    // dispatch(clearWorkerSelected())
                    dispatch(setCanBuild(true))
                }

                return
            }
            
            
            const adjacentTiles:number[] = TILE_ADJACENCY[TILES.indexOf(workerPos.tile)] ? 
            TILE_ADJACENCY[TILES.indexOf(workerPos.tile)] : []
            const adjTiles = adjacentTiles.map(t =>  TILES[t] as Tile)

            //Check for valid movement and placement
            const validTiles: Tile[] = []
            const tempMoveWorkers: WorkerPostion[] = []
            if(!workerPos.tile) return
            const fromBlockTile = tileData[TILES.indexOf(workerPos.tile)]
            const fromBlockLevel:Building | undefined = fromBlockTile.buildings;
            adjTiles.forEach(tile => {
                const toBlockLevel = tileData[TILES.indexOf(tile)]
                if( fromBlockLevel && VALID_MOVEMENTS.get(fromBlockLevel)?.includes(toBlockLevel.buildings as Building))
                {
                    console.log("worker opponent", player.type, toBlockLevel.worker)
                    if(toBlockLevel.worker === undefined  ){
                        // console.log("toBlockLevel worker: ", toBlockLevel)
                        validTiles.push(tile)
                    }
                    else if(toBlockLevel.worker && workerPos.tile &&
                        (player.identifier === "I" || (player.identifier === "VIII" && 
                            getMinotaurPushDestinationTile(workerPos.tile, tile, tileData))) && 
                            toBlockLevel.worker.toUpperCase() !== player.type?.toUpperCase()){
                            const tempWorkerPos = workerPositions.find(w => w.worker === toBlockLevel.worker)
                        if(tempWorkerPos){
                            validTiles.push(tile)
                            const copyPos = JSON.parse(JSON.stringify(tempWorkerPos))
                            tempMoveWorkers.push(copyPos)
                        }
                    } 
                }
            })
            setMoveWorkerIndicators(tempMoveWorkers)
            setMoveIndicators(validTiles)
            setSelectedWorker(workerPos.worker ? workerPos.worker : null)
        }
    }

    return(
        <>
            {allWorkers}
        </>
    )
}

export default WorkersOnBoard