import { GiPowerLightning } from "react-icons/gi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearCurrentTurnData, setCanBuild, undoTurn } from "../../feature/boardstate-slice";
import { PlayerInfo, Tile, Turn, Worker } from "../../types/Types";
import "./GamePlayControls.css"

interface GamePlaycontrolsProp {
    player: PlayerInfo,
    moveIndicators: Tile[],
    selectedWorker: Worker | null,
    canUseSpecialPower: boolean,
    onTurnEnd?: (move:Turn) => boolean|Error,
    setMoveIndicators: (ind: Tile[]) => void,
    setSelectedWorker: (worker: Worker|null) => void,
    setCanUseSpecialPower: (atlas: boolean) => void,
}
function GamePlayControls({player, onTurnEnd = () => true, 
    canUseSpecialPower, setMoveIndicators, setSelectedWorker, setCanUseSpecialPower}:GamePlaycontrolsProp ){

    const canBuild = useAppSelector((state) => state.boardState.canBuild)
    // const canUseAtlasPower = useAppSelector((state) => state.boardState.canUseAtlasPower)
    // const canPlaceBlock = useAppSelector((state) => state.boardState.canPlaceBlock)
    const currentGameActions = useAppSelector((state) => state.boardState.currentGameActions)    
    const dispatch = useAppDispatch();
    // const [powerButton, setPowerButton] = useState("power-btn")
    
    const handleBuild = () => {
        console.log("Build clicked")
        if(!canBuild){
            dispatch(setCanBuild(true))
        }
        // dispatch(setCanPlaceBlock(true))
    }

    const handlePower = () => {
        console.log("Power clicked 1")
        if(player.identifier === "IV" || player.identifier === "XII"){
            console.log("Power clicked")
            if(!canUseSpecialPower)  {
                setCanUseSpecialPower(true)
            }
        }
    }

    // useEffect(()=> {
    //     if(canPlaceBlock || canUseAtlasPower) dispatch(setCanBuild(true))

    // }, [canBuild, canPlaceBlock, canUseAtlasPower, dispatch])

    const handleEndTurn = () => {
        const turn:Turn = {gameActions: currentGameActions}
 
        if(onTurnEnd(turn)){
            // console.log("onTurnEnd executed")
        }
        else {
            dispatch(undoTurn())
            setMoveIndicators([])
            setSelectedWorker(null)
            setCanUseSpecialPower(false)
        }    
        dispatch(clearCurrentTurnData())           
    }

    const handleUndoTurn = () => {
        dispatch(undoTurn())
        dispatch(clearCurrentTurnData()) 
        // setPowerButton("power-btn")
        setMoveIndicators([])
        setSelectedWorker(null)
        setCanUseSpecialPower(false)
    }

    const hasSpecialGodPower = () => {
        if(player.identifier === "IV" || player.identifier === "XII") return true
        return false;
    }

    return (
        <div className="affix" >                
        {(canBuild && hasSpecialGodPower()) && <button className="power-btn"
           onClick={() => handlePower()}> <GiPowerLightning />God Power</button>}
        {canBuild && <button className="build-btn" 
             onClick={() => handleBuild()}>Build</button> }
        <button className="undoTurn-btn"  
            onClick={() => handleUndoTurn()}>Undo turn</button>
        <button className="endTurn-btn"  
            onClick={() => handleEndTurn()}>End turn</button>        
    </div>
    )
}

export default GamePlayControls