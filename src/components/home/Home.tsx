import { GameStartPhase, Player, PlayerInfo } from "../../types/Types"
import { useEffect, useState } from "react"
import {v4 as uuidV4} from   "uuid"
import WaitingRoom from "./WaitingRoom"
import GameBoard from "../game/GameBoard"
import "./Home.css"
import { useParams } from "react-router-dom"
import PowerPicker from "./PowerPicker"

function Home() {

    const [, setPlayer] = useState<Player | null>(null)
    const [name, setName] = useState("")
    const [roomId, setRoomId] = useState("")
    const [ errorMsg, setErrorMsg] = useState("")
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo >({name:"",roomId:"",type:undefined, identifier:null})
    const [isSpectator, setIsSpectator] = useState<boolean>(false)
    const [join, setJoin] = useState<boolean>(false)
    const [opponents, setOpponents] = useState<PlayerInfo[]>([])
    const [phase, setPhase] = useState<GameStartPhase>("CreateRoom")
    const { paramRoomId } = useParams<{ paramRoomId: string}>()
    // const matches = useMediaQuery("(min-width: 475px)")

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
            setErrorMsg("")
            setRoomId(rmId)
            setPlayer("X")         
            setPlayerInfo({
                name: name,
                roomId: rmId,
                type: "X",
                identifier: null
            })
            setPhase("WaitingRoom")
            
        }
    }

    const onJoin = () => {
        if(name.length < 3) {
            setErrorMsg("Please enter a name with more than 2 characters")
        }
        else{
            setErrorMsg("")
            setPlayerInfo({
                name: name,
                roomId: roomId,
                type: isSpectator ? "S" : undefined,
                identifier: null
            })
            setPhase("WaitingRoom")
        }
    }

    useEffect(() => {      
        if(paramRoomId){
            setRoomId(paramRoomId)
            setJoin(true)
            setPhase("JoinRoom");
        } 
        // if(window.location.pathname !== "/"){
        //     setRoomId(window.location.pathname.substring(1));
        //     setJoin(true)
        // }
    },[])

    if(phase === "CreateRoom"){
        return (
            <div className="container">
                <h1>Santorini</h1>                
                <h1 className="header">Start a Game</h1>
                <label className="name-lbl">Name:  <input className="name-input" type="text"  defaultValue={name} 
                        onChange={(e)=>setName(e.target.value)} id={uuidV4()}/></label>
                
                <button className="create-btn" onClick={()=>onCreate()}>Create</button> 
                <p className="error-msg">{errorMsg}</p>                 
            </div>
        )
    }
    else if(phase === "JoinRoom"){
        return (
            <div className="container">
                <h1>Santorini</h1>
                <h1 className="header">Join a Game</h1>
                <label className="name-lbl">Name: <input className="name-input" type="text"  defaultValue={name} id={uuidV4()}
                        onChange={(e)=>setName(e.target.value)}/></label>
                
                {/* <input className="spectator-box" type="checkbox"  defaultChecked={isSpectator} 
                    title="Join  Room as a spectator" onChange={(e) => setIsSpectator(e.target.checked)} /> */}
                <button className="join-btn" onClick={()=>onJoin()}>Join</button>
                <p className="error-msg">{errorMsg}</p>    
            </div>
        )
    }
    else if(phase === "WaitingRoom"){
        return playerInfo && <WaitingRoom playerInfo={playerInfo} opponents={opponents}
        setPlayerInfo={setPlayerInfo}  setOpponents={setOpponents} setPhase={setPhase}/>
    }
    else if(phase === "PickPowers" && playerInfo){
        return <PowerPicker  setPlayerInfo={setPlayerInfo}  player={playerInfo} setPhase={setPhase}
        setOpponents={setOpponents} opponents={opponents}/>
    }
    else{
        return playerInfo && <GameBoard playerInfo={playerInfo} opponents={opponents}/>
    }

    // if(start && playerInfo){
    //     return <GameBoard playerInfo={playerInfo} playerCount={players.length} players={players}/>
    // }else if(pickPower && playerInfo){
    //     // return <GameBoard playerInfo={playerInfo} playerCount={players.length} players={players}/>
    //     return <PowerPicker  setPlayerInfo={setPlayerInfo}  setPlayers={setPlayers}/>
    // }else if(playerInfo){
    //     return <WaitingRoom playerInfo={playerInfo} setPickPower={setPickPower} setStart={setStart}
    //         setPlayerInfo={setPlayerInfo}  setPlayers={setPlayers}/>
    // }
    // else{    
    //     if(join){
    //         return (
    //             <div className="container">
    //                 <h1>Santorini</h1>
    //                 <h1 className="header">Join a Game</h1>
    //                 <label className="name-lbl">Name: </label>
    //                 <input className="name-input" type="text"  defaultValue={name}
    //                         onChange={(e)=>setName(e.target.value)}/>
    //                 {/* <input className="spectator-box" type="checkbox"  defaultChecked={isSpectator} 
    //                     title="Join  Room as a spectator" onChange={(e) => setIsSpectator(e.target.checked)} /> */}
    //                 <button className="join-btn" onClick={()=>onJoin()}>Join</button>
    //             </div>
    //         )
    //     }
    //     else {                  
    //         return (
    //             <div className="container">
    //                 <h1>Santorini</h1>                
    //                 <h1 className="header">Start a Game</h1>
    //                 <label className="name-lbl">Name:  </label>
    //                 <input className="name-input" type="text"  defaultValue={name} 
    //                         onChange={(e)=>setName(e.target.value)}/>
    //                 <button className="create-btn" onClick={()=>onCreate()}>Create</button>                   
    //             </div>
    //         )
    //     }
    // }
}

export default Home