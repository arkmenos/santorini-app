import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Board from "./Board"
import './SantoriniBoard.css'
import { PERIMETER_TILES, PlayerInfo, START, Tile, TILES, Turn, Worker, WorkerPostion } from "../../types/Types"
import { isMobile } from "../../Utility/Utility"
import { GenerateBoardData } from "./GenerateBoardData"
import { v4 as uuidv4 } from 'uuid'
import WorkersOnBoard from "./WorkersOnBoard"
import MoveIndicatorOnBoard from "./MoveIndicatorsOnBoard"
import { setBoardState } from "../../feature/boardstate-slice"
import TileBlocksOnBoard from "./TileBlocksOnBoard"
// import { Affix } from "rsuite"
import BoardCoordinates from "./BoardCoordinates"
import { useAppDispatch } from "../../app/hooks"
import GamePlayControls from "./GamePlayControls"
// import { GiPowerLightning } from "react-icons/gi"
// import { setMoveIndicators } from "../../feature/moveIndicator-slice"

interface BoardProps {
    SAN: string,
    onTurnEnd?: (move:Turn) => boolean|Error,
    isTurn?: boolean,
    enableBuild?: boolean,
    player: PlayerInfo
}
function SantoriniBoard({SAN, onTurnEnd= ()=>true, isTurn = true, player}:BoardProps) {

    const [moveIndicators, setMoveIndicators] = useState<Tile[]>([])
    const [moveWorkerIndicators, setMoveWorkerIndicators] = useState<WorkerPostion[]>([])
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
    const [canUseSpecialPower, setCanUseSpecialPower] = useState(false)
    // const [prevMoveIndicators, setPrevMoveIndicators] = useState<WorkerPostion[]>([])
    const dispatch = useAppDispatch();
    // const canBuild = useAppSelector((state) => state.boardState.canBuild)
    // const currentGameActions = useAppSelector((state) => state.boardState.currentGameActions)

  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fov, _] = useState(isMobile() ? 110: 90)
    // const [canUseSpecialPower, setCanUSeSpecialPower] = useState<GodIdentifier | null>(null)

    // const handleBuild = () => {
    //     if(!canBuild){
    //         dispatch(setCanBuild(true))
    //     }
    // }

    // const handleEndTurn = () => {
    //     const turn:Turn = {gameActions: currentGameActions}
 
    //     if(onTurnEnd(turn)){
    //         // console.log("onTurnEnd executed")
    //     }
    //     else {
    //         dispatch(undoTurn())
    //     }    
    //     dispatch(clearCurrentTurnData())           
    // }

    // const handleUndoTurn = () => {
    //     dispatch(undoTurn())
    //     dispatch(clearCurrentTurnData()) 
    // }
    
    // useEffect(()=> {
    //     cameraControlsRef.current?.lookInDirectionOf(15, 0, 1, false)
    // })

    useEffect(() => {
        const data = GenerateBoardData(SAN === "" ? START : SAN);
        let moveInds:Tile[] = []
        if(data.turnCount === 1 || data.turnCount === 2 || (data.playerCount === 3 && data.turnCount ===3)){
            
            // console.log("set Bia start ")
            if(player.identifier === "XIII"){
                console.log("set Bia start ")
                PERIMETER_TILES.forEach(p => {
                    moveInds = [...moveInds, p]
                })
            }else{
            
                data.tileData.forEach((t, i) => {
                    if(!t.worker)
                        moveInds = [...moveInds, (TILES[i] as Tile)]
                })
                data.workerPositions.forEach(w => {
                    moveInds = moveInds.filter(t=> t !== w.tile)
                })
            }
           
        }
        setMoveIndicators(moveInds)
        // dispatch(setMoveIndicators(moveInds))
        dispatch(setBoardState(data))
       
    }, [SAN])

    return(
        <div id="gameboard">          
            <Canvas camera={{ fov: fov, position: [0, 3, 5] }}>
            {/* <CameraControls enabled={true} ref={cameraControlsRef}/> */}
                <directionalLight position={[0,0,2]} intensity={0.8}  />
                <ambientLight/>
                <Board key={uuidv4()}>
                    <WorkersOnBoard isTurn={isTurn} player={player} 
                        moveIndicators={moveIndicators} setMoveIndicators={setMoveIndicators}
                        moveWorkerIndicators={moveWorkerIndicators} 
                        selectedWorker={selectedWorker}
                        setMoveWorkerIndicators={setMoveWorkerIndicators}
                        setSelectedWorker={setSelectedWorker}
                        
                        />

                    <MoveIndicatorOnBoard isTurn={isTurn} player={player}
                        moveIndicators={moveIndicators} setMoveIndicators={setMoveIndicators}
                        moveWorkerIndicators={moveWorkerIndicators} 
                        setMoveWorkerIndicators={setMoveWorkerIndicators}
                        selectedWorker={selectedWorker} setSelectedWorker={setSelectedWorker}/>    

                    <TileBlocksOnBoard selectedWorker={selectedWorker} player={player}
                        isTurn={isTurn}  setSelectedWorker={setSelectedWorker}  
                        setMoveIndicators={setMoveIndicators}
                        setMoveWorkerIndicators={setMoveWorkerIndicators}
                        canUseSpecialPower={canUseSpecialPower}  setCanUseSpecialPower={setCanUseSpecialPower}

                        />  
                    <BoardCoordinates />
                </Board>     
                <OrbitControls   minDistance={2}  maxDistance={6} minPolarAngle={0}
                    maxPolarAngle={1.75} target={[0,0.1,-0.5]} 
                    panSpeed={0.5} rotateSpeed={0.1} zoomSpeed={0.5}  />
                    
            </Canvas>           
            {isTurn && <GamePlayControls player={player} onTurnEnd={onTurnEnd} 
                moveIndicators={moveIndicators} setMoveIndicators={setMoveIndicators}
                selectedWorker={selectedWorker} setSelectedWorker={setSelectedWorker}
                canUseSpecialPower={canUseSpecialPower}  setCanUseSpecialPower={setCanUseSpecialPower}/>}
        </div>
    )
}

export default SantoriniBoard