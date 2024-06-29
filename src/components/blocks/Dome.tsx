import { DoubleSide } from "three"
import { BlockProp } from "../../types/Types"

function Dome ({position, color="blue"}: BlockProp) {
    return(
        <>
            <mesh position={position}>
                <sphereGeometry args={[0.25,16,16, (Math.PI), (Math.PI*2), 0, Math.PI/2]} />
                {/* <Edges  threshold={1} /> */}
                <meshBasicMaterial color={color} side={DoubleSide}/>
            </mesh>
        </>
    )
}

export default Dome