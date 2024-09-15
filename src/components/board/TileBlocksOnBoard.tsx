import { v4 as uuidv4 } from "uuid";
import Large from "../blocks/Large"
import { ATLAS_VALID_BUILDS, Build, DOME_Y_POS, DOME_Y_POS_FIRST, DOME_Y_POS_GROUND, DOME_Y_POS_SECOND, DOMES, GodIdentifier, L_BLOCK_Y_POS, M_BLOCK_Y_POS, POSITIONS, S_BLOCK_Y_POS, Tile, TileData, TileDataUpdator, TILES, VALID_BUILDS, Worker, WorkerPostion } from "../../types/Types"
import Medium from "../blocks/Medium";
import Small from "../blocks/Small";
import Dome from "../blocks/Dome";
import TileBlock from "./TileBlock";
import { addCurrentGameAction,   setCanBuild,  updateTileData } from "../../feature/boardstate-slice";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ThreeEvent } from "@react-three/fiber";

interface TileBlocksProp {
    selectedWorker: Worker | null,
    canUseAtlasPower: boolean,
    setSelectedWorker: (worker: Worker | null) => void,
    setMoveIndicators: (tiles: Tile[]) => void,
    setMoveWorkerIndicators: (pos: WorkerPostion[]) => void,
    setCanUseAtlasPower: (atlas: boolean) => void
}

function TileBlocksOnBoard({selectedWorker, canUseAtlasPower, setCanUseAtlasPower,
    setSelectedWorker, setMoveIndicators, setMoveWorkerIndicators}:TileBlocksProp){

    const tileData = useAppSelector((state) => state.boardState.tileData)
    // const workerSelected = useAppSelector((state) => state.boardState.workerSelected)
    const canBuild = useAppSelector((state) => state.boardState.canBuild)
    // const canUseAtlasPower = useAppSelector((state) => state.boardState.canUseAtlasPower)
    const canPlaceBlock = useAppSelector((state) => state.boardState.canPlaceBlock)
    const playerTurn = useAppSelector((state) => state.boardState.playerTurn)
    const playerPowers = useAppSelector((state) => state.boardState.playerPowers)
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
        if(playerTurn === "Y") power = playerPowers[1];
        if(playerTurn === "Z") power = playerPowers[2];
        
        if(power === "V" || power === "VI" || power === "X") return true;
        return false
    }
    const handleClick = (e:ThreeEvent<MouseEvent>, tile: string) =>{
        // if(tile) console.log(tile)
        e.stopPropagation()
        if(selectedWorker) {
            // dispatch(clearWorkerSelected())
            // dispatch(clearIndicators())
            setMoveIndicators([])
            setMoveWorkerIndicators([])
            setSelectedWorker(null)
        }

        console.log("Start of click canBuild canUseAtlasPower", canBuild, canPlaceBlock, canUseAtlasPower)
        if( canUseAtlasPower){
            console.log("Use Atlas Power")
            const tempTile = tileData[TILES.indexOf(tile)]
            if(!tempTile.worker){
                if(tempTile.buildings && tempTile.buildings !== "D"){
                    const atlasbuild = ATLAS_VALID_BUILDS.get(tempTile.buildings)?.length === 1 ?
                        ATLAS_VALID_BUILDS.get(tempTile.buildings)?.[0] : 
                        ATLAS_VALID_BUILDS.get(tempTile.buildings)?.[1];
                    const newTileData:TileData = {buildings:atlasbuild} 
                    const updater:TileDataUpdator ={index:TILES.indexOf(tile), data:newTileData} 
                    // console.log("build here: ", tempTile, updater)
                    dispatch(updateTileData(updater))
                    if (newTileData.buildings) dispatch(addCurrentGameAction((
                        {building: newTileData.buildings, tile: tile as Tile}) as Build))

                }
                dispatch(setCanBuild(false))
                setCanUseAtlasPower(false)
            }
        }
        else if(canBuild  && !DOMES.includes(tile)){
            console.log("Build on tile: ", tile)
           if(!allowMultipleBuilds()) dispatch(setCanBuild(false));

            //Check if can build
            const tempTile = tileData[TILES.indexOf(tile)]
            if(!tempTile.worker){
                if(tempTile.buildings && tempTile.buildings !== "D"){
                    const newTileData:TileData = {buildings:VALID_BUILDS.get(tempTile.buildings)} 
                    const updater:TileDataUpdator ={index:TILES.indexOf(tile), data:newTileData} 
                    // console.log("build here: ", tempTile, updater)
                    dispatch(updateTileData(updater))
                    if (newTileData.buildings) dispatch(addCurrentGameAction((
                        {building: newTileData.buildings, tile: tile as Tile}) as Build))

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