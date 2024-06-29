import { useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Board from "./Board"
import './SantoriniBoard.css'
import { START, Turn } from "../../types/Types"
import { GenerateBoardData } from "./GenerateBoardData"
import { v4 as uuidv4 } from 'uuid'
import WorkersOnBoard from "./WorkersOnBoard"
import MoveIndicatorOnBoard from "./MoveIndicatorsOnBoard"
import { clearCurrentTurnData, setBoardState, setCanBuild, undoTurn } from "../../feature/boardstate-slice"
import TileBlocksOnBoard from "./TileBlocksOnBoard"
import { Affix } from "rsuite"
import BoardCoordinates from "./BoardCoordinates"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

interface BoardProps {
    SAN: string,
    onTurnEnd?: (move:Turn) => {},
    areWorkersMoveable?: boolean,
    enableBuild?: boolean
}
function SantoriniBoard({SAN, onTurnEnd= ()=>true, areWorkersMoveable = true, enableBuild =true}:BoardProps) {


    const dispatch = useAppDispatch();
    const canBuild = useAppSelector((state) => state.boardState.canBuild)
    const currentMoves = useAppSelector((state) => state.boardState.currentMoves)
    const currentBuilds = useAppSelector((state) => state.boardState.currentBuilds)
    

    const handleBuild = () => {
        if(!canBuild){
            dispatch(setCanBuild(true))
        }
    }

    const handleEndTurn = () => {
        const turn:Turn = {moves:currentMoves, buildings:currentBuilds}
 
        if(onTurnEnd(turn)){
            // console.log("onTurnEnd executed")
        }
        else {
            dispatch(undoTurn())
        }    
        dispatch(clearCurrentTurnData())           
    }

    const handleUndoTurn = () => {
        dispatch(undoTurn())
        dispatch(clearCurrentTurnData()) 
    }
    
    useEffect(() => {
        const data = GenerateBoardData(SAN === "" ? START : SAN);
        dispatch(setBoardState(data))
    }, [SAN])

    return(
        <div id="container">          
            <Canvas >
                <directionalLight position={[0,0,2]} intensity={0.8}  />
                <ambientLight/>
                <Board key={uuidv4()}>
                    <WorkersOnBoard areWorkersMoveable={areWorkersMoveable}/>
                    <MoveIndicatorOnBoard areWorkersMoveable={areWorkersMoveable}/>    
                    <TileBlocksOnBoard />  
                    <BoardCoordinates />
                </Board>     
                <OrbitControls   minDistance={2}  maxDistance={6} minPolarAngle={0}
                    maxPolarAngle={1.75} target={[0,-0.25,3]} position={[1,2,3]}/>
            </Canvas>           
            <Affix className="affix" >
                <div>
                    {canBuild && <button className="build-btn" disabled={enableBuild && !canBuild} onClick={() => handleBuild()}>Build</button>}
                    <br/><br/><br/><button className="undoTurn-btn"  onClick={() => handleUndoTurn()}>Undo turn</button>
                    <br/><br/><br/><button className="endTurn-btn"  onClick={() => handleEndTurn()}>End turn</button>
                </div>
            </Affix>
        </div>
    )
}

export default SantoriniBoard