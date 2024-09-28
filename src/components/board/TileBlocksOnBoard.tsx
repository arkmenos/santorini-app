import { v4 as uuidv4 } from "uuid";
import Large from "../blocks/Large"
import { ARES_VALID_REMOVE, ATLAS_VALID_BUILDS, Build, DOME_Y_POS, DOME_Y_POS_FIRST, DOME_Y_POS_GROUND, DOME_Y_POS_SECOND, DOMES, GodIdentifier, L_BLOCK_Y_POS, M_BLOCK_Y_POS, PlayerInfo, POSITIONS, RemoveBuilding, S_BLOCK_Y_POS, Tile, TileData, TileDataUpdator, TILES, VALID_BUILDS, Worker, WorkerPostion } from "../../types/Types"
import Medium from "../blocks/Medium";
import Small from "../blocks/Small";
import Dome from "../blocks/Dome";
import TileBlock from "./TileBlock";
import { addCurrentGameAction,   setCanBuild,  setWorkerPosition,  updateTileData } from "../../feature/boardstate-slice";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ThreeEvent } from "@react-three/fiber";
import { getWorkerYPositionIndicator } from "../../Utility/Utility";
import { Message, useToaster } from "rsuite";

interface TileBlocksProp {
    selectedWorker: Worker | null,
    player:PlayerInfo,
    canUseSpecialPower: boolean,
    isTurn: boolean,
    setSelectedWorker: (worker: Worker | null) => void,
    setMoveIndicators: (tiles: Tile[]) => void,
    setMoveWorkerIndicators: (pos: WorkerPostion[]) => void,
    setCanUseSpecialPower: (atlas: boolean) => void
}

function TileBlocksOnBoard({selectedWorker, player, canUseSpecialPower, isTurn, setCanUseSpecialPower,
    setSelectedWorker, setMoveIndicators, setMoveWorkerIndicators}:TileBlocksProp){

    const toaster = useToaster()
    const tileData = useAppSelector((state) => state.boardState.tileData)
    // const workerSelected = useAppSelector((state) => state.boardState.workerSelected)
    const canBuild = useAppSelector((state) => state.boardState.canBuild)
    // const canUseAtlasPower = useAppSelector((state) => state.boardState.canUseAtlasPower)
    // const canPlaceBlock = useAppSelector((state) => state.boardState.canPlaceBlock)
    const playerTurn = useAppSelector((state) => state.boardState.playerTurn)
    const playerPowers = useAppSelector((state) => state.boardState.playerPowers)
    const workerPositions = useAppSelector((state) => state.boardState.workerPositions)
    const dispatch = useAppDispatch();
    
    const  tiles = useMemo(() => {
        const tempTiles:JSX.Element[] = []
        tileData.forEach((tData:TileData, index:number) => {
            const blocks = []
            blocks.push(<TileBlock position={[POSITIONS[index][0],POSITIONS[index][1],POSITIONS[index][2]]} 
                    key={uuidv4()} />)
            switch(tData.buildings){
                case "L":
                    blocks.push(<Large position={[POSITIONS[index][0], L_BLOCK_Y_POS,
                          POSITIONS[index][2]]} key={uuidv4()} />,);
                    break;
                case "M":
                    blocks.push(<Large position={[POSITIONS[index][0], L_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Medium position={[POSITIONS[index][0], M_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);                        
                  break;
                case "S":
                    blocks.push(<Large position={[POSITIONS[index][0], L_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Medium position={[POSITIONS[index][0], M_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Small position={[POSITIONS[index][0], S_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                  break;
                case "D":
                    blocks.push(<Large position={[POSITIONS[index][0], L_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Medium position={[POSITIONS[index][0], M_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Small position={[POSITIONS[index][0], S_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Dome position={[POSITIONS[index][0], DOME_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);                            
                  break;
                case "F":
                    blocks.push(<Large position={[POSITIONS[index][0], L_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Dome position={[POSITIONS[index][0], DOME_Y_POS_FIRST,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    break;
                case "G":
                    blocks.push(<Large position={[POSITIONS[index][0], L_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Medium position={[POSITIONS[index][0], M_BLOCK_Y_POS,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    blocks.push(<Dome position={[POSITIONS[index][0], DOME_Y_POS_SECOND,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    break;
                case "H":
                    blocks.push(<Dome position={[POSITIONS[index][0], DOME_Y_POS_GROUND,
                        POSITIONS[index][2]]} key={uuidv4()} />,);
                    break;
            }

            tempTiles.push(<group key={uuidv4()} name={TILES[index]}  
                onClick={(e) =>handleClick(e, TILES[index])}>{blocks}</group>)
        })
        return tempTiles

    },[tileData])
    
    const allowMultipleBuilds = () => {
        let power:GodIdentifier | null = null
        if(playerTurn === "X") power = playerPowers[0];
        else if(playerTurn === "Y") power = playerPowers[1];
        else if(playerTurn === "Z") power = playerPowers[2];
        
        if(power === "V" || power === "VI" || power === "X" || power === "XII") return true;
        return false
    }
    const handleClick = (e:ThreeEvent<MouseEvent>, tile: string) =>{
        // if(tile) console.log(tile)
        e.stopPropagation()
        if(!isTurn) {
            // console.log("Not your turn")
            toaster.push(<Message>Not your turn</Message>, {placement: 'topCenter', duration:2500})
             return
        }

        if(selectedWorker) {
            // dispatch(clearWorkerSelected())
            // dispatch(clearIndicators())
            setMoveIndicators([])
            setMoveWorkerIndicators([])
            setSelectedWorker(null)
        }

        console.log("Start of click canBuild canUseSpecialPower", canBuild,  canUseSpecialPower)
        if( canUseSpecialPower ){
            if(player.identifier === "IV"){            
                console.log("Use Atlas Power")
                const tempTile = tileData[TILES.indexOf(tile)]
                if(!tempTile.worker){
                    if(tempTile.buildings && !DOMES.includes(tempTile.buildings)){
                        const atlasbuild = ATLAS_VALID_BUILDS.get(tempTile.buildings)?.length === 1 ?
                            ATLAS_VALID_BUILDS.get(tempTile.buildings)?.[0] : 
                            ATLAS_VALID_BUILDS.get(tempTile.buildings)?.[1];
                        const newTileData:TileData = {buildings:atlasbuild} 
                        const updater:TileDataUpdator = {index:TILES.indexOf(tile), data:newTileData} 
                        // console.log("build here: ", tempTile, updater)
                        dispatch(updateTileData(updater))
                        if (newTileData.buildings) dispatch(addCurrentGameAction((
                            {building: newTileData.buildings, tile: tile as Tile}) as Build))

                    }
                    dispatch(setCanBuild(false))
                    setCanUseSpecialPower(false)
                }
            }
            else if(player.identifier === "XII"){
                //Use Ares Remove Block Power
                const tempTile = tileData[TILES.indexOf(tile)]
                if(!tempTile.worker && tempTile.buildings && !DOMES.includes(tempTile.buildings)){
                    const aresRemoveBuild = ARES_VALID_REMOVE.get(tempTile.buildings)
                    const newTileData:TileData = {buildings: aresRemoveBuild}
                    const updater:TileDataUpdator = {index:TILES.indexOf(tile), data:newTileData}
                    dispatch(updateTileData(updater))
                    if (newTileData.buildings) dispatch(addCurrentGameAction((
                        {tile: tile as Tile}) as RemoveBuilding));
                    dispatch(setCanBuild(false))
                    setCanUseSpecialPower(false)
                }
                return
            }
        }
        else if(canBuild  && !DOMES.includes(tile)){
            console.log("Build on tile: ", tile)
           if(!allowMultipleBuilds()) dispatch(setCanBuild(false));

            //Check if can build
            const tempTile = tileData[TILES.indexOf(tile)]
            if(!tempTile.worker || player.identifier === "XXX"){
                if(tempTile.buildings && tempTile.buildings !== "D"){
                    const newTileData:TileData = {buildings:VALID_BUILDS.get(tempTile.buildings)} 
                    const updater:TileDataUpdator ={index:TILES.indexOf(tile), data:newTileData} 
                    // console.log("build here: ", tempTile, updater)
                    dispatch(updateTileData(updater))
                    if (newTileData.buildings) dispatch(addCurrentGameAction((
                        {building: newTileData.buildings, tile: tile as Tile}) as Build))
                    if(tempTile.worker){
                        const workerPos = workerPositions.find(w => { return w.worker === tempTile.worker})
                        if(workerPos)
                        {
                            if(newTileData.buildings && workerPos.position){
                                // console.log("Zeus power",workerPos)
                                const newPos = [...workerPos.position]
                                newPos[1] = getWorkerYPositionIndicator(newTileData.buildings)
                                const newWorkerPos = {...workerPos}
                                newWorkerPos.position = newPos
                                dispatch(setWorkerPosition(newWorkerPos))
                            }   
                        }
                    }
                }
            }
            // dispatch(setCanBuild(true))
        }
        
        
    }

    return(
        <>
            {tiles}
        </>
    )
}

export default TileBlocksOnBoard