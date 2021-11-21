import * as THREE from 'three'
import { SceneOptions } from '../interfaces'
import { RGBELoader, EXRLoader } from 'three-stdlib'
import merge from 'lodash/merge'

const defaultOptions: SceneOptions = {
  background: 0xffffff,
  fog: {
    color: undefined,
    near: 10,
    far: 50
  },
  hdri: false
}

export default (props: SceneOptions = defaultOptions) => {
  const options = merge({}, defaultOptions, props)
  const scene: THREE.Scene = new THREE.Scene()
  scene.background = new THREE.Color(options.background)
  if (options.fog) scene.fog = new THREE.Fog(options.fog.color || options.background, options.fog.near, options.fog.far)

  if (props.helper) scene.add(new THREE.AxesHelper( 5 ))

  return new Promise((resolve, reject) => {
    if (options.hdri) {
      // new RGBELoader().load(options.hdri, (texture) => {
      //   console.log(texture)
      //   texture.mapping = THREE.EquirectangularReflectionMapping
      //   scene.environment = texture
      //   console.log(scene)
      //   resolve(scene)
      // })
      new EXRLoader().load(options.hdri, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
        resolve(scene)
      })
    }
    else {
      resolve(scene)
    }
  })
}