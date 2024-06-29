import { v4 as uuidv4 } from "uuid";
import Large from "../blocks/Large"
import { DOME_Y_POS, L_BLOCK_Y_POS, M_BLOCK_Y_POS, POSITIONS, S_BLOCK_Y_POS, Tile, TileData, TileDataUpdator, TILES, VALID_BUILDS } from "../../types/Types"
import Medium from "../blocks/Medium";
import Small from "../blocks/Small";
import Dome from "../blocks/Dome";
import TileBlock from "./TileBlock";
import { addCurrentBuild, clearIndicators, clearWorkerSelected, setCanBuild, updateTileData } from "../../feature/boardstate-slice";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ThreeEvent } from "@react-three/fiber";


function TileBlocksOnBoard(){

    const tileData = useAppSelector((state) => state.boardState.tileData)
    const workerSelected = useAppSelector((state) => state.boardState.workerSelected)
    const canBuild = useAppSelector((state) => state.boardState.canBuild)
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
            }

            tempTiles.push(<group key={uuidv4()} name={TILES[index]}  
                onClick={(e) =>handleClick(e, TILES[index])}>{blocks}</group>)
        })
        return tempTiles

    },[tileData])
    
    const handleClick = (e:ThreeEvent<MouseEvent>, tile: string) =>{
        // if(tile) console.log(tile)
        
        if(workerSelected) {
            dispatch(clearWorkerSelected())
            dispatch(clearIndicators())
        }
        if(canBuild){
            // console.log("Build on tile: ", tile)
            dispatch(setCanBuild(false))
            //Check if can build
            const tempTile = tileData[TILES.indexOf(tile)]
            if(!tempTile.worker){
                if(tempTile.buildings && tempTile.buildings !== "D"){
                    const newTileData:TileData = {buildings:VALID_BUILDS.get(tempTile.buildings)} 
                    const updater:TileDataUpdator ={index:TILES.indexOf(tile), data:newTileData} 
                    // console.log("build here: ", tempTile, updater)
                    dispatch(updateTileData(updater))
                    if (newTileData.buildings) dispatch(addCurrentBuild(
                        {building: newTileData.buildings, tile: tile as Tile}))

                }
            }
            // dispatch(setCanBuild(true))
        }
        
        e.stopPropagation()
    }

    return(
        <>
            {tiles}
        </>
    )
}

export default TileBlocksOnBoard