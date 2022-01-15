import * as THREE from 'three'
import { SceneOptions } from '../interfaces'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import merge from 'lodash/merge'

const defaultOptions: SceneOptions = {
  background: 0xffffff,
  fog: {
    color: undefined,
    near: 10,
    far: 50
  },
  hdri: false,
  helper: false
}

export default (props: SceneOptions = defaultOptions) => {
  const options = merge({}, defaultOptions, props)
  const scene: THREE.Scene = new THREE.Scene()
  scene.background = options.background === null
    ? null
    : new THREE.Color(options.background)
  if (options.fog) scene.fog = new THREE.Fog(options.fog.color || options.background, options.fog.near, options.fog.far)

  if (props.helper) scene.add(new THREE.AxesHelper( 5 ))

  return new Promise((resolve) => {
    if (options.hdri) {
      // new RGBELoader().load(options.hdri, (texture) => {
      //   console.log(texture)
      //   texture.mapping = THREE.EquirectangularReflectionMapping
      //   scene.environment = texture
      //   console.log(scene)
      //   resolve(scene)
      // })
      const exrLoader: any = new EXRLoader()
      exrLoader.load(options.hdri, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
        scene.environment.repeat.y = 20
        console.log(scene)
        resolve(scene)
      })
    }
    else {
      resolve(scene)
    }
  })
}