import { GameProp } from "../../types/Types"
import Game from "./Game"


function GameBoard ({playerInfo, playerCount, players}:GameProp){

    return(
        <>
            <Game playerInfo={playerInfo} playerCount={playerCount} players={players} />
        </>
    )
}

export default GameBoard