import { io } from 'socket.io-client'


const URL = "https://santorini-server.onrender.com"

export const socket = io(URL, {
    autoConnect: false, transports:["webscoket"]
})