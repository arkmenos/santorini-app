/* eslint-disable react/no-unknown-property */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 .\FemaleRed.gltf 
*/

import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ignore prop validation
export function FemaleRed(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/worker/FemaleRed.gltf')
  const { actions, names } = useAnimations(animations, group)
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ignore prop validation
    actions[names[1]].reset().fadeIn(0.0001).play()
  }, [])

  return (
    <group ref={group} {...props} dispose={null} scale={[0.4, 0.4, 0.4]} >
      <group name="Scene">
        <group name="female_Idlegltf">
          <group name="RootNode">
            <primitive object={nodes.mixamorigHips}  />
            {/* @ts-expect-error ignore type checks on content of nodes */}
            <skinnedMesh name="Beta_Surface" geometry={nodes.Beta_Surface.geometry} material={materials.Beta_HighLimbsGeoSG3} skeleton={nodes.Beta_Surface.skeleton} />
            {/* @ts-expect-error ignore type checks on content of nodes */}
            <skinnedMesh name="Beta_Joints" geometry={nodes.Beta_Joints.geometry} material={materials.Beta_Joints_MAT1} skeleton={nodes.Beta_Joints.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/worker/FemaleRed.gltf')
