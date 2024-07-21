import { v4 as uuidv4 } from "uuid";
import { FemaleBlue } from "../worker/FemaleBlue.js";
import { MaleBlue } from "../worker/MaleBlue.js";
import { FemaleRed } from "../worker/FemaleRed.js";
import { MaleRed } from "../worker/MaleRed.js";
import { FemaleYellow } from "../worker/FemaleYellow.js";
import { MaleYellow } from "../worker/MaleYellow.js";
import { Building, Tile, TILE_ADJACENCY, TILES, VALID_MOVEMENTS, WorkerPostion } from "../../types/Types.js";
import { setIndicators, setPlayer, setWorkerSelected } from "../../feature/boardstate-slice.js";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { Message, useToaster } from "rsuite";
import { ThreeEvent } from "@react-three/fiber";

interface WorkersProp {
    areWorkersMoveable:boolean
}

const WorkersOnBoard = ({areWorkersMoveable}:WorkersProp) => {
    const toaster = useToaster()
    const workerPositions = useAppSelector((state) => state.boardState.workerPositions)
    const turnCount = useAppSelector((state) => state.boardState.turnCount)
    const playerCount = useAppSelector((state) => state.boardState.playerCount)
    const tileData = useAppSelector((state) => state.boardState.tileData)
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
            const adjacentTiles:number[] = TILE_ADJACENCY[TILES.indexOf(workerPos.tile)] ? 
            TILE_ADJACENCY[TILES.indexOf(workerPos.tile)] : []
            const adjTiles = adjacentTiles.map(t =>  TILES[t] as Tile)

            //Check for valid movement and placement
            const validTiles: Tile[] = []
            if(!workerPos.tile) return
            const fromBlockLevel:Building | undefined = tileData[TILES.indexOf(workerPos.tile)].buildings;
            adjTiles.forEach(tile => {
            const toBlockLevel = tileData[TILES.indexOf(tile)]
            if( fromBlockLevel && VALID_MOVEMENTS.get(fromBlockLevel)?.includes(toBlockLevel.buildings as Building) &&
                toBlockLevel.worker === undefined){
                // console.log("toBlockLevel worker: ", toBlockLevel)
                validTiles.push(tile)
                }
            })

            dispatch(setIndicators(validTiles));
            dispatch(setPlayer(workerPos.worker))
            dispatch(setWorkerSelected(workerPos.worker))
        }
    }

    return(
        <>
            {allWorkers}
        </>
    )
}

export default WorkersOnBoard