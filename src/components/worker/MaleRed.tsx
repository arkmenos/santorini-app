/* eslint-disable react/no-unknown-property */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 .\MaleRed.gltf 
*/

import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ignore prop validation
export function MaleRed(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/worker/MaleRed.gltf')
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore ignore null checks here.
    actions[names[1]].reset().fadeIn(0.0001).play()
  }, [])

  return (
    <group ref={group} {...props} dispose={null} scale={[0.4, 0.4, 0.4]} >
      <group name="Scene">
        <group name="Idleglb">
          <group name="RootNode">
            <primitive object={nodes.mixamorigHips} />
            {/* @ts-expect-error ignore type checks on content of nodes */}
            <skinnedMesh name="Alpha_Surface" geometry={nodes.Alpha_Surface.geometry} material={materials.Alpha_Body_MAT} skeleton={nodes.Alpha_Surface.skeleton} />
            {/* @ts-expect-error ignore type checks on content of nodes */}
            <skinnedMesh name="Alpha_Joints" geometry={nodes.Alpha_Joints.geometry} material={materials.Alpha_Joints_MAT} skeleton={nodes.Alpha_Joints.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/worker/MaleRed.gltf')
