import { ReactElement, useEffect, useState } from "react"
import { socket } from "../../socket/socket";
import {v4 as uuidV4} from   "uuid"
import { PlayerInfo } from "../../types/Types";
import { JSX } from "react/jsx-runtime";

interface WaitingRoomProps{
    playerInfo:PlayerInfo,
    setStart: (start:boolean) => void,
    setPlayerInfo: (playerInfo: PlayerInfo) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPlayerCount:(count: any) => void,
    setPlayers: (arg0: any) => void
}

function WaitingRoom({playerInfo, setStart, setPlayerInfo, setPlayerCount, setPlayers}:WaitingRoomProps) {
    const [roomPath, ] = useState(window.location.origin + `/${playerInfo.roomId}`);
    const [playersDisplay, setPlayersDisplay] = useState<ReactElement[]>([])
    const [ready, setReady] = useState(false)
    
    socket.off('updatePlayer')
    socket.on('updatePlayer', (data) => {
        const updated = {name:playerInfo.name, roomId:playerInfo.roomId, type:data}
        setPlayerInfo(updated);
        setPlayers(p => [...p, updated])        
        setPlayersDisplay(p => [...p, <li key={uuidV4()}>{playerInfo.name} (you)</li> ])
    })

    socket.off('getUsersInRoom')
    socket.on('getUsersInRoom', (data) => {
        // console.log("getUsersInRoom" , data)
        const otherPlayers: JSX.Element[] = []
        let pCount = 0;
        data.forEach((p: { type: string; name: string}) => {
            if(p.type !== "S") pCount++
            otherPlayers.push(<li key={uuidV4()}>{p.name}</li>)
        })
        setPlayersDisplay(p => [...p,...otherPlayers])
        setPlayers(p => [...p, ...data])     
        if(pCount > 0) setPlayerCount((c: number) => c + pCount)
    })

    socket.off('userJoined')
    socket.on('userJoined', data => {
        // console.log("userJoined", data)
        setPlayersDisplay(p=> [...p, <li key={uuidV4()}>{data.name}</li>])
        setPlayers(p => [...p, data])      
        if(data.type !== "S") setPlayerCount((c: number) => c + 1)
        if(playerInfo.type === "X" && data.type !== "S") setReady(true)
    })

    socket.off('startGame')
    socket.on('startGame', () => {
        // console.log("startGame")
        setStart(true)
    })

    const handleStartGame = () => {
        // console.log("Emit Start")
        socket.emit('startGame')        
        setStart(true)
    }
    useEffect(()=> {
        // console.log(playerInfo)
        const enterRoom = () => {
            if(playerInfo.type === "X"){
                socket.emit('createRoom', playerInfo)
                setPlayersDisplay([<li key={uuidV4()}>{playerInfo.name} (you)</li>])
                setPlayers(p => [...p, playerInfo])      
            }
            else{
                socket.emit('enterRoom', playerInfo)
                // if(playerInfo.type === "S"){
                //     socket.emit('getBoardState', playerInfo.roomId)
                // }
            }
        }
        // const rmId = playerInfo.roomId
        // console.log(playerInfo.name, rmId)
        // setRoomPath(window.location.origin + `/${playerInfo.roomId}`)
        socket.connect()
        enterRoom()       
    
    }, [])

    return(
        <div className="container">
            <h1>Waiting on other players to join</h1><br/>
            <input className="link-lbl" type="text" readOnly value={roomPath} size={50}/>
            {/* <div className="link-lbl">{roomPath}</div> */}
            <button className="create-btn" onClick={() => {navigator.clipboard.writeText(roomPath)}}>copy</button>
            <br/><br/>
            <div>
                <ul className="player-list">{playersDisplay}</ul>
                {ready && <button className="start-btn" onClick={() => handleStartGame()}>Start Game</button>}
            </div>
        </div>
    )
}

export default WaitingRoom