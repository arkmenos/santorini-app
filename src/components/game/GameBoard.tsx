import { GameProp } from "../../types/Types"
import Game from "./Game"


function GameBoard ({playerInfo, playerCount}:GameProp){

    return(
        <>
            <Game playerInfo={playerInfo} playerCount={playerCount} />
        </>
    )
}

export default GameBoard