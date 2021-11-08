import * as THREE from 'three'
import { SceneOptions } from '../interfaces'
import merge from 'lodash/merge'

const defaultOptions: SceneOptions = {
  background: 0xffffff,
  fog: {
    color: undefined,
    near: 10,
    far: 50
  }
}

export default (props: SceneOptions = defaultOptions) => {
  const options = merge(defaultOptions, props)
  const scene: THREE.Scene = new THREE.Scene()
  scene.background = new THREE.Color(options.background)
  if (options.fog) scene.fog = new THREE.Fog(options.fog.color || options.background, options.fog.near, options.fog.far)

  if (props.helper) scene.add(new THREE.AxesHelper( 5 ))
  return scene
}