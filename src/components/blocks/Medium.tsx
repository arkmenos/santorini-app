import { Edges } from "@react-three/drei"
import { BlockProp } from "../../types/Types"

function Medium ({position, size=[0.75,0.5,0.75], color="lightgray"}: BlockProp) {
    return(
        <>
            <mesh position={position}>
                <boxGeometry args={size} />
                <Edges linewidth={2} threshold={1} />
                <meshBasicMaterial color={color}/>
            </mesh>
        </>
    )
}

export default Medium