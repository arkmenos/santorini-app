import { Text } from "@react-three/drei"
import { useMemo } from "react"

const  BoardCoordinates = () => useMemo(() => {
        const coords = []
        const letter = 97
        const number = 1
        let x_coord = -1.75;
        let z_coord = 1.65

        for(let i = 0; i < 5; i++){
            coords.push( <Text position={[x_coord,0.385,2.35]} scale={0.2} color={'BLACK'} 
                key={letter + i} rotation={[-1.56,0,0]}>{String.fromCharCode(letter + i)}</Text>)
            coords.push(<Text key={number + i} position={[-2.35,0.385,z_coord]} scale={0.2} color={'BLACK'} rotation={[-1.56,0,0]}>{number + i }</Text>)
            x_coord ++;
            z_coord--;
        }
           
    return (
        <>
        {coords}
        </>
    )
}, [])

export default BoardCoordinates