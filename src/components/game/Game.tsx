import { useEffect, useRef, useState } from "react"
import SantoriniBoard from "../board/SantoriniBoard"
import Santorini from "../system/Santorini"
import { GameProp, START, Turn } from "../../types/Types"
import { Button, Message, Modal, useToaster } from "rsuite"
import { socket } from "../../socket/socket"
import './Game.css'
"rsuite/dist/rsuite-no-reset.min.css"
import "rsuite/dist/rsuite.min.css";
// import 'rsuite/useToaster/styles/index.css';
// import 'rsuite/Message/styles/index.css'
// import { Alert, Snackbar } from "@mui/material"

function Game({playerInfo, playerCount}:GameProp){
    const santorini = useRef<Santorini>(null!)
    const [san, setSan] = useState("")
    const [isturn, setIsTurn] = useState(false)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const toaster = useToaster()

    useEffect(() => {
        santorini.current = new Santorini(START, playerCount);
        if(playerInfo.type === "X") setIsTurn(playerInfo.type === santorini.current.getPlayerTurn())
    },[])

    // function updateMove(){
    //     const santoriniRef: Santorini = santorini.current;
    //     if(santoriniRef){
    //         santorini.current.turn(((document.getElementById("move") as HTMLInputElement).value));
    //         // setUpdatedSan(santorini.current.getSAN())           
    //         (document.getElementById("move") as HTMLInputElement).value = "";
    //         setSan(santoriniRef.getSAN())
    //         // setPreviousTurn(santorini.current.getSAN().trim())
    //         // if(santorini.current.isGameOver()){
    //             // if(santoriniRef.getWinner()) setWinner(santoriniRef.getWinner())
    //         // }
    //         // setCanUndo(true)
    //     }
    // }


    // function updateSAN(){
    //     santorini.current.load(((document.getElementById("san") as HTMLInputElement).value));
    //     setSan(santorini.current.getSAN().trim());
    //     (document.getElementById("san") as HTMLInputElement).value = "";
    // }

    function opponentTurn(turn: Turn){
        // console.log("opponent Move", turn )
        santorini.current.turn(turn);
        setSan(santorini.current.getSAN())
        if(santorini.current.isGameOver()){
            const winner = santorini.current.getWinner()
            toaster.push(<Message>{winner} has won the game!!! </Message>, {placement: 'topCenter'})
            setIsTurn(false)
        }else if(playerInfo.type !== "S"){           
            setIsTurn(playerInfo.type === santorini.current.getPlayerTurn())
        }
    }
    socket.off('takeTurn')
    socket.on('takeTurn', turn => {
        opponentTurn(turn)
    })

    function turnEnd(turn:Turn):boolean{
        // console.log("Turn end in game: ", turn)
        turn.moves?.forEach(move => {
            if(move.worker.toLocaleUpperCase() !== santorini.current.getPlayerTurn()){
                return false
            }
        })
        let newTurn 
        try {
             newTurn =  santorini.current.turn(turn);

        }catch(err){
            console.log((err as Error).message);
            toaster.push(<Message type="warning" ><strong>{(err as Error).message}</strong></Message>, {placement: 'topCenter'})
            return false
        }

        if(newTurn === null) return false
        setSan(santorini.current.getSAN())
        socket.emit('takeTurn', turn)
        socket.emit('boardState', santorini.current.getSAN())
        setIsTurn(playerInfo.type === santorini.current.getPlayerTurn())

        if(santorini.current.isGameOver()){
            const winner = santorini.current.getWinner()
            handleOpen();
            // toaster.push(<Message>{winner} has won the game!!! </Message>, {placement: 'topCenter'})
         
        }
        return true
    }

    return (
        <div>
            <SantoriniBoard SAN={san} onTurnEnd={turnEnd} areWorkersMoveable={isturn}/>
            {/* <div className="move_area">
                <br/>
                <input id="san"   type="text" placeholder="SAN notation"/>
                <button onClick={()=>updateSAN()}>Update SAN</button><br/><br/>
                <input id="move" type="text" placeholder="Type Turn"/>
                <button onClick={() =>updateMove()}>Validate Turn</button><br/><br/>
                <div>Updated SAN: {san}</div>
                {winner.length > 0 && <div>{winner} WON!!!</div> }
            </div> */}           
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>
                <Modal.Body>Player X is the Winner!!!!</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} appearance="primary">Ok</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Game