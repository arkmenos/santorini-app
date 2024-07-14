import { Player, PlayerInfo } from "../../types/Types"
import { useEffect, useState } from "react"
import WaitingRoom from "./WaitingRoom"
import GameBoard from "../game/GameBoard"
import "./Home.css"
import { useParams } from "react-router-dom"

function Home() {

    const [, setPlayer] = useState<Player | null>(null)
    const [name, setName] = useState("")
    const [roomId, setRoomId] = useState("")
    const [, setErrorMsg] = useState("")
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
    const [isSpectator, setIsSpectator] = useState<boolean>(false)
    const [join, setJoin] = useState<boolean>(false)
    const [start, setStart] = useState(false)
    const [playerCount, setPlayerCount] = useState(1)
    const [players, setPlayers] = useState<PlayerInfo[]>([])
    const { paramRoomId } = useParams<{ paramRoomId: string}>()

    const createRoomId = () => {
        const possibleDigits ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let result = "";
        for(let i=0; i < 8; i++){
            const index = Math.floor(Math.random() * possibleDigits.length)
            result += possibleDigits[index]
        }
        return result
    }

    const onCreate = () => {
        if(name.length < 3) {
            setErrorMsg("Please enter a name with more than 2 characters")
        }else{
            const rmId = createRoomId()
            setRoomId(rmId)
            setPlayer("X")
            // createRoom()   
            // window.location.pathname =`/${rmId}`
         
            setPlayerInfo({
                name: name,
                roomId: rmId,
                type: "X"
            })
            
        }
    }

    const onJoin = () => {
        if(name.length < 3) {
            setErrorMsg("Please enter a name with more than 2 characters")
        }
        else{
            setPlayerInfo({
                name: name,
                roomId: roomId,
                type: isSpectator ? "S" : undefined
            })
        }

    }

    useEffect(() => {      
        if(paramRoomId){
            setRoomId(paramRoomId)
            setJoin(true)
        } 
        // if(window.location.pathname !== "/"){
        //     setRoomId(window.location.pathname.substring(1));
        //     setJoin(true)
        // }
    },[])

    if(start && playerInfo){
        return <GameBoard playerInfo={playerInfo} playerCount={playerCount} players={players}/>
    }else if(playerInfo){
        return <WaitingRoom playerInfo={playerInfo} setStart={setStart} 
            setPlayerInfo={setPlayerInfo} setPlayerCount={setPlayerCount} setPlayers={setPlayers}/>
    }
    else{    
        if(join){
            return (
                <div className="container">
                    <h1>Join a Santorini Game</h1><br/>
                    <label className="name-lbl">Name: </label>
                    <input className="name-input" type="text"  defaultValue={name}
                            onChange={(e)=>setName(e.target.value)}/>
                    <input className="spectator-box" type="checkbox"  defaultChecked={isSpectator} 
                        title="Join  Room as a spectator" onChange={(e) => setIsSpectator(e.target.checked)} />
                    <button className="join-btn" onClick={()=>onJoin()}>Join</button>
                </div>
            )
        }
        else {                  
            return (
                <div className="container">
                    <div>
                        <h1>Start a Santorini Game</h1><br/>
                        <label className="name-lbl">Name:  </label>
                        <input className="name-input" type="text"  defaultValue={name} 
                                onChange={(e)=>setName(e.target.value)}/>
                        <button className="create-btn" onClick={()=>onCreate()}>Create</button>
                    </div>
                </div>
            )
        }
    }
}

export default Home